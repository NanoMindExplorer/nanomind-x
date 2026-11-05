# Patches — change record for the nanomind-x engine

The fifteen patches in this directory are the local modifications that were made
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
| `2026-11-06-scraper-follow-pin-bio.patch` | `src/client/Scraper.js`: adds `followByUsername()` (REST `friendships/create`), `pinTweet()` (REST `account/pin_tweet`) and `updateProfileBio()` (REST `account/update_profile`) — the Scraper had none of the three (follow/pin lived only in the unsigned scrapers-layer module and the MCP browser path; bio only in the MCP browser path, which timed out). All three use the same signed SimpleHttp path as tweets. Verified live 2026-11-06: followed @bolt_book (following 2 → 3), pinned the intro tweet, bio set in ~1 s. |
| `2026-11-06-v2-graphql-bookmarks.patch` | `src/client/api/graphqlQueries.js`: adds `CreateBookmark` (`aoDbu3RHznuiSkQ9aNM67Q`) and `DeleteBookmark` (`Wlmlj2-xzyS1GN3a6cj-mQ`) endpoint entries (query IDs from the discovery cache), same shape as `FavoriteTweet`. Part of wrapper v2.0.0. |
| `2026-11-06-v2-tweets-bookmarks.patch` | `src/client/api/tweets.js`: adds `bookmarkTweet()` / `unbookmarkTweet()`, mirroring `likeTweet()` / `unlikeTweet()` exactly but with the CreateBookmark/DeleteBookmark endpoints. Part of wrapper v2.0.0. |
| `2026-11-06-v2-scraper-account-actions.patch` | `src/client/Scraper.js`: adds `bookmarkTweet()` / `unbookmarkTweet()` (mirror like/unlike), `unpinTweet()` (REST mirror of `pinTweet`), and `blockUserByUsername()` / `unblockUserByUsername()` / `muteUserByUsername()` / `unmuteUserByUsername()` via a shared `_userRestAction()` helper (resolve via getProfile, then POST `user_id` + `skip_status` to blocks/create, blocks/destroy, mutes/users/create, mutes/users/destroy). All over the signed SimpleHttp path. Part of wrapper v2.0.0; writes live-tested by the parent, not by this patch (dry-run only during development). |
| `2026-11-06-v2-scraper-unfollow-blocked.patch` | `src/client/Scraper.js`: (a) adds `unfollowByUsername()` (REST `friendships/destroy`, mirror of `followByUsername`) — the built-in `unfollowUser` routes through `usersApi.unfollowUser`, whose GraphQL-style body + `contentType` header key make X answer 404 (verified live 2026-11-06); the REST destroy call works. (b) adds `getBlockedUsers()` (BlockedAccountsAll, see the users patch). Part of wrapper v2.0.0; live-tested by the parent. |
| `2026-11-06-v2-users-blocked.patch` | `src/client/api/users.js`: adds `getBlockedUsers()` — BlockedAccountsAll timeline query with a recursive parser collecting user objects from both `core` (new-style) and `legacy` (old-style) blocks. Part of wrapper v2.0.0; live-tested by the parent (returned `@binanceminters` + `@fckfaster`). |
| `2026-11-06-v2-graphql-blocked.patch` | `src/client/api/graphqlQueries.js`: adds the `BlockedAccountsAll` endpoint (`XDSJN_rGtdlynilYFJLYOw`). The discovery cache held a stale ID for this operation (`vSD6QsvM22S5…`, 404s); the live ID comes from the engine's generated endpoint table and the cache entry was corrected to match. Part of wrapper v2.0.0. |
