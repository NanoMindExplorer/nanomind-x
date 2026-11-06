// Capture the exact outgoing request (URL + header names) for the article query,
// and try all-true features. Also verify whether x-client-transaction-id is attached.
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { buildGraphQLUrl } from '../../engine/src/scrapers/twitter/http/endpoints.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ID = '2118426406657163264';
const QID = 'eUiP53I_YemhBOI2TMCI3A';
const OP = 'ArticleEntityResultByRestId';
const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const cookieStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');

const realFetch = globalThis.fetch;
let lastReq = null;
const capturingFetch = async (url, init) => {
  lastReq = { url: String(url), method: init?.method, headers: Object.keys(init?.headers || {}), hasTxId: Boolean(init?.headers?.['x-client-transaction-id']), txId: (init?.headers?.['x-client-transaction-id'] || '').slice(0, 20) };
  return realFetch(url, init);
};
const client = new TwitterHttpClient({ cookies: cookieStr, fetch: capturingFetch, debug: true });

// 1) all-true features
const allTrue = { profile_label_improvements_pcf_label_in_post_enabled: true, responsive_web_profile_redirect_enabled: true, rweb_tipjar_consumption_enabled: true, verified_phone_label_enabled: true, responsive_web_graphql_timeline_navigation_enabled: true };
const url = buildGraphQLUrl(QID, OP, { articleEntityId: ID }, allTrue);
console.log('features param:', new URL(url).searchParams.get('features'));
const json = await client.request(url);
console.log('result keys:', Object.keys(json?.data?.article_result_by_rest_id?.result ?? {}));
console.log('captured request:', JSON.stringify(lastReq, null, 2));
console.log('URL path:', new URL(url).pathname);
console.log('variables param:', new URL(url).searchParams.get('variables'));
