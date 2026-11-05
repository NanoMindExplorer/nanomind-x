/**
 * Whether signing is switched on.
 *
 * Explicit call option wins, then process configuration, then
 * `NANOMIND_X_TRANSACTION_ID`. Defaults to on outside vitest; unit tests must
 * not reach x.com unless they opt in.
 *
 * @param {object} [options]
 * @param {boolean} [options.enabled]
 * @returns {boolean}
 */
export function isTransactionIdEnabled(options?: {
    enabled?: boolean;
}): boolean;
/**
 * Absolute path of the key cache.
 *
 * @param {string} [cacheDir]
 * @returns {string}
 */
export function resolveCachePath(cacheDir?: string): string;
/**
 * Read the on-disk key cache. Returns null when absent, unreadable, or
 * missing either key.
 *
 * @param {string} [cacheDir]
 * @returns {{key: string, animationKey: string, fetchedAt: string, source?: string}|null}
 */
export function loadCache(cacheDir?: string): {
    key: string;
    animationKey: string;
    fetchedAt: string;
    source?: string;
} | null;
/**
 * Write the key cache atomically (temp file + rename).
 *
 * @param {object} payload
 * @param {string} [cacheDir]
 * @returns {string} The path written
 */
export function saveCache(payload: object, cacheDir?: string): string;
/**
 * Pull the base64 site-verification key out of x.com page HTML.
 *
 * @param {string} html
 * @returns {string|null}
 */
export function extractVerificationKey(html: string): string | null;
/**
 * Pull the four `loading-x-anim-*` animation paths out of x.com page HTML, in
 * document order.
 *
 * Each animation is an `<svg id="loading-x-anim-N"><g><path/><path d="M .. C ..
 * "/></g></svg>`; the second path in the group carries the curve data. Read
 * with a regex rather than a DOM so no HTML parser has to be shipped just to
 * read four attributes.
 *
 * @param {string} html
 * @returns {string[]}
 */
export function extractAnimationPaths(html: string): string[];
/**
 * Extract the key-byte indices from the `ondemand.s` chunk source.
 *
 * The chunk reads its own key bytes as `parseInt(t[<n>], 16)`, obfuscated to
 * `(t[30], 16)`. The first index selects the animation row; the rest multiply
 * together into the point on the curve to sample.
 *
 * @param {string} js
 * @returns {{rowIndex: number, keyByteIndices: number[]}|null}
 */
export function extractKeyByteIndices(js: string): {
    rowIndex: number;
    keyByteIndices: number[];
} | null;
/**
 * Split one SVG path's curve data into rows of integers.
 *
 * @param {string} d
 * @returns {number[][]}
 */
export function pathToFrameRows(d: string): number[][];
/**
 * Decode a base64 key into its bytes.
 *
 * @param {string} key
 * @returns {number[]}
 */
export function keyToBytes(key: string): number[];
/**
 * The web client's own float-to-hex routine, including its quirks: the
 * integer loop recomputes from the original value, and the fraction is
 * expanded until it hits zero.
 *
 * @param {number} x
 * @returns {string}
 */
export function floatToHex(x: number): string;
/**
 * Sample a cubic-bezier curve, given its four control values, at `time`.
 *
 * @param {number[]} curves
 * @param {number} time
 * @returns {number}
 */
export function cubicValue(curves: number[], time: number): number;
/**
 * Turn one row of curve data into its animation-key fragment.
 *
 * @param {number[]} frames One row from {@link pathToFrameRows}
 * @param {number} targetTime Normalised position along the curve
 * @returns {string}
 */
export function animate(frames: number[], targetTime: number): string;
/**
 * Compute the animation key for a verification key, given the indices from
 * the ondemand chunk and the animation paths from the page.
 *
 * @param {object} input
 * @param {number[]} input.keyBytes
 * @param {number} input.rowIndex
 * @param {number[]} input.keyByteIndices
 * @param {string[]} input.paths
 * @returns {string|null} null when the page markup no longer lines up
 */
export function computeAnimationKey({ keyBytes, rowIndex, keyByteIndices, paths }: {
    keyBytes: number[];
    rowIndex: number;
    keyByteIndices: number[];
    paths: string[];
}): string | null;
/**
 * Reduce a URL or path to the pathname x.com signs: no origin, no query, no
 * fragment.
 *
 * @param {string} target
 * @returns {string}
 */
export function normalizeSignedPath(target: string): string;
/**
 * Build one `x-client-transaction-id` value.
 *
 * Pure and deterministic once `timeNow` and `randomByte` are pinned, which is
 * what the tests do; in production both come from the clock and the RNG, as
 * they do in the browser.
 *
 * @param {object} input
 * @param {string} input.key Base64 verification key
 * @param {string} input.animationKey
 * @param {string} input.method HTTP method
 * @param {string} input.path Request path or full URL
 * @param {number} [input.timeNow] Seconds since {@link TRANSACTION_EPOCH_MS}
 * @param {number} [input.randomByte] 0-255 XOR mask
 * @returns {Promise<string>}
 */
export function generateTransactionId({ key, animationKey, method, path: target, timeNow, randomByte }: {
    key: string;
    animationKey: string;
    method: string;
    path: string;
    timeNow?: number;
    randomByte?: number;
}): Promise<string>;
/**
 * Fast path: take a known-good `{animationKey, verification}` pair from the
 * published dictionary. One small fetch, no bundle parsing.
 *
 * @param {object} [options]
 * @param {typeof globalThis.fetch} [options.fetch]
 * @param {string} [options.pairUrl]
 * @returns {Promise<{key: string, animationKey: string, source: 'pairs', pairUrl: string}>}
 */
