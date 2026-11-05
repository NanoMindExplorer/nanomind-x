/**
 * Manages authentication tokens for Twitter API requests.
 * Handles guest token lifecycle (activation, expiry, rotation) and
 * provides properly formatted HTTP headers for both guest and authenticated modes.
 */
export class TokenManager {
    /**
     * @param {Function} [fetchFn] - Custom fetch implementation (defaults to globalThis.fetch)
     */
    constructor(fetchFn?: Function);
    /** @type {string} The public Twitter bearer token */
    bearerToken: string;
    /** @type {string|null} Current guest token */
    guestToken: string | null;
    /** @type {number|null} Timestamp when guest token expires */
    guestTokenExpiresAt: number | null;
    /** @type {string|null} CSRF token for authenticated requests (from ct0 cookie) */
    csrfToken: string | null;
    /**
     * Browser User-Agent sent on every request. X answers a UA-less request
     * to activate.json with a misleading HTTP 404, so this is required, not
     * cosmetic. Pinned for the lifetime of the manager so a single session
     * presents a consistent fingerprint.
     * @type {string}
     */
    userAgent: string;
    /** @private */
    private _fetchFn;
    /**
     * Activate a new guest token from Twitter's activation endpoint.
     * POST https://api.x.com/1.1/guest/activate.json
     *
     * Guest tokens are rate-limited. If you get a 429, this method waits
     * and retries once before throwing.
     *
     * @returns {Promise<string>} The activated guest token
     * @throws {Error} If activation fails or is rate-limited
     */
    activateGuestToken(): Promise<string>;
    /**
     * Get a valid guest token, activating a new one if the current token
     * is missing or expired.
     *
     * @returns {Promise<string>} A valid guest token
     */
    getGuestToken(): Promise<string>;
    /**
     * Build the HTTP headers that Twitter expects for API requests.
     *
     * @param {boolean} [authenticated=false] - Whether this is an authenticated request
     * @returns {Object} Headers object ready for fetch()
     */
    getHeaders(authenticated?: boolean): any;
    /**
     * Set the CSRF token (extracted from the ct0 cookie after login).
     *
     * @param {string|null} token - CSRF token value, or null to clear
     */
    setCsrfToken(token: string | null): void;
    /**
     * Check if the current guest token exists and hasn't expired.
     *
     * @returns {boolean}
     */
    isGuestTokenValid(): boolean;
    /**
     * Invalidate the current guest token, forcing re-activation on next request.
     */
    invalidateGuestToken(): void;
}
