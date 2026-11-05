/**
 * Get all bookmarks
 * @param {import('puppeteer').Page} page
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export function getBookmarks(page: import("puppeteer").Page, options?: any): Promise<any>;
/**
 * Create a bookmark folder (Premium required)
 * @param {import('puppeteer').Page} page
 * @param {string} folderName
 * @returns {Promise<Object>}
 */
export function createFolder(page: import("puppeteer").Page, folderName: string): Promise<any>;
/**
 * Clear all bookmarks
 * @param {import('puppeteer').Page} page
 * @returns {Promise<Object>}
 */
export function clearAllBookmarks(page: import("puppeteer").Page): Promise<any>;
declare namespace _default {
    export { getBookmarks };
    export { createFolder };
    export { clearAllBookmarks };
    export { SELECTORS };
}
export default _default;
declare namespace SELECTORS {
    export let bookmarksNav: string;
    export let bookmark: string;
    export let removeBookmark: string;
    export let bookmarkFolder: string;
    let createFolder_1: string;
    export { createFolder_1 as createFolder };
    export let tweet: string;
    export let tweetText: string;
    export let clearAll: string;
    export let confirmClear: string;
}
