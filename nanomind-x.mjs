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
//   nanomind-x tweet --id <tweet_id>
//   nanomind-x liked <screen_name> [--limit N]
//   nanomind-x followers <screen_name> [--limit N]
//   nanomind-x following <screen_name> [--limit N]
//   nanomind-x replies <screen_name> [--limit N]
//   nanomind-x trends
//   nanomind-x blocked [--limit N]
//   nanomind-x me
//   nanomind-x notifications [--type all|mentions|verified] [--limit N]
//   nanomind-x dms [--limit N]
//   nanomind-x dm-read --id <conversation_id> [--limit N]
//   nanomind-x post --text "..." [--media <image>] [--confirm] [--allow-browser-fallback] [--force]
//   nanomind-x reply --id <tweet_id> --text "..." [--media <image>] [--confirm] [--force]
//   nanomind-x quote --id <tweet_id> --text "..." [--media <image>] [--confirm] [--force]
//   nanomind-x thread --text "part one || part two" [--confirm] [--force]   (POST a thread)
//   nanomind-x thread --id <tweet_id>                                        (READ a thread)
//   nanomind-x like --id <tweet_id> [--confirm] [--force]
//   nanomind-x unlike --id <tweet_id> [--confirm] [--force]
//   nanomind-x repost --id <tweet_id> [--confirm] [--force]
//   nanomind-x unrepost --id <tweet_id> [--confirm] [--force]
//   nanomind-x bookmark --id <tweet_id> [--confirm] [--force]
//   nanomind-x unbookmark --id <tweet_id> [--confirm] [--force]
//   nanomind-x follow <screen_name> [--confirm] [--force]
//   nanomind-x unfollow <screen_name> [--confirm] [--force]
//   nanomind-x pin --id <tweet_id> [--confirm] [--force]
//   nanomind-x unpin --id <tweet_id> [--confirm] [--force]
//   nanomind-x block <screen_name> [--confirm] [--force]
//   nanomind-x unblock <screen_name> [--confirm] [--force]
//   nanomind-x mute <screen_name> [--confirm] [--force]
//   nanomind-x unmute <screen_name> [--confirm] [--force]
//   nanomind-x bio --text "..." [--confirm] [--force]
//   nanomind-x dm --user <screen_name> --text "..." [--confirm] [--force]
//   nanomind-x delete --id <tweet_id> [--confirm]
//   nanomind-x health
//
// Rules enforced here (standing rules, not just defaults):
// - Every write (post/reply/quote/thread/like/unlike/repost/unrepost/
//   bookmark/unbookmark/follow/unfollow/pin/unpin/block/unblock/mute/unmute/
//   bio/dm/delete) is DRY-RUN by default: it prints the exact request + the
//   idempotency check and sends nothing. A real write needs --confirm.
// - Idempotency ledger ~/.nanomind-x/nanomind-x-ledger.json refuses a duplicate
//   write for the same (operation, target/text-hash) within 24 h, unless
//   --force — which must only ever be used with Iman's explicit approval.
// - Reads never fall back to the browser (Iman's instruction: search via
//   tools, not browser). Writes fall back to the browser path (x_post_tweet)
//   ONLY with --allow-browser-fallback, and the path used is logged.
//   Follow, reply, quote, thread, like, repost, bookmark, pin, block and
//   mute use the signed GraphQL/REST paths (no browser). Bio uses the
//   signed REST path first (MCP browser path only as fallback) and needs
//   the proxy forwarder alive for that fallback.
// - Media upload (--media on post/reply/quote) is a write: in dry-run mode
//   NOTHING is uploaded — the preview only reports what would be uploaded.
//   On --confirm the file is uploaded first (chunked INIT/APPEND/FINALIZE
//   over the signed path) and its media id is attached to the CreateTweet
//   call. Only jpg/png/gif/webp, 5 MB images / 15 MB GIFs.
// - `thread` is two commands sharing one name: `thread --text ...` POSTS a
//   thread, `thread --id <tweet_id>` READS a thread (focal tweet + replies).
//   The read path takes no --confirm and touches no ledger.
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

const VERSION = '2.1.0';

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
const TOGGLE_PAIRS = {
  like: 'unlike', unlike: 'like',
  repost: 'unrepost', unrepost: 'repost',
  bookmark: 'unbookmark', unbookmark: 'bookmark',
  pin: 'unpin', unpin: 'pin',
  follow: 'unfollow', unfollow: 'follow',
  block: 'unblock', unblock: 'block',
  mute: 'unmute', unmute: 'mute',
};
function ledgerTarget(entry) {
  if (entry.tweetId) return 'tweet:' + entry.tweetId;
  if (entry.username) return 'user:' + String(entry.username).toLowerCase();
  return null;
}
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
  // Toggle semantics (fixed 2026-11-06, v2.0.0): recording the inverse of a
  // toggle invalidates the forward entry, so pin -> unpin -> pin (or like ->
  // unlike -> like) is allowed, while repeating the forward action without
  // its inverse in between is still refused as a duplicate. Non-toggle
  // entries (post, reply, quote, dm, bio, delete, thread) are unaffected.
  const inverse = TOGGLE_PAIRS[entry.operation];
  const target = ledgerTarget(entry);
  let rows = ledgerRead();
  if (inverse && target) {
    rows = rows.filter((r) => !(r.operation === inverse && ledgerTarget(r) === target));
  }
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
  emit({ ok: false, error: { code: 'USAGE', message: 'Usage: nanomind-x <search|profile|timeline|tweet|liked|followers|following|replies|trends|blocked|me|notifications|dms|dm-read|post|reply|quote|thread|like|unlike|repost|unrepost|bookmark|unbookmark|follow|unfollow|pin|unpin|block|unblock|mute|unmute|bio|dm|delete|health> [args] [--confirm] [--dry-run] [--allow-browser-fallback] [--force] [--burst] [--mode latest|top|people] [--limit N] [--text ...] [--id ...] [--user ...] [--media <image>] [--type all|mentions|verified]', http_status: null, operation: null, retryable: false } });
  process.exit(2);
}

