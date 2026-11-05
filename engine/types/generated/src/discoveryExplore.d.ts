/**
 * Search tweets with query
 * @param {import('puppeteer').Page} page
 * @param {string} query - Search query (supports operators)
 * @param {Object} options
 * @returns {Promise<Array>}
 */
export function searchTweets(page: import("puppeteer").Page, query: string, options?: any): Promise<any[]>;
/**
 * Get trending topics
 * @param {import('puppeteer').Page} page
 * @param {Object} options
 * @returns {Promise<Array>}
 */
export function getTrends(page: import("puppeteer").Page, options?: any): Promise<any[]>;
/**
 * Get explore feed content
 * @param {import('puppeteer').Page} page
 * @param {Object} options
 * @returns {Promise<Array>}
 */
export function getExploreFeed(page: import("puppeteer").Page, options?: any): Promise<any[]>;
/**
 * Follow a topic
 * @param {import('puppeteer').Page} page
 * @param {string} topicName
 * @returns {Promise<Object>}
 */
export function followTopic(page: import("puppeteer").Page, topicName: string): Promise<any>;
/**
 * Advanced search with multiple filters
 * @param {import('puppeteer').Page} page
 * @param {Object} filters
 * @returns {Promise<Array>}
 */
export function advancedSearch(page: import("puppeteer").Page, filters?: any): Promise<any[]>;
declare namespace _default {
    export { searchTweets };
    export { getTrends };
    export { getExploreFeed };
    export { followTopic };
    export { advancedSearch };
    export { SELECTORS };
}
export default _default;
declare namespace SELECTORS {
    let searchInput: string;
    let searchResults: string;
    let trendItem: string;
    let topicFollow: string;
    let exploreTabs: string;
    let tweet: string;
    let tweetText: string;
    let latestTab: string;
    let peopleTab: string;
    let mediaTab: string;
}
