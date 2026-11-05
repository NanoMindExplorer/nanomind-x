/**
 * Launch a headless Chromium browser, navigate to a public X profile, and
 * intercept the first outgoing UserByScreenName GraphQL request. Returns a
 * copy of its request headers for use with `fetch()`.
 *
 * The browser is closed immediately after harvesting — it is not kept alive.
 *
 * @param {object} [options]
 * @param {string} [options.probeProfile='x'] - Public username to load (triggers the GraphQL request)
 * @param {string} [options.userAgent]         - Override the browser user agent
 * @param {boolean} [options.headless=true]    - Run browser in headless mode
 * @returns {Promise<Record<string, string>>}  - Request headers ready for use with fetch()
 * @throws {Error} If no GraphQL request is observed within the timeout
 *
 * @example
 * const headers = await harvestSession();
 * const res = await fetch('https://x.com/i/api/graphql/...', { headers });
 */
export function harvestSession({ probeProfile, userAgent, headless, }?: {
    probeProfile?: string;
    userAgent?: string;
    headless?: boolean;
}): Promise<Record<string, string>>;
/**
 * Harvest a session and return a configured `TwitterHttpClient` instance.
 *
 * The client is pre-loaded with the harvested cookie and guest token so you
 * can use it with `scrapeProfile`, `scrapeProfileById`, etc. immediately.
 *
 * @param {object} [options] - Forwarded to harvestSession()
 * @returns {Promise<import('./client.js').TwitterHttpClient>}
 *
 * @example
 * import { createClientFromSession } from './playwright-session.js';
 * import { scrapeProfile } from './profile.js';
 *
 * const client = await createClientFromSession();
 * const profile = await scrapeProfile(client, 'elonmusk');
 */
export function createClientFromSession(options?: object): Promise<import("./client.js").TwitterHttpClient>;
/** How many requests to make per session before harvesting a fresh one */
export const DEFAULT_SESSION_TTL: 80;
/**
 * Manages a pool of harvested sessions, rotating them as they exhaust their
 * request budget. Concurrent-safe: multiple parallel callers share the pool.
 *
 * @example
 * const pool = new SessionPool({ size: 2, ttl: 100 });
 * await pool.init();
 *
 * // In a parallel scraping loop:
 * const headers = await pool.getHeaders();
 * const res = await fetch(url, { headers });
 *
 * @example Single-session (default)
 * const pool = new SessionPool();
 * const headers = await pool.getHeaders(); // harvests on first call
 */
export class SessionPool {
    /**
     * @param {object} [options]
     * @param {number} [options.size=1]    - Number of concurrent sessions to maintain
     * @param {number} [options.ttl]       - Requests per session before rotation (default: DEFAULT_SESSION_TTL)
     * @param {object} [options.harvest]   - Options forwarded to harvestSession()
     */
    constructor({ size, ttl, harvest }?: {
        size?: number;
        ttl?: number;
        harvest?: object;
    });
    _size: number;
    _ttl: number;
    _harvestOpts: any;
    /** @type {Array<{ headers: Record<string, string>, uses: number }>} */
    _sessions: Array<{
        headers: Record<string, string>;
        uses: number;
    }>;
    _index: number;
    _refreshing: boolean;
    _refreshPromise: any;
    /**
     * Pre-fill the pool with `size` sessions.
     * Call this before starting your scraping loop to avoid cold-start latency.
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    /**
     * Get headers from the next available session.
     * Automatically harvests a fresh session if the current one is exhausted.
     * @returns {Promise<Record<string, string>>}
     */
    getHeaders(): Promise<Record<string, string>>;
    /**
     * Force-refresh a specific session slot.
     * @param {number} slotIndex
     * @returns {Promise<void>}
     */
    _rotate(slotIndex: number): Promise<void>;
    /**
     * Force-refresh all sessions (e.g. after an auth failure).
     * @returns {Promise<void>}
     */
    refreshAll(): Promise<void>;
}
