/**
 * nanomind-x Client — Cookie Parser
 *
 * Parses Set-Cookie headers from HTTP responses and updates the CookieJar.
 * Also provides helper functions to extract critical Twitter tokens (ct0, twid, auth_token).
 *
 * Note: Node.js fetch() does NOT expose Set-Cookie headers by default for security.
 * Use response.headers.getSetCookie() (Node 18.14+) or undici which does expose them.
 *
 * @author nich (@nichxbt) - https://github.com/nirholas
 * @license Apache-2.0
 */
/**
 * Parse a single Set-Cookie header value into a Cookie object.
 *
 * @param {string} header - A single Set-Cookie header string
 * @returns {{ name: string, value: string, domain?: string, path?: string, expires?: Date|null, httpOnly?: boolean, secure?: boolean, sameSite?: string }|null}
 */
export function parseSetCookieHeader(header: string): {
    name: string;
    value: string;
    domain?: string;
    path?: string;
    expires?: Date | null;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: string;
} | null;
/**
 * Parse multiple Set-Cookie headers into an array of Cookie objects.
 *
 * @param {string[]} headers - Array of Set-Cookie header strings
 * @returns {Array<{ name: string, value: string, domain?: string, path?: string, expires?: Date|null, httpOnly?: boolean, secure?: boolean, sameSite?: string }>}
 */
export function parseSetCookieHeaders(headers: string[]): Array<{
    name: string;
    value: string;
    domain?: string;
    path?: string;
    expires?: Date | null;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: string;
}>;
/**
 * Extract Set-Cookie headers from a fetch Response and update the CookieJar.
 * Critical: call this after every Twitter API request to keep ct0 current.
 *
 * @param {import('./CookieJar.js').CookieJar} jar - The CookieJar to update
 * @param {Response} response - The fetch Response object
 */
export function updateJarFromResponse(jar: import("./CookieJar.js").CookieJar, response: Response): void;
/**
 * Extract the CSRF token (ct0 cookie value) from a CookieJar.
 *
 * @param {import('./CookieJar.js').CookieJar} jar
 * @returns {string|null}
 */
export function extractCsrfToken(jar: import("./CookieJar.js").CookieJar): string | null;
/**
 * Extract the authenticated user ID from the twid cookie.
 * twid format: "u%3D1234567890" → decodeURIComponent → "u=1234567890" → "1234567890"
 *
 * @param {import('./CookieJar.js').CookieJar} jar
 * @returns {string|null}
 */
export function extractUserId(jar: import("./CookieJar.js").CookieJar): string | null;
/**
 * Extract the auth_token cookie value from a CookieJar.
 *
 * @param {import('./CookieJar.js').CookieJar} jar
 * @returns {string|null}
 */
export function extractAuthToken(jar: import("./CookieJar.js").CookieJar): string | null;
