// Capture raw response headers for the article query vs a working TweetDetail query.
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { buildGraphQLUrl, DEFAULT_FEATURES } from '../../engine/src/scrapers/twitter/http/endpoints.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });

// use the raw fetch to see headers
const url = buildGraphQLUrl('eUiP53I_YemhBOI2TMCI3A', 'ArticleEntityResultByRestId', { articleEntityId: '2118426406657163264' }, DEFAULT_FEATURES);
const headers = client._buildHeaders ? client._buildHeaders() : {};
const res = await fetch(url, { headers });
console.log('ARTICLE status:', res.status);
for (const [k, v] of res.headers.entries()) console.log(' ', k, '=', v);
console.log(' body:', (await res.text()).slice(0, 200));
