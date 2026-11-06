// Probe ResultByRestId for several OTHER (older, unrelated) articles.
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { buildGraphQLUrl, DEFAULT_FEATURES } from '../../engine/src/scrapers/twitter/http/endpoints.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });
for (const id of ['2118717915230855168', '2118722189901914112', '2118720741638303746', '2118720708541075456', '2118426406657163264']) {
  const url = buildGraphQLUrl('eUiP53I_YemhBOI2TMCI3A', 'ArticleEntityResultByRestId', { articleEntityId: id }, DEFAULT_FEATURES);
  try {
    const json = await client.request(url);
    const result = json?.data?.article_result_by_rest_id?.result;
    console.log(id, '-> keys:', result ? Object.keys(result) : 'NO RESULT', '| title:', JSON.stringify(result?.title ?? null), '| preview:', JSON.stringify(result?.preview_text ?? null)?.slice(0, 120));
  } catch (e) { console.log(id, '-> ERROR:', e.message?.slice(0, 150)); }
}
