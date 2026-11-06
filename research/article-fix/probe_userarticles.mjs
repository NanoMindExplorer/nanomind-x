// Try UserArticlesTweets with both the cached and generated queryIds to list
// OmbrelloNFT's articles and get a second article id for comparison.
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { buildGraphQLUrl, DEFAULT_FEATURES } from '../../engine/src/scrapers/twitter/http/endpoints.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });
const vars = { userId: '2115333364807061504', count: 20, includePromotedContent: false, withCommunity: false };
for (const [label, qid] of [['cached', '9Yf6bKYpvNL8ungvkqMlTw'], ['generated', 'ZmMjUyrTpwYfTGAdylEyMw']]) {
  try {
    const url = buildGraphQLUrl(qid, 'UserArticlesTweets', vars, DEFAULT_FEATURES);
    const json = await client.request(url);
    const text = JSON.stringify(json);
    console.log(`--- UserArticlesTweets (${label}) ---`);
    console.log('has article rest id 2118426406657163264:', text.includes('2118426406657163264'));
    console.log('preview:', text.slice(0, 600));
  } catch (e) { console.log(`--- UserArticlesTweets (${label}) --- ERROR:`, e.message?.slice(0, 200)); }
}