export function discoverFromPairDictionary(options?: {
    fetch?: typeof globalThis.fetch;
    pairUrl?: string;
}): Promise<{
    key: string;
    animationKey: string;
    source: "pairs";
    pairUrl: string;
}>;
/**
 * Resolve the `ondemand.s` chunk URL out of page HTML, reusing the webpack
 * manifest parser that query-ID discovery already runs on the same markup.
 *
 * @param {string} html
 * @returns {string|null}
 */
export function resolveOnDemandChunkUrl(html: string): string | null;
/**
 * Fallback: read the keys out of x.com's live page and bundle.
 *
 * @param {object} [options]
 * @param {typeof globalThis.fetch} [options.fetch]
 * @param {string[]} [options.entryUrls]
 * @returns {Promise<{key: string, animationKey: string, source: 'live', entryUrl: string, chunkUrl: string}>}
 */
export function discoverFromLiveBundles(options?: {
    fetch?: typeof globalThis.fetch;
    entryUrls?: string[];
}): Promise<{
    key: string;
    animationKey: string;
    source: "live";
    entryUrl: string;
    chunkUrl: string;
}>;
/**
 * Make sure a usable `{key, animationKey}` pair is in memory, discovering and
 * caching one if needed. Concurrent callers share one initialisation.
 *
 * Never throws: a failure is recorded, backed off, and reported as null.
 *
 * @param {object} [options]
 * @param {string} [options.cacheDir]
 * @param {typeof globalThis.fetch} [options.fetch]
 * @param {'pairs'|'live'} [options.source]
 * @param {number} [options.maxAgeMs]
 * @param {boolean} [options.force] Ignore a fresh cache and rediscover
 * @returns {Promise<{key: string, animationKey: string, source: string, fetchedAt: string}|null>}
 */
export function initializeTransactionId(options?: {
    cacheDir?: string;
    fetch?: typeof globalThis.fetch;
    source?: "pairs" | "live";
    maxAgeMs?: number;
    force?: boolean;
}): Promise<{
    key: string;
    animationKey: string;
    source: string;
    fetchedAt: string;
} | null>;
/**
 * Sign one request.
 *
 * @param {string} method HTTP method
 * @param {string} target Request path or full URL
 * @param {object} [options]
 * @param {boolean} [options.enabled] Override the on/off switch
 * @param {string} [options.cacheDir]
 * @param {typeof globalThis.fetch} [options.fetch]
 * @param {'pairs'|'live'} [options.source]
 * @returns {Promise<string|null>} The header value, or null when signing is
 *   off or unavailable. A null means the caller sends the request unsigned.
 *
 * @example
 * ```js
 * const id = await getTransactionId('GET', 'https://x.com/i/api/graphql/abc/UserByScreenName?variables=%7B%7D');
 * if (id) headers['x-client-transaction-id'] = id;
 * ```
 */
export function getTransactionId(method: string, target: string, options?: {
    enabled?: boolean;
    cacheDir?: string;
    fetch?: typeof globalThis.fetch;
    source?: "pairs" | "live";
}): Promise<string | null>;
/**
 * Snapshot for diagnostics (`nanomind-x doctor`).
 *
 * @param {object} [options]
 * @param {string} [options.cacheDir]
 * @returns {{enabled: boolean, cached: boolean, source: string|null, fetchedAt: string|null, stale: boolean, cachePath: string, preferredSource: string}}
 */
export function transactionIdStatus(options?: {
    cacheDir?: string;
}): {
    enabled: boolean;
    cached: boolean;
    source: string | null;
    fetchedAt: string | null;
    stale: boolean;
    cachePath: string;
    preferredSource: string;
};
/**
 * Process-wide defaults. Pass `{}` to reset.
 *
 * @param {{cacheDir?: string, fetch?: typeof globalThis.fetch, enabled?: boolean, source?: 'pairs'|'live'}} config
 */
export function configureTransactionId(config?: {
    cacheDir?: string;
    fetch?: typeof globalThis.fetch;
    enabled?: boolean;
    source?: "pairs" | "live";
}): void;
/**
 * Drop in-memory keys so the next call re-reads the cache file.
 */
export function resetTransactionIdState(): void;
export const CACHE_FILENAME: "transaction-keys.json";
/** Cached keys older than this are refreshed (x.com rotates them per deploy). */
export const DEFAULT_MAX_AGE_MS: number;
/** After a failed initialisation, do not try again for this long. */
export const FAILURE_BACKOFF_MS: number;
/** The webpack chunk that carries the key-byte indices. */
export const ON_DEMAND_CHUNK_NAME: "ondemand.s";
/** Published `{animationKey, verification}` pairs (fa0311, MIT). */
export const PAIR_DICTIONARY_URL: "https://raw.githubusercontent.com/fa0311/x-client-transaction-id-pair-dict/main/pair.json";
/** Literal the web client folds into the hashed payload. */
export const DEFAULT_KEYWORD: "obfiowerehiring";
/** Constant byte the web client appends before the XOR pass. */
export const ADDITIONAL_RANDOM_NUMBER: 3;
/** The epoch the encoded timestamp counts from (2023-05-01T07:00:00Z). */
export const TRANSACTION_EPOCH_MS: number;
