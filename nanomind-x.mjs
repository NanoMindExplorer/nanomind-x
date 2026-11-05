#!/usr/bin/env node
// nanomind-x — agent-fit X tool. Wraps the in-tree engine (see NOTICE for
// upstream attribution).
//
// Built 2026-11-05 (Iman approved ~17:49 WIB). One file, no upstream changes.
// All output on stdout is a single JSON object:
//   success: { ok: true, ...data }
//   failure: { ok: false, error: { code, message, http_status, operation, retryable, retry_after? } }
// Human chatter (warnings, progress) goes to stderr only.
// Exit codes: 0 ok | 2 usage | 3 rate-limited | 4 auth | 5 upstream.
//
// Commands:
//   nanomind-x search <query> [--mode latest|top|people] [--limit N] [--burst]
//   nanomind-x profile <screen_name>
//   nanomind-x timeline <screen_name> [--limit N]
//   nanomind-x post --text "..." [--confirm] [--allow-browser-fallback] [--force]
//   nanomind-x delete --id <tweet_id> [--confirm]
//   nanomind-x health
//
// Rules enforced here (standing rules, not just defaults):
// - post/delete are DRY-RUN by default: they print the exact request + the
//   idempotency check and send nothing. A real write needs --confirm.
// - Idempotency ledger ~/.nanomind-x/nanomind-x-ledger.json refuses a duplicate
//   write for the same (operation, target/text-hash) within 24 h, unless
//   --force — which must only ever be used with Iman's explicit approval.
// - Reads never fall back to the browser (Iman's instruction: search via
//   tools, not browser). Writes fall back to the browser path (x_post_tweet)
//   ONLY with --allow-browser-fallback, and the path used is logged.
// - Search is capped at 1/60 s per wrapper invocation state (file-backed);
//   --burst overrides and logs the override.
import { Scraper } from './engine/src/client/index.js';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import net from 'node:net';
import { spawn } from 'node:child_process';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const HOME = os.homedir();
const XDIR = process.env.NANOMIND_X_HOME || path.join(HOME, '.nanomind-x');
process.env.NANOMIND_X_HOME = XDIR;
const COOKIES = path.join(XDIR, 'cookies.json');
const LEDGER = path.join(XDIR, 'nanomind-x-ledger.json'); // NOTE: NOT action-ledger.json — that path is the tool's own file (timestamps format); the wrapper keeps its own array-format ledger here.
const RATE_FILE = path.join(XDIR, 'nanomind-x-rate.json');
const LOG_FILE = path.join(ROOT, 'nanomind-x.log');
const MCP_SERVER = path.join(ROOT, 'engine', 'src', 'mcp', 'server.js');
const PROXY = { host: '127.0.0.1', port: 18080 };
const SEARCH_MIN_INTERVAL_MS = 60_000;
const IDEMPOTENCY_WINDOW_MS = 24 * 60 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 60_000;

const VERSION = '1.0.0';

// ---------------------------------------------------------------------------
// Output + logging
// ---------------------------------------------------------------------------
function emit(obj) {
  process.stdout.write(JSON.stringify(obj) + '\n');
}
function warn(...args) {
  process.stderr.write('[nanomind-x] ' + args.join(' ') + '\n');
}
function exitCodeFor(code) {
  if (code === 'USAGE') return 2;
  if (code === 'RATE_LIMITED' || code === 'RATE_CAP') return 3;
  if (code === 'AUTH') return 4;
  return 5;
}
function fail(code, message, extra = {}) {
  emit({ ok: false, error: { code, message, http_status: extra.http_status ?? null, operation: extra.operation ?? null, retryable: extra.retryable ?? false, ...(extra.retry_after != null ? { retry_after: extra.retry_after } : {}) } });
  process.exit(exitCodeFor(code));
}
function logLine(entry) {
  try {
    fs.appendFileSync(LOG_FILE, JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n');
  } catch { /* logging must never break the command */ }
}

// ---------------------------------------------------------------------------
// Small file helpers
// ---------------------------------------------------------------------------
function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; }
}
function writeJsonAtomic(file, obj) {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2));
  fs.renameSync(tmp, file);
}
function sha256(s) {
  return crypto.createHash('sha256').update(s, 'utf8').digest('hex');
}

