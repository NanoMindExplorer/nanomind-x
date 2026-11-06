// Probe: POST variant + extra article field toggles for ArticleEntityResultByRestId.
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { buildGraphQLUrl, DEFAULT_FEATURES, operationFeatures } from '../../engine/src/scrapers/twitter/http/endpoints.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ID = '2118426406657163264';
const QID = 'eUiP53I_YemhBOI2TMCI3A';
const OP = 'ArticleEntityResultByRestId';
const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });
const exact = operationFeatures(OP);

async function show(label, json) {
  const result = json?.data?.article_result_by_rest_id?.result;
  console.log(`--- ${label} --- keys:`, result ? Object.keys(result) : 'NO RESULT', '| preview:', JSON.stringify(result)?.slice(0, 400), '| errors:', JSON.stringify(json?.errors)?.slice(0, 200) ?? 'none');
}

// POST variant (mutation-style body)
try {
  const json = await client.request(`https://x.com/i/api/graphql/${QID}/${OP}`, { method: 'POST', body: { variables: { articleEntityId: ID }, features: exact, queryId: QID } });
  await show('POST + exact features', json);
} catch (e) { console.log('--- POST + exact features --- ERROR:', e.message?.slice(0, 200)); }

// GET + exact features + article toggles (withArticlePlainText / RichContentState true)
try {
  const url = buildGraphQLUrl(QID, OP, { articleEntityId: ID }, exact, { withArticlePlainText: true, withArticleRichContentState: true, withArticleSummaryText: true, withPayments: false, withDmBlocks: false, withAuxiliaryUserLabels: false });
  await show('GET + article toggles true', await client.request(url));
} catch (e) { console.log('--- GET + article toggles true --- ERROR:', e.message?.slice(0, 200)); }

// GET + DEFAULT_FEATURES + article toggles true
try {
  const url = buildGraphQLUrl(QID, OP, { articleEntityId: ID }, DEFAULT_FEATURES, { withArticlePlainText: true, withArticleRichContentState: true });
  await show('GET + DEFAULT + article toggles true', await client.request(url));
} catch (e) { console.log('--- GET + DEFAULT + article toggles true --- ERROR:', e.message?.slice(0, 200)); }
