/**
 * Whether this runtime can persist the cache to disk.
 * @returns {boolean}
 */
export function hasFilesystem(): boolean;
/**
 * Directory the cache lives in: `$NANOMIND_X_HOME`, else `~/.nanomind-x`.
 *
 * Under vitest, with no explicit directory, this points at a per-run temp
 * directory instead of the developer's home: unit tests must not pick up
 * whatever `~/.nanomind-x/query-ids.json` happens to hold on the machine.
 *
 * @param {string} [override]
 * @returns {string}
 */
export function resolveCacheDir(override?: string): string;
/**
 * @param {string} [cacheDir]
 * @returns {string}
 */
export function resolveCachePath(cacheDir?: string): string;
/**
 * Read the on-disk cache. Returns null when absent or unreadable.
 *
 * @param {string} [cacheDir]
 * @returns {{operations: Record<string, {queryId: string, operationType: string}>, fetchedAt: string, source?: object}|null}
 */
export function loadCache(cacheDir?: string): {
    operations: Record<string, {
        queryId: string;
        operationType: string;
    }>;
    fetchedAt: string;
    source?: object;
} | null;
/**
 * Write the cache atomically (temp file + rename).
 *
 * @param {object} payload
 * @param {string} [cacheDir]
 * @returns {string|null} The path written, or null where there is no filesystem
 */
export function saveCache(payload: object, cacheDir?: string): string | null;
/**
 * Extract every GraphQL operation descriptor from a bundle's source text.
 *
 * @param {string} js
 * @returns {Array<{queryId: string, operationName: string, operationType: string}>}
 */
export function extractOperations(js: string): Array<{
    queryId: string;
    operationName: string;
    operationType: string;
}>;
/**
 * Parse the inline webpack runtime's chunk manifest out of page HTML.
 *
 * Returns the public path plus a list of `{id, name, hash, url}` for every
 * chunk the runtime can load. `name` is the chunk id itself for unnamed
 * numeric chunks.
 *
 * @param {string} html
 * @returns {{base: string, chunks: Array<{id: string, name: string, hash: string, url: string}>}}
 */
export function parseChunkManifest(html: string): {
    base: string;
    chunks: Array<{
        id: string;
        name: string;
        hash: string;
        url: string;
    }>;
};
/**
 * Find the main bundle URL in page HTML.
 *
 * @param {string} html
 * @returns {string|null}
 */
export function parseMainBundleUrl(html: string): string | null;
/**
 * Choose which manifest chunks to download.
 *
 * @param {Array<{name: string, url: string}>} chunks
 * @param {'core'|'full'} [scope='core']
 * @returns {Array<{name: string, url: string}>}
 */
export function selectChunks(chunks: Array<{
    name: string;
    url: string;
}>, scope?: "core" | "full"): Array<{
    name: string;
    url: string;
}>;
/**
 * Discover current GraphQL query IDs from x.com's live web bundles.
 *
 * Does not touch module state or the cache unless `persist` is true (the
 * default), so it can be used as a pure probe.
 *
 * @param {object} [options]
 * @param {typeof globalThis.fetch} [options.fetch] Custom fetch (proxying, tests)
 * @param {string} [options.cacheDir] Where to persist (default `~/.nanomind-x`)
 * @param {boolean} [options.persist=true] Write the cache file and update memory
 * @param {'core'|'full'} [options.scope='core'] Which feature chunks to sweep
 * @param {string[]} [options.entryUrls] Pages to try for the bundle manifest
 * @param {number} [options.concurrency=8]
 * @returns {Promise<{operations: Record<string, {queryId: string, operationType: string}>, fetchedAt: string, count: number, source: {entryUrl: string, mainBundle: string, chunksFetched: number, chunksFailed: string[], bytes: number}, cachePath: string|null}>}
 */
export function discoverQueryIds(options?: {
    fetch?: typeof globalThis.fetch;
    cacheDir?: string;
    persist?: boolean;
    scope?: "core" | "full";
    entryUrls?: string[];
    concurrency?: number;
}): Promise<{
    operations: Record<string, {
        queryId: string;
        operationType: string;
    }>;
    fetchedAt: string;
    count: number;
    source: {
        entryUrl: string;
        mainBundle: string;
        chunksFetched: number;
        chunksFailed: string[];
        bytes: number;
    };
    cachePath: string | null;
}>;
/**
 * Refresh the cache from x.com. Concurrent callers share one in-flight
 * discovery.
 *
 * @param {Parameters<typeof discoverQueryIds>[0]} [options]
 * @returns {Promise<Awaited<ReturnType<typeof discoverQueryIds>>>}
 */