// ---------------------------------------------------------------------------
// Media argument validation (post/reply/quote --media)
// ---------------------------------------------------------------------------
// Mirrors the engine limits (api/media.js): jpg/png/webp <= 5 MB, gif <=
// 15 MB. Checked here so a bad --media fails fast with exit 2 before any
// network call; the engine re-validates on the real upload.
const MEDIA_EXTS = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp' };
const MEDIA_MAX = { 'image/jpeg': 5 * 1024 * 1024, 'image/png': 5 * 1024 * 1024, 'image/webp': 5 * 1024 * 1024, 'image/gif': 15 * 1024 * 1024 };
function resolveMediaArg(args, operation) {
  const mediaPath = args.media;
  if (!mediaPath || typeof mediaPath !== 'string') return null;
  if (!fs.existsSync(mediaPath)) {
    fail('USAGE', `Media file not found: ${mediaPath}`, { operation, retryable: false });
  }
  const ext = path.extname(mediaPath).toLowerCase();
  const mimeType = MEDIA_EXTS[ext];
  if (!mimeType) {
    fail('USAGE', `Unsupported media type "${ext || '(no extension)'}": only jpg, png, gif and webp are supported.`, { operation, retryable: false });
  }
  const bytes = fs.statSync(mediaPath).size;
  if (bytes > MEDIA_MAX[mimeType]) {
    fail('USAGE', `Media file too large: ${bytes} bytes exceeds the ${MEDIA_MAX[mimeType]} byte limit for ${mimeType}.`, { operation, retryable: false });
  }
  return { path: mediaPath, bytes, mimeType };
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

async function cmdTweet(args) {
  const id = args.id;
  if (!id || typeof id !== 'string') usage();
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const tweet = await scraper.getTweet(id);
    logLine({ command: 'tweet', operation: 'tweet', status: 'ok', ms: Date.now() - t0, rateLimitRemaining: lastRate.remaining });
    emit({ ok: true, data: tweet });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'tweet', operation: 'tweet', status: 'error', ms: Date.now() - t0, httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'tweet', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'tweet', retryable: false });
    fail('UPSTREAM', `Tweet read failed: ${e.message}`, { http_status: status, operation: 'tweet', retryable: status === 404 });
  }
}

async function cmdLiked(args) {
  const name = args._[1];
  if (!name) usage();
  const limit = Math.max(1, Math.min(100, Number(args.limit || 10) || 10));
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const items = [];
    for await (const t of scraper.getLikedTweets(name, limit)) items.push(t);
    logLine({ command: 'liked', operation: 'liked', status: 'ok', ms: Date.now() - t0, count: items.length, rateLimitRemaining: lastRate.remaining });
    emit({ ok: true, data: items, meta: { screenName: name, count: items.length } });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'liked', operation: 'liked', status: 'error', ms: Date.now() - t0, httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'liked', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'liked', retryable: false });
    fail('UPSTREAM', `Liked-tweets read failed: ${e.message}`, { http_status: status, operation: 'liked', retryable: status === 404 });
  }
}

async function cmdFollowers(args) {
  const name = args._[1];
  if (!name) usage();
  const limit = Math.max(1, Math.min(100, Number(args.limit || 10) || 10));
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const profile = await scraper.getProfile(name);
    const userId = profile?.id;
    if (!userId) fail('UPSTREAM', `Could not resolve @${name} to a user id.`, { operation: 'followers', retryable: false });
    const items = [];
    for await (const p of scraper.getFollowers(userId, limit)) items.push(p);
    logLine({ command: 'followers', operation: 'followers', status: 'ok', ms: Date.now() - t0, count: items.length, rateLimitRemaining: lastRate.remaining });
    emit({ ok: true, data: items, meta: { screenName: name, userId: String(userId), count: items.length } });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'followers', operation: 'followers', status: 'error', ms: Date.now() - t0, httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'followers', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'followers', retryable: false });
    fail('UPSTREAM', `Followers read failed: ${e.message}`, { http_status: status, operation: 'followers', retryable: status === 404 });
  }
}

async function cmdFollowing(args) {
  const name = args._[1];
  if (!name) usage();
  const limit = Math.max(1, Math.min(100, Number(args.limit || 10) || 10));
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const profile = await scraper.getProfile(name);
    const userId = profile?.id;
    if (!userId) fail('UPSTREAM', `Could not resolve @${name} to a user id.`, { operation: 'following', retryable: false });
    const items = [];
    for await (const p of scraper.getFollowing(userId, limit)) items.push(p);
    logLine({ command: 'following', operation: 'following', status: 'ok', ms: Date.now() - t0, count: items.length, rateLimitRemaining: lastRate.remaining });
    emit({ ok: true, data: items, meta: { screenName: name, userId: String(userId), count: items.length } });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'following', operation: 'following', status: 'error', ms: Date.now() - t0, httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'following', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'following', retryable: false });
    fail('UPSTREAM', `Following read failed: ${e.message}`, { http_status: status, operation: 'following', retryable: status === 404 });
  }
}

async function cmdReplies(args) {
  const name = args._[1];
  if (!name) usage();
  const limit = Math.max(1, Math.min(100, Number(args.limit || 10) || 10));
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const items = [];
    for await (const t of scraper.getTweetsAndReplies(name, limit)) items.push(t);
    logLine({ command: 'replies', operation: 'replies', status: 'ok', ms: Date.now() - t0, count: items.length, rateLimitRemaining: lastRate.remaining });
    emit({ ok: true, data: items, meta: { screenName: name, count: items.length } });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'replies', operation: 'replies', status: 'error', ms: Date.now() - t0, httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'replies', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'replies', retryable: false });
    fail('UPSTREAM', `Replies read failed: ${e.message}`, { http_status: status, operation: 'replies', retryable: status === 404 });
  }
}

async function cmdTrends(args) {
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const trends = await scraper.getTrends();
    logLine({ command: 'trends', operation: 'trends', status: 'ok', ms: Date.now() - t0, rateLimitRemaining: lastRate.remaining });
    emit({ ok: true, data: trends });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'trends', operation: 'trends', status: 'error', ms: Date.now() - t0, httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'trends', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'trends', retryable: false });
    fail('UPSTREAM', `Trends read failed: ${e.message}`, { http_status: status, operation: 'trends', retryable: status === 404 });
  }
}

