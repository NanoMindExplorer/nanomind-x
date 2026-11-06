// Copyright (c) 2024-2026 nich (@nichxbt). Licensed under the Apache License, Version 2.0.
/**
 * nanomind-x Client — Articles API
 *
 * Reads X Articles (long-form posts at https://x.com/i/article/<id>).
 * Read-only; no post/reply/follow or any other write.
 *
 * Same two-hop read as src/scrapers/twitter/http/articles.js (the canonical
 * implementation; the parse step is shared). The direct
 * `ArticleEntityResultByRestId` query returns an empty `result: {}` from this
 * client, so the reader resolves the article to its linked tweet first and
 * then reads the full body off the tweet's `article` field:
 *
 *   1. `ArticleRedirectScreenQuery` with `{ articleEntityId }` ->
 *      `metadata.tweet_results.rest_id` (+ author screen name).
 *   2. `TweetResultByRestId` for that tweet with the article fieldToggles
 *      (`withArticlePlainText`, `withArticleRichContentState`,
 *      `withArticleSummaryText`) -> the tweet's `article.article_results`
 *      carries the full article (`plain_text`, `content_state`, ...).
 *
 * Verified live 2026-11-06. Full evidence in research/article-fix/NOTES.md.
 *
 * @author nich (@nichxbt) - https://github.com/nirholas
 * @license Apache-2.0
 */

import { GRAPHQL_ENDPOINTS, buildGraphQLUrl } from './graphqlQueries.js';
import { ARTICLE_FIELD_TOGGLES } from '../../scrapers/twitter/http/endpoints.js';
import { parseArticle } from '../../scrapers/twitter/http/articles.js';
import { NotFoundError } from '../errors.js';

/**
 * Get a full X Article by its rest id.
 *
 * @param {Object} http - HTTP client with a get(url) method (SimpleHttp).
 * @param {string} articleId - Numeric article rest id.
 * @returns {Promise<ReturnType<typeof parseArticle>>} Parsed article.
 * @throws {NotFoundError} If the article has no linked tweet or no body.
 */
export async function getArticle(http, articleId) {
  const id = String(articleId);

  // Hop 1: resolve the article to its linked tweet.
  const redirectUrl = buildGraphQLUrl(GRAPHQL_ENDPOINTS.ArticleRedirectScreenQuery, { articleEntityId: id });
  const redirect = await http.get(redirectUrl);
  const metadata = redirect?.data?.article_result_by_rest_id?.result?.metadata;
  const tweetId = metadata?.tweet_results?.rest_id;
  const redirectAuthor = metadata?.author_results?.result?.core?.screen_name ?? null;
  if (!tweetId) {
    throw new NotFoundError(
      `Article ${id} not found (no linked tweet; it may be deleted, private, or not visible to this session)`,
    );
  }

  // Hop 2: read the full body off the tweet's `article` field. The article
  // fieldToggles are what make the server include plain_text + content_state
  // instead of the preview-only card.
  const tweetUrl = buildGraphQLUrl(
    GRAPHQL_ENDPOINTS.TweetResultByRestId,
    { tweetId, withCommunity: false, includePromotedContent: false, withVoice: false },
    undefined,
    ARTICLE_FIELD_TOGGLES,
  );
  const tweetResp = await http.get(tweetUrl);
  const tweet = tweetResp?.data?.tweetResult?.result;
  const entity = tweet?.article?.article_results?.result;
  if (!entity || typeof entity.plain_text !== 'string') {
    throw new NotFoundError(`Article ${id} has no readable body (tweet ${tweetId} carries no article text)`);
  }

  const userResult = tweet?.core?.user_results?.result;
  const author = {
    username: userResult?.core?.screen_name ?? redirectAuthor,
    // Display name lives on core.name in this query's user shape (there is
    // no legacy object on the user result); legacy.name kept as a fallback.
    name: userResult?.core?.name ?? userResult?.legacy?.name ?? null,
  };
  return parseArticle(entity, author, tweetId);
}
