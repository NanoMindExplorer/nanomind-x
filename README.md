# nanomind-x

Agent-fit X tool: signed GraphQL search, profile and timeline reads, and
posting with a dry-run default and an idempotency guard. One JSON object per
call, structured errors, exit codes an agent can branch on.

Version 2.2.0 — 37 commands covering search, reads, posting, engagement and
account management, all through signed GraphQL/REST paths (no login form,
no browser needed for reads or posts). See [Features](#features) for the
full list.

The engine (`engine/`) is an in-tree fork of the upstream 4.0.1 release with
transaction-ID signing on every GraphQL call (this is what fixed the search
404 and the CreateTweet 226), a fixed liked-tweets resolution and core-first
author parsing. Full upstream attribution is in `NOTICE`.

## Features

**Search and read**

- `search <query>` — signed GraphQL search, `--mode latest|top|people`,
  capped at one call per 60 seconds (`--burst` overrides and logs it)
- `profile <screen_name>`, `timeline <screen_name>` — profile and tweets
- `tweet --id <tweet_id>` — one tweet
- `article --id <article_id>` — a full X Article: title, author, published
  time, full plain text, content blocks, links and cover image (v2.2.0).
  Articles live in a different ID namespace than tweets, so `tweet --id`
  and `thread --id` on an article id route here automatically instead of
  reporting "not found". The reader is a two-hop GraphQL read (redirect
  query resolves the article to its linked tweet, then the tweet query with
  the article fieldToggles returns the body) — the direct
  `ArticleEntityResultByRestId` query returns an empty result from this
  client; see `research/article-fix/NOTES.md`. Read-only; publishing
  articles is not supported.
- `thread --id <tweet_id>` — the full conversation: focal tweet plus its
  replies in order (v2.1.0)
- `liked`, `followers`, `following`, `replies` — liked tweets, followers,
  following, tweets + replies
- `trends` — trending topics
- `notifications [--type all|mentions|verified]` — mentions, replies, likes
  and follows on your account, newest first (v2.1.0)
- `blocked` — accounts you blocked; `me` — the signed-in account
- `dms`, `dm-read --id <conversation_id>` — DM conversations and messages

**Post and engage**

- `post --text "..."`, `reply --id <id> --text "..."`,
  `quote --id <id> --text "..."` — post, reply, quote
- `thread --text "part one || part two"` — multi-part threads, max 25
  parts, each replying to the previous one
- `--media <image>` on `post`, `reply` and `quote` — attach a photo
  (jpg/png/gif/webp, 5 MB images / 15 MB GIFs) via chunked upload (v2.1.0)
- `like` / `unlike`, `repost` / `unrepost`, `bookmark` / `unbookmark`
- `delete --id <tweet_id>` — delete your own tweet

**Account management**

- `follow` / `unfollow`, `pin` / `unpin` — via signed REST paths
- `block` / `unblock`, `mute` / `unmute` — see Known limitations below
- `bio --text "..."` — update the profile bio (max 160 chars)
- `dm --user <screen_name> --text "..."` — send a DM

**Safety, built in**

- Writes are dry-run by default: nothing is sent without `--confirm`
- An append-only idempotency ledger refuses a duplicate write for the same
  operation and text within 24 hours (toggle pairs are stateful: pin →
  unpin → pin is allowed, a repeated pin is not)
- One JSON object per call on stdout; exit codes 0 ok, 2 usage,
  3 rate-limited, 4 auth, 5 upstream
- Reads never use the browser; writes fall back to it only with
  `--allow-browser-fallback`

## Known limitations

- `unblock` returns HTTP 404 (error 34) on every route tried, even while the
  account is verifiably blocked — X no longer serves `blocks/destroy.json`
  to this session. Treat a block as effectively permanent from this tool;
  check the current list with `nanomind-x blocked`.
- No scheduled posts, polls, lists, Spaces or Grok — and no
  automation of any kind (auto-follow, auto-like, bulk actions). Deliberate:
  automation is what gets accounts flagged. X Articles can be READ
  (`article --id`, v2.2.0) but not published from this tool.

## Install

Requires Node 20 or newer and npm. The fastest way is npx — no clone
needed:

```sh
npx nanomind-x health
```

This installs the latest published release from npm
(https://www.npmjs.com/package/nanomind-x) and runs it. Every command below
works the same way, prefixed with `npx`:

```sh
npx nanomind-x search "freemint bsc" --mode latest --limit 5
npx nanomind-x-engine login --cookies-file cookies.json
```

Notes for npx installs: the install ships the tool only, not a session —
you still need to log in with your own X cookies (see Session setup). On a
slow network the first install can stall while puppeteer downloads
Chromium; if it does, retry with
`PUPPETEER_SKIP_DOWNLOAD=1 npx nanomind-x` (the GraphQL path does not need
the browser).

Or install from source:

```sh
git clone https://github.com/NanoMindExplorer/nanomind-x.git
cd nanomind-x
./install.sh
```

`install.sh` installs dependencies, makes the wrapper executable, places a
`nanomind-x` launcher in `~/.local/bin` (add it to `PATH` if it is not there
already) and runs a smoke test. Usage afterwards:

```sh
nanomind-x health
nanomind-x search "freemint bsc" --mode latest --limit 5
```

## Session setup

nanomind-x logs in with cookies exported from your own logged-in browser.
It never fills a login form.

1. In your browser, export the `x.com` cookies with a cookie-export
   extension (JSON format) to a file, for example `cookies.json`.
2. Import them:

```sh
nanomind-x-engine login --cookies-file cookies.json
```

3. Delete the export file right after the import. The live session is kept
   in `~/.nanomind-x/` with mode 600.
4. Verify with `nanomind-x health` — it reports session, query-ID cache age,
   signing-key cache age, proxy state and one cheap probe read.

Never paste cookie values in chat, in a file you share, or in a ticket.
Cookies equal full session access. Anyone with them can post as you.

## Commands

All output on stdout is a single JSON object. Human chatter goes to stderr.
Exit codes: 0 ok, 2 usage, 3 rate-limited, 4 auth, 5 upstream.
Full usage per command is in `skill/nanomind-x/SKILL.md`.

```sh
# Search and read
nanomind-x search <query> [--mode latest|top|people] [--limit N] [--burst]
nanomind-x profile <screen_name>
nanomind-x timeline <screen_name> [--limit N]
nanomind-x tweet --id <tweet_id>
nanomind-x thread --id <tweet_id>
nanomind-x liked <screen_name> [--limit N]
nanomind-x followers <screen_name> [--limit N]
nanomind-x following <screen_name> [--limit N]
nanomind-x replies <screen_name> [--limit N]
nanomind-x trends
nanomind-x notifications [--type all|mentions|verified] [--limit N]
nanomind-x blocked [--limit N]
nanomind-x me
nanomind-x dms [--limit N]
nanomind-x dm-read --id <conversation_id> [--limit N]

# Post and engage (dry-run by default; add --confirm to send)
nanomind-x post --text "..." [--media <image>] [--confirm]
nanomind-x reply --id <tweet_id> --text "..." [--media <image>] [--confirm]
nanomind-x quote --id <tweet_id> --text "..." [--media <image>] [--confirm]
nanomind-x thread --text "part one || part two" [--confirm]
nanomind-x like --id <tweet_id> [--confirm]
nanomind-x unlike --id <tweet_id> [--confirm]
nanomind-x repost --id <tweet_id> [--confirm]
nanomind-x unrepost --id <tweet_id> [--confirm]
nanomind-x bookmark --id <tweet_id> [--confirm]
nanomind-x unbookmark --id <tweet_id> [--confirm]
nanomind-x delete --id <tweet_id> [--confirm]

# Account management (dry-run by default; add --confirm to apply)
nanomind-x follow <screen_name> [--confirm]
nanomind-x unfollow <screen_name> [--confirm]
nanomind-x pin --id <tweet_id> [--confirm]
nanomind-x unpin --id <tweet_id> [--confirm]
nanomind-x block <screen_name> [--confirm]
nanomind-x unblock <screen_name> [--confirm]
nanomind-x mute <screen_name> [--confirm]
nanomind-x unmute <screen_name> [--confirm]
nanomind-x bio --text "..." [--confirm]
nanomind-x dm --user <screen_name> --text "..." [--confirm]

# Session check
nanomind-x health
```

`search` is capped at one call per 60 seconds (`--burst` overrides and logs
the override). Reads never use the browser.

## Safety rules

Writes are dry-run by default. `nanomind-x post --text "..."` prints the
exact request and the idempotency check and sends nothing. A real write
needs `--confirm`, and a public post still needs a human preview and explicit
approval first.

An append-only ledger (`~/.nanomind-x/nanomind-x-ledger.json`) refuses a
duplicate write for the same operation and text within 24 hours unless
`--force` is passed — and `--force` itself needs explicit human approval.

On a 429 the tool exits 3 with `retry_after`. Back off until then instead
of retrying in a loop.

If a GraphQL mutation is rejected (226, 403 or repeated 404), the tool falls
back to the browser path only when `--allow-browser-fallback` is passed, and
it logs which path was used. The browser path needs a logged-in Chromium and
the localhost proxy forwarder (see Troubleshooting).

## Troubleshooting

- `AUTH` / session invalid: re-import cookies with
  `nanomind-x-engine login --cookies-file <file>`. A login from a different
  IP or device can invalidate the session.
- Search 404 or empty results: the GraphQL query-ID cache may be stale.
  Refresh it with `node scripts/refresh-query-ids.mjs` (authenticated
  refresh from the live bundle) and retry.
- `CreateTweet` error 226: the request was not signed. Check that
  `engine/src/client/Scraper.js` carries the signing patch, then retry.
- Liked-tweets 422: stale variables shape. See `patches/` for the fix that
  was applied to the fork.
- Browser fallback fails to launch or times out: the browser path routes
  Chromium through `http://127.0.0.1:18080`. Start the forwarder with
  `nohup node proxy_forward.js > proxy_forward.log 2>&1 &` — but only if
  your network sits behind an egress proxy that needs preemptive
  authentication (set `HTTPS_PROXY` first). On a direct network the
  forwarder is unnecessary and the `--proxy-server` browser argument in the
  engine should be removed.
- `health` reports the proxy as not alive: that only matters for the
  browser fallback path. GraphQL reads and posts do not need it.

## Layout

- `nanomind-x.mjs` — the agent wrapper (JSON output, dry-run, ledger, caps)
- `engine/` — the forked engine (GraphQL client, MCP server, CLI)
- `patches/` — change record of the twenty-one local modifications, already
  applied in-tree
- `scripts/refresh-query-ids.mjs` — authenticated query-ID cache refresh
- `proxy_forward.js` — localhost CONNECT forwarder for the browser path
- `skill/nanomind-x/` — the installable skill for this tool
- `NOTICE` — upstream attribution (Apache-2.0)

## Licence

Apache-2.0. See `LICENSE` and `NOTICE`.
