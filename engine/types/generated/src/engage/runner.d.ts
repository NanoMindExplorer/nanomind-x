/**
 * Normalise the source options into one descriptor.
 *
 * Exactly one of username / search / list identifies the feed; passing more
 * than one is a mistake worth catching before a single write happens.
 *
 * @param {object} opts
 * @param {string} [opts.username] - Profile to sweep (with or without @)
 * @param {string} [opts.search] - Search query to sweep
 * @param {string} [opts.list] - List ID to sweep
 * @param {boolean} [opts.includeReplies=false] - Profile only: read the replies tab
 * @param {string} [opts.mode='Latest'] - Search only: Latest | Top
 * @returns {{ kind: string, username?: string, query?: string, listId?: string, includeReplies: boolean, mode: string, label: string, stateKey: string }}
 */
export function resolveSource(opts?: {
    username?: string;
}): {
    kind: string;
    username?: string;
    query?: string;
    listId?: string;
    includeReplies: boolean;
    mode: string;
    label: string;
    stateKey: string;
};
/**
 * A file-name-safe slug for a search query, short enough to stay readable.
 * @param {string} text
 * @returns {string}
 */
export function slug(text: string): string;
/**
 * Read tweets from whichever feed the source names.
 *
 * @param {object} scraper - An nanomind-x Scraper
 * @param {ReturnType<typeof resolveSource>} source
 * @param {number} count
 * @returns {AsyncIterable<object>}
 */
export function readSource(scraper: object, source: ReturnType<typeof resolveSource>, count: number): AsyncIterable<object>;
/**
 * Pick the posts a run should touch, and say why each rejected one was skipped.
 *
 * Every filter is evaluated in the order a person would apply them: what the
 * post is, who wrote it, what it says, then how much it already has. The
 * `why` strings are surfaced verbatim in the report, so a sweep that engages
 * nothing explains itself instead of looking broken.
 *
 * @param {object[]} tweets - Tweet models from the client
 * @param {object} opts
 * @param {{like:boolean, repost:boolean, comment:boolean}} opts.actions
 * @param {boolean} [opts.includeReplies=false]
 * @param {boolean} [opts.includeReposts=false]
 * @param {Date|null} [opts.since=null]
 * @param {number} [opts.limit=Infinity]
 * @param {Record<string, object>} [opts.done={}] - Prior state, keyed by tweet id
 * @param {string[]} [opts.onlyFrom=[]] - Only these authors (handles, no @)
 * @param {string[]} [opts.skipUsers=[]] - Never these authors
 * @param {string[]} [opts.keywords=[]] - Post must contain one of these
 * @param {string[]} [opts.skipKeywords=[]] - Post must contain none of these
 * @param {number} [opts.minLikes=0]
 * @param {number} [opts.maxLikes=0] - 0 means no ceiling
 * @param {string} [opts.self] - Your own handle, never engaged
 * @returns {{ selected: object[], skipped: Array<{ id: string, why: string }> }}
 */
export function selectTweets(tweets: object[], opts: {
    actions: {
        like: boolean;
        repost: boolean;
        comment: boolean;
    };
    includeReplies?: boolean;
    includeReposts?: boolean;
    since?: Date | null;
    limit?: number;
    done?: Record<string, object>;
    onlyFrom?: string[];
}): {
    selected: object[];
    skipped: Array<{
        id: string;
        why: string;
    }>;
};
/**
 * Parse reply templates from repeated flags and an optional file.
 * One template per line; blank lines and `#` comments are ignored.
 *
 * @param {string[]} [fromFlags=[]]
 * @param {string} [fileContents='']
 * @returns {string[]}
 */
export function parseTemplates(fromFlags?: string[], fileContents?: string): string[];
/**
 * Choose the next template, never the same one twice in a row, and fill in
 * the placeholders.
 *
 * @param {string[]} templates
 * @param {{ username?: string, name?: string }} tweet
 * @param {number} lastIndex
 * @param {() => number} [random=Math.random]
 * @returns {{ text: string, index: number }}
 */
