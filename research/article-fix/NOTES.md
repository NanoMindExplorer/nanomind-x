# X Articles in nanomind-x — fix notes (v2.2.0, 2026-11-06)

## The problem

`tweet --id` said "not found" and `thread --id` returned 0 entries for X
Article ids (e.g. the Tampesta article `2118426406657163264` by
@OmbrelloNFT). The article page HTML does not embed the article text
(0 occurrences of "Tampesta" in the 315 KB logged-in HTML), so HTML
scraping is dead.

## What the endpoint is

X serves article content over GraphQL. The web client's article code lives
in `bundle.TwitterArticles.*.js` (chunk hash `8b06a0368bd03f24` on
2026-11-06). It declares two article queries:

- `ArticleEntityResultByRestId` (queryId `eUiP53I_YemhBOI2TMCI3A`) — the
  direct fetch, variables `{ articleEntityId }`, read as
  `data.article_result_by_rest_id.result`. Used by the article editor.
- `ArticleEntitiesSlice` (queryId `8hpdcfFniawLzEQ7CD2WMQ`) — a user's
  article list (profile Articles tab). **Not** the content fetcher.

The article reader page (`/i/article/:id`) is a redirect screen backed by
`bundle.Articles.*.js`: a Relay persisted query
`ArticleRedirectScreenQuery` (params.id `zrSRXJmE1vj37AUmkh2oGg`) whose
`article_result_by_rest_id` selection is only
`metadata.tweet_results.rest_id` + `metadata.author_results.result.core.screen_name`
— it resolves an article to its linked tweet.

## Why the direct query returns an empty result

`ArticleEntityResultByRestId` returns HTTP 200 with
`{"data":{"article_result_by_rest_id":{"result":{}}}}` for **every**
request variant tried, while the same session reads tweets fine:

- all 32 combinations of the operation's 5 feature switches
- fieldToggles: none / the descriptor's 3 / the article toggles, true and false
- GET and POST, txid on / off / freshly re-discovered signing keys
- Referer (article page / home), exact Chrome UA, Sec-Fetch headers
- string and numeric ids, five different articles (Tampesta + four others)

The guest (unauthenticated) call 403s, so auth works; the server genuinely
resolves the field to an empty object for this client. The persisted
query's server-side selection set is not visible from outside, so the
precise server-side cause cannot be determined from the client side — but
the route is demonstrably unusable and no request reshaping fixes it.
(The `s: "4c07"` literal argument seen in the Relay query is baked into
the persisted query text, not something the caller sends; passing it as a
variable changes nothing.)

## How it was fixed — the two-hop reader

The working path is the one the web client's article reader and the
twitter-mcp tool both use:

1. `ArticleRedirectScreenQuery` (`zrSRXJmE1vj37AUmkh2oGg`) with
   `{ articleEntityId }` → `metadata.tweet_results.rest_id` (the linked
   tweet) + author screen name. Works with or without features.
2. `TweetResultByRestId` for that tweet with variables
   `{ tweetId, withCommunity: false, includePromotedContent: false,
   withVoice: false }` **and** fieldToggles
   `{ withArticlePlainText: true, withArticleRichContentState: true,
   withArticleSummaryText: true }` → the tweet's
   `article.article_results.result` carries the FULL article:
   `plain_text`, `content_state` (Draft.js blocks), `media_entities`,
   `cover_media`, `metadata`, `title`, `preview_text`, `rest_id`.
   Without those toggles the same call returns the preview only
   (4,451 bytes vs ~22,600 for Tampesta).

## Implementation (v2.2.0)

- `engine/src/scrapers/twitter/http/articles.js` (new, canonical):
  `scrapeArticleById(client, articleId)` + `parseArticle(entity, author,
  tweetId)` → `{ kind: 'article', id, title, author: { username, name },
  publishedAt, modifiedAt, tweetId, previewText, text, blocks: [{type,
  text}], urls, coverImage }`. Author display name comes from the tweet
  hop's `core.user_results.result.core.name` (there is no `legacy` object
  on the user result in this query).