async function cmdBlocked(args) {
  const limit = Math.max(1, Math.min(100, Number(args.limit || 20) || 20));
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const users = await scraper.getBlockedUsers(limit);
    logLine({ command: 'blocked', operation: 'blocked', status: 'ok', ms: Date.now() - t0, count: users.length, rateLimitRemaining: lastRate.remaining });
    emit({ ok: true, data: users });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'blocked', operation: 'blocked', status: 'error', ms: Date.now() - t0, httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'blocked', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'blocked', retryable: false });
    fail('UPSTREAM', `Blocked list read failed: ${e.message}`, { http_status: status, operation: 'blocked', retryable: status === 404 });
  }
}

async function cmdMe(args) {
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const profile = await scraper.me();
    logLine({ command: 'me', operation: 'me', status: 'ok', ms: Date.now() - t0, rateLimitRemaining: lastRate.remaining });
    emit({ ok: true, data: profile });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'me', operation: 'me', status: 'error', ms: Date.now() - t0, httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'me', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'me', retryable: false });
    fail('UPSTREAM', `Me read failed: ${e.message}`, { http_status: status, operation: 'me', retryable: status === 404 });
  }
}

async function cmdNotifications(args) {
  const type = String(args.type || 'all').toLowerCase();
  if (!['all', 'mentions', 'verified'].includes(type)) usage();
  const limit = Math.max(1, Math.min(50, Number(args.limit || 20) || 20));
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const items = await scraper.getNotifications({ type, count: limit });
    logLine({ command: 'notifications', operation: 'notifications', status: 'ok', ms: Date.now() - t0, count: items.length, rateLimitRemaining: lastRate.remaining });
    emit({ ok: true, data: items, meta: { type, count: items.length } });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'notifications', operation: 'notifications', status: 'error', ms: Date.now() - t0, httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'notifications', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'notifications', retryable: false });
    fail('UPSTREAM', `Notifications read failed: ${e.message}`, { http_status: status, operation: 'notifications', retryable: status === 404 });
  }
}

async function cmdDms(args) {
  const limit = Math.max(1, Math.min(100, Number(args.limit || 10) || 10));
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const items = [];
    for await (const c of scraper.getDmConversations(limit)) items.push(c);
    logLine({ command: 'dms', operation: 'dms', status: 'ok', ms: Date.now() - t0, count: items.length, rateLimitRemaining: lastRate.remaining });
    emit({ ok: true, data: items, meta: { count: items.length } });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'dms', operation: 'dms', status: 'error', ms: Date.now() - t0, httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'dms', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'dms', retryable: false });
    fail('UPSTREAM', `DM conversations read failed: ${e.message}`, { http_status: status, operation: 'dms', retryable: status === 404 });
  }
}

async function cmdDmRead(args) {
  const id = args.id;
  if (!id || typeof id !== 'string') usage();
  const limit = Math.max(1, Math.min(100, Number(args.limit || 10) || 10));
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const items = [];
    for await (const m of scraper.getDmMessages(id, limit)) items.push(m);
    logLine({ command: 'dm-read', operation: 'dm-read', status: 'ok', ms: Date.now() - t0, count: items.length, rateLimitRemaining: lastRate.remaining });
    emit({ ok: true, data: items, meta: { conversationId: id, count: items.length } });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'dm-read', operation: 'dm-read', status: 'error', ms: Date.now() - t0, httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'dm-read', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'dm-read', retryable: false });
    fail('UPSTREAM', `DM messages read failed: ${e.message}`, { http_status: status, operation: 'dm-read', retryable: status === 404 });
  }
}

async function cmdPost(args) {
  const text = args.text;
  if (!text || typeof text !== 'string') usage();
  const confirm = args.confirm === true || args.confirm === 'true';
  const allowBrowser = args['allow-browser-fallback'] === true || args['allow-browser-fallback'] === 'true';
  const force = args.force === true || args.force === 'true';
  const media = resolveMediaArg(args, 'post');
  const key = sha256(text);
  const dup = ledgerCheck('post', key);
  if (force) warn('FORCE used: idempotency check bypassed. --force requires Iman\'s explicit approval.');
  if (dup && !force) {
    fail('DUPLICATE', `Refusing duplicate post: identical text was already posted (tweet ${dup.tweetId || 'unknown'}, ${new Date(dup.ts).toISOString()}). Pass --force only with Iman's explicit approval.`, { operation: 'post', retryable: false });
  }
  const request = { endpoint: 'CreateTweet', operation: 'post', variables: { tweet_text: text, dark_request: false }, ...(media ? { media: { file: media.path, bytes: media.bytes, mimeType: media.mimeType, note: 'NOT uploaded in dry-run; on --confirm the file is uploaded first, then attached as media_ids' } } : {}) };
  if (!confirm) {
    emit({ ok: true, dryRun: true, request, idempotency: { duplicate: Boolean(dup), within24h: Boolean(dup), key } });
    return;
  }
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    let mediaIds = [];
    let mediaInfo = null;
    if (media) {
      mediaInfo = await scraper.uploadMedia(media.path);
      mediaIds = [mediaInfo.mediaId];
    }
    const tweet = await scraper.sendTweet(text, mediaIds.length ? { mediaIds } : {});
    const tweetId = tweet?.id || null;
    ledgerAppend({ operation: 'post', key, textHash: key, tweetId, path: 'graphql', ...(mediaInfo ? { mediaId: mediaInfo.mediaId } : {}) });
    logLine({ command: 'post', operation: 'post', status: 'ok', ms: Date.now() - t0, path: 'graphql', tweetId, ...(mediaInfo ? { mediaId: mediaInfo.mediaId } : {}) });
    emit({ ok: true, path: 'graphql', tweetId, ...(mediaInfo ? { mediaId: mediaInfo.mediaId } : {}), data: tweet });
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
        // The browser path posts text only: an uploaded media file is NOT
        // attached by the fallback — say so plainly instead of implying it was.
        emit({ ok: true, path: 'browser', tweetId, ...(mediaInfo ? { mediaId: mediaInfo.mediaId, mediaAttached: false, note: 'Posted via browser fallback; the uploaded media was NOT attached (browser path is text-only).' } : {}), ...(tweetId ? {} : { note: 'Posted via browser; tweet id not parsed — verify on the timeline.' }), data: res });
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

async function cmdReply(args) {
  const id = args.id;
  const text = args.text;
  if (!id || typeof id !== 'string' || !text || typeof text !== 'string') usage();
  const confirm = args.confirm === true || args.confirm === 'true';
  const force = args.force === true || args.force === 'true';
  const media = resolveMediaArg(args, 'reply');
  const key = sha256(id + '\n' + text);
  const dup = ledgerCheck('reply', key);
  if (force) warn('FORCE used: idempotency check bypassed. --force requires Iman\'s explicit approval.');
  if (dup && !force) {
    fail('DUPLICATE', `Refusing duplicate reply: identical reply to ${id} was already posted (tweet ${dup.tweetId || 'unknown'}, ${new Date(dup.ts).toISOString()}). Pass --force only with Iman's explicit approval.`, { operation: 'reply', retryable: false });
  }
  const request = { endpoint: 'CreateTweet', operation: 'reply', variables: { tweet_text: text, reply: { in_reply_to_tweet_id: id }, dark_request: false }, ...(media ? { media: { file: media.path, bytes: media.bytes, mimeType: media.mimeType, note: 'NOT uploaded in dry-run; on --confirm the file is uploaded first, then attached as media_ids' } } : {}) };
  if (!confirm) {
    emit({ ok: true, dryRun: true, request, idempotency: { duplicate: Boolean(dup), within24h: Boolean(dup), key } });
    return;
  }
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    let mediaIds = [];
    let mediaInfo = null;
    if (media) {
      mediaInfo = await scraper.uploadMedia(media.path);
      mediaIds = [mediaInfo.mediaId];
    }
    const tweet = await scraper.sendTweet(text, { replyTo: id, ...(mediaIds.length ? { mediaIds } : {}) });
    const tweetId = tweet?.id || null;
    ledgerAppend({ operation: 'reply', key, textHash: key, tweetId, inReplyTo: id, path: 'graphql', ...(mediaInfo ? { mediaId: mediaInfo.mediaId } : {}) });
    logLine({ command: 'reply', operation: 'reply', status: 'ok', ms: Date.now() - t0, path: 'graphql', tweetId, inReplyTo: id, ...(mediaInfo ? { mediaId: mediaInfo.mediaId } : {}) });
    emit({ ok: true, path: 'graphql', tweetId, inReplyTo: id, ...(mediaInfo ? { mediaId: mediaInfo.mediaId } : {}), data: tweet });
  } catch (e) {
    const status = httpStatusOf(e);
    const graphQL226 = is226(e);
    logLine({ command: 'reply', operation: 'reply', status: 'error', ms: Date.now() - t0, path: 'graphql', httpStatus: status, error226: graphQL226 });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'reply', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'reply', retryable: false });
    fail('UPSTREAM', `Reply failed: ${e.message}${graphQL226 ? ' (error 226: automation-looking request)' : ''}`, { http_status: status, operation: 'reply', retryable: false });
  }
}

