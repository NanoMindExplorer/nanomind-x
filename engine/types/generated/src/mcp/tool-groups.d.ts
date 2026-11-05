/**
 * Resolve what a tool call should be charged: an action class and how many
 * actions. Returns null for read tools and uncapped write tools. Bulk tools
 * whose class depends on their arguments (x_bulk_execute, x_engage) are
 * resolved from the arguments; a dry run costs nothing.
 *
 * A tool that performs several classes of action in one call returns an
 * array, one entry per class, so a sweep that likes and replies is charged
 * against both budgets rather than only the first.
 *
 * @param {string} name tool name
 * @param {object} [args] tool arguments
 * @returns {{ actionClass: string, count: number } | Array<{ actionClass: string, count: number }> | null}
 */
export function resolveActionCharge(name: string, args?: object): {
    actionClass: string;
    count: number;
} | Array<{
    actionClass: string;
    count: number;
}> | null;
/**
 * Resolve the group a tool belongs to.
 * @param {string} name
 * @returns {string} group name; unknown tools fall into "other"
 */
export function groupOf(name: string): string;
/**
 * Build a group -> tool names map for a concrete tool list.
 * @param {Array<{name: string}>} tools
 * @returns {Record<string, string[]>}
 */
export function buildGroups(tools: Array<{
    name: string;
}>): Record<string, string[]>;
/**
 * Is this tool a side-effect tool the approval gate should intercept?
 * @param {string} name
 */
export function isWriteTool(name: string): boolean;
/**
 * Parse a comma or whitespace separated selection string into a list of
 * lower-cased tokens. Accepts arrays too, so CLI flags that were given more
 * than once merge naturally.
 * @param {string | string[] | undefined | null} value
 * @returns {string[]}
 */
export function parseSelection(value: string | string[] | undefined | null): string[];
/**
 * Expand a token list into the set of tool names it selects. A token is a
 * tool name, a group name, or a wildcard suffix pattern such as `x_get_*`.
 * @param {string[]} tokens
 * @param {Array<{name: string}>} tools
 * @returns {{ names: Set<string>, unknown: string[] }}
 */
export function expandSelection(tokens: string[], tools: Array<{
    name: string;
}>): {
    names: Set<string>;
    unknown: string[];
};
/**
 * Create the shared allow predicate.
 *
 * Semantics (matching xmcp): an empty include list means "everything";
 * exclude always wins over include; the draft tools are never filtered.
 *
 * @param {object} options
 * @param {string | string[]} [options.include] tool/group tokens to allow
 * @param {string | string[]} [options.exclude] tool/group tokens to deny
 * @param {Array<{name: string}>} options.tools the full tool list to filter
 * @returns {{
 *   isAllowed: (name: string) => boolean,
 *   filter: <T extends {name: string}>(list: T[]) => T[],
 *   include: Set<string> | null,
 *   exclude: Set<string>,
 *   unknown: string[],
 *   active: boolean,
 * }}
 */
export function createToolFilter({ include, exclude, tools }: {
    include?: string | string[];
    exclude?: string | string[];
    tools: Array<{
        name: string;
    }>;
}): {
    isAllowed: (name: string) => boolean;
    filter: <T extends {
        name: string;
    }>(list: T[]) => T[];
    include: Set<string> | null;
    exclude: Set<string>;
    unknown: string[];
    active: boolean;
};
/**
 * Tool groups, allowlist filtering, and the write-tool register for the
 * nanomind-x MCP server.
 *
 * Three things live here:
 *
 * 1. GROUP_RULES assigns every tool name to exactly one group (read, write,
 *    dm, lists, spaces, analytics, ai, grok, automation, monitoring,
 *    workflows, persona, graph, data, x402, drafts, auth). Groups are what a
 *    user names in NANOMIND_X_MCP_TOOLS / NANOMIND_X_MCP_EXCLUDE or on the
 *    --tools / --exclude flags, so a config can say "read,analytics" instead
 *    of listing forty tool names.
 *
 * 2. WRITE_TOOLS enumerates every tool that posts, deletes, follows, mutes,
 *    sends, or otherwise changes state on X. The draft-approval gate
 *    (NANOMIND_X_MCP_REQUIRE_APPROVAL) intercepts exactly these.
 *
 * 3. createToolFilter() turns an include list plus an exclude list into a
 *    single isAllowed(name) predicate that ListTools and CallTool share, so a
 *    filtered tool is neither advertised nor callable.
 *
 * Modelled on the allowlist in xdevplatform/xmcp and the draft flow in x-use.
 */
