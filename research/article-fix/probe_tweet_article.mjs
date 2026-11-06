// Dump the article-related subtree of the pinned tweet's raw result.
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });
const { queryId, operationName } = (await import('../../engine/src/scrapers/twitter/http/endpoints.js')).GRAPHQL.TweetResultByRestId;
const tweet = await client.graphql(queryId, operationName, { tweetId: '2118682381536440451', withCommunity: false, includePromotedContent: false, withVoice: false });
const result = tweet?.data?.tweetResult?.result;

// walk and print every subtree whose key contains 'article'
function walk(o, p = '') {
  if (!o || typeof o !== 'object') return;
  for (const [k, v] of Object.entries(o)) {
    const np = p ? `${p}.${k}` : k;
    if (/article/i.test(k)) {
      console.log(`--- ${np} ---`);
      console.log(JSON.stringify(v, null, 2).slice(0, 2500));
    }
    if (v && typeof v === 'object') walk(v, np);
  }
}
walk(result);
// also: does the tweet legacy entities contain the article url?
console.log('=== entities.urls ===');
console.log(JSON.stringify(result?.legacy?.entities?.urls, null, 2)?.slice(0, 1500));
