# Patches — change record for the nanomind-x engine

The nine patches in this directory are the local modifications that were made
to the upstream 4.0.1 engine release. They are **already applied in-tree** in
`../engine/` — this directory is the change record, not an install step. The
old `apply.sh` (which re-applied them to a fresh `node_modules` install) was
retired with the fork; there is no `node_modules` engine to patch anymore.

One patch text was rebranded with the fork: `2026-11-05-mcp-session-cookies.patch`
now reads the new session path (`~/.nanomind-x/cookies.json`); the change it
records is identical, only the path string changed.

Pristine pre-patch originals (`*.orig-2026-11-05`) are NOT shipped in this
repository; they live in the maintainer's local backup.

## Patches (alphabetical)

| File | What it does |
|---|---|
| `2026-11-05-browser-proxy-args.patch` | `src/scrapers/twitter/index.js`: Chromium args `--proxy-server=http://127.0.0.1:18080` (localhost CONNECT forwarder adds preemptive Proxy-Authorization) + `--ignore-certificate-errors` (egress proxy MITMs TLS). |
| `2026-11-05-graphql-endpoint-url.patch` | `src/client/api/graphqlQueries.js`: adds the missing `url()` method to the endpoint factory — call sites threw "endpoint.url is not a function". |
| `2026-11-05-mcp-session-cookies.patch` | `src/mcp/local-tools.js`: loads the saved session cookies into the browser (`ensureBrowser`) + compose uses `domcontentloaded` + `waitForSelector` instead of `networkidle2` (never settles on the logged-in compose page). |
| `2026-11-05-puppeteer-stealth-default.patch` | `src/utils/puppeteerStealth.js`: unwraps `.default` when `loaded.use` is not a function (ESM namespace bug). |
| `2026-11-05-simplehttp-sign-get.patch` | `src/client/Scraper.js`: `SimpleHttp.get` attaches `x-client-transaction-id` (best-effort). **Fixes the SearchTimeline/Followers HTTP 404.** |
| `2026-11-05-simplehttp-sign-post.patch` | `src/client/Scraper.js`: same signing for `SimpleHttp.post`. **Cures the CreateTweet error 226** — verified with one signed test post (deleted immediately after). |
| `2026-11-05-likes-variables.patch` | `src/client/api/tweets.js`: `getLikedTweets` variables mirror the live `fetchLikes` call site (drops only `withV2Timeline`, which no longer exists in the live bundle). |
| `2026-11-05-queryid-likes-resolution.patch` | `src/scrapers/twitter/http/queryIds.js`: `toOperationName` returns the name itself when it IS an x.com operation name. **Root cause of the liked-tweets HTTP 422**: the key `Likes` maps to the *Favoriters* operation, so `Likes` resolved to the Favoriters query ID and X answered `GRAPHQL_VALIDATION_FAILED`. Only `Likes` is affected. Also fixes the scrapers-layer `UserLikes` resolution. |
| `2026-11-05-tweet-username-core.patch` | `src/client/models/Tweet.js`: `Tweet.fromGraphQL` reads the author from `core.screen_name` (the user result no longer carries a `legacy` block at all) with the legacy fallback. Search/timeline/likes results used to come back with `username: ""`. |
