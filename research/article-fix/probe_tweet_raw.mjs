// Dump the FULL raw TweetResultByRestId response for the pinned tweet and
// search it for any article content fields (plain_text / content_state).
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { getQueryId } from '../../engine/src/scrapers/twitter/http/queryIds.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });
const qid = await getQueryId('TweetResultByRestId');
const vars = { tweetId: '2118682381536440451', withCommunity: false, includePromotedContent: false, withVoice: false };
const json = await client.graphql(qid, 'TweetResultByRestId', vars);
const text = JSON.stringify(json);
fs.writeFileSync('tweet_pinned_raw.json', text);
console.log('total bytes:', text.length);
console.log('contains plain_text:', text.includes('plain_text'));
console.log('contains content_state:', text.includes('content_state'));
console.log('contains article_results:', text.includes('article_results'));
console.log('contains "article":', text.includes('"article"'));
const tweet = json?.data?.tweetResult?.result;
console.log('tweet top-level keys:', tweet ? Object.keys(tweet) : 'NONE');
console.log('note_tweet present:', Boolean(tweet?.note_tweet));
console.log('article field keys:', tweet?.article ? Object.keys(tweet.article) : 'NONE');
