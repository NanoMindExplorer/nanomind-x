// Test: does article_result_by_rest_id need the `s` argument (seen as a literal
// "4c07" in the ArticleRedirectScreenQuery Relay fragment) as a variable?
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

async function run(label, variables, features = DEFAULT_FEATURES) {
  const url = buildGraphQLUrl(QID, OP, variables, features);
  try {
    const json = await client.request(url);
    const result = json?.data?.article_result_by_rest_id?.result;
    console.log(`--- ${label} --- keys:`, result ? Object.keys(result) : 'NO RESULT', '| title:', JSON.stringify(result?.title ?? null), '| preview:', JSON.stringify(result)?.slice(0, 300));
  } catch (e) { console.log(`--- ${label} --- ERROR:`, e.message?.slice(0, 200)); }
}

await run('A: {articleEntityId, s:"4c07"}', { articleEntityId: ID, s: '4c07' });
await run('B: {rest_id: ID, s:"4c07"}', { rest_id: ID, s: '4c07' });
await run('C: {articleEntityId, s:"4c07"} POST', { articleEntityId: ID, s: '4c07' });
