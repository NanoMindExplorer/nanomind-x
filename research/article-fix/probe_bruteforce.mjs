// Brute-force all 32 combinations of the 5 Article feature switches.
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { buildGraphQLUrl } from '../../engine/src/scrapers/twitter/http/endpoints.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ID = '2118426406657163264';
const QID = 'eUiP53I_YemhBOI2TMCI3A';
const OP = 'ArticleEntityResultByRestId';
const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });
const names = ['profile_label_improvements_pcf_label_in_post_enabled', 'responsive_web_profile_redirect_enabled', 'rweb_tipjar_consumption_enabled', 'verified_phone_label_enabled', 'responsive_web_graphql_timeline_navigation_enabled'];
for (let mask = 0; mask < 32; mask++) {
  const features = {};
  for (let i = 0; i < 5; i++) features[names[i]] = Boolean(mask & (1 << i));
  const url = buildGraphQLUrl(QID, OP, { articleEntityId: ID }, features);
  try {
    const json = await client.request(url);
    const result = json?.data?.article_result_by_rest_id?.result;
    const keys = result ? Object.keys(result).length : -1;
    console.log(`mask ${String(mask).padStart(2)} [${Object.values(features).map(v => v ? 1 : 0).join('')}] -> result keys: ${keys}${keys > 0 ? '  *** NON-EMPTY *** title=' + JSON.stringify(result.title) : ''}`);
    if (keys > 0) break;
  } catch (e) { console.log(`mask ${mask} -> ERROR:`, e.message?.slice(0, 100)); }
}
