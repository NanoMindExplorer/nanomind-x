/**
 * Get a platform module by name
 * @param {string} platform - Platform name
 * @returns {Object} Platform module
 */
export function getPlatform(platform: string): any;
/**
 * Unified scrape function — dispatches to the correct platform module
 *
 * @param {string} platform - Platform name: 'twitter', 'bluesky', 'mastodon', 'threads'
 * @param {string} action - Action name: 'profile', 'followers', 'following', 'tweets', 'search', 'hashtag', 'trending'
 * @param {Object} options - Action-specific options
 * @param {string} [options.username] - Target username
 * @param {string} [options.query] - Search query (for 'search' action)
 * @param {string} [options.hashtag] - Hashtag (for 'hashtag' action)
 * @param {number} [options.limit] - Max results
 * @param {string} [options.instance] - Mastodon instance URL
 * @param {Object} [options.page] - Puppeteer page (for Twitter/Threads)
 * @param {Object} [options.client] - API client (for Bluesky/Mastodon)
 * @returns {Promise<Object|Array>} Scraped data
 *
 * @example
 *   // Twitter
 *   const profile = await scrape('twitter', 'profile', { page, username: 'elonmusk' });
 *
 *   // Bluesky (no Puppeteer needed)
 *   const profile = await scrape('bluesky', 'profile', { username: 'user.bsky.social' });
 *
 *   // Mastodon (no Puppeteer needed)
 *   const profile = await scrape('mastodon', 'profile', { username: 'user', instance: 'https://mastodon.social' });
 *
 *   // Threads (Puppeteer)
 *   const posts = await scrape('threads', 'tweets', { page, username: 'zuck', limit: 20 });
 */
export function scrape(platform: string, action: string, options?: {
    username?: string;
    query?: string;
    hashtag?: string;
    limit?: number;
    instance?: string;
    page?: any;
    client?: any;
}): Promise<any | any[]>;
/**
 * Get a plugin-contributed scraper by name.
 * Plugins register scrapers via the plugin system — this provides a unified lookup.
 * @param {string} name - Scraper name
 * @returns {Promise<Function|undefined>} The scraper handler, or undefined
 */
export function getPluginScraper(name: string): Promise<Function | undefined>;
export { createHttpScraper } from "./twitter/http/index.js";
export const createBrowser: typeof import("./twitter/index.js").createBrowser;
export const createPage: typeof import("./twitter/index.js").createPage;
export const loginWithCookie: typeof import("./twitter/index.js").loginWithCookie;
export const scrapeProfile: typeof import("./twitter/index.js").scrapeProfile;
export const scrapeFollowers: typeof import("./twitter/index.js").scrapeFollowers;
export const scrapeFollowing: typeof import("./twitter/index.js").scrapeFollowing;
export const scrapeTweets: typeof import("./twitter/index.js").scrapeTweets;
export const searchTweets: typeof import("./twitter/index.js").searchTweets;
export const scrapeThread: typeof import("./twitter/index.js").scrapeThread;
export const scrapeLikes: typeof import("./twitter/index.js").scrapeLikes;
export const scrapeHashtag: typeof import("./twitter/index.js").scrapeHashtag;
export const scrapeMedia: typeof import("./twitter/index.js").scrapeMedia;
export const scrapeListMembers: typeof import("./twitter/index.js").scrapeListMembers;
export const scrapeBookmarks: typeof import("./twitter/index.js").scrapeBookmarks;
export const scrapeNotifications: typeof import("./twitter/index.js").scrapeNotifications;
export const scrapeTrending: typeof import("./twitter/index.js").scrapeTrending;
export const scrapeCommunityMembers: typeof import("./twitter/index.js").scrapeCommunityMembers;
export const scrapeSpaces: typeof import("./twitter/index.js").scrapeSpaces;
export const exportToJSON: typeof import("./twitter/index.js").exportToJSON;
export const exportToCSV: typeof import("./twitter/index.js").exportToCSV;
export namespace platforms {
    export { twitter };
    export { twitter as x };
    export { bluesky };
    export { bluesky as bsky };
    export { mastodon };
    export { mastodon as masto };
    export { threads };
}
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
    export { scrape };
    export { platforms };
    export { getPlatform };
    export { twitter };
    export { bluesky };
    export { mastodon };
    export { threads };
    export { getPluginScraper };
    export { getAdapter };
    export { getAvailableAdapter };
    export { setDefaultAdapter };
    export { getDefaultAdapterName };
    export { registerAdapter };
    export { listAdapters };
    export { getAdapterInfo };
    export { checkAvailability };
    export { BaseAdapter };
}
export default _default;
import twitter from './twitter/index.js';
import bluesky from './bluesky/index.js';
import mastodon from './mastodon/index.js';
import threads from './threads/index.js';
import { getAdapter } from './adapters/index.js';
import { getAvailableAdapter } from './adapters/index.js';
import { setDefaultAdapter } from './adapters/index.js';
import { getDefaultAdapterName } from './adapters/index.js';
import { registerAdapter } from './adapters/index.js';
import { listAdapters } from './adapters/index.js';
import { getAdapterInfo } from './adapters/index.js';
import { checkAvailability } from './adapters/index.js';
import { BaseAdapter } from './adapters/index.js';
export { getAdapter, getAvailableAdapter, setDefaultAdapter, getDefaultAdapterName, registerAdapter, listAdapters, getAdapterInfo, checkAvailability, BaseAdapter };
