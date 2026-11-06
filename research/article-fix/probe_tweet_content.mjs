// Save the full article content from the tweet two-hop and print plain_text.
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { buildGraphQLUrl, DEFAULT_FEATURES } from '../../engine/src/scrapers/twitter/http/endpoints.js';
import { getQueryId } from '../../engine/src/scrapers/twitter/http/queryIds.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });
const qid = await getQueryId('TweetResultByRestId');
const vars = { tweetId: '2118682381536440451', withCommunity: false, includePromotedContent: false, withVoice: false };
const toggles = { withArticlePlainText: true, withArticleRichContentState: true, withArticleSummaryText: true };
const url = buildGraphQLUrl(qid, 'TweetResultByRestId', vars, DEFAULT_FEATURES, toggles);
const json = await client.request(url);
const art = json?.data?.tweetResult?.result?.article?.article_results?.result;
fs.writeFileSync('tampesta_article_full.json', JSON.stringify(art, null, 2));
console.log('title:', art?.title);
console.log('rest_id:', art?.rest_id);
console.log('plain_text length:', art?.plain_text?.length, 'chars');
console.log('plain_text contains Tampesta:', art?.plain_text?.includes('Tampesta'));
console.log('content_state blocks:', art?.content_state?.blocks?.length);
console.log('media_entities:', art?.media_entities?.length);
console.log('--- plain_text (first 1500 chars) ---');
console.log(art?.plain_text?.slice(0, 1500));
