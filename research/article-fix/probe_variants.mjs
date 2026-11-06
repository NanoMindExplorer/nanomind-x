// Variants: no transaction-id, +Referer, no-txid+Referer.
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
const allTrue = { profile_label_improvements_pcf_label_in_post_enabled: true, responsive_web_profile_redirect_enabled: true, rweb_tipjar_consumption_enabled: true, verified_phone_label_enabled: true, responsive_web_graphql_timeline_navigation_enabled: true };

async function run(label, client, extraHeaders = {}) {
  const url = buildGraphQLUrl(QID, OP, { articleEntityId: ID }, allTrue);
  try {
    const json = await client.request(url, { headers: extraHeaders });
    const result = json?.data?.article_result_by_rest_id?.result;
    console.log(`--- ${label} --- keys:`, result ? Object.keys(result) : 'NO RESULT', '| preview:', JSON.stringify(result)?.slice(0, 300));
  } catch (e) { console.log(`--- ${label} --- ERROR:`, e.message?.slice(0, 200)); }
}

await run('A: no txid', new TwitterHttpClient({ cookies: cookieStr, transactionId: false }));
await run('B: +Referer', new TwitterHttpClient({ cookies: cookieStr }), { Referer: 'https://x.com/i/article/2118426406657163264' });
await run('C: no txid + Referer', new TwitterHttpClient({ cookies: cookieStr, transactionId: false }), { Referer: 'https://x.com/i/article/2118426406657163264' });
await run('D: +Referer home', new TwitterHttpClient({ cookies: cookieStr }), { Referer: 'https://x.com/home' });