// ---------------------------------------------------------------------------
// Rate-limit capture (SimpleHttp drops response headers; we wrap fetch)
// ---------------------------------------------------------------------------
let lastRate = { remaining: null, reset: null, limit: null, status: null };
function capturingFetch(url, init = {}) {
  const signal = init.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  return globalThis.fetch(url, { ...init, signal }).then((res) => {
    lastRate = {
      remaining: res.headers.get('x-rate-limit-remaining'),
      reset: res.headers.get('x-rate-limit-reset'),
      limit: res.headers.get('x-rate-limit-limit'),
      status: res.status,
    };
    return res;
  });
}
function httpStatusOf(err) {
  if (err?.details?.httpStatus) return err.details.httpStatus;
  if (err?.httpStatus) return err.httpStatus;
  const m = String(err?.message || '').match(/HTTP\s+(\d{3})/);
  return m ? Number(m[1]) : null;
}
function is226(err) {
  const s = JSON.stringify(err?.message || '') + JSON.stringify(err?.details || '');
  return /226|might be automated/i.test(s);
}

// ---------------------------------------------------------------------------
// Scraper bootstrap
// ---------------------------------------------------------------------------
async function makeScraper() {
  if (!fs.existsSync(COOKIES)) {
    fail('AUTH', 'No X session: ~/.nanomind-x/cookies.json is missing. Log in first (nanomind-x-engine login --cookies-file <file>).', { operation: 'auth', retryable: false });
  }
  const scraper = new Scraper({ fetch: capturingFetch });
  await scraper.loadCookies(COOKIES);
  return scraper;
}

// ---------------------------------------------------------------------------
// Idempotency ledger (append-only)
// ---------------------------------------------------------------------------
function ledgerRead() {
  const data = readJson(LEDGER, null);
  return Array.isArray(data) ? data : [];
}
function ledgerCheck(operation, key) {
  const now = Date.now();
  const hit = ledgerRead().find(
    (e) => e.operation === operation && e.key === key && now - e.ts < IDEMPOTENCY_WINDOW_MS,
  );
  return hit || null;
}
function ledgerAppend(entry) {
  const rows = ledgerRead();
  rows.push({ ts: Date.now(), ...entry });
  try { writeJsonAtomic(LEDGER, rows); } catch (e) { warn('ledger write failed:', e.message); }
}

// ---------------------------------------------------------------------------
// Search rate cap (file-backed, per wrapper)
// ---------------------------------------------------------------------------
function searchCapCheck(burst) {
  const state = readJson(RATE_FILE, {});
  const last = state.lastSearchAtMs || 0;
  const elapsed = Date.now() - last;
  if (elapsed < SEARCH_MIN_INTERVAL_MS && !burst) {
    return Math.ceil((SEARCH_MIN_INTERVAL_MS - elapsed) / 1000);
  }
  if (elapsed < SEARCH_MIN_INTERVAL_MS && burst) {
    warn(`search burst override: only ${Math.round(elapsed / 1000)}s since last search`);
  }
  return 0;
}
function searchCapMark() {
  try { writeJsonAtomic(RATE_FILE, { lastSearchAtMs: Date.now() }); } catch { /* non-fatal */ }
}

