/**
 * Parse a semicolon-delimited cookie string (as copied from browser DevTools)
 * into an object mapping cookie names to values.
 *
 * Handles formats:
 *   "auth_token=abc; ct0=def; twid=u%3D123"
 *   "auth_token=abc;ct0=def"          (no space)
 *
 * @param {string} cookieString
 * @returns {Record<string, string>}
 */
export function parseCookieString(cookieString: string): Record<string, string>;
/**
 * Authentication-specific error.
 * Thrown for expired sessions, invalid cookies, login failures, etc.
 */
export class AuthError extends Error {
    /**
     * @param {string} message
     * @param {object} [details]
     * @param {number} [details.status] — HTTP status code
     * @param {string} [details.subtask] — Login subtask that failed
     * @param {object} [details.response] — Raw API response
     */
    constructor(message: string, details?: {
        status?: number;
        subtask?: string;
        response?: object;
    });
    status: number;
    subtask: string;
    response: any;
}
export class TwitterAuth {
    /**
     * @param {object} [options]
     * @param {string}  [options.encryptionKey] — AES-256 key for encrypting persisted cookies
     * @param {typeof globalThis.fetch} [options.fetch] — Custom fetch (for testing / proxies)
     * @param {string}  [options.userAgent] — Fixed user-agent (default: random rotation)
     */
    constructor(options?: {
        encryptionKey?: string;
        fetch?: typeof globalThis.fetch;
        userAgent?: string;
    });
    /**
     * Acquire an anonymous guest token from Twitter.
     * Caches the token and auto-refreshes when expired.
     *
     * @returns {Promise<{ guestToken: string, expiresAt: number }>}
     */
    getGuestToken(): Promise<{
        guestToken: string;
        expiresAt: number;
    }>;
    /**
     * Set up an authenticated session from a browser cookie string.
     *
     * @param {string} cookieString — e.g. "auth_token=xxx; ct0=yyy; twid=u%3D123"
     * @returns {Promise<{ id: string, username: string, name: string }>}
     * @throws {AuthError} if cookies are invalid or session is expired
     */
    loginWithCookies(cookieString: string): Promise<{
        id: string;
        username: string;
        name: string;
    }>;
    /**
     * Full username/password login flow using Twitter's multi-step onboarding API.
     *
     * Implements the subtask chain:
     *   1. LoginJsInstrumentationSubtask (init)
     *   2. LoginEnterUserIdentifierSSO (username)
     *   3. LoginEnterPassword (password)
     *   4. LoginAcid (email verification if needed)
     *   5. AccountDuplicationCheck
     *   6. LoginTwoFactorAuthChallenge (2FA if enabled)
     *
     * @param {string} username
     * @param {string} password
     * @param {string} [email] — Required if Twitter prompts for email verification
     * @returns {Promise<{ id: string, username: string, name: string }>}
     * @throws {AuthError}
     */
    loginWithCredentials(username: string, password: string, email?: string): Promise<{
        id: string;
        username: string;
        name: string;
    }>;
    /**
     * Validate the current authenticated session.
     *
     * @returns {Promise<{ valid: boolean, user: { id: string, username: string, name: string } | null, reason: string, status?: number }>}
     */
    validateSession(): Promise<{
        valid: boolean;
        user: {
            id: string;
            username: string;
            name: string;
        } | null;
        reason: string;
        status?: number;
    }>;
    /**
     * Refresh an expired session.
     * - If credentials are stored, re-login.
     * - If cookie-only, throw AuthError (user must re-import cookies).
     *
     * @returns {Promise<{ id: string, username: string, name: string }>}
     * @throws {AuthError}
     */
    refreshSession(): Promise<{
        id: string;
        username: string;
        name: string;
    }>;
    /**
     * Save the current cookies to a JSON file on disk.
     * Format is compatible with the-convocation/twitter-scraper cookie files.
     *
     * If an encryption key was provided at construction, sensitive cookie values
     * (auth_token, ct0, kdt) are encrypted with AES-256-GCM.
     *
     * @param {string} filePath
     */
    saveCookies(filePath: string): Promise<void>;
    /**
     * Load cookies from a JSON file and validate the session.
     * Returns false if the file doesn't exist or the session is expired.
     *
     * @param {string} filePath
     * @returns {Promise<boolean>} true if session is active
     */
    loadCookies(filePath: string): Promise<boolean>;
    /**
     * Build the full set of request headers for Twitter API calls.
     *
     * @param {boolean} [authenticated=false] — If true, include auth cookies.
     *   If false, include guest token headers.
     * @returns {Record<string, string>}
     */
    getHeaders(authenticated?: boolean): Record<string, string>;
    /** Check if we have an authenticated session (auth_token present). */
    isAuthenticated(): boolean;
    /** Get the CSRF token from cookies. */
    getCsrfToken(): string;
    /** Get the current user info (null if not logged in). */
    getUser(): {
        id: string;
        username: string;
        name: string;
    };
    /** Get the current cookies as a header string. */
    getCookieString(): string;
    /** Get a copy of the cookies object. */
    getCookies(): {
        [x: string]: string;
    };
    /**
     * Directly set cookies from an object (for internal / testing use).
     * @param {Record<string, string>} cookies
     */
    setCookies(cookies: Record<string, string>): void;
    #private;
}
export default TwitterAuth;
