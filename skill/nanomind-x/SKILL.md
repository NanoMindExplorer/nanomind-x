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

- Read one tweet with `nanomind-x tweet --id <tweet_id>`, liked tweets with `nanomind-x liked <screen_name> [--limit N]`, a user's tweets+replies with `nanomind-x replies <screen_name> [--limit N]`, followers with `nanomind-x followers <screen_name> [--limit N]`, and following with `nanomind-x following <screen_name> [--limit N]`.

- Read trends with `nanomind-x trends`, the blocked-accounts list with `nanomind-x blocked [--limit N]`, the signed-in account with `nanomind-x me`, DM conversations with `nanomind-x dms [--limit N]`, and messages in one conversation with `nanomind-x dm-read --id <conversation_id> [--limit N]`.

- Read notifications with `nanomind-x notifications [--type all|mentions|verified] [--limit N]` (v2.1.0; signed `NotificationsTimeline` GraphQL, newest first). Each item carries `id`, `type` (`like`, `retweet`, `reply`, `mention`, `quote`, `follow`, or `other`), `timestamp`, `message`, acting `users`, and the target `tweet` when there is one. The Mentions tab is usually empty for a quiet account — that is a real empty result, not a failure.

- Read a full conversation with `nanomind-x thread --id <tweet_id>` (v2.1.0; same `TweetDetail` call as `tweet`, single page). The result lists the focal tweet plus its replies in order, each tagged `role: ancestor | focal | reply`; `hasMore` reports whether a bottom cursor was present. Related tweets are excluded, only the conversation is returned.

- Read every result as one JSON object on stdout and branch on the exit code, using 0 for ok, 2 for usage, 3 for rate-limited, 4 for auth and 5 for upstream.

- Treat reads as tool calls that never use the browser, and do not route a search through a browser session.

## Post and delete safely

- Post with `nanomind-x post --text "..."` and treat the result as a preview only, because writes are dry-run by default and send nothing.

- Reply with `nanomind-x reply --id <tweet_id> --text "..."` (same dry-run rule; sends via the signed CreateTweet path with `in_reply_to_tweet_id`).

- Quote with `nanomind-x quote --id <tweet_id> --text "..."` (same dry-run rule; signed CreateTweet with an attachment URL).

- Post a thread with `nanomind-x thread --text "part one || part two"` (parts split on `||`, max 25 parts, max 280 chars each; each part replies to the previous one; a failure mid-thread stops immediately and reports the parts already posted — no retry, no rollback). Read a thread with `nanomind-x thread --id <tweet_id>` instead; `--text` and `--id` together, or neither, is a usage error (exit 2).

- Attach a photo with `--media <path>` on `post`, `reply`, and `quote` (v2.1.0; chunked upload to `upload.twitter.com`, images only: jpg/png/gif/webp, 5 MB images / 15 MB GIFs). In dry-run mode nothing is uploaded — the preview reports the file that would be attached. On `--confirm` the file is uploaded first, then the tweet posts with the returned media id; the result reports `mediaAttached: true` and the `mediaId`. Missing file, unsupported extension, or oversized file is a usage error (exit 2) before anything is uploaded. The browser fallback posts text only and reports `mediaAttached: false`.

- Like with `nanomind-x like --id <tweet_id>`, unlike with `unlike`, repost with `repost`, unrepost with `unrepost`, bookmark with `bookmark`, unbookmark with `unbookmark` (all the same dry-run rule; signed GraphQL path).

- Follow with `nanomind-x follow <screen_name>` (same dry-run rule; sends via the signed REST `friendships/create` path).

- Unfollow with `nanomind-x unfollow <screen_name>` (same dry-run rule; signed REST `friendships/destroy` path — the built-in GraphQL `DestroyFollow` route answers 404, so the wrapper uses the REST route that mirrors `follow`).

- Pin a tweet with `nanomind-x pin --id <tweet_id>` (same dry-run rule; signed REST `account/pin_tweet` path). The pin call's own response echoes the pinned list — that is the confirmation; `nanomind-x me` also reports `pinnedTweetIds` (v2.1.0 fixed the parser: the live response carries `pinned_items.tweet_ids_str`, not `pinned_tweet_ids_str`). Unpin with `nanomind-x unpin --id <tweet_id>` (signed REST `account/unpin_tweet` path).

- Block with `nanomind-x block <screen_name>`, unblock with `unblock`, mute with `mute`, unmute with `unmute` (all the same dry-run rule; signed REST `blocks/` and `mutes/users/` paths). Known limitation, verified 2026-11-06 and re-tested in v2.1.0: `block`, `mute` and `unmute` work, but `unblock` returns HTTP 404 (error 34) on every route tried (`x.com/i/api/1.1` and `api.x.com`, `user_id` and `screen_name`, with and without extra headers; the v2.1.0 retry also tried `api.twitter.com/1.1/blocks/destroy.json` with both param styles and the follow-style full param set — all 404) even while the account is verifiably blocked, and no GraphQL unblock mutation exists in the generated endpoint table or the discovery cache (only DM-scoped `dmBlockUser`/`dmUnblockUser`, which are not profile blocks). X no longer serves `blocks/destroy.json` to this session on any host/param variant — a platform-side limitation, not a tool bug. Treat a block as effectively permanent from this tool until a working route is found; check the current block list with `nanomind-x blocked`.

- Set the bio with `nanomind-x bio --text "..."` (max 160 chars; same dry-run rule; signed REST `account/update_profile` path first, MCP browser path only as fallback).

- Send a DM with `nanomind-x dm --user <screen_name> --text "..."` (same dry-run rule; resolves the user first, then sends via the signed path).

- Send a real write only with `--confirm` after showing the exact preview text to the user and getting explicit approval for that write — unless the user has handed over account management, in which case the standing mandate covers routine follows and substantive replies, and every action is still reported with its link.

## Not in v2.1.0 (deliberately)

- Scheduled posts (no cached query ID for the scheduling mutation).
- Polls (no signed route).
- Lists (reading or managing).
- Spaces, Grok, and articles.
- ALL automation — auto-follow, auto-like, auto-repost, auto-reply, bulk actions of any kind. Excluded on purpose: automation is what gets accounts flagged. Every write is a deliberate, single, human-approved action.

Media upload (`--media`), thread reading (`thread --id`), and the notifications timeline are IN since v2.1.0 — they left this list, they are not new exclusions.

- Rely on the idempotency ledger to refuse a duplicate write for the same operation and text within 24 hours, and never pass `--force` without explicit approval for that write. Toggle pairs are stateful, not just history: recording the inverse of a toggle (unlike, unpin, unfollow, unblock, unmute, unrepost, unbookmark) invalidates the forward entry, so pin → unpin → pin is allowed while a repeated pin without an unpin in between is still refused.

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