async function cmdFollow(args) {
  const raw = args._[1];
  if (!raw || typeof raw !== 'string') usage();
  const username = raw.replace(/^@/, '').toLowerCase();
  if (!/^[a-z0-9_]{1,15}$/.test(username)) usage();
  const confirm = args.confirm === true || args.confirm === 'true';
  const force = args.force === true || args.force === 'true';
  const key = sha256('follow:' + username);
  const dup = ledgerCheck('follow', key);
  if (force) warn('FORCE used: idempotency check bypassed. --force requires Iman\'s explicit approval.');
  if (dup && !force) {
    fail('DUPLICATE', `Refusing duplicate follow: @${username} was already followed via nanomind-x (${new Date(dup.ts).toISOString()}). Pass --force only with Iman's explicit approval.`, { operation: 'follow', retryable: false });
  }
  const request = { endpoint: 'POST /i/api/1.1/friendships/create.json', operation: 'follow', variables: { screen_name: username } };
  if (!confirm) {
    emit({ ok: true, dryRun: true, request, idempotency: { duplicate: Boolean(dup), within24h: Boolean(dup), key } });
    return;
  }
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const res = await scraper.followByUsername(username);
    const userId = res?.id_str || res?.id || null;
    ledgerAppend({ operation: 'follow', key, username, userId: userId ? String(userId) : null, path: 'rest' });
    logLine({ command: 'follow', operation: 'follow', status: 'ok', ms: Date.now() - t0, path: 'rest', username, userId });
    emit({ ok: true, path: 'rest', followed: username, userId: userId ? String(userId) : null, data: res });
  } catch (e) {
    const status = httpStatusOf(e);
    const msg = String(e?.message || '');
    logLine({ command: 'follow', operation: 'follow', status: 'error', ms: Date.now() - t0, path: 'rest', httpStatus: status });
    if (/already follow/i.test(msg)) {
      ledgerAppend({ operation: 'follow', key, username, userId: null, path: 'rest', alreadyFollowing: true });
      emit({ ok: true, path: 'rest', followed: username, alreadyFollowing: true, note: 'X reports already following.' });
      return;
    }
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'follow', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'follow', retryable: false });
    fail('UPSTREAM', `Follow failed: ${msg}`, { http_status: status, operation: 'follow', retryable: false });
  }
}

async function cmdPin(args) {
  const id = args.id;
  if (!id || typeof id !== 'string') usage();
  const confirm = args.confirm === true || args.confirm === 'true';
  const force = args.force === true || args.force === 'true';
  const key = sha256('pin:' + id);
  const dup = ledgerCheck('pin', key);
  if (force) warn('FORCE used: idempotency check bypassed. --force requires Iman\'s explicit approval.');
  if (dup && !force) {
    fail('DUPLICATE', `Refusing duplicate pin: tweet ${id} was already pinned via nanomind-x (${new Date(dup.ts).toISOString()}). Pass --force only with Iman's explicit approval.`, { operation: 'pin', retryable: false });
  }
  const request = { endpoint: 'POST /i/api/1.1/account/pin_tweet.json', operation: 'pin', variables: { id } };
  if (!confirm) {
    emit({ ok: true, dryRun: true, request, idempotency: { duplicate: Boolean(dup), within24h: Boolean(dup), key } });
    return;
  }
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const res = await scraper.pinTweet(id);
    ledgerAppend({ operation: 'pin', key, tweetId: id, path: 'rest' });
    logLine({ command: 'pin', operation: 'pin', status: 'ok', ms: Date.now() - t0, path: 'rest', tweetId: id });
    emit({ ok: true, path: 'rest', pinned: id, data: res });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'pin', operation: 'pin', status: 'error', ms: Date.now() - t0, path: 'rest', httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'pin', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'pin', retryable: false });
    fail('UPSTREAM', `Pin failed: ${e.message}`, { http_status: status, operation: 'pin', retryable: false });
  }
}

