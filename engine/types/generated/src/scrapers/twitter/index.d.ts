/**
 * Create a browser instance with stealth settings.
 *
 * Supports adapter mode:
 *   const browser = await createBrowser({ adapter: 'playwright' });
 *   const browser = await createBrowser({ adapter: 'puppeteer' });
 *   const browser = await createBrowser(); // Legacy Puppeteer
 *
 * @param {Object} [options]
 * @param {string} [options.adapter] - Framework adapter: 'puppeteer', 'playwright', 'cheerio'
 * @param {boolean} [options.headless] - Run headless (default: true)
 * @returns {Promise<Object>} Browser instance
 */
export function createBrowser(options?: {
    adapter?: string;
    headless?: boolean;
}): Promise<any>;
/**
 * Create a page with realistic settings.
 * Works with both native Puppeteer browsers and adapter browsers.
 *
 * @param {Object} browser - Browser instance (native or adapter)
 * @param {Object} [options]
 * @returns {Promise<Object>} Page instance
 */
export function createPage(browser: any, options?: any): Promise<any>;
/**
 * Login with session cookie.
 * Works with both native Puppeteer pages and adapter pages.
 */
export function loginWithCookie(page: any, authToken: any): Promise<any>;
/**
 * Scrape profile information for a user
 */
export function scrapeProfile(page: any, username: any): Promise<any>;
/**
 * Scrape followers for a user
 */
export function scrapeFollowers(page: any, username: any, options?: {}): Promise<any[]>;
/**
 * Scrape accounts a user is following
 */
export function scrapeFollowing(page: any, username: any, options?: {}): Promise<any[]>;
/**
 * Scrape tweets from a user's profile
 */
export function scrapeTweets(page: any, username: any, options?: {}): Promise<any[]>;
/**
 * Search tweets by query
 */
export function searchTweets(page: any, query: any, options?: {}): Promise<any[]>;
/**
 * Scrape a full tweet thread
 */
export function scrapeThread(page: any, tweetUrl: any): Promise<any>;
/**
 * Scrape users who liked a tweet
 */
export function scrapeLikes(page: any, tweetUrl: any, options?: {}): Promise<any[]>;
/**
 * Scrape tweets for a hashtag
 */
export function scrapeHashtag(page: any, hashtag: any, options?: {}): Promise<any[]>;
/**
 * Scrape media (images/videos) from a user
 */
export function scrapeMedia(page: any, username: any, options?: {}): Promise<any[]>;
/**
 * Scrape members of a Twitter list
 */
export function scrapeListMembers(page: any, listUrl: any, options?: {}): Promise<any[]>;
/**
 * Scrape bookmarked tweets (requires login)
 */
export function scrapeBookmarks(page: any, options?: {}): Promise<any[]>;
/**
 * Scrape recent notifications (requires login)
 */
export function scrapeNotifications(page: any, options?: {}): Promise<any[]>;
/**
 * Scrape trending topics from the Explore page
 */
export function scrapeTrending(page: any, options?: {}): Promise<any>;
/**
 * Scrape members of an X Community
 */
export function scrapeCommunityMembers(page: any, communityUrl: any, options?: {}): Promise<any[]>;
/**
 * Scrape X Spaces from search results
 */
export function scrapeSpaces(page: any, query: any, options?: {}): Promise<any[]>;
/**
 * Export data to JSON file
 */
export function exportToJSON(data: any, filename: any): Promise<any>;
/**
 * Export data to CSV file
 */
export function exportToCSV(data: any, filename: any): Promise<any>;
declare namespace _default {
    export { createBrowser };
    export { createPage };
    export { loginWithCookie };
    export { scrapeProfile };
    export { scrapeFollowers };
    export { scrapeFollowing };
    export { scrapeTweets };
    export { searchTweets };
    export { scrapeThread };
    export { scrapeLikes };
    export { scrapeHashtag };
    export { scrapeMedia };
    export { scrapeListMembers };
    export { scrapeBookmarks };
    export { scrapeNotifications };
    export { scrapeTrending };
    export { scrapeCommunityMembers };
    export { scrapeSpaces };
    export { exportToJSON };
    export { exportToCSV };
}
export default _default;