export function refreshQueryIds(options?: Parameters<typeof discoverQueryIds>[0]): Promise<Awaited<ReturnType<typeof discoverQueryIds>>>;
/**
 * Map a name to its GraphQL operationName. Accepts either an operationName
 * (`Favoriters`) or a key of the hardcoded table (`Likes`).
 *
 * @param {string} name
 * @returns {string}
 */
export function toOperationName(name: string): string;
/**
 * Look up the best-known query ID for an operation.
 *
 * Order: in-memory/cached discovery, then the hardcoded table. Synchronous,
 * never touches the network.
 *
 * @param {string} name operationName or hardcoded-table key
 * @param {object} [options]
 * @param {string} [options.cacheDir]
 * @returns {string|null}
 */
export function getQueryId(name: string, options?: {
    cacheDir?: string;
}): string | null;
/**
 * Resolve an operation to the `{queryId, operationName}` pair a request needs.
 *
 * @param {string} name operationName or hardcoded-table key
 * @param {object} [options]
 * @param {string} [options.cacheDir]
 * @returns {{queryId: string|null, operationName: string, operationType: string|null, source: 'cache'|'hardcoded'|'unknown'}}
 */
export function resolveOperation(name: string, options?: {
    cacheDir?: string;
}): {
    queryId: string | null;
    operationName: string;
    operationType: string | null;
    source: "cache" | "hardcoded" | "unknown";
};
/**
 * Whether the cache is missing or older than `maxAgeMs`.
 *
 * @param {object} [options]
 * @param {number} [options.maxAgeMs=DEFAULT_MAX_AGE_MS]
 * @param {string} [options.cacheDir]
 * @returns {boolean}
 */
export function isCacheStale(options?: {
    maxAgeMs?: number;
    cacheDir?: string;
}): boolean;
/**
 * Kick off a refresh in the background if the cache is stale, at most once
 * per hour per process. Never throws and never blocks the caller.
 *
 * @param {Parameters<typeof discoverQueryIds>[0] & {maxAgeMs?: number}} [options]
 * @returns {boolean} true if a refresh was started
 */
export function maybeRefreshInBackground(options?: Parameters<typeof discoverQueryIds>[0] & {
    maxAgeMs?: number;
}): boolean;
/**
 * Snapshot for diagnostics (`nanomind-x doctor`).
 *
 * @param {object} [options]
 * @param {string} [options.cacheDir]
 * @returns {{cached: boolean, fetchedAt: string|null, count: number, cachePath: string, stale: boolean}}
 */
export function queryIdStatus(options?: {
    cacheDir?: string;
}): {
    cached: boolean;
    fetchedAt: string | null;
    count: number;
    cachePath: string;
    stale: boolean;
};
/**
 * Whether an HTTP failure looks like a stale persisted query rather than a
 * missing resource or a bad request.
 *
 * @param {number} status
 * @param {object} [body] Parsed JSON error body, if any
 * @returns {boolean}
 */
export function isStaleQueryIdError(status: number, body?: object): boolean;
/**
 * Process-wide defaults: cache directory and fetch implementation used when a
 * call does not pass its own. Pass `{}` to reset.
 *
 * @param {{cacheDir?: string, fetch?: typeof globalThis.fetch}} config
 */
export function configureQueryIds(config?: {
    cacheDir?: string;
    fetch?: typeof globalThis.fetch;
}): void;
/**
 * Drop in-memory state so the next lookup re-reads the cache file.
 */
export function resetQueryIdState(): void;
/**
 * The hardcoded operationName -> queryId table, for diagnostics and tests.
 * @returns {Readonly<Record<string, string>>}
 */
export function hardcodedQueryIds(): Readonly<Record<string, string>>;
export const CACHE_FILENAME: "query-ids.json";
/** Cache entries older than this trigger a background refresh. */
export const DEFAULT_MAX_AGE_MS: number;
/** Pages that still ship the classic client bundles, tried in order. */
export const ENTRY_URLS: string[];
export const BUNDLE_BASE: "https://abs.twimg.com/responsive-web/client-web/";
/**
 * Feature chunks fetched in the default (`core`) scope, on top of `main`.
 * Matched against chunk names from the manifest. Each pattern is there for a
 * concrete operation the hardcoded table needs and `main` does not carry:
 *   - LoggedInMain / HoverCard: ListMembers, ListLatestTweetsTimeline, ListByRestId
 *   - LoggedInMain~HomeTimeline~Compose: HomeTimeline, HomeLatestTimeline
 *   - BookmarkFolders~Bookmarks: Bookmarks
 *   - TweetActivity / TweetEditHistory: Favoriters, Retweeters
 *   - UserProfile / UserHandler: profile-page operations
 */
export const CORE_CHUNK_PATTERNS: RegExp[];
