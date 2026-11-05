/**
 * Scrape tweets from a user's timeline via the `UserTweets` GraphQL
 * endpoint.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} username — Screen name (without `@`).
 * @param {object} [options]
 * @param {number} [options.limit=100]
 * @param {boolean} [options.includeReplies=false]
 * @param {string|null} [options.cursor=null] — Resume pagination from cursor.
 * @param {function} [options.onProgress] — `({ fetched, limit }) => void`
 * @returns {Promise<object[]>} Array of parsed tweet objects.
 */
export function scrapeTweets(client: import("./client.js").TwitterHttpClient, username: string, options?: {
    limit?: number;
    includeReplies?: boolean;
    cursor?: string | null;
    onProgress?: Function;
}): Promise<object[]>;
/**
 * Scrape tweets and replies from a user's timeline via the
 * `UserTweetsAndReplies` GraphQL endpoint.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} username
 * @param {object} [options]
 * @param {number} [options.limit=100]
 * @param {string|null} [options.cursor=null]
 * @param {function} [options.onProgress]
 * @returns {Promise<object[]>}
 */
export function scrapeTweetsAndReplies(client: import("./client.js").TwitterHttpClient, username: string, options?: {
    limit?: number;
    cursor?: string | null;
    onProgress?: Function;
}): Promise<object[]>;
/**
 * Fetch a single tweet by its ID via `TweetResultByRestId`.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId
 * @returns {Promise<object>} Parsed tweet object.
 * @throws {NotFoundError} If the tweet doesn't exist.
 */
export function scrapeTweetById(client: import("./client.js").TwitterHttpClient, tweetId: string): Promise<object>;
/**
 * Reconstruct a conversation thread from a single tweet.
 *
 * Uses the `TweetDetail` endpoint which returns the conversation context:
 * parent tweets above, the focal tweet, and replies below.
 *
 * Filters to only include tweets from the same author (self-thread) unless
 * `options.allAuthors` is true.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId — Any tweet in the thread.
 * @param {object} [options]
 * @param {boolean} [options.allAuthors=false]
 * @returns {Promise<{ rootTweet: object, tweets: object[], totalReplies: number }>}
 */
export function scrapeThread(client: import("./client.js").TwitterHttpClient, tweetId: string, options?: {
    allAuthors?: boolean;
}): Promise<{
    rootTweet: object;
    tweets: object[];
    totalReplies: number;
}>;
export { parseTweetData, parseTimelineInstructions, userTimelineInstructions } from "./parse/tweet.js";
