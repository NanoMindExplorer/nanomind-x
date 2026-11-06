// TweetResultByRestId + article fieldToggles: does the tweet's `article` field
// then include plain_text / content_state?
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

async function run(label, toggles) {
  const url = buildGraphQLUrl(qid, 'TweetResultByRestId', vars, DEFAULT_FEATURES, toggles);
  try {
    const json = await client.request(url);
    const text = JSON.stringify(json);
    const art = json?.data?.tweetResult?.result?.article?.article_results?.result;
    console.log(`--- ${label} --- bytes:${text.length} plain_text:${text.includes('plain_text')} content_state:${text.includes('content_state')} articleKeys:${art ? Object.keys(art).join(',') : 'NONE'}`);
  } catch (e) { console.log(`--- ${label} --- ERROR:`, e.message?.slice(0, 150)); }
}

await run('A: article toggles all true', { withArticlePlainText: true, withArticleRichContentState: true, withArticleSummaryText: true });
await run('B: article toggles + descriptor toggles', { withArticlePlainText: true, withArticleRichContentState: true, withArticleSummaryText: true, withPayments: true, withDmBlocks: true, withAuxiliaryUserLabels: true });