async function cmdBio(args) {
  const text = args.text;
  if (!text || typeof text !== 'string') usage();
  if (text.length > 160) {
    fail('USAGE', `Bio too long: ${text.length}/160 characters.`, { operation: 'bio', retryable: false });
  }
  const confirm = args.confirm === true || args.confirm === 'true';
  const force = args.force === true || args.force === 'true';
  const key = sha256('bio:' + text);
  const dup = ledgerCheck('bio', key);
  if (force) warn('FORCE used: idempotency check bypassed. --force requires Iman\'s explicit approval.');
  if (dup && !force) {
    fail('DUPLICATE', `Refusing duplicate bio: identical bio was already set via nanomind-x (${new Date(dup.ts).toISOString()}). Pass --force only with Iman's explicit approval.`, { operation: 'bio', retryable: false });
  }
  const request = { endpoint: 'POST /i/api/1.1/account/update_profile.json', operation: 'bio', variables: { description: text } };
  if (!confirm) {
    emit({ ok: true, dryRun: true, request, idempotency: { duplicate: Boolean(dup), within24h: Boolean(dup), key } });
    return;
  }
  const t0 = Date.now();
  try {
    const scraper = await makeScraper();
    const res = await scraper.updateProfileBio(text);
    ledgerAppend({ operation: 'bio', key, textHash: key, path: 'rest' });
    logLine({ command: 'bio', operation: 'bio', status: 'ok', ms: Date.now() - t0, path: 'rest' });
    emit({ ok: true, path: 'rest', bio: text, data: res });
  } catch (e) {
    // REST path failed — fall back to the MCP browser path when the proxy is
    // alive; otherwise report the REST failure.
    const status = httpStatusOf(e);
    logLine({ command: 'bio', operation: 'bio', status: 'error', ms: Date.now() - t0, path: 'rest', httpStatus: status });
    if (!(await proxyAlive())) {
      fail('UPSTREAM', `Bio update failed on the REST path (${e.message}) and the browser fallback is unavailable: proxy 127.0.0.1:18080 is down.`, { http_status: status, operation: 'bio', retryable: true });
    }
    warn('REST bio update failed; falling back to browser path (x_update_profile).');
    try {
      const res = await callMcpTool('x_update_profile', { bio: text });
      const flat = JSON.stringify(res || '');
      const succeeded = /"success"\s*:\s*true/i.test(flat) || /Profile updated/i.test(flat);
      if (!succeeded) {
        logLine({ command: 'bio', operation: 'bio', status: 'error', ms: Date.now() - t0, path: 'browser' });
        fail('UPSTREAM', `Bio update failed on both paths. Browser result: ${flat.slice(0, 500)}`, { operation: 'bio', retryable: false });
      }
      ledgerAppend({ operation: 'bio', key, textHash: key, path: 'browser' });
      logLine({ command: 'bio', operation: 'bio', status: 'ok', ms: Date.now() - t0, path: 'browser' });
      emit({ ok: true, path: 'browser', bio: text, data: res });
    } catch (be) {
      logLine({ command: 'bio', operation: 'bio', status: 'error', ms: Date.now() - t0, path: 'browser' });
      fail('UPSTREAM', `Bio update failed: REST (${e.message}); browser (${be.message})`, { http_status: status, operation: 'bio', retryable: false });
    }
  }
}

// Shared single-tweet-id GraphQL write (like/unlike/repost/unrepost/
// bookmark/unbookmark). Same dry-run + ledger + error handling as cmdPin,
// parameterized by endpoint and operation name; the ledger key is the
// tweet id.
async function cmdTweetIdWrite(args, { command, operation, endpoint, fn }) {
  const id = args.id;
  if (!id || typeof id !== 'string') usage();
  const confirm = args.confirm === true || args.confirm === 'true';
  const force = args.force === true || args.force === 'true';
  const key = id;
  const dup = ledgerCheck(operation, key);
  if (force) warn('FORCE used: idempotency check bypassed. --force requires Iman\'s explicit approval.');
  if (dup && !force) {
    fail('DUPLICATE', `Refusing duplicate ${operation}: tweet ${id} was already ${operation}d via nanomind-x (${new Date(dup.ts).toISOString()}). Pass --force only with Iman's explicit approval.`, { operation, retryable: false });
  }
  const request = { endpoint, operation, variables: { tweet_id: id } };
  if (!confirm) {
    emit({ ok: true, dryRun: true, request, idempotency: { duplicate: Boolean(dup), within24h: Boolean(dup), key } });
    return;
  }
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    await fn(scraper, id);
    ledgerAppend({ operation, key, tweetId: id, path: 'graphql' });
    logLine({ command, operation, status: 'ok', ms: Date.now() - t0, path: 'graphql', tweetId: id });
    emit({ ok: true, path: 'graphql', tweetId: id, [operation]: true });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command, operation, status: 'error', ms: Date.now() - t0, path: 'graphql', httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation, retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation, retryable: false });
    fail('UPSTREAM', `${operation} failed: ${e.message}`, { http_status: status, operation, retryable: false });
  }
}

async function cmdLike(args) {
  await cmdTweetIdWrite(args, { command: 'like', operation: 'like', endpoint: 'FavoriteTweet', fn: (s, id) => s.likeTweet(id) });
}

async function cmdUnlike(args) {
  await cmdTweetIdWrite(args, { command: 'unlike', operation: 'unlike', endpoint: 'UnfavoriteTweet', fn: (s, id) => s.unlikeTweet(id) });
}

async function cmdRepost(args) {
  await cmdTweetIdWrite(args, { command: 'repost', operation: 'repost', endpoint: 'CreateRetweet', fn: (s, id) => s.retweet(id) });
}

async function cmdUnrepost(args) {
  await cmdTweetIdWrite(args, { command: 'unrepost', operation: 'unrepost', endpoint: 'DeleteRetweet', fn: (s, id) => s.unretweet(id) });
}