- `engine/src/scrapers/twitter/http/client.js`: `graphql()` /
  `_graphqlOnce()` accept `options.fieldToggles` (GET URL param, POST body).
- `engine/src/scrapers/twitter/http/endpoints.js`: article operations in
  `TRACKED_OPERATIONS`; `QUERY_ID_PINS` for the Relay redirect query
  (undiscoverable — no `queryId:` descriptor) and for the two article
  operations whose generated-table IDs are stale (Aug 2026 upstream
  snapshot; remove those pins after the next `npm run sync:endpoints`);
  `ARTICLE_FIELD_TOGGLES` constant.
- `engine/src/scrapers/twitter/http/queryIds.js`: `bundle.TwitterArticles`
  added to `CORE_CHUNK_PATTERNS` so refresh discovers the article
  operations (verified: refresh found 129 ops, incl.
  `ArticleEntityResultByRestId` → `eUiP53I_YemhBOI2TMCI3A` and
  `ArticleEntitiesSlice` → `8hpdcfFniawLzEQ7CD2WMQ`).
- `engine/src/client/api/articles.js` (new): `getArticle(http, articleId)`
  — same two-hop on the SimpleHttp path the wrapper uses; shares
  `parseArticle`.
- `engine/src/client/api/graphqlQueries.js`: `buildGraphQLUrl()` takes
  `fieldToggles`; `TweetResultByRestId` and `ArticleRedirectScreenQuery`
  endpoints added.
- `engine/src/client/Scraper.js`: `getArticle(id)`; `validation.js`:
  `validateArticleId()`.
- `nanomind-x.mjs`: new `article --id <id>` command (read-only, not
  search-capped, `{ok, data}` shape). `tweet --id` and `thread --id` on an
  article id route to the article reader (thread also handles the empty-
  conversation case, since TweetDetail returns 0 entries for article ids
  instead of throwing) and return a `meta.note` naming the `article`
  command; a genuinely missing id fails with an error naming the `article`
  command, never a bare "not found".

## Test results (2026-11-06, live)

- `article --id 2118426406657163264` (Tampesta): title "Tampesta: the
  storm only AI agents can mint", author @OmbrelloNFT ("Ombrello ☂️"),
  published 2026-11-06T12:30:17Z, text 5,000–5,023 chars (server's
  plain_text varies slightly between calls), 31 blocks, 9 urls, cover
  image `https://pbs.twimg.com/media/HWYpogjaYAAgHNp.jpg`. Text contains
  "Tampesta" and the mint details (0.0042 BNB paid, free storm puzzle,
  GTD, Agent ID required).
- `article --id 2118717915230855168` (reggularMike, "Sports Betting vs.
  Wall Street"): 11,346 chars, 168 blocks. Third article (pirwot,
  "$100 for a Stranger's Record"): 13,377 chars, 42 blocks — both via the
  two-hop probe before the CLI existed.
- `tweet --id <article-id>` and `thread --id <article-id>` route to the
  article reader with a `meta.note` naming `article --id`.
- Regression: `tweet --id 2118682381536440451` (normal tweet), `thread
  --id` on the same tweet (5 entries), `search "freemint bsc"` (3
  results), `profile OmbrelloNFT` (997 followers) — all still work.
- `tweet --id 1111111111111111111` (nonexistent) → clear error naming
  the `article` command.

## Remaining limitations

- The reader needs the article's linked tweet: an article with no linked
  tweet (e.g. unpublished/draft, or a tweet deleted after publishing)
  cannot be read this way — it fails with a clear "no linked tweet" error.
- `plain_text` length can vary slightly between calls (5,000 vs 5,023
  chars observed for Tampesta); the tool returns the server's current
  plain_text verbatim, no truncation on our side.
- The direct `ArticleEntityResultByRestId` route stays unused; if x.com
  ever fixes it, the tracked operation + pinned ID are already in the
  registry.
- Publishing articles is not supported (read-only, like everything else
  in this tool that is not an explicit write command).
- `engine/scripts/sync-x-endpoints.mjs` does not exist in this fork, so
  `npm run sync:endpoints:check` cannot run; `MISSING_OPERATIONS` was
  verified empty directly (`[]`).
