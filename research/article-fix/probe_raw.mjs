// Print the FULL raw response of ArticleEntityResultByRestId, and fetch the
// pinned tweet that links the article to find the article's true entity id.
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { buildGraphQLUrl, DEFAULT_FEATURES } from '../../engine/src/scrapers/twitter/http/endpoints.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });

// 1) full raw body for the article query
const url = buildGraphQLUrl('eUiP53I_YemhBOI2TMCI3A', 'ArticleEntityResultByRestId', { articleEntityId: '2118426406657163264' }, DEFAULT_FEATURES);
const raw = await client.request(url);
console.log('=== FULL RAW RESPONSE ===');
console.log(JSON.stringify(raw, null, 2).slice(0, 3000));

// 2) the pinned tweet 2118682381536440451 (links the article) via TweetResultByRestId
const { queryId, operationName } = (await import('../../engine/src/scrapers/twitter/http/endpoints.js')).GRAPHQL.TweetResultByRestId;
const tweet = await client.graphql(queryId, operationName, { tweetId: '2118682381536440451', withCommunity: false, includePromotedContent: false, withVoice: false });
const t = JSON.stringify(tweet?.data ?? tweet);
console.log('=== PINNED TWEET: article mentions ===');
for (const m of t.matchAll(/article[^"]{0,80}/gi)) console.log(m[0].slice(0, 200));
console.log('contains 2118426406657163264:', t.includes('2118426406657163264'));
console.log('tweet text:', JSON.stringify(tweet?.data?.tweetResult?.result?.legacy?.full_text ?? '').slice(0, 300));
