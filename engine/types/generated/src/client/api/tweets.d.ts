/**
 * Get a single tweet by ID.
 *
 * @param {Object} http - HTTP client with get/post methods
 * @param {string} tweetId - Numeric tweet ID
 * @returns {Promise<Tweet>}
 * @throws {NotFoundError}
 */
export function getTweet(http: any, tweetId: string): Promise<Tweet>;
/**
 * Get tweets from a user's timeline.
 *
 * @param {Object} http
 * @param {string} userId - Numeric user ID
 * @param {number} [count=40] - Maximum tweets to yield
 * @yields {Tweet}
 */
export function getTweets(http: any, userId: string, count?: number): AsyncGenerator<Tweet, void, unknown>;
/**
 * Get tweets and replies from a user's timeline.
 *
 * @param {Object} http
 * @param {string} userId
 * @param {number} [count=40]
 * @yields {Tweet}
 */
export function getTweetsAndReplies(http: any, userId: string, count?: number): AsyncGenerator<Tweet, void, unknown>;
/**
 * Get a user's liked tweets.
 *
 * @param {Object} http
 * @param {string} userId
 * @param {number} [count=40]
 * @yields {Tweet}
 */
export function getLikedTweets(http: any, userId: string, count?: number): AsyncGenerator<Tweet, void, unknown>;
/**
 * Get the latest tweet from a user.
 *
 * @param {Object} http
 * @param {string} userId
 * @returns {Promise<Tweet|null>}
 */
export function getLatestTweet(http: any, userId: string): Promise<Tweet | null>;
/**
 * Post a new tweet.
 *
 * @param {Object} http
 * @param {string} text - Tweet text
 * @param {Object} [options={}]
 * @param {string[]} [options.mediaIds] - Media entity IDs to attach
 * @param {string} [options.replyTo] - Tweet ID to reply to
 * @returns {Promise<Tweet>}
 */
export function sendTweet(http: any, text: string, options?: {
    mediaIds?: string[];
    replyTo?: string;
}): Promise<Tweet>;
/**
 * Post a quote tweet.
 *
 * @param {Object} http
 * @param {string} text
 * @param {string} quotedTweetId
 * @param {string[]} [mediaIds=[]]
 * @returns {Promise<Tweet>}
 */
export function sendQuoteTweet(http: any, text: string, quotedTweetId: string, mediaIds?: string[]): Promise<Tweet>;
/**
 * Delete a tweet.
 *
 * @param {Object} http
 * @param {string} tweetId
 * @returns {Promise<void>}
 */
export function deleteTweet(http: any, tweetId: string): Promise<void>;
/**
 * Like a tweet.
 *
 * @param {Object} http
 * @param {string} tweetId
 * @returns {Promise<void>}
 */
export function likeTweet(http: any, tweetId: string): Promise<void>;
/**
 * Unlike a tweet.
 *
 * @param {Object} http
 * @param {string} tweetId
 * @returns {Promise<void>}
 */
export function unlikeTweet(http: any, tweetId: string): Promise<void>;
/**
 * Retweet a tweet.
 *
 * @param {Object} http
 * @param {string} tweetId
 * @returns {Promise<void>}
 */
export function retweet(http: any, tweetId: string): Promise<void>;
/**
 * Unretweet (undo retweet).
 *
 * @param {Object} http
 * @param {string} tweetId
 * @returns {Promise<void>}
 */
export function unretweet(http: any, tweetId: string): Promise<void>;
import { Tweet } from '../models/Tweet.js';