/**
 * Tools that exist regardless of any filter. Removing these would strand
 * pending drafts with no way to approve or discard them.
 */
export const ALWAYS_AVAILABLE_TOOLS: readonly string[];
/**
 * Ordered classification rules. The first matching rule wins, so exact
 * names come before prefixes and specific prefixes before broad ones.
 * `names` is an exact-match list, `prefixes` matches `name.startsWith()`.
 */
export const GROUP_RULES: readonly ({
    group: string;
    names: string[];
    prefixes?: undefined;
} | {
    group: string;
    names: string[];
    prefixes: string[];
} | {
    group: string;
    prefixes: string[];
    names?: undefined;
})[];
/** Every group name, in rule order. */
export const GROUP_NAMES: readonly string[];
/**
 * Tools that change state on X (or send something on the user's behalf).
 * The approval gate stores these as drafts instead of executing them.
 * Read tools, analytics, and local bookkeeping (persona create/edit, CRM
 * tagging, dataset listing) are deliberately absent: they touch nothing a
 * follower could see.
 */
export const WRITE_TOOLS: Readonly<Set<string>>;
/**
 * Action class each write tool is charged against in the daily cap ledger
 * (src/mcp/action-caps.js). Classes: post, reply, like, repost, follow,
 * unfollow, dm, block, mute, delete. A tool that fans out into many actions
 * (auto_like, unfollow_all, persona_run) is charged once per call here;
 * the per-item pacing inside those tools is their own delay setting.
 */
export const ACTION_CLASS: Readonly<{
    x_post_tweet: "post";
    x_post_thread: "post";
    x_create_poll: "post";
    x_schedule_post: "post";
    x_publish_article: "post";
    x_client_send_tweet: "post";
    x_schedule_add: "post";
    x_workflow_run: "post";
    x_persona_run: "post";
    x_reply: "reply";
    x_quote_tweet: "reply";
    x_auto_comment: "reply";
    x_like: "like";
    x_auto_like: "like";
    x_bookmark: "like";
    x_retweet: "repost";
    x_auto_retweet: "repost";
    x_follow: "follow";
    x_auto_follow: "follow";
    x_follow_engagers: "follow";
    x_unfollow: "unfollow";
    x_unfollow_non_followers: "unfollow";
    x_unfollow_all: "unfollow";
    x_smart_unfollow: "unfollow";
    x_send_dm: "dm";
    x_mute_user: "mute";
    x_unmute_user: "mute";
    x_delete_tweet: "delete";
    x_clear_bookmarks: "delete";
}>;
/**
 * Write tools with no action class: they change the account's own settings,
 * move data between platforms, join a Space, or send a notification to the
 * owner's channels. None of them is something X rate-limits per day, so they
 * pass the cap check untouched. Every WRITE_TOOL is in exactly one of
 * ACTION_CLASS, UNCAPPED_WRITE_TOOLS, or the dynamic resolver below.
 */
/**
 * Write tools whose charge cannot be read off the tool name because it
 * depends on the arguments: which action a bulk call performs, which of
 * like/repost/reply a sweep was asked for. resolveActionCharge() handles
 * these explicitly, so they are exempt from the name-to-class table.
 */
export const ARGUMENT_RESOLVED_WRITE_TOOLS: Readonly<Set<string>>;
export const UNCAPPED_WRITE_TOOLS: Readonly<Set<string>>;
declare namespace _default {
    export { ALWAYS_AVAILABLE_TOOLS };
    export { GROUP_RULES };
    export { GROUP_NAMES };
    export { WRITE_TOOLS };
    export { ACTION_CLASS };
    export { UNCAPPED_WRITE_TOOLS };
    export { resolveActionCharge };
    export { groupOf };
    export { buildGroups };
    export { isWriteTool };
    export { parseSelection };
    export { expandSelection };
    export { createToolFilter };
}
export default _default;