async function cmdBookmark(args) {
  await cmdTweetIdWrite(args, { command: 'bookmark', operation: 'bookmark', endpoint: 'CreateBookmark', fn: (s, id) => s.bookmarkTweet(id) });
}

async function cmdUnbookmark(args) {
  await cmdTweetIdWrite(args, { command: 'unbookmark', operation: 'unbookmark', endpoint: 'DeleteBookmark', fn: (s, id) => s.unbookmarkTweet(id) });
}

async function cmdQuote(args) {
  const id = args.id;
  const text = args.text;
  if (!id || typeof id !== 'string' || !text || typeof text !== 'string') usage();
  const confirm = args.confirm === true || args.confirm === 'true';
  const force = args.force === true || args.force === 'true';
  const media = resolveMediaArg(args, 'quote');
  const key = sha256(id + '\n' + text);
  const dup = ledgerCheck('quote', key);
  if (force) warn('FORCE used: idempotency check bypassed. --force requires Iman\'s explicit approval.');
  if (dup && !force) {
    fail('DUPLICATE', `Refusing duplicate quote: identical quote of ${id} was already posted (tweet ${dup.tweetId || 'unknown'}, ${new Date(dup.ts).toISOString()}). Pass --force only with Iman's explicit approval.`, { operation: 'quote', retryable: false });
  }
  const request = { endpoint: 'CreateTweet', operation: 'quote', variables: { tweet_text: text, quoted_tweet_id: id, dark_request: false }, ...(media ? { media: { file: media.path, bytes: media.bytes, mimeType: media.mimeType, note: 'NOT uploaded in dry-run; on --confirm the file is uploaded first, then attached as media_ids' } } : {}) };
  if (!confirm) {
    emit({ ok: true, dryRun: true, request, idempotency: { duplicate: Boolean(dup), within24h: Boolean(dup), key } });
    return;
  }
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    let mediaIds = [];
    let mediaInfo = null;
    if (media) {
      mediaInfo = await scraper.uploadMedia(media.path);
      mediaIds = [mediaInfo.mediaId];
    }
    const tweet = await scraper.sendQuoteTweet(text, id, mediaIds);
    const tweetId = tweet?.id || null;
    ledgerAppend({ operation: 'quote', key, textHash: key, tweetId, quotedTweetId: id, path: 'graphql', ...(mediaInfo ? { mediaId: mediaInfo.mediaId } : {}) });
    logLine({ command: 'quote', operation: 'quote', status: 'ok', ms: Date.now() - t0, path: 'graphql', tweetId, quotedTweetId: id, ...(mediaInfo ? { mediaId: mediaInfo.mediaId } : {}) });
    emit({ ok: true, path: 'graphql', tweetId, quotedTweetId: id, ...(mediaInfo ? { mediaId: mediaInfo.mediaId } : {}), data: tweet });
  } catch (e) {
    const status = httpStatusOf(e);
    const graphQL226 = is226(e);
    logLine({ command: 'quote', operation: 'quote', status: 'error', ms: Date.now() - t0, path: 'graphql', httpStatus: status, error226: graphQL226 });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'quote', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'quote', retryable: false });
    fail('UPSTREAM', `Quote failed: ${e.message}${graphQL226 ? ' (error 226: automation-looking request)' : ''}`, { http_status: status, operation: 'quote', retryable: false });
  }
}

async function cmdUnfollow(args) {
  const raw = args._[1];
  if (!raw || typeof raw !== 'string') usage();
  const username = raw.replace(/^@/, '').toLowerCase();
  if (!/^[a-z0-9_]{1,15}$/.test(username)) usage();
  const confirm = args.confirm === true || args.confirm === 'true';
  const force = args.force === true || args.force === 'true';
  const key = sha256('unfollow:' + username);
  const dup = ledgerCheck('unfollow', key);
  if (force) warn('FORCE used: idempotency check bypassed. --force requires Iman\'s explicit approval.');
  if (dup && !force) {
    fail('DUPLICATE', `Refusing duplicate unfollow: @${username} was already unfollowed via nanomind-x (${new Date(dup.ts).toISOString()}). Pass --force only with Iman's explicit approval.`, { operation: 'unfollow', retryable: false });
  }
  const request = { endpoint: 'POST /i/api/1.1/friendships/destroy.json', operation: 'unfollow', variables: { screen_name: username } };
  if (!confirm) {
    emit({ ok: true, dryRun: true, request, idempotency: { duplicate: Boolean(dup), within24h: Boolean(dup), key } });
    return;
  }
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    await scraper.unfollowByUsername(username);
    ledgerAppend({ operation: 'unfollow', key, username, path: 'rest' });
    logLine({ command: 'unfollow', operation: 'unfollow', status: 'ok', ms: Date.now() - t0, path: 'rest', username });
    emit({ ok: true, path: 'rest', unfollowed: username });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'unfollow', operation: 'unfollow', status: 'error', ms: Date.now() - t0, path: 'rest', httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'unfollow', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'unfollow', retryable: false });
    fail('UPSTREAM', `Unfollow failed: ${e.message}`, { http_status: status, operation: 'unfollow', retryable: false });
  }
}

async function cmdUnpin(args) {
  const id = args.id;
  if (!id || typeof id !== 'string') usage();
  const confirm = args.confirm === true || args.confirm === 'true';
  const force = args.force === true || args.force === 'true';
  const key = 'unpin:' + id;
  const dup = ledgerCheck('unpin', key);
  if (force) warn('FORCE used: idempotency check bypassed. --force requires Iman\'s explicit approval.');
  if (dup && !force) {
    fail('DUPLICATE', `Refusing duplicate unpin: tweet ${id} was already unpinned via nanomind-x (${new Date(dup.ts).toISOString()}). Pass --force only with Iman's explicit approval.`, { operation: 'unpin', retryable: false });
  }
  const request = { endpoint: 'POST /i/api/1.1/account/unpin_tweet.json', operation: 'unpin', variables: { id } };
  if (!confirm) {
    emit({ ok: true, dryRun: true, request, idempotency: { duplicate: Boolean(dup), within24h: Boolean(dup), key } });
    return;
  }
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const res = await scraper.unpinTweet(id);
    ledgerAppend({ operation: 'unpin', key, tweetId: id, path: 'rest' });
    logLine({ command: 'unpin', operation: 'unpin', status: 'ok', ms: Date.now() - t0, path: 'rest', tweetId: id });
    emit({ ok: true, path: 'rest', unpinned: id, data: res });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'unpin', operation: 'unpin', status: 'error', ms: Date.now() - t0, path: 'rest', httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'unpin', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'unpin', retryable: false });
    fail('UPSTREAM', `Unpin failed: ${e.message}`, { http_status: status, operation: 'unpin', retryable: false });
  }
}

