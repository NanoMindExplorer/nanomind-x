// Variants: exact Chrome UA, +Sec-Fetch headers, both.
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
    console.log(`--- ${label} --- keys:`, result ? Object.keys(result) : 'NO RESULT', '| preview:', JSON.stringify(result)?.slice(0, 200));
  } catch (e) { console.log(`--- ${label} --- ERROR:`, e.message?.slice(0, 200)); }
}

const CHROME_UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
await run('A: exact Chrome UA', new TwitterHttpClient({ cookies: cookieStr, userAgent: CHROME_UA }));
await run('B: +Sec-Fetch', new TwitterHttpClient({ cookies: cookieStr }), { 'sec-fetch-dest': 'empty', 'sec-fetch-mode': 'cors', 'sec-fetch-site': 'same-origin' });
await run('C: Chrome UA + Sec-Fetch', new TwitterHttpClient({ cookies: cookieStr, userAgent: CHROME_UA }), { 'sec-fetch-dest': 'empty', 'sec-fetch-mode': 'cors', 'sec-fetch-site': 'same-origin' });
