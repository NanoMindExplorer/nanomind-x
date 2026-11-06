// Test the ArticleRedirectScreenQuery (Relay persisted query, id zrSRXJmE1vj37AUmkh2oGg)
// to resolve an article rest_id -> tweet rest_id + author screen_name.
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { buildGraphQLUrl, DEFAULT_FEATURES } from '../../engine/src/scrapers/twitter/http/endpoints.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ID = '2118426406657163264';
const QID = 'zrSRXJmE1vj37AUmkh2oGg';
const OP = 'ArticleRedirectScreenQuery';
const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });

async function run(label, url) {
  try {
    const json = await client.request(url);
    console.log(`--- ${label} ---`, JSON.stringify(json)?.slice(0, 600));
  } catch (e) { console.log(`--- ${label} --- ERROR:`, e.message?.slice(0, 200)); }
}

await run('A: GET + DEFAULT_FEATURES', buildGraphQLUrl(QID, OP, { articleEntityId: ID }, DEFAULT_FEATURES));
await run('B: GET + no features', buildGraphQLUrl(QID, OP, { articleEntityId: ID }, {}));
