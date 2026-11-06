import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { getQueryId } from '../../engine/src/scrapers/twitter/http/queryIds.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });
const qid = await getQueryId('TweetResultByRestId');
console.log('TweetResultByRestId queryId:', qid);
const json = await client.graphql(qid, 'TweetResultByRestId', { tweetId: '2118682381536440451', withCommunity: false, includePromotedContent: false, withVoice: false });
const tweet = json?.data?.tweetResult?.result;
console.log('tweet __typename:', tweet?.__typename, '| keys:', tweet ? Object.keys(tweet) : 'NONE');
console.log('legacy keys:', tweet?.legacy ? Object.keys(tweet.legacy) : 'NONE');
console.log('has article_results:', 'article_results' in (tweet || {}));
console.log('fullText:', JSON.stringify(tweet?.legacy?.full_text)?.slice(0, 300));
console.log('article raw:', JSON.stringify(tweet?.article)?.slice(0, 4000));
