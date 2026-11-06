// Probe: find bundle.TwitterArticles via the home page chunk manifest, download it,
// extract Article operations and their call-site context.
import { parseChunkManifest, extractOperations } from '../../engine/src/scrapers/twitter/http/queryIds.js';
import { browserNavigationHeaders } from '../../engine/src/scrapers/twitter/http/guest.js';
import fs from 'node:fs';

const home = await (await fetch('https://x.com/home', { headers: browserNavigationHeaders(), redirect: 'follow', signal: AbortSignal.timeout(30000) })).text();
fs.writeFileSync('home.html', home);
console.log('home.html bytes:', home.length);
const manifest = parseChunkManifest(home);
console.log('chunks:', manifest.chunks.length, 'base:', manifest.base);
const ta = manifest.chunks.filter(c => /TwitterArticles/i.test(c.name));
console.log('TwitterArticles chunks:', JSON.stringify(ta, null, 2));
for (const c of ta) {
  const js = await (await fetch(c.url, { headers: { 'user-agent': browserNavigationHeaders()['user-agent'], accept: '*/*' }, signal: AbortSignal.timeout(60000) })).text();
  fs.writeFileSync(`bundle.TwitterArticles.${c.hash}.js`, js);
  console.log('saved', c.name, js.length, 'bytes');
  const ops = extractOperations(js).filter(o => /Article/i.test(o.operationName));
  console.log('Article ops in bundle:', JSON.stringify(ops, null, 2));
  // call-site context: every occurrence of ArticleEntityResultByRestId / ArticleEntitiesSlice
  for (const name of ['ArticleEntityResultByRestId', 'ArticleEntitiesSlice']) {
    let idx = -1, n = 0;
    while ((idx = js.indexOf(name, idx + 1)) !== -1 && n < 6) {
      n++;
      console.log(`--- ${name} occurrence ${n} at ${idx} ---`);
      console.log(js.slice(Math.max(0, idx - 600), idx + 900).replace(/\n/g, ' '));
    }
  }
}
