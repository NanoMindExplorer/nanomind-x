// Copyright (c) 2024-2026 nich (@nichxbt). Licensed under the Apache License, Version 2.0.
/**
 * Twitter HTTP Article Scraper
 *
 * Reads X Articles (long-form posts at https://x.com/i/article/<id>) via
 * Twitter's internal GraphQL API — no browser required, read-only.
 *
 * Why two hops instead of the obvious one:
 * `ArticleEntityResultByRestId` (the direct article fetch the web client's
 * editor uses) returns an empty `result: {}` for every request variant tried
 * — all 32 feature-switch combinations, fieldToggles, GET and POST, txid
 * on/off/fresh, Referer, UA, Sec-Fetch, string and numeric ids, five
 * different articles — while the same session reads tweets fine. The
 * direct route is unusable from this client; the cause is server-side (the
 * persisted query's selection set is not visible from outside) and cannot be
 * worked around by reshaping the request. The working path is the one the
 * web client's article reader and the twitter-mcp tool both use:
 *
 *   1. `ArticleRedirectScreenQuery` (Relay persisted query, pinned ID) with
 *      `{ articleEntityId }` resolves the article to its linked tweet
 *      (`metadata.tweet_results.rest_id`) and author screen name.
 *   2. `TweetResultByRestId` for that tweet, with the article fieldToggles
 *      (`withArticlePlainText`, `withArticleRichContentState`,
 *      `withArticleSummaryText` all true), returns the tweet whose `article`
 *      field carries the FULL article — `plain_text`, `content_state`
 *      (Draft.js blocks), `media_entities`, `cover_media`, `metadata`.
 *      Without those toggles the same call returns the preview only
 *      (title + preview_text + cover, 4,451 bytes vs ~22,600 for Tampesta).
 *
 * Verified live 2026-11-06 on the Tampesta article (2118426406657163264)
 * and two unrelated articles. Full evidence in research/article-fix/NOTES.md.
 *
 * @author nich (@nichxbt)
 * @license Apache-2.0
 */

import { GRAPHQL, ARTICLE_FIELD_TOGGLES } from './endpoints.js';
import { NotFoundError } from './errors.js';

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

/**
 * Parse a raw article entity (the `article_results.result` object from a
 * tweet's `article` field) into the shape the CLI returns.
 *
 * @param {object} entity - Raw article entity from the GraphQL response.
 * @param {object} [author] - `{ username, name }`; the tweet hop's
 *   `core.user_results` is the source when available, otherwise the
 *   redirect hop's screen name.
 * @param {string|null} [tweetId] - Rest id of the tweet carrying the article.
 * @returns {{
 *   kind: 'article',
 *   id: string,
 *   title: string|null,
 *   author: { username: string|null, name: string|null },
 *   publishedAt: string|null,
 *   modifiedAt: string|null,
 *   tweetId: string|null,
 *   previewText: string|null,
 *   text: string,
 *   blocks: Array<{ type: string, text: string }>,
 *   urls: string[],
 *   coverImage: string|null,
 * }}
 */
export function parseArticle(entity, author = {}, tweetId = null) {
  const contentState = entity?.content_state ?? {};
  const blocks = Array.isArray(contentState.blocks)
    ? contentState.blocks.map((b) => ({ type: b?.type ?? 'unstyled', text: b?.text ?? '' }))
    : [];
  const text = typeof entity?.plain_text === 'string' ? entity.plain_text : blocks.map((b) => b.text).join('\n\n');

  // URLs, deduplicated in first-seen order, from three places: LINK entities
  // in the content_state entityMap, the media entities' image URLs, and any
  // URL written literally in the plain text.
  const urls = [];
  const pushUrl = (u) => {
    if (typeof u === 'string' && u.startsWith('http') && !urls.includes(u)) urls.push(u);
  };
  const entityMap = Array.isArray(contentState.entityMap) ? contentState.entityMap : [];
  for (const entry of entityMap) {
    const value = entry?.value;
    if (value?.type === 'LINK' && typeof value.data?.url === 'string') pushUrl(value.data.url);
  }
  const mediaEntities = Array.isArray(entity?.media_entities) ? entity.media_entities : [];
  for (const m of mediaEntities) {
    pushUrl(m?.media_info?.original_img_url);
  }
  for (const u of text.match(/https?:\/\/[^\s)>\]]+/g) ?? []) pushUrl(u.replace(/[.,;]+$/, ''));

  const firstPublishedSecs = entity?.metadata?.first_published_at_secs;
  const modifiedSecs = entity?.lifecycle_state?.modified_at_secs;
  const toIso = (secs) =>
    typeof secs === 'number' && Number.isFinite(secs) ? new Date(secs * 1000).toISOString() : null;

  return {
    kind: 'article',
    id: String(entity?.rest_id ?? ''),
    title: entity?.title ?? null,
    author: {
      username: author?.username ?? null,
      name: author?.name ?? null,
    },
    publishedAt: toIso(firstPublishedSecs),
    modifiedAt: toIso(modifiedSecs),
    tweetId: tweetId ? String(tweetId) : null,
    previewText: entity?.preview_text ?? null,
    text,
    blocks,
    urls,
    coverImage: entity?.cover_media?.media_info?.original_img_url ?? entity?.cover_media?.original_img_url ?? null,
  };
}

// ---------------------------------------------------------------------------
// Scraping
// ---------------------------------------------------------------------------

/**
 * Fetch a full X Article by its rest id.
 *
 * Two-hop read (see the module header for why the direct
 * `ArticleEntityResultByRestId` query is not used): redirect query to resolve
 * the article to its linked tweet, then the tweet query with the article
 * fieldToggles to get the full body.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} articleId - Numeric article rest id (e.g. 2118426406657163264).
 * @returns {Promise<ReturnType<typeof parseArticle>>} Parsed article.
 * @throws {NotFoundError} If the article has no linked tweet or no body.
 */
export async function scrapeArticleById(client, articleId) {
  const { queryId: redirectId, operationName: redirectOp } = GRAPHQL.ArticleRedirectScreenQuery;

  const redirect = await client.graphql(redirectId, redirectOp, { articleEntityId: String(articleId) });
  const metadata = redirect?.data?.article_result_by_rest_id?.result?.metadata;
  const tweetId = metadata?.tweet_results?.rest_id;
  const redirectAuthor = metadata?.author_results?.result?.core?.screen_name ?? null;
  if (!tweetId) {
    throw new NotFoundError(
      `Article ${articleId} not found (no linked tweet; it may be deleted, private, or not visible to this session)`,
    );
  }

  const { queryId: tweetIdQuery, operationName: tweetOp } = GRAPHQL.TweetResultByRestId;
  const tweetResp = await client.graphql(
    tweetIdQuery,
    tweetOp,
    { tweetId, withCommunity: false, includePromotedContent: false, withVoice: false },
    { fieldToggles: ARTICLE_FIELD_TOGGLES },
  );
  const tweet = tweetResp?.data?.tweetResult?.result;
  const entity = tweet?.article?.article_results?.result;
  if (!entity || typeof entity.plain_text !== 'string') {
    throw new NotFoundError(`Article ${articleId} has no readable body (tweet ${tweetId} carries no article text)`);
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
