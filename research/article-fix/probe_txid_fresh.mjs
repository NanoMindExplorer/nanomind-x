// Check txid cache state, force fresh discovery from live bundles, and probe
// the article endpoint signed with the fresh keys.
import { transactionIdStatus, getTransactionId, initializeTransactionId } from '../../engine/src/scrapers/twitter/http/transactionId.js';
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { buildGraphQLUrl, DEFAULT_FEATURES } from '../../engine/src/scrapers/twitter/http/endpoints.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

console.log('status before:', JSON.stringify(transactionIdStatus(), null, 2));
const keys = await initializeTransactionId({ force: true });
console.log('fresh keys:', keys ? { source: keys.source, fetchedAt: keys.fetchedAt } : null);

const ID = '2118426406657163264';
const QID = 'eUiP53I_YemhBOI2TMCI3A';
const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });
const url = buildGraphQLUrl(QID, 'ArticleEntityResultByRestId', { articleEntityId: ID }, DEFAULT_FEATURES);
const json = await client.request(url);
const result = json?.data?.article_result_by_rest_id?.result;
console.log('fresh-signed result keys:', result ? Object.keys(result) : 'NO RESULT', '| title:', JSON.stringify(result?.title ?? null));
