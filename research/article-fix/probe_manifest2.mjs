// Probe: fetch home WITH session cookies (logged-in shell ships the classic client),
// parse chunk manifest, download bundle.TwitterArticles, extract Article call sites.
import { parseChunkManifest, extractOperations } from '../../engine/src/scrapers/twitter/http/queryIds.js';
import { browserNavigationHeaders } from '../../engine/src/scrapers/twitter/http/guest.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
console.log('cookie names:', cookies.map(c => c.name).join(','));

const headers = { ...browserNavigationHeaders(), cookie: cookieHeader };
const home = await (await fetch('https://x.com/home', { headers, redirect: 'follow', signal: AbortSignal.timeout(30000) })).text();
fs.writeFileSync('home_auth.html', home);
console.log('home_auth.html bytes:', home.length);
const manifest = parseChunkManifest(home);
console.log('chunks:', manifest.chunks.length);
const ta = manifest.chunks.filter(c => /TwitterArticles/i.test(c.name));
console.log('TwitterArticles chunks:', JSON.stringify(ta));
for (const c of ta) {
  const js = await (await fetch(c.url, { headers: { 'user-agent': headers['user-agent'], accept: '*/*', cookie: cookieHeader }, signal: AbortSignal.timeout(60000) })).text();
  fs.writeFileSync(`bundle.TwitterArticles.${c.hash}.js`, js);
  console.log('saved', c.name, js.length, 'bytes');
  const ops = extractOperations(js).filter(o => /Article/i.test(o.operationName));
  console.log('Article ops in bundle:', JSON.stringify(ops));
}
