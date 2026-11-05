# nanomind-x

## Install and check the session

- Clone the repository and run `./install.sh` from its root, then confirm the `nanomind-x` command is on `PATH`.

- Import the session from cookies exported from your own logged-in browser with `nanomind-x-engine login --cookies-file <file>`, then delete the export file right after the import.

- Never paste cookie values in chat, in a shared file, or in a ticket, because cookies equal full session access.

- Run `nanomind-x health` before any other command and read its checks for session presence, query-ID cache age, signing-key cache age, proxy state and one cheap probe read.

- If health reports no session, re-import cookies instead of retrying reads, because every read fails without a session.

## Search and read

- Search with `nanomind-x search <query> [--mode latest|top|people] [--limit N]` and pass `--burst` only when a second search inside 60 seconds is truly needed, since search is capped at one call per 60 seconds.

- Read a profile with `nanomind-x profile <screen_name>` and a timeline with `nanomind-x timeline <screen_name> [--limit N]`.

- Read every result as one JSON object on stdout and branch on the exit code, using 0 for ok, 2 for usage, 3 for rate-limited, 4 for auth and 5 for upstream.

- Treat reads as tool calls that never use the browser, and do not route a search through a browser session.

## Post and delete safely

- Post with `nanomind-x post --text "..."` and treat the result as a preview only, because writes are dry-run by default and send nothing.

- Send a real post only with `--confirm` after showing the exact preview text to the user and getting explicit approval for that post.

- Rely on the idempotency ledger to refuse a duplicate write for the same operation and text within 24 hours, and never pass `--force` without explicit approval for that write.

- Delete with `nanomind-x delete --id <tweet_id> [--confirm]`, using the same preview rule as posting.

- Pass `--allow-browser-fallback` only when a GraphQL mutation was rejected and the user accepts the browser path, and record which path was used.

## Keep the tool healthy

- Refresh a stale query-ID cache with `node scripts/refresh-query-ids.mjs` from the repository root, then retry the failed search.

- Read a search 404 as an unsigned or stale request and a CreateTweet 226 as an unsigned mutation, then check the signing patch in `engine/src/client/Scraper.js` before retrying.

- Back off until `retry_after` when a call exits 3 with a 429, and never retry in a loop.

- Start the localhost proxy forwarder with `nohup node proxy_forward.js > proxy_forward.log 2>&1 &` only when the network sits behind an egress proxy that needs preemptive authentication, and set `HTTPS_PROXY` first.

- Re-import cookies when health reports the session invalid, because a login from another device or IP can invalidate it.

## Available connectors

- Use `muse.connector_search` to find other connectors and `muse.skill_search` to find related skills.

- If nothing here fits, look on the web for a maintained API or MCP server and set it up with [Custom Connectors and MCPs](/opt/muse/skills/custom-connector-setup/SKILL.md), or build a custom connector.