// ---------------------------------------------------------------------------
// Browser-path fallback via the MCP server (writes only, opt-in)
// ---------------------------------------------------------------------------
function callMcpTool(name, args, timeoutMs = 120_000) {
  return new Promise((resolve, reject) => {
    const server = spawn(process.execPath, [MCP_SERVER], { stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, NANOMIND_X_HOME: XDIR } });
    const rl = readline.createInterface({ input: server.stdout });
    let nextId = 1;
    const pending = new Map();
    let done = false;
    const timer = setTimeout(() => finish(new Error('MCP timeout')), timeoutMs);
    function finish(err, result) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try { server.kill(); } catch { /* ignore */ }
      err ? reject(err) : resolve(result);
    }
    server.stderr.on('data', (d) => process.stderr.write('[mcp] ' + d));
    server.on('error', (e) => finish(e));
    rl.on('line', (line) => {
      let msg;
      try { msg = JSON.parse(line); } catch { return; }
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      }
    });
    function send(method, params) {
      return new Promise((resolve, reject) => {
        const id = nextId++;
        pending.set(id, { resolve, reject });
        server.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
      });
    }
    (async () => {
      try {
        await send('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'nanomind-x', version: VERSION } });
        server.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} }) + '\n');
        const res = await send('tools/call', { name, arguments: args });
        finish(null, res);
      } catch (e) { finish(e); }
    })();
  });
}
function extractTweetIdFromMcp(result) {
  const text = JSON.stringify(result || '');
  const m = text.match(/status\/(\d{10,25})/) || text.match(/"id"\s*:\s*"(\d{10,25})"/) || text.match(/rest_id"\s*:\s*"(\d{10,25})"/);
  return m ? m[1] : null;
}
function proxyAlive(timeoutMs = 2000) {
  return new Promise((resolve) => {
    const s = net.connect(PROXY.port, PROXY.host);
    const timer = setTimeout(() => { s.destroy(); resolve(false); }, timeoutMs);
    s.on('connect', () => { clearTimeout(timer); s.destroy(); resolve(true); });
    s.on('error', () => { clearTimeout(timer); resolve(false); });
  });
}

// ---------------------------------------------------------------------------
// Argument parsing (minimal, no deps)
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next != null && !next.startsWith('--')) { args[key] = next; i++; }
      else args[key] = true;
    } else args._.push(a);
  }
  return args;
}
function usage() {
  emit({ ok: false, error: { code: 'USAGE', message: 'Usage: nanomind-x <search|profile|timeline|post|delete|health> [args] [--confirm] [--dry-run] [--allow-browser-fallback] [--force] [--burst] [--mode latest|top|people] [--limit N] [--text ...] [--id ...]', http_status: null, operation: null, retryable: false } });
  process.exit(2);
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------
async function cmdSearch(args) {
  const query = args._[1];
  if (!query) usage();
  const mode = String(args.mode || 'latest').toLowerCase();
  if (!['latest', 'top', 'people'].includes(mode)) usage();
  const limit = Math.max(1, Math.min(100, Number(args.limit || 10) || 10));
  const wait = searchCapCheck(args.burst === true || args.burst === 'true');
  if (wait > 0) {
    fail('RATE_CAP', `Search capped at 1/60s by nanomind-x policy; retry in ${wait}s (or pass --burst).`, { operation: 'search', retryable: true, retry_after: wait });
  }
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    let items = [];
    if (mode === 'people') {
      for await (const p of scraper.searchProfiles(query, limit)) items.push(p);
    } else {
      for await (const t of scraper.searchTweets(query, limit, mode === 'top' ? 'Top' : 'Latest')) items.push(t);
    }
    searchCapMark();
    logLine({ command: 'search', operation: 'search', status: 'ok', ms: Date.now() - t0, count: items.length, rateLimitRemaining: lastRate.remaining });
    emit({ ok: true, data: items, meta: { query, mode, count: items.length, rateLimitRemaining: lastRate.remaining } });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'search', operation: 'search', status: 'error', ms: Date.now() - t0, httpStatus: status, rateLimitRemaining: lastRate.remaining });
    if (status === 429) {
      const reset = lastRate.reset ? Math.max(0, Number(lastRate.reset) - Math.floor(Date.now() / 1000)) : null;
      fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'search', retryable: true, ...(reset != null ? { retry_after: reset } : {}) });
    }
    if (status === 401) fail('AUTH', 'X session rejected (401). Re-login required.', { http_status: 401, operation: 'search', retryable: false });
    fail('UPSTREAM', `Search failed: ${e.message}`, { http_status: status, operation: 'search', retryable: status === 404 });
  }
}

async function cmdProfile(args) {
  const name = args._[1];
  if (!name) usage();
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const profile = await scraper.getProfile(name);
    logLine({ command: 'profile', operation: 'profile', status: 'ok', ms: Date.now() - t0, rateLimitRemaining: lastRate.remaining });
    emit({ ok: true, data: profile });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'profile', operation: 'profile', status: 'error', ms: Date.now() - t0, httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'profile', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'profile', retryable: false });
    fail('UPSTREAM', `Profile read failed: ${e.message}`, { http_status: status, operation: 'profile', retryable: status === 404 });
  }
}

