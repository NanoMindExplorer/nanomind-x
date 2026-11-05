/**
 * Search mode enum for Twitter search.
 */
export type SearchMode = string;
/**
 * Search mode enum for Twitter search.
 * @enum {string}
 */
export const SearchMode: Readonly<{
    Top: "Top";
    Latest: "Latest";
    Photos: "Photos";
    Videos: "Videos";
}>;
/**
 * Scraper — the main entry point for programmatic Twitter/X access.
 *
 * @example
 * ```js
 * import { Scraper } from 'nanomind-x/client';
 *
 * const scraper = new Scraper();
 * await scraper.loadCookies('./cookies.json');
 *
 * const profile = await scraper.getProfile('nichxbt');
 * console.log(profile.followersCount);
 *
 * for await (const tweet of scraper.getTweets('nichxbt', 10)) {
 *   console.log(tweet.text);
 * }
 * ```
 */
export class Scraper {
    /**
     * Create a new Scraper instance.
     *
     * @param {Object} [options={}]
     * @param {string|Array} [options.cookies] - Cookie string or array
     * @param {string} [options.proxy] - Proxy URL
     * @param {Function} [options.fetch] - Custom fetch function
     * @param {Function} [options.transform] - Request transform function
     */
    constructor(options?: {
        cookies?: string | any[];
        proxy?: string;
        fetch?: Function;
        transform?: Function;
    });
    /** @private */
    private _auth;
    /** @private */
    private _http;
    /** @private */
    private _isLoggedIn;
    /** @private */
    private _userIdCache;
    /** @private */
    private _options;
    /**
     * Log in to Twitter with credentials.
     *
     * @param {Object} credentials
     * @param {string} credentials.username
     * @param {string} credentials.password
     * @param {string} [credentials.email]
     * @returns {Promise<void>}
     */
    login(credentials: {
        username: string;
        password: string;
        email?: string;
    }): Promise<void>;
    /**
     * Log out and clear cookies.
     *
     * @returns {Promise<void>}
     */
    logout(): Promise<void>;
    /**
     * Check if the scraper is authenticated.
     *
     * @returns {Promise<boolean>}
     */
    isLoggedIn(): Promise<boolean>;
    /**
     * Get current cookies as an array.
     *
     * @returns {Promise<Array<{name: string, value: string}>>}
     */
    getCookies(): Promise<Array<{
        name: string;
        value: string;
    }>>;
    /**
     * Set cookies for authenticated requests.
     *
     * @param {string|Array<{name: string, value: string}>} cookies
     * @returns {Promise<void>}
     */
    setCookies(cookies: string | Array<{
        name: string;
        value: string;
    }>): Promise<void>;
    /**
     * Save cookies to a JSON file.
     *
     * @param {string} filePath - Path to save cookies
     * @returns {Promise<void>}
     */
    saveCookies(filePath: string): Promise<void>;
    /**
     * Load cookies from a JSON file.
     *
     * @param {string} filePath - Path to cookie file
     * @returns {Promise<void>}
     */
    loadCookies(filePath: string): Promise<void>;
    /**
     * Get a user profile by username.
     *
     * @param {string} username - Twitter handle (with or without @)
     * @returns {Promise<import('./models/Profile.js').Profile>}
     */
    getProfile(username: string): Promise<import("./models/Profile.js").Profile>;
    /**
     * Get current authenticated user profile.
     *
     * @returns {Promise<import('./models/Profile.js').Profile>}
     */
    me(): Promise<import("./models/Profile.js").Profile>;
    /**
     * Get followers of a user.
     *
     * @param {string} userId - Twitter user ID
     * @param {number} [count=100] - Maximum number of followers to return
     * @returns {AsyncGenerator<import('./models/Profile.js').Profile>}
     */
    getFollowers(userId: string, count?: number): AsyncGenerator<import("./models/Profile.js").Profile>;
    /**
     * Get users that a user is following.
     *
     * @param {string} userId - Twitter user ID
     * @param {number} [count=100] - Maximum number of following to return
     * @returns {AsyncGenerator<import('./models/Profile.js').Profile>}
     */
    getFollowing(userId: string, count?: number): AsyncGenerator<import("./models/Profile.js").Profile>;
    /**
     * Follow a user.
     *
     * @param {string} username - Twitter handle
     * @returns {Promise<void>}
     */
    followUser(username: string): Promise<void>;
    /**
     * Unfollow a user.
     *
     * @param {string} username - Twitter handle
     * @returns {Promise<void>}
     */
    unfollowUser(username: string): Promise<void>;
    /**
     * Get a single tweet by ID.
     *
     * @param {string} id - Tweet ID
     * @returns {Promise<import('./models/Tweet.js').Tweet>}
     */
    getTweet(id: string): Promise<import("./models/Tweet.js").Tweet>;
    /**
     * Get tweets from a user's timeline.
     *
     * @param {string} username - Twitter handle
     * @param {number} [count=100] - Maximum number of tweets
     * @returns {AsyncGenerator<import('./models/Tweet.js').Tweet>}
     */
    getTweets(username: string, count?: number): AsyncGenerator<import("./models/Tweet.js").Tweet>;
    /**
     * Get tweets and replies from a user's timeline.
     *
     * @param {string} username - Twitter handle
     * @param {number} [count=100] - Maximum number of tweets + replies
     * @returns {AsyncGenerator<import('./models/Tweet.js').Tweet>}
     */
    getTweetsAndReplies(username: string, count?: number): AsyncGenerator<import("./models/Tweet.js").Tweet>;
    /**
     * Get tweets a user has liked.
     *
     * @param {string} username - Twitter handle
     * @param {number} [count=100] - Maximum number of liked tweets
     * @returns {AsyncGenerator<import('./models/Tweet.js').Tweet>}
     */
    getLikedTweets(username: string, count?: number): AsyncGenerator<import("./models/Tweet.js").Tweet>;
    /**
     * Get the latest tweet from a user.
     *
     * @param {string} username - Twitter handle
     * @returns {Promise<import('./models/Tweet.js').Tweet|null>}
     */
    getLatestTweet(username: string): Promise<import("./models/Tweet.js").Tweet | null>;
    /**
     * Send a tweet.
     *
     * @param {string} text - Tweet text
     * @param {Object} [options={}]
     * @param {string[]} [options.mediaIds] - Media entity IDs to attach
     * @param {string} [options.replyTo] - Tweet ID to reply to
     * @returns {Promise<import('./models/Tweet.js').Tweet>}
     */
    sendTweet(text: string, options?: {
        mediaIds?: string[];
        replyTo?: string;
    }): Promise<import("./models/Tweet.js").Tweet>;
    /**
     * Send a quote tweet.
     *
     * @param {string} text - Tweet text
     * @param {string} quotedTweetId - ID of tweet to quote
     * @param {string[]} [mediaIds] - Media entity IDs to attach
     * @returns {Promise<import('./models/Tweet.js').Tweet>}
     */
    sendQuoteTweet(text: string, quotedTweetId: string, mediaIds?: string[]): Promise<import("./models/Tweet.js").Tweet>;
    /**
     * Delete a tweet.
     *
     * @param {string} id - Tweet ID
     * @returns {Promise<void>}
     */
    deleteTweet(id: string): Promise<void>;
    /**
     * Like a tweet.
     *
     * @param {string} id - Tweet ID
     * @returns {Promise<void>}
     */
    likeTweet(id: string): Promise<void>;
    /**
     * Unlike a tweet.
     *
     * @param {string} id - Tweet ID
     * @returns {Promise<void>}
     */
    unlikeTweet(id: string): Promise<void>;
    /**
     * Retweet a tweet.
     *
     * @param {string} id - Tweet ID
     * @returns {Promise<void>}
     */
    retweet(id: string): Promise<void>;
    /**
     * Unretweet a tweet.
     *
     * @param {string} id - Tweet ID
     * @returns {Promise<void>}
     */
    unretweet(id: string): Promise<void>;
    /**
     * Search tweets.
     *
     * @param {string} query - Search query (supports advanced operators)
     * @param {number} [count=100] - Maximum number of results
     * @param {string} [mode='Latest'] - SearchMode: 'Top', 'Latest', 'Photos', 'Videos'
     * @returns {AsyncGenerator<import('./models/Tweet.js').Tweet>}
     */
    searchTweets(query: string, count?: number, mode?: string): AsyncGenerator<import("./models/Tweet.js").Tweet>;
    /**
     * Search profiles.
     *
     * @param {string} query - Search query
     * @param {number} [count=100] - Maximum number of results
     * @returns {AsyncGenerator<import('./models/Profile.js').Profile>}
     */
    searchProfiles(query: string, count?: number): AsyncGenerator<import("./models/Profile.js").Profile>;
    /**
     * Get trending topics.
     *
     * @param {string} [category='trending'] - Category: 'trending', 'for_you', 'news', 'sports', 'entertainment'
     * @returns {Promise<Array<{name: string, tweetCount: string, url: string, context: string}>>}
     */
    getTrends(category?: string): Promise<Array<{
        name: string;
        tweetCount: string;
        url: string;
        context: string;
    }>>;
    /**
     * Get available explore tabs.
     *
     * @returns {Promise<Array<{id: string, label: string}>>}
     */
    getExploreTabs(): Promise<Array<{
        id: string;
        label: string;
    }>>;
    /**
     * Get tweets from a list.
     *
     * @param {string} listId - Twitter list ID
     * @param {number} [count=100] - Maximum number of tweets
     * @returns {AsyncGenerator<import('./models/Tweet.js').Tweet>}
     */
    getListTweets(listId: string, count?: number): AsyncGenerator<import("./models/Tweet.js").Tweet>;
    /**
     * Get members of a list.
     *
     * @param {string} listId - Twitter list ID
     * @param {number} [count=100] - Maximum number of members
     * @returns {AsyncGenerator<import('./models/Profile.js').Profile>}
     */
    getListMembers(listId: string, count?: number): AsyncGenerator<import("./models/Profile.js").Profile>;
    /**
     * Get list details by ID.
     *
     * @param {string} listId - Twitter list ID
     * @returns {Promise<{id: string, name: string, description: string, memberCount: number, subscriberCount: number, createdAt: string}|null>}
     */
    getListById(listId: string): Promise<{
        id: string;
        name: string;
        description: string;
        memberCount: number;
        subscriberCount: number;
        createdAt: string;
    } | null>;
    /**
     * Send a DM to a conversation.
     *
     * @param {string} conversationId - DM conversation ID
     * @param {string} text - Message text
     * @returns {Promise<{id: string, text: string, createdAt: string}>}
     */
    sendDm(conversationId: string, text: string): Promise<{
        id: string;
        text: string;
        createdAt: string;
    }>;
    /**
     * Send a DM to a user by ID (creates conversation if needed).
     *
     * @param {string} userId - Target user ID
     * @param {string} text - Message text
     * @returns {Promise<{id: string, text: string, createdAt: string}>}
     */
    sendDmToUser(userId: string, text: string): Promise<{
        id: string;
        text: string;
        createdAt: string;
    }>;
    /**
     * Get DM conversations.
     *
     * @param {number} [count=50] - Maximum conversations to return
     * @returns {AsyncGenerator<{id: string, type: string, participants: string[], lastMessage: string, updatedAt: string}>}
     */
    getDmConversations(count?: number): AsyncGenerator<{
        id: string;
        type: string;
        participants: string[];
        lastMessage: string;
        updatedAt: string;
    }>;
    /**
     * Get messages in a DM conversation.
     *
     * @param {string} conversationId - Conversation ID
     * @param {number} [count=50] - Maximum messages to return
     * @returns {AsyncGenerator<import('./models/Message.js').Message>}
     */
    getDmMessages(conversationId: string, count?: number): AsyncGenerator<import("./models/Message.js").Message>;
    /**
     * Ensure the scraper is authenticated.
     * @private
     * @throws {AuthenticationError}
     */
    private _requireAuth;
    /**
     * Resolve a username to a user ID, with caching.
     * @private
     * @param {string} username - Cleaned username
     * @returns {Promise<string>}
     */
    private _resolveUserId;
}
