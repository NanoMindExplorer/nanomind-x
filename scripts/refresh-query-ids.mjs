#!/usr/bin/env node
// Refresh the nanomind-x GraphQL query-ID cache using the engine's own
// discovery, but with an authenticated fetch (session cookies from the saved
// login). A guest fetch only gets the new server-rendered shell, which has no
// client bundles, so the engine's own refresh finds nothing.
// Cookie values are never printed.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { discoverQueryIds } from '../engine/src/scrapers/twitter/http/queryIds.js';

const HOME = process.env.NANOMIND_X_HOME || path.join(os.homedir(), '.nanomind-x');
const cookies = JSON.parse(fs.readFileSync(path.join(HOME, 'cookies.json'), 'utf8'));
const cookieHeader = cookies
  .filter((c) => c.name && typeof c.value === 'string')
  .map((c) => `${c.name}=${c.value}`)
  .join('; ');
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const authFetch = (url, opts = {}) =>
  fetch(url, {
    ...opts,
    headers: { ...(opts.headers || {}), 'User-Agent': UA, Cookie: cookieHeader },
    redirect: 'follow',
  });

try {
  const result = await discoverQueryIds({ fetch: authFetch, scope: 'core' });
  console.log('DISCOVERED count:', result.count);
  console.log('source:', JSON.stringify(result.source));
  console.log('SearchTimeline:', JSON.stringify(result.operations.SearchTimeline || null));
  console.log('Followers:', JSON.stringify(result.operations.Followers || null));
  console.log('CreateTweet:', JSON.stringify(result.operations.CreateTweet || null));
  console.log('cachePath:', result.cachePath);
} catch (e) {
  console.log('DISCOVERY FAILED:', e.message);
  process.exitCode = 1;
}