async function cmdTimeline(args) {
  const name = args._[1];
  if (!name) usage();
  const limit = Math.max(1, Math.min(100, Number(args.limit || 10) || 10));
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const items = [];
    for await (const t of scraper.getTweets(name, limit)) items.push(t);
    logLine({ command: 'timeline', operation: 'timeline', status: 'ok', ms: Date.now() - t0, count: items.length, rateLimitRemaining: lastRate.remaining });
    emit({ ok: true, data: items, meta: { screenName: name, count: items.length } });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'timeline', operation: 'timeline', status: 'error', ms: Date.now() - t0, httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'timeline', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'timeline', retryable: false });
    fail('UPSTREAM', `Timeline read failed: ${e.message}`, { http_status: status, operation: 'timeline', retryable: status === 404 });
  }
}

async function cmdPost(args) {
  const text = args.text;
  if (!text || typeof text !== 'string') usage();
  const confirm = args.confirm === true || args.confirm === 'true';
  const allowBrowser = args['allow-browser-fallback'] === true || args['allow-browser-fallback'] === 'true';
  const force = args.force === true || args.force === 'true';
  const key = sha256(text);
  const dup = ledgerCheck('post', key);
  if (force) warn('FORCE used: idempotency check bypassed. --force requires Iman\'s explicit approval.');
  if (dup && !force) {
    fail('DUPLICATE', `Refusing duplicate post: identical text was already posted (tweet ${dup.tweetId || 'unknown'}, ${new Date(dup.ts).toISOString()}). Pass --force only with Iman's explicit approval.`, { operation: 'post', retryable: false });
  }
  const request = { endpoint: 'CreateTweet', operation: 'post', variables: { tweet_text: text, dark_request: false } };
  if (!confirm) {
    emit({ ok: true, dryRun: true, request, idempotency: { duplicate: Boolean(dup), within24h: Boolean(dup), key } });
    return;
  }
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const tweet = await scraper.sendTweet(text);
    const tweetId = tweet?.id || null;
    ledgerAppend({ operation: 'post', key, textHash: key, tweetId, path: 'graphql' });
    logLine({ command: 'post', operation: 'post', status: 'ok', ms: Date.now() - t0, path: 'graphql', tweetId });
    emit({ ok: true, path: 'graphql', tweetId, data: tweet });
  } catch (e) {
    const status = httpStatusOf(e);
    const graphQL226 = is226(e);
    logLine({ command: 'post', operation: 'post', status: 'error', ms: Date.now() - t0, path: 'graphql', httpStatus: status, error226: graphQL226 });
    const fallbackEligible = graphQL226 || status === 403 || status === 404;
    if (fallbackEligible && allowBrowser) {
      warn('GraphQL post failed (226/403/404); falling back to browser path (x_post_tweet) per --allow-browser-fallback.');
      if (!(await proxyAlive())) {
        fail('UPSTREAM', 'Browser fallback unavailable: proxy 127.0.0.1:18080 is down. Restart proxy_forward.js first.', { operation: 'post', retryable: true });
      }
      try {
        const res = await callMcpTool('x_post_tweet', { text });
        const tweetId = extractTweetIdFromMcp(res);
        ledgerAppend({ operation: 'post', key, textHash: key, tweetId, path: 'browser' });
        logLine({ command: 'post', operation: 'post', status: 'ok', ms: Date.now() - t0, path: 'browser', tweetId });
        emit({ ok: true, path: 'browser', tweetId, note: tweetId ? undefined : 'Posted via browser; tweet id not parsed — verify on the timeline.', data: res });
      } catch (be) {
        fail('UPSTREAM', `GraphQL post failed (${e.message}) and browser fallback also failed: ${be.message}`, { http_status: status, operation: 'post', retryable: false });
      }
      return;
    }
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'post', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'post', retryable: false });
    fail('UPSTREAM', `Post failed: ${e.message}${graphQL226 ? ' (error 226: automation-looking request)' : ''}${fallbackEligible ? ' Browser fallback available with --allow-browser-fallback.' : ''}`, { http_status: status, operation: 'post', retryable: false });
  }
}

