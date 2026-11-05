/**
 * Parse a raw GraphQL user result into the nanomind-x user format.
 *
 * This is intentionally self-contained so relationships.js has no circular
 * dependency on profile.js. The output shape matches the Puppeteer scrapers.
 *
 * @param {object} rawUser — `user_results.result` from GraphQL response
 * @returns {object|null} Parsed user or null if unavailable
 */
export function parseUserEntry(rawUser: object): object | null;
/**
 * Parse timeline instructions that contain user entries.
 *
 * Twitter GraphQL responses for follower/following/liker lists wrap user data
 * in the same `instructions[].entries[]` structure as tweet timelines, but
 * with `user-` prefixed entry IDs.
 *
 * @param {Array} instructions — `timeline.instructions` array from GraphQL
 * @returns {{ users: object[], cursor: string|null }}
 */
export function parseUserList(instructions: any[]): {
    users: object[];
    cursor: string | null;
};
/**
 * Scrape a user's followers via GraphQL.
 *
 * Requires authentication (auth_token cookie). Guest tokens cannot access
 * follower lists.
 *
 * @param {object} client — TwitterHttpClient instance (authenticated)
 * @param {string} username — Twitter username (without @)
 * @param {object} [options]
 * @param {number} [options.limit=1000] — Maximum followers to scrape
 * @param {string} [options.cursor=null] — Resume pagination from cursor
 * @param {Function} [options.onProgress] — Progress callback `({ fetched, limit, page })`
 * @returns {Promise<object[]>} — Array of user objects in nanomind-x format
 * @throws {AuthError} if client is not authenticated
 * @throws {NotFoundError} if username doesn't exist
 *
 * @example
 * ```js
 * const followers = await scrapeFollowers(client, 'elonmusk', { limit: 100 });
 * console.log(followers[0]); // { username, name, bio, verified, avatar, ... }
 * ```
 */
export function scrapeFollowers(client: object, username: string, options?: {
    limit?: number;
    cursor?: string;
    onProgress?: Function;
}): Promise<object[]>;
/**
 * Scrape accounts a user is following via GraphQL.
 *
 * Requires authentication (auth_token cookie).
 *
 * @param {object} client — TwitterHttpClient instance (authenticated)
 * @param {string} username — Twitter username (without @)
 * @param {object} [options]
 * @param {number} [options.limit=1000] — Maximum accounts to scrape
 * @param {string} [options.cursor=null] — Resume pagination from cursor
 * @param {Function} [options.onProgress] — Progress callback `({ fetched, limit, page })`
 * @returns {Promise<object[]>} — Array of user objects in nanomind-x format
 * @throws {AuthError} if client is not authenticated
 * @throws {NotFoundError} if username doesn't exist
 */
export function scrapeFollowing(client: object, username: string, options?: {
    limit?: number;
    cursor?: string;
    onProgress?: Function;
}): Promise<object[]>;
/**
 * Detect users you follow who don't follow you back.
 *
 * This is nanomind-x' most popular feature. It scrapes both follower and following
 * lists, then performs a set comparison.
 *
 * @param {object} client — TwitterHttpClient instance (authenticated)
 * @param {string} username — Twitter username (without @)
 * @param {object} [options]
 * @param {number} [options.limit=Infinity] — Max users per list (followers & following)
 * @param {Function} [options.onProgress] — Phase-aware progress callback
 * @returns {Promise<{ nonFollowers: object[], mutuals: object[], stats: object }>}
 * @throws {AuthError} if client is not authenticated
 * @throws {NotFoundError} if username doesn't exist
 *
 * @example
 * ```js
 * const result = await scrapeNonFollowers(client, 'myusername', {
 *   onProgress: ({ phase, fetched, limit }) => {
 *     console.log(`${phase}: ${fetched}/${limit}`);
 *   },
 * });
 * console.log(`${result.stats.nonFollowers} people don't follow you back`);
 * ```
 */
export function scrapeNonFollowers(client: object, username: string, options?: {
    limit?: number;
    onProgress?: Function;
}): Promise<{
    nonFollowers: object[];
    mutuals: object[];
    stats: object;
}>;
/**
 * Scrape users who liked a specific tweet.
 *
 * Requires authentication.
 *
 * @param {object} client — TwitterHttpClient instance (authenticated)
 * @param {string} tweetId — Tweet ID
 * @param {object} [options]
 * @param {number} [options.limit=1000] — Maximum likers to scrape
 * @param {string} [options.cursor=null] — Resume pagination from cursor
 * @param {Function} [options.onProgress] — Progress callback
 * @returns {Promise<object[]>} — Array of user objects
 * @throws {AuthError} if client is not authenticated
 */
export function scrapeLikers(client: object, tweetId: string, options?: {
    limit?: number;
    cursor?: string;
    onProgress?: Function;
}): Promise<object[]>;
/**
 * Scrape users who retweeted a specific tweet.
 *
 * Requires authentication.
 *
 * @param {object} client — TwitterHttpClient instance (authenticated)
 * @param {string} tweetId — Tweet ID
 * @param {object} [options]
 * @param {number} [options.limit=1000] — Maximum retweeters to scrape
 * @param {string} [options.cursor=null] — Resume pagination from cursor
 * @param {Function} [options.onProgress] — Progress callback
 * @returns {Promise<object[]>} — Array of user objects
 * @throws {AuthError} if client is not authenticated
 */
export function scrapeRetweeters(client: object, tweetId: string, options?: {
    limit?: number;
    cursor?: string;
    onProgress?: Function;
}): Promise<object[]>;
/**
 * Scrape members of a Twitter list.
 *
 * Requires authentication.
 *
 * @param {object} client — TwitterHttpClient instance (authenticated)
 * @param {string} listId — Twitter list ID
 * @param {object} [options]
 * @param {number} [options.limit=1000] — Maximum members to scrape
 * @param {string} [options.cursor=null] — Resume pagination from cursor
 * @param {Function} [options.onProgress] — Progress callback
 * @returns {Promise<object[]>} — Array of user objects
 * @throws {AuthError} if client is not authenticated
 */
export function scrapeListMembers(client: object, listId: string, options?: {
    limit?: number;
    cursor?: string;
    onProgress?: Function;
}): Promise<object[]>;
