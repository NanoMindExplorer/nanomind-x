/**
 * Create a browser instance for Threads scraping
 */
export function createBrowser(options?: {}): Promise<any>;
/**
 * Create a page with realistic settings
 */
export function createPage(browser: any): Promise<any>;
/**
 * Scrape a Threads profile
 * @param {Page} page - Puppeteer page instance
 * @param {string} username - Threads username (without @)
 * @returns {Object} Normalized profile data
 */
export function scrapeProfile(page: Page, username: string): any;
/**
 * Scrape posts from a Threads user's profile
 */
export function scrapeTweets(page: any, username: any, options?: {}): Promise<any[]>;
/**
 * Search Threads by query
 */
export function searchTweets(page: any, query: any, options?: {}): Promise<any[]>;
/**
 * Scrape followers for a Threads user
 * Note: Threads doesn't expose follower lists publicly like Twitter.
 * This returns limited data from the profile page.
 */
export function scrapeFollowers(page: any, username: any, options?: {}): Promise<{
    followers: any;
    username: any;
    note: string;
    platform: string;
}>;
/**
 * Scrape following for a Threads user
 * Note: Same limitation as followers.
 */
export function scrapeFollowing(page: any, username: any, options?: {}): Promise<{
    username: any;
    note: string;
    platform: string;
}>;
declare namespace _default {
    export { createBrowser };
    export { createPage };
    export { scrapeProfile };
    export { scrapeFollowers };
    export { scrapeFollowing };
    export { scrapeTweets };
    export { searchTweets };
}
export default _default;
