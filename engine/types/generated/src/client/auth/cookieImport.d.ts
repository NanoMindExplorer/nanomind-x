/**
 * Identify which cookie export format a blob of text is.
 *
 * @param {string} text
 * @returns {'json-array'|'storage-state'|'netscape'|'header'|'unknown'}
 */
export function detectCookieFormat(text: string): "json-array" | "storage-state" | "netscape" | "header" | "unknown";
/**
 * Parse cookie text in any supported format into X/Twitter cookies.
 *
 * @param {string} text - The raw cookie export.
 * @param {object} [options]
 * @param {'json-array'|'storage-state'|'netscape'|'header'|'auto'} [options.format='auto']
 *   Force a format instead of auto-detecting.
 * @returns {Array<{name: string, value: string, domain: string, path: string, secure: boolean, httpOnly: boolean, expires: string|null}>}
 * @throws {Error} When the text is empty or no X/Twitter cookies are found.
 */
export function parseCookieInput(text: string, options?: {
    format?: "json-array" | "storage-state" | "netscape" | "header" | "auto";
}): Array<{
    name: string;
    value: string;
    domain: string;
    path: string;
    secure: boolean;
    httpOnly: boolean;
    expires: string | null;
}>;
/**
 * Read x.com cookies straight out of a locally installed browser.
 *
 * Supported without any export step:
 *   - Firefox on every platform (cookies are plaintext).
 *   - Chromium-family browsers (chrome, chromium, brave, edge, arc) on Linux
 *     when the browser uses the default keyring-less key, and on macOS via the
 *     Keychain.
 *
 * Everything else (Windows Chromium, or a Linux Chromium sealed by the system
 * keyring) throws an Error whose message names the exact `--cookies-file`
 * export path to use instead. Nothing is faked.
 *
 * @param {BrowserName} browser
 * @returns {Array<{name: string, value: string, domain: string, path: string, secure: boolean, httpOnly: boolean, expires: string|null}>}
 * @throws {Error} On an unknown browser name or an unsupported platform/browser combo.
 */
export function readBrowserCookies(browser: BrowserName): Array<{
    name: string;
    value: string;
    domain: string;
    path: string;
    secure: boolean;
    httpOnly: boolean;
    expires: string | null;
}>;
/** Browsers readBrowserCookies understands, for CLI validation and help text. */
export const SUPPORTED_BROWSERS: string[];
declare namespace _default {
    export { parseCookieInput };
    export { detectCookieFormat };
    export { readBrowserCookies };
    export { SUPPORTED_BROWSERS };
}
export default _default;
export type BrowserName = "chrome" | "chromium" | "brave" | "edge" | "arc" | "firefox";