export function pickTemplate(templates: string[], tweet: {
    username?: string;
    name?: string;
}, lastIndex: number, random?: () => number): {
    text: string;
    index: number;
};
/** Milliseconds to wait before the next post: base plus symmetric jitter. */
export function nextDelay(baseSeconds: any, jitterSeconds: any, random?: () => number): number;
/**
 * True when an error is X telling us to slow down.
 * @param {Error} err
 * @returns {boolean}
 */
export function isRateLimit(err: Error): boolean;
/**
 * Read enough of the feed to fill the run after filtering.
 *
 * Reading exactly `limit` posts starves a filtered sweep: on a profile where
 * four in five posts are replies, a limit of 20 would engage four. This reads
 * a multiple and stops as soon as the quota is genuinely filled.
 *
 * @param {object} scraper
 * @param {ReturnType<typeof resolveSource>} source
 * @param {object} filters - Passed through to selectTweets
 * @param {number} limit
 * @param {(count: number) => void} [onProgress]
 * @returns {Promise<{ fetched: object[], selected: object[], skipped: Array<{id:string,why:string}> }>}
 */
export function collectTweets(scraper: object, source: ReturnType<typeof resolveSource>, filters: object, limit: number, onProgress?: (count: number) => void): Promise<{
    fetched: object[];
    selected: object[];
    skipped: Array<{
        id: string;
        why: string;
    }>;
}>;
/**
 * Run the sweep.
 *
 * @param {object} options
 * @param {object} options.scraper - Authenticated nanomind-x Scraper
 * @param {ReturnType<typeof resolveSource>} options.source
 * @param {object[]} options.tweets - Already-selected tweets, in order
 * @param {{like:boolean, repost:boolean, comment:boolean}} options.actions
 * @param {Record<string, object>} [options.done={}] - Prior state, mutated as the run proceeds
 * @param {string[]} [options.templates=[]]
 * @param {{ generate: Function }|null} [options.generator=null] - From createCommentGenerator
 * @param {boolean} [options.fallbackToTemplates=true]
 * @param {boolean} [options.dryRun=false]
 * @param {number} [options.delay=20] - Seconds between posts
 * @param {number} [options.jitter=10]
 * @param {(event: object) => void} [options.onEvent] - Progress events
 * @param {(id: string, record: object) => Promise<void>|void} [options.onProgressSaved] - Called after each post
 * @param {() => boolean} [options.shouldStop] - Return true to end the run early
 * @param {(ms: number) => Promise<void>} [options.wait=sleep] - Injectable for tests
 * @returns {Promise<object>} Report
 */
export function runEngage(options: {
    scraper: object;
    source: ReturnType<typeof resolveSource>;
    tweets: object[];
    actions: {
        like: boolean;
        repost: boolean;
        comment: boolean;
    };
    done?: Record<string, object>;
    templates?: string[];
    generator?: {
        generate: Function;
    } | null;
    fallbackToTemplates?: boolean;
    dryRun?: boolean;
    delay?: number;
    jitter?: number;
    onEvent?: (event: object) => void;
    onProgressSaved?: (id: string, record: object) => Promise<void> | void;
    shouldStop?: () => boolean;
    wait?: (ms: number) => Promise<void>;
}): Promise<object>;
/**
 * The engagement sweep engine.
 *
 * One implementation of "walk a feed and like, repost, and reply to what is
 * on it", shared by the `nanomind-x engage` CLI command and the
 * `x_engage_profile` MCP tool. It runs on the HTTP client, so there is no
 * browser, no DOM, and no page Content-Security-Policy between it and an LLM
 * provider.
 *
 * The engine emits events rather than printing: the CLI renders them with
 * colour and spinners, the MCP tool collects them into a report, and a test
 * asserts on them directly.
 *
 * @author nich (@nichxbt) - https://github.com/nirholas
 * @license Apache-2.0
 */
/** Feeds a sweep can run over. */
export const SOURCE_KINDS: readonly string[];
