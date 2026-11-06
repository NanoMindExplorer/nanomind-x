// Re-test the DIRECT ArticleEntityResultByRestId with the article fieldToggles,
// using the exact pattern that just worked on the tweet query.
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { buildGraphQLUrl, DEFAULT_FEATURES } from '../../engine/src/scrapers/twitter/http/endpoints.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ID = '2118426406657163264';
const QID = 'eUiP53I_YemhBOI2TMCI3A';
const OP = 'ArticleEntityResultByRestId';
const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });

async function run(label, toggles) {
  const url = buildGraphQLUrl(QID, OP, { articleEntityId: ID }, DEFAULT_FEATURES, toggles);
  try {
    const json = await client.request(url);
    const text = JSON.stringify(json);
    const result = json?.data?.article_result_by_rest_id?.result;
    console.log(`--- ${label} --- bytes:${text.length} plain_text:${text.includes('plain_text')} content_state:${text.includes('content_state')} keys:${result ? Object.keys(result).join(',') : 'NONE'}`);
    if (result?.plain_text) console.log('   plain_text excerpt:', JSON.stringify(result.plain_text).slice(0, 400));
  } catch (e) { console.log(`--- ${label} --- ERROR:`, e.message?.slice(0, 150)); }
}

await run('A: article toggles all true', { withArticlePlainText: true, withArticleRichContentState: true, withArticleSummaryText: true });
await run('B: no toggles', undefined);
await run('C: article toggles + descriptor toggles', { withArticlePlainText: true, withArticleRichContentState: true, withArticleSummaryText: true, withPayments: true, withDmBlocks: true, withAuxiliaryUserLabels: true });
