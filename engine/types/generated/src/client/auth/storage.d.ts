/**
 * Get the default cookie file path.
 *
 * @returns {Promise<string>} ~/.nanomind-x/cookies.json
 */
export function getDefaultCookiePath(): Promise<string>;
/**
 * Save cookies into ~/.nanomind-x/config.json under a sessions key.
 *
 * @param {CookieAuth} cookieAuth - The cookie auth instance to save
 * @param {string} username - The Twitter username to save under
 * @returns {Promise<void>}
 */
export function saveCookiesToConfig(cookieAuth: CookieAuth, username: string): Promise<void>;
/**
 * Load cookies from ~/.nanomind-x/config.json for a specific username.
 *
 * @param {string} username - The Twitter username
 * @returns {Promise<CookieAuth>} CookieAuth instance with loaded cookies
 */
export function loadCookiesFromConfig(username: string): Promise<CookieAuth>;
/**
 * List all saved sessions with metadata.
 *
 * @returns {Promise<Array<{ username: string, createdAt: string, lastUsed: string, isValid: boolean }>>}
 */
export function listSessions(): Promise<Array<{
    username: string;
    createdAt: string;
    lastUsed: string;
    isValid: boolean;
}>>;
/**
 * Delete a saved session.
 *
 * @param {string} username - The Twitter username to remove
 * @returns {Promise<boolean>} True if the session existed and was removed
 */
export function deleteSession(username: string): Promise<boolean>;
/**
 * Get the active (most recently used) session.
 *
 * @returns {Promise<{ username: string, cookieAuth: CookieAuth }|null>}
 */
export function getActiveSession(): Promise<{
    username: string;
    cookieAuth: CookieAuth;
} | null>;
import { CookieAuth } from './CookieAuth.js';