// Shared REST user write (block/unblock/mute/unmute). Same dry-run +
// ledger + error handling as cmdFollow; the ledger key is
// sha256(operation + ':' + username).
const PAST_TENSE = { block: 'blocked', unblock: 'unblocked', mute: 'muted', unmute: 'unmuted' };
async function cmdUserRestWrite(args, { command, operation, endpoint, fn }) {
  const raw = args._[1];
  if (!raw || typeof raw !== 'string') usage();
  const username = raw.replace(/^@/, '').toLowerCase();
  if (!/^[a-z0-9_]{1,15}$/.test(username)) usage();
  const confirm = args.confirm === true || args.confirm === 'true';
  const force = args.force === true || args.force === 'true';
  const key = sha256(operation + ':' + username);
  const dup = ledgerCheck(operation, key);
  if (force) warn('FORCE used: idempotency check bypassed. --force requires Iman\'s explicit approval.');
  if (dup && !force) {
    fail('DUPLICATE', `Refusing duplicate ${operation}: @${username} was already ${operation}ed via nanomind-x (${new Date(dup.ts).toISOString()}). Pass --force only with Iman's explicit approval.`, { operation, retryable: false });
  }
  const request = { endpoint, operation, variables: { screen_name: username } };
  if (!confirm) {
    emit({ ok: true, dryRun: true, request, idempotency: { duplicate: Boolean(dup), within24h: Boolean(dup), key } });
    return;
  }
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const res = await fn(scraper, username);
    const userId = res?.id_str || res?.id || null;
    ledgerAppend({ operation, key, username, userId: userId ? String(userId) : null, path: 'rest' });
    logLine({ command, operation, status: 'ok', ms: Date.now() - t0, path: 'rest', username, userId });
    emit({ ok: true, path: 'rest', [PAST_TENSE[operation] || (operation + 'ed')]: username, userId: userId ? String(userId) : null, data: res });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command, operation, status: 'error', ms: Date.now() - t0, path: 'rest', httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation, retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation, retryable: false });
    fail('UPSTREAM', `${operation} failed: ${e.message}`, { http_status: status, operation, retryable: false });
  }
}

async function cmdBlock(args) {
  await cmdUserRestWrite(args, { command: 'block', operation: 'block', endpoint: 'POST /i/api/1.1/blocks/create.json', fn: (s, u) => s.blockUserByUsername(u) });
}

async function cmdUnblock(args) {
  await cmdUserRestWrite(args, { command: 'unblock', operation: 'unblock', endpoint: 'POST /i/api/1.1/blocks/destroy.json', fn: (s, u) => s.unblockUserByUsername(u) });
}

async function cmdMute(args) {
  await cmdUserRestWrite(args, { command: 'mute', operation: 'mute', endpoint: 'POST /i/api/1.1/mutes/users/create.json', fn: (s, u) => s.muteUserByUsername(u) });
}

async function cmdUnmute(args) {
  await cmdUserRestWrite(args, { command: 'unmute', operation: 'unmute', endpoint: 'POST /i/api/1.1/mutes/users/destroy.json', fn: (s, u) => s.unmuteUserByUsername(u) });
}

async function cmdDm(args) {
  const rawUser = args.user;
  const text = args.text;
  if (!rawUser || typeof rawUser !== 'string' || !text || typeof text !== 'string') usage();
  const username = rawUser.replace(/^@/, '').toLowerCase();
  if (!/^[a-z0-9_]{1,15}$/.test(username)) usage();
  const confirm = args.confirm === true || args.confirm === 'true';
  const force = args.force === true || args.force === 'true';
  const t0 = Date.now();
  const scraper = await makeScraper();
  let userId = null;
  try {
    const profile = await scraper.getProfile(username);
    userId = profile?.id;
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'dm', operation: 'dm', status: 'error', ms: Date.now() - t0, httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'dm', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'dm', retryable: false });
    fail('UPSTREAM', `DM failed: could not resolve @${username}: ${e.message}`, { http_status: status, operation: 'dm', retryable: status === 404 });
  }
  if (!userId) {
    fail('UPSTREAM', `DM failed: could not resolve @${username} to a user id.`, { operation: 'dm', retryable: false });
  }
  const key = sha256(String(userId) + '\n' + text);
  const dup = ledgerCheck('dm', key);
  if (force) warn('FORCE used: idempotency check bypassed. --force requires Iman\'s explicit approval.');
  if (dup && !force) {
    fail('DUPLICATE', `Refusing duplicate DM: identical DM to @${username} was already sent (message ${dup.messageId || 'unknown'}, ${new Date(dup.ts).toISOString()}). Pass --force only with Iman's explicit approval.`, { operation: 'dm', retryable: false });
  }
  const request = { endpoint: 'sendDmToUser', operation: 'dm', variables: { user_id: String(userId), screen_name: username, text } };
  if (!confirm) {
    emit({ ok: true, dryRun: true, request, idempotency: { duplicate: Boolean(dup), within24h: Boolean(dup), key } });
    return;
  }
  try {
    const res = await scraper.sendDmToUser(String(userId), text);
    const messageId = res?.id || null;
    ledgerAppend({ operation: 'dm', key, textHash: key, messageId, userId: String(userId), username, path: 'graphql' });
    logLine({ command: 'dm', operation: 'dm', status: 'ok', ms: Date.now() - t0, path: 'graphql', messageId, userId: String(userId) });
    emit({ ok: true, path: 'graphql', messageId, userId: String(userId), username, data: res });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'dm', operation: 'dm', status: 'error', ms: Date.now() - t0, path: 'graphql', httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'dm', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'dm', retryable: false });
    fail('UPSTREAM', `DM failed: ${e.message}`, { http_status: status, operation: 'dm', retryable: false });
  }
}

