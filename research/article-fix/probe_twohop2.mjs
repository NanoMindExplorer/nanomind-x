// Validate the full two-hop on a SECOND, unrelated article (reggularMike).
import { TwitterHttpClient } from '../../engine/src/scrapers/twitter/http/client.js';
import { buildGraphQLUrl, DEFAULT_FEATURES } from '../../engine/src/scrapers/twitter/http/endpoints.js';
import { getQueryId } from '../../engine/src/scrapers/twitter/http/queryIds.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const cookies = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.nanomind-x', 'cookies.json'), 'utf8'));
const client = new TwitterHttpClient({ cookies: cookies.map(c => `${c.name}=${c.value}`).join('; ') });
const toggles = { withArticlePlainText: true, withArticleRichContentState: true, withArticleSummaryText: true };

async function twoHop(articleId) {
  const r1 = await client.request(buildGraphQLUrl('zrSRXJmE1vj37AUmkh2oGg', 'ArticleRedirectScreenQuery', { articleEntityId: articleId }, DEFAULT_FEATURES));
  const meta = r1?.data?.article_result_by_rest_id?.result?.metadata;
  const tweetId = meta?.tweet_results?.rest_id;
  const author = meta?.author_results?.result?.core?.screen_name;
  if (!tweetId) return { articleId, ok: false, reason: 'no tweet_results.rest_id' };
  const qid = await getQueryId('TweetResultByRestId');
  const r2 = await client.request(buildGraphQLUrl(qid, 'TweetResultByRestId', { tweetId, withCommunity: false, includePromotedContent: false, withVoice: false }, DEFAULT_FEATURES, toggles));
  const art = r2?.data?.tweetResult?.result?.article?.article_results?.result;
  return { articleId, ok: Boolean(art?.plain_text), tweetId, author, title: art?.title, plainLen: art?.plain_text?.length ?? 0, blocks: art?.content_state?.blocks?.length ?? 0, excerpt: art?.plain_text?.slice(0, 200) };
}

for (const id of ['2118717915230855168', '2118722189901914112']) {
  console.log(JSON.stringify(await twoHop(id), null, 2));
}
