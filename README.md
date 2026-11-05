# nanomind-x

Agent-fit X tool: signed GraphQL search, profile and timeline reads, and
posting with a dry-run default and an idempotency guard. One JSON object per
call, structured errors, exit codes an agent can branch on.

The engine (`engine/`) is an in-tree fork of the upstream 4.0.1 release with
transaction-ID signing on every GraphQL call (this is what fixed the search
404 and the CreateTweet 226), a fixed liked-tweets resolution and core-first
author parsing. Full upstream attribution is in `NOTICE`.

## Install

Requires Node 24 and npm.

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

```sh
nanomind-x search <query> [--mode latest|top|people] [--limit N] [--burst]
nanomind-x profile <screen_name>
nanomind-x timeline <screen_name> [--limit N]
nanomind-x post --text "..." [--confirm] [--allow-browser-fallback] [--force]
nanomind-x delete --id <tweet_id> [--confirm]
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
- `patches/` — change record of the nine local modifications, already
  applied in-tree
- `scripts/refresh-query-ids.mjs` — authenticated query-ID cache refresh
- `proxy_forward.js` — localhost CONNECT forwarder for the browser path
- `skill/nanomind-x/` — the installable skill for this tool
- `NOTICE` — upstream attribution (Apache-2.0)

## Licence

Apache-2.0. See `LICENSE` and `NOTICE`.
