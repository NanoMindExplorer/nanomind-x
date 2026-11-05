/**
 * Get current settings overview
 * @param {import('puppeteer').Page} page
 * @returns {Promise<Object>}
 */
export function getSettings(page: import("puppeteer").Page): Promise<any>;
/**
 * Toggle protected/private account
 * @param {import('puppeteer').Page} page
 * @param {boolean} protect - true to protect, false to unprotect
 * @returns {Promise<Object>}
 */
export function toggleProtectedAccount(page: import("puppeteer").Page, protect: boolean): Promise<any>;
/**
 * Get blocked accounts list
 * @param {import('puppeteer').Page} page
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export function getBlockedAccounts(page: import("puppeteer").Page, options?: any): Promise<any>;
/**
 * Get muted accounts list
 * @param {import('puppeteer').Page} page
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export function getMutedAccounts(page: import("puppeteer").Page, options?: any): Promise<any>;
/**
 * Request data download/archive
 * @param {import('puppeteer').Page} page
 * @returns {Promise<Object>}
 */
export function requestDataDownload(page: import("puppeteer").Page): Promise<any>;
/**
 * Set content preferences (reduce political content, etc.)
 * @param {import('puppeteer').Page} page
 * @param {Object} preferences
 * @returns {Promise<Object>}
 */
export function setContentPreferences(page: import("puppeteer").Page, preferences?: any): Promise<any>;
declare namespace _default {
    export { getSettings };
    export { toggleProtectedAccount };
    export { getBlockedAccounts };
    export { getMutedAccounts };
    export { requestDataDownload };
    export { setContentPreferences };
    export { SELECTORS };
}
export default _default;
declare namespace SELECTORS {
    let settingsNav: string;
    let accountTab: string;
    let privacyTab: string;
    let notificationsTab: string;
    let settingsSwitch: string;
    let protectedToggle: string;
    let dataDownload: string;
    let deactivate: string;
    let twoFASettings: string;
    let blockedAccounts: string;
    let mutedAccounts: string;
    let mutedKeywords: string;
    let contentPrefs: string;
    let displaySettings: string;
    let saveButton: string;
}
