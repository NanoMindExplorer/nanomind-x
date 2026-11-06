// Probe ArticleEntityResultByRestId with the engine's TwitterHttpClient.
// Tests: string vs number id, exact features, fieldToggles on/off, and
// UserArticlesTweets cross-check of the article rest_id.
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { buildGraphQLUrl, DEFAULT_FEATURES, operationFeatures } from '../../engine/src/scrapers/twitter/http/endpoints.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ID = '2118426406657163264';
const QID = 'eUiP53I_YemhBOI2TMCI3A';
const OP = 'ArticleEntityResultByRestId';

const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; '), debug: false });
console.log('authenticated:', client.isAuthenticated());

const exactFeatures = operationFeatures(OP);
console.log('operationFeatures:', JSON.stringify(exactFeatures));

async function rawGet(url, label) {
  try {
    const json = await client.request(url);
    const result = json?.data?.article_result_by_rest_id?.result;
    console.log(`--- ${label} ---`);
    console.log('HTTP ok. result keys:', result ? Object.keys(result) : 'NO RESULT FIELD');
    console.log('result preview:', JSON.stringify(result)?.slice(0, 600));
    console.log('errors:', JSON.stringify(json?.errors)?.slice(0, 300) ?? 'none');
    return result;
  } catch (e) {
    console.log(`--- ${label} --- ERROR:`, e.message?.slice(0, 300));
    return null;
  }
}

// A: string id + DEFAULT_FEATURES (what the task already tried)
await rawGet(buildGraphQLUrl(QID, OP, { articleEntityId: ID }, DEFAULT_FEATURES), 'A: string id + DEFAULT_FEATURES');
// B: string id + exact 5 features
await rawGet(buildGraphQLUrl(QID, OP, { articleEntityId: ID }, exactFeatures), 'B: string id + exact 5 features');
// C: string id + exact features + fieldToggles all false
await rawGet(buildGraphQLUrl(QID, OP, { articleEntityId: ID }, exactFeatures, { withPayments: false, withDmBlocks: false, withAuxiliaryUserLabels: false }), 'C: + fieldToggles all false');
// D: string id + exact features + fieldToggles all true
await rawGet(buildGraphQLUrl(QID, OP, { articleEntityId: ID }, exactFeatures, { withPayments: true, withDmBlocks: true, withAuxiliaryUserLabels: true }), 'D: + fieldToggles all true');
// E: NUMBER id (precision trap test) + DEFAULT_FEATURES
await rawGet(buildGraphQLUrl(QID, OP, { articleEntityId: 2118426406657163264 }, DEFAULT_FEATURES), 'E: NUMBER id + DEFAULT_FEATURES');

// F: cross-check rest_id via UserArticlesTweets for OmbrelloNFT
try {
  const { queryId, operationName } = (await import('../../engine/src/scrapers/twitter/http/endpoints.js')).GRAPHQL.UserArticlesTweets;
  const resp = await client.graphql(queryId, operationName, { userId: '2115333364807061504', count: 10, includePromotedContent: false, withCommunity: false });
  const text = JSON.stringify(resp?.data ?? resp);
  console.log('--- F: UserArticlesTweets ---');
  console.log('contains 2118426406657163264:', text.includes('2118426406657163264'));
  console.log('data preview:', text.slice(0, 800));
} catch (e) {
  console.log('--- F: UserArticlesTweets --- ERROR:', e.message?.slice(0, 300));
}