async function cmdThread(args) {
  // `thread` is two commands sharing one name (v2.1.0): `--id` READS a
  // thread (focal tweet + replies, no ledger, no --confirm), `--text`
  // POSTS a thread. Both flags or neither is a usage error.
  if (args.id && !args.text) return cmdThreadRead(args);
  if (args.text && !args.id) return cmdThreadPost(args);
  usage();
}

async function cmdThreadRead(args) {
  const id = args.id;
  if (!id || typeof id !== 'string') usage();
  const t0 = Date.now();
  const scraper = await makeScraper();
  try {
    const thread = await scraper.getThread(id);
    logLine({ command: 'thread', operation: 'thread-read', status: 'ok', ms: Date.now() - t0, tweetId: id, entries: thread.entries.length, rateLimitRemaining: lastRate.remaining });
    emit({ ok: true, data: thread, meta: { focalTweetId: thread.focalTweetId, entries: thread.entries.length, hasMore: thread.hasMore } });
  } catch (e) {
    const status = httpStatusOf(e);
    logLine({ command: 'thread', operation: 'thread-read', status: 'error', ms: Date.now() - t0, httpStatus: status });
    if (status === 429) fail('RATE_LIMITED', 'X rate limit hit (429).', { http_status: 429, operation: 'thread-read', retryable: true });
    if (status === 401) fail('AUTH', 'X session rejected (401).', { http_status: 401, operation: 'thread-read', retryable: false });
    fail('UPSTREAM', `Thread read failed: ${e.message}`, { http_status: status, operation: 'thread-read', retryable: status === 404 });
  }
}

async function cmdThreadPost(args) {
  const text = args.text;
  if (!text || typeof text !== 'string') usage();
  const parts = text.split('||').map((p) => p.trim());
  if (parts.length > 25) {
    fail('USAGE', `Thread too long: ${parts.length}/25 parts.`, { operation: 'thread', retryable: false });
  }
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i]) {
      fail('USAGE', `Thread part ${i + 1} is empty.`, { operation: 'thread', retryable: false });
    }
    if (parts[i].length > 280) {
      fail('USAGE', `Thread part ${i + 1} too long: ${parts[i].length}/280 characters.`, { operation: 'thread', retryable: false });
    }
  }
  const confirm = args.confirm === true || args.confirm === 'true';
  const force = args.force === true || args.force === 'true';
  const key = sha256(text);
  const dup = ledgerCheck('thread', key);
  if (force) warn('FORCE used: idempotency check bypassed. --force requires Iman\'s explicit approval.');
  if (dup && !force) {
    fail('DUPLICATE', `Refusing duplicate thread: identical thread was already posted (first tweet ${dup.tweetIds?.[0] || 'unknown'}, ${new Date(dup.ts).toISOString()}). Pass --force only with Iman's explicit approval.`, { operation: 'thread', retryable: false });
  }
  const request = { endpoint: 'CreateTweet (thread)', operation: 'thread', variables: { parts } };
  if (!confirm) {
    emit({ ok: true, dryRun: true, request, idempotency: { duplicate: Boolean(dup), within24h: Boolean(dup), key } });
    return;
  }
  const t0 = Date.now();
  const scraper = await makeScraper();
  const posted = [];
  let prevId = null;
  for (let i = 0; i < parts.length; i++) {
    try {
      const tweet = await scraper.sendTweet(parts[i], prevId ? { replyTo: prevId } : {});
      const tweetId = tweet?.id || null;
      posted.push(tweetId);
      prevId = tweetId;
    } catch (e) {
      const status = httpStatusOf(e);
      logLine({ command: 'thread', operation: 'thread', status: 'error', ms: Date.now() - t0, path: 'graphql', httpStatus: status, failedPart: i + 1, postedTweetIds: posted });
      fail('UPSTREAM', `Thread failed at part ${i + 1}/${parts.length}${status ? ` (HTTP ${status})` : ''}: ${e.message}. Already posted: ${posted.length ? posted.join(', ') : 'none'}. No retry, no rollback — the posted parts stay live.`, { http_status: status, operation: 'thread', retryable: status === 429 });
    }
  }
  ledgerAppend({ operation: 'thread', key, textHash: key, tweetIds: posted, path: 'graphql' });
  logLine({ command: 'thread', operation: 'thread', status: 'ok', ms: Date.now() - t0, path: 'graphql', tweetIds: posted });
  emit({ ok: true, path: 'graphql', tweetIds: posted, count: posted.length });
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
  else if (cmd === 'tweet') await cmdTweet(args);
  else if (cmd === 'liked') await cmdLiked(args);
  else if (cmd === 'followers') await cmdFollowers(args);
  else if (cmd === 'following') await cmdFollowing(args);
  else if (cmd === 'replies') await cmdReplies(args);
  else if (cmd === 'trends') await cmdTrends(args);
  else if (cmd === 'blocked') await cmdBlocked(args);
  else if (cmd === 'me') await cmdMe(args);
  else if (cmd === 'notifications') await cmdNotifications(args);
  else if (cmd === 'dms') await cmdDms(args);
  else if (cmd === 'dm-read') await cmdDmRead(args);
  else if (cmd === 'post') await cmdPost(args);
  else if (cmd === 'reply') await cmdReply(args);
  else if (cmd === 'quote') await cmdQuote(args);
  else if (cmd === 'thread') await cmdThread(args);
  else if (cmd === 'like') await cmdLike(args);
  else if (cmd === 'unlike') await cmdUnlike(args);
  else if (cmd === 'repost') await cmdRepost(args);
  else if (cmd === 'unrepost') await cmdUnrepost(args);
  else if (cmd === 'bookmark') await cmdBookmark(args);
  else if (cmd === 'unbookmark') await cmdUnbookmark(args);
  else if (cmd === 'follow') await cmdFollow(args);
  else if (cmd === 'unfollow') await cmdUnfollow(args);
  else if (cmd === 'pin') await cmdPin(args);
  else if (cmd === 'unpin') await cmdUnpin(args);
  else if (cmd === 'block') await cmdBlock(args);
  else if (cmd === 'unblock') await cmdUnblock(args);
  else if (cmd === 'mute') await cmdMute(args);
  else if (cmd === 'unmute') await cmdUnmute(args);
  else if (cmd === 'bio') await cmdBio(args);
  else if (cmd === 'dm') await cmdDm(args);
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
