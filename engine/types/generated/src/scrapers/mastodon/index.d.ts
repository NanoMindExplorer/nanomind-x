/**
 * Create a Mastodon API client
 * @param {Object} options
 * @param {string} [options.instance] - Instance URL (default: mastodon.social)
 * @param {string} [options.accessToken] - OAuth access token for auth-protected endpoints
 * @returns {Object} Mastodon client
 */
export function createClient(options?: {
    instance?: string;
    accessToken?: string;
}): any;
/**
 * Scrape a Mastodon profile
 * @param {Object} client - Mastodon client from createClient()
 * @param {string} username - Mastodon handle (e.g. user or user@instance.social)
 * @returns {Object} Normalized profile data
 */
export function scrapeProfile(client: any, username: string): any;
/**
 * Scrape followers for a Mastodon user
 */
export function scrapeFollowers(client: any, username: any, options?: {}): Promise<{
    username: any;
    id: any;
    name: any;
    bio: string;
    avatar: any;
    url: any;
    bot: any;
    platform: string;
}[]>;
/**
 * Scrape accounts a Mastodon user is following
 */
export function scrapeFollowing(client: any, username: any, options?: {}): Promise<{
    username: any;
    id: any;
    name: any;
    bio: string;
    avatar: any;
    url: any;
    bot: any;
    platform: string;
}[]>;
/**
 * Scrape posts from a Mastodon user (equivalent of scrapeTweets)
 */
export function scrapeTweets(client: any, username: any, options?: {}): Promise<{
    id: any;
    text: string;
    timestamp: any;
    likes: any;
    reposts: any;
    replies: any;
    url: any;
    author: any;
    media: {
        images: any;
        hasVideo: any;
    };
    isRepost: boolean;
    sensitive: any;
    visibility: any;
    platform: string;
    instance: any;
}[]>;
/**
 * Search Mastodon posts by query
 */
export function searchTweets(client: any, query: any, options?: {}): Promise<any>;
/**
 * Scrape posts from a hashtag timeline
 */
export function scrapeHashtag(client: any, hashtag: any, options?: {}): Promise<{
    id: any;
    text: string;
    timestamp: any;
    likes: any;
    reposts: any;
    replies: any;
    url: any;
    author: any;
    media: {
        images: any;
        hasVideo: any;
    };
    isRepost: boolean;
    sensitive: any;
    visibility: any;
    platform: string;
    instance: any;
}[]>;
/**
 * Scrape trending topics from a Mastodon instance
 */
export function scrapeTrending(client: any, options?: {}): Promise<any>;
declare namespace _default {
    export { createClient };
    export { scrapeProfile };
    export { scrapeFollowers };
    export { scrapeFollowing };
    export { scrapeTweets };
    export { searchTweets };
    export { scrapeHashtag };
    export { scrapeTrending };
}
export default _default;
