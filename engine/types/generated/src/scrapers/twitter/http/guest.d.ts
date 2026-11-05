/**
 * Manages guest token lifecycle: acquisition, caching, pooling, rate-limit
 * distribution, and header construction.
 *
 * @example
 * ```js
 * const guest = new GuestTokenManager();
 * const headers = await guest.getHeaders();
 * const res = await fetch(url, { headers });
 * ```
 *
 * @example Token pool usage
 * ```js
 * const guest = new GuestTokenManager({ poolSize: 3 });
 * // Pool will auto-fill on first use, or pre-fill:
 * await guest.fillPool();
 * const token = guest.getNextToken('search');
 * ```
 */
export class GuestTokenManager {
    /**
     * @param {object} [options]
     * @param {number}   [options.poolSize=0]      Number of tokens to maintain in the pool. 0 = single-token mode.
     * @param {typeof globalThis.fetch} [options.fetch]  Custom fetch implementation.
     * @param {string}   [options.bearerToken]     Override the default bearer token.
     */
    constructor(options?: {
        poolSize?: number;
        fetch?: typeof globalThis.fetch;
        bearerToken?: string;
    });
    /**
     * Activate a new guest token from Twitter's API.
     *
     * POST https://api.x.com/1.1/guest/activate.json
     * Response: { guest_token: "1234567890" }
     *
     * The User-Agent is not decoration: activate.json answers a request without
     * one with `HTTP 404 {"message":"Sorry, that page does not exist"}`, which
     * reads as a dead endpoint rather than a rejected client and sent every
     * caller of this class looking for a stale URL.
     *
     * @returns {Promise<GuestToken>} The newly acquired token
     * @throws {Error} If the activation request fails
     */
    activate(): Promise<GuestToken>;
    /**
     * Get a valid guest token — cached if still fresh, otherwise auto-activates.
     *
     * Concurrent-safe: if multiple callers invoke this simultaneously while the
     * token is expired, only a single activation request is made (thundering-herd
     * prevention via promise deduplication).
     *
     * @returns {Promise<string>} The guest token string
     */
    getToken(): Promise<string>;
    /**
     * Build unauthenticated request headers for Twitter's API.
     *
     * Includes:
     *   - authorization: Bearer {BEARER_TOKEN}
     *   - x-guest-token: {token}
     *   - x-twitter-active-user: yes
     *   - x-twitter-client-language: en
     *   - User-Agent (rotated)
     *   - x-client-transaction-id, when the request being signed is named
     *
     * The transaction ID is derived from the method and path, so it can only be
     * added when the caller says which request the headers are for. Callers that
     * pass nothing get the same headers as before.
     *
     * @param {object} [request]
     * @param {string} [request.method='GET'] HTTP method of the request being signed
     * @param {string} [request.path] Request path or full URL to sign
     * @param {boolean} [request.transactionId] Force signing on or off
     * @returns {Promise<Record<string, string>>}
     *
     * @example
     * ```js
     * const guest = new GuestTokenManager();
     * const url = 'https://x.com/i/api/graphql/abc/UserByScreenName?variables=%7B%7D';
     * const headers = await guest.getHeaders({ method: 'GET', path: url });
     * const res = await fetch(url, { headers });
     * ```
     */
    getHeaders(request?: {
        method?: string;
        path?: string;
        transactionId?: boolean;
    }): Promise<Record<string, string>>;
    /**
     * Check whether the current primary token is expired or absent.
     * @returns {boolean}
     */
    isExpired(): boolean;
    /**
     * Add a pre-fetched token to the pool.
     *
     * @param {string} tokenValue  Raw guest token string
     * @param {number} [createdAt] Override creation timestamp (ms)
     */
    addToken(tokenValue: string, createdAt?: number): void;
    /**
     * Get the next available token from the pool using round-robin.
     *
     * If an `endpoint` is specified, tokens that are rate-limited for that
     * endpoint are skipped. If all tokens are exhausted, returns `null`.
     *
     * @param {string} [endpoint]  Logical endpoint name for rate-limit awareness
     * @returns {GuestToken|null}
     */
    getNextToken(endpoint?: string): GuestToken | null;
    /**
     * Remove expired tokens from the pool.
     * @returns {number} Number of tokens removed
     */
    removeExpired(): number;
    /**
     * Fill the pool up to the configured `poolSize` by activating new tokens.
     * Useful for pre-warming the pool before heavy scraping.
     *
     * @returns {Promise<number>} Number of tokens added
     */
    fillPool(): Promise<number>;
    /**
     * Record rate-limit information for a token from API response headers.
     *
     * @param {GuestToken|string} token     Token instance or raw token string
     * @param {string}            endpoint  Logical endpoint name (search|profile|tweet)
     * @param {object}            headers   Response headers (or Headers instance)
     */
    recordRateLimit(token: GuestToken | string, endpoint: string, headers: object): void;
    /** @returns {number} Current pool size */
    get poolLength(): number;
    /** @returns {GuestToken|null} The current primary token (read-only) */
    get currentToken(): GuestToken | null;
    #private;
}
export default GuestTokenManager;
/**
 * Single guest token with metadata for expiry and rate-limit tracking.
 */
export class GuestToken {
    /**
     * @param {string} value  The raw guest token string
     * @param {number} [createdAt]  Override creation timestamp (ms)
     */
    constructor(value: string, createdAt?: number);
    /** @type {string} */
    value: string;
    /** @type {number} Unix ms timestamp when token was created */
    createdAt: number;
    /**
     * Per-endpoint rate-limit state.
     * @type {Map<string, { remaining: number, resetAt: number }>}
     */
    rateLimits: Map<string, {
        remaining: number;
        resetAt: number;
    }>;
    /** @returns {boolean} true if the token has exceeded its TTL */
    isExpired(): boolean;
    /**
     * Record a rate-limit observation from response headers.
     * @param {string} endpoint  Logical endpoint name (search|profile|tweet)
     * @param {number} remaining  Remaining requests in window
     * @param {number} resetAt    Unix ms timestamp when window resets
     */
    recordRateLimit(endpoint: string, remaining: number, resetAt: number): void;
    /**
     * Check whether this token has available capacity for an endpoint.
     * @param {string} endpoint  Logical endpoint name
     * @returns {boolean}
     */
    hasCapacity(endpoint: string): boolean;
}
/**
 * Public bearer token embedded in Twitter's web client JS bundle.
 * Same token used by the-convocation/twitter-scraper, d60/twikit, and others.
 */
export const BEARER_TOKEN: "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";
/** Guest token expiry window — 2.5 hours (tokens actually expire at ~3h) */
export const TOKEN_TTL_MS: number;
/** Rate-limit window (15 minutes in ms) */
export const RATE_LIMIT_WINDOW_MS: number;
export namespace GUEST_RATE_LIMITS {
    let search: number;
    let profile: number;
    let tweet: number;
}
/** Realistic Chrome user agents for rotation */
export const USER_AGENTS: string[];
/**
 * Pick a random user agent from the pool.
 * @returns {string}
 */
export function randomUserAgent(): string;
/**
 * Headers a browser sends on a top-level page navigation. Used when fetching
 * x.com HTML (query-ID discovery loads a page to read the bundle manifest);
 * a bare fetch with no Accept/Sec-Fetch headers is served a stripped shell.
 *
 * @param {string} [userAgent]  Override the rotated User-Agent
 * @returns {Record<string, string>}
 */
export function browserNavigationHeaders(userAgent?: string): Record<string, string>;
