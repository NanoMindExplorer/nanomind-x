// Guest (unauthenticated) vs authenticated article query — is the empty result
// tied to the session/account?
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { buildGraphQLUrl, DEFAULT_FEATURES } from '../../engine/src/scrapers/twitter/http/endpoints.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ID = '2118426406657163264';
const QID = 'eUiP53I_YemhBOI2TMCI3A';
const OP = 'ArticleEntityResultByRestId';
const url = buildGraphQLUrl(QID, OP, { articleEntityId: ID }, DEFAULT_FEATURES);

const guest = new TwitterHttpClient({ cookies: '' });
try {
  const json = await guest.request(url);
  console.log('GUEST ->', JSON.stringify(json)?.slice(0, 300));
} catch (e) { console.log('GUEST -> ERROR:', e.message?.slice(0, 200)); }

const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const auth = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });
try {
  const json = await auth.request(url);
  console.log('AUTH  ->', JSON.stringify(json)?.slice(0, 300));
} catch (e) { console.log('AUTH  -> ERROR:', e.message?.slice(0, 200)); }
