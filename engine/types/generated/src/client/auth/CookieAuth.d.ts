/**
 * Cookie-based authentication manager.
 * Loads cookies from file or array, validates them, and provides auth headers.
 */
export class CookieAuth {
    /**
     * @param {import('./TokenManager.js').TokenManager} tokenManager
     */
    constructor(tokenManager: import("./TokenManager.js").TokenManager);
    /** @private */
    private _tokenManager;
    /** @type {CookieJar} */
    jar: CookieJar;
    /** @private */
    private _authenticated;
    /**
     * Check if the auth state is valid (has both ct0 and auth_token).
     *
     * @returns {boolean}
     */
    isAuthenticated(): boolean;
    /**
     * Get the authenticated user's ID from the twid cookie.
     *
     * @returns {string|null}
     */
    getAuthenticatedUserId(): string | null;
    /**
     * Set cookies from an array of {name, value} objects or a cookie string.
     *
     * @param {Array<{name: string, value: string}>|string} cookies
     */
    setCookies(cookies: Array<{
        name: string;
        value: string;
    }> | string): void;
    /**
     * Get cookies as a flat array of {name, value} for the SimpleHttpClient.
     *
     * @returns {Array<{name: string, value: string}>}
     */
    getCookies(): Array<{
        name: string;
        value: string;
    }>;
    /**
     * Get the Cookie header string for HTTP requests.
     *
     * @returns {string}
     */
    getCookieString(): string;
    /**
     * Save cookies to a JSON file.
     *
     * @param {string} filePath
     * @returns {Promise<void>}
     */
    saveCookies(filePath: string): Promise<void>;
    /**
     * Load cookies from a JSON file.
     *
     * @param {string} filePath
     * @returns {Promise<void>}
     */
    loadCookies(filePath: string): Promise<void>;
    /**
     * Update the jar from a fetch response's Set-Cookie headers.
     *
     * @param {Response} response
     */
    updateFromResponse(response: Response): void;
    /**
     * Clear all cookies and reset auth state.
     */
    clear(): void;
    /**
     * Sync token manager with current cookie state.
     * @private
     */
    private _syncTokens;
}
import { CookieJar } from './CookieJar.js';