async function cmdDelete(args) {
  const id = args.id;
  if (!id || typeof id !== 'string') usage();
  const confirm = args.confirm === true || args.confirm === 'true';
  const dup = ledgerCheck('delete', id);
  if (dup) {
    fail('DUPLICATE', `Refusing duplicate delete: tweet ${id} was already deleted via nanomind-x (${new Date(dup.ts).toISOString()}).`, { operation: 'delete', retryable: false });
  }
  const request = { endpoint: 'DeleteTweet', operation: 'delete', variables: { tweet_id: id, dark_request: false } };
  if (!confirm) {
    emit({ ok: true, dryRun: true, request, idempotency: { duplicate: false, key: id } });
    return;
  }
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    await scraper.deleteTweet(id);
    ledgerAppend({ operation: 'delete', key: id, tweetId: id, path: 'graphql' });
    logLine({ command: 'delete', operation: 'delete', status: 'ok', ms: Date.now() - t0, path: 'graphql', tweetId: id });
    emit({ ok: true, path: 'graphql', tweetId: id, deleted: true });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'delete', operation: 'delete', status: 'error', ms: Date.now() - t0, httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'delete', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'delete', retryable: false });
    fail('UPSTREAM', `Delete failed: ${e.message}`, { http_status: status, operation: 'delete', retryable: false });
  }
}

async function cmdHealth() {
  const t0 = Date.now();
  const checks = {};
  // Session files
  try {
    const st = fs.statSync(COOKIES);
    checks.cookies = { present: true, mode: (st.mode & 0o777).toString(8) };
  } catch { checks.cookies = { present: false }; }
  const qids = readJson(path.join(XDIR, 'query-ids.json'), null);
  checks.queryIds = qids
    ? { cached: true, count: Object.keys(qids.operations || {}).length, fetchedAt: qids.fetchedAt || null, ageHours: qids.fetchedAt ? Math.round((Date.now() - Date.parse(qids.fetchedAt)) / 3600000) : null }
    : { cached: false };
  try {
    const st = fs.statSync(path.join(XDIR, 'transaction-keys.json'));
    checks.txidCache = { present: true, ageHours: Math.round((Date.now() - st.mtimeMs) / 3600000) };
  } catch { checks.txidCache = { present: false }; }
  checks.proxy = { alive: await proxyAlive() };
  // One cheap read (guest tier)
  try {
    const scraper = await makeScraper();
    const profile = await scraper.getProfile('nasa');
    checks.read = { ok: true, profile: profile?.username || profile?.screenName || 'nasa', rateLimitRemaining: lastRate.remaining };
  } catch (e) {
    const status = httpStatusOf(e);
    checks.read = { ok: false, error: e.message, httpStatus: status };
    logLine({ command: 'health', operation: 'health', status: 'error', ms: Date.now() - t0, httpStatus: status });
    emit({ ok: false, error: { code: status === 401 ? 'AUTH' : 'UPSTREAM', message: `Health check failed on the probe read: ${e.message}`, http_status: status, operation: 'health', retryable: status === 429 }, checks });
    process.exit(status === 401 ? 4 : 5);
  }
  logLine({ command: 'health', operation: 'health', status: 'ok', ms: Date.now() - t0 });
  emit({ ok: true, checks, version: VERSION });
}

// ---------------------------------------------------------------------------
const args = parseArgs(process.argv.slice(2));
const cmd = args._[0];
const t0 = Date.now();
try {
  if (cmd === 'search') await cmdSearch(args);
  else if (cmd === 'profile') await cmdProfile(args);
  else if (cmd === 'timeline') await cmdTimeline(args);
  else if (cmd === 'post') await cmdPost(args);
  else if (cmd === 'delete') await cmdDelete(args);
  else if (cmd === 'health') await cmdHealth(args);
  else usage();
} catch (e) {
  // Last-resort guard: never crash with a stack trace on stdout.
  if (!process.stdout.writableEnded) {
    emit({ ok: false, error: { code: 'UPSTREAM', message: `Unexpected error: ${e.message}`, http_status: null, operation: cmd || null, retryable: false } });
  }
  logLine({ command: cmd || 'unknown', operation: cmd || null, status: 'error', ms: Date.now() - t0, error: e.message });
  process.exit(5);
}
