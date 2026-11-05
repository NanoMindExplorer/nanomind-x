/**
 * Scrape recent notifications
 * @param {import('puppeteer').Page} page
 * @param {Object} options
 * @returns {Promise<Array>}
 */
export function getNotifications(page: import("puppeteer").Page, options?: any): Promise<any[]>;
/**
 * Mute a user
 * @param {import('puppeteer').Page} page
 * @param {string} username
 * @returns {Promise<Object>}
 */
export function muteUser(page: import("puppeteer").Page, username: string): Promise<any>;
/**
 * Unmute a user
 * @param {import('puppeteer').Page} page
 * @param {string} username
 * @returns {Promise<Object>}
 */
export function unmuteUser(page: import("puppeteer").Page, username: string): Promise<any>;
/**
 * Mute a word/phrase
 * @param {import('puppeteer').Page} page
 * @param {string} word
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export function muteWord(page: import("puppeteer").Page, word: string, options?: any): Promise<any>;
/**
 * Get notification settings
 * @param {import('puppeteer').Page} page
 * @returns {Promise<Object>}
 */
export function getNotificationSettings(page: import("puppeteer").Page): Promise<any>;
declare namespace _default {
    export { getNotifications };
    export { muteUser };
    export { unmuteUser };
    export { muteWord };
    export { getNotificationSettings };
    export { SELECTORS };
}
export default _default;
declare namespace SELECTORS {
    let notificationTab: string;
    let mentionsTab: string;
    let notification: string;
    let settingsGear: string;
    let toggleSwitch: string;
    let notificationText: string;
    let userCell: string;
    let muteOption: string;
}
