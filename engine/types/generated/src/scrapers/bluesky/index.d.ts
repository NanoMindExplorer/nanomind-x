/**
 * Create a Bluesky API agent
 * Uses @atproto/api if installed, otherwise falls back to fetch-based client.
 * @param {Object} options
 * @param {string} [options.service] - PDS URL (default: public API)
 * @param {string} [options.identifier] - Handle or DID for login
 * @param {string} [options.password] - App password for login
 * @returns {Object} Bluesky agent
 */
export function createAgent(options?: {
    service?: string;
    identifier?: string;
    password?: string;
}): any;
/**
 * Scrape a Bluesky profile
 * @param {Object} client - Bluesky agent from createAgent()
 * @param {string} username - Bluesky handle (e.g. user.bsky.social) or DID
 * @returns {Object} Normalized profile data
 */
export function scrapeProfile(client: any, username: string): any;
/**
 * Scrape followers for a Bluesky user
 * @param {Object} client - Bluesky agent
 * @param {string} username - Bluesky handle
 * @param {Object} options
 * @returns {Array} List of follower objects
 */
export function scrapeFollowers(client: any, username: string, options?: any): any[];
/**
 * Scrape accounts a user is following on Bluesky
 */
export function scrapeFollowing(client: any, username: any, options?: {}): Promise<{
    username: any;
    did: any;
    name: any;
    bio: any;
    avatar: any;
    platform: string;
}[]>;
/**
 * Scrape posts from a Bluesky user's feed
 */
export function scrapeTweets(client: any, username: any, options?: {}): Promise<{
    id: any;
    text: any;
    timestamp: any;
    likes: any;
    reposts: any;
    replies: any;
    url: string;
    author: any;
    media: {
        images: any;
        hasVideo: boolean;
    };
    isRepost: boolean;
    platform: string;
}[]>;
/**
 * Search Bluesky posts by query
 */
export function searchTweets(client: any, query: any, options?: {}): Promise<{
    id: any;
    text: any;
    author: any;
    timestamp: any;
    likes: any;
    reposts: any;
    url: string;
    platform: string;
}[]>;
/**
 * Get posts from a specific Bluesky feed (custom algorithm)
 */
export function scrapeFeed(client: any, feedUri: any, options?: {}): Promise<{
    id: any;
    text: any;
    author: any;
    timestamp: any;
    likes: any;
    reposts: any;
    url: string;
    platform: string;
}[]>;
declare namespace _default {
    export { createAgent };
    export { scrapeProfile };
    export { scrapeFollowers };
    export { scrapeFollowing };
    export { scrapeTweets };
    export { searchTweets };
    export { scrapeFeed };
}
export default _default;
