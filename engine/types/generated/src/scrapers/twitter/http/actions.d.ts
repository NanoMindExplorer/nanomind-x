/**
 * Post a tweet via the CreateTweet GraphQL mutation.
 *
 * @param {import('./client.js').TwitterHttpClient} client — authenticated client
 * @param {string} text — tweet body
 * @param {object} [options]
 * @param {string} [options.replyTo] — tweet ID to reply to
 * @param {string[]} [options.mediaIds] — uploaded media IDs to attach
 * @param {string} [options.quoteTweetId] — tweet ID to quote
 * @param {boolean} [options.sensitive=false] — mark media as sensitive
 * @param {boolean} [options.premium=false] — allow >280 chars
 * @param {string[]} [options.excludeReplyUserIds] — user IDs to exclude from reply thread
 * @returns {Promise<object>} the created tweet object
 */
export function postTweet(client: import("./client.js").TwitterHttpClient, text: string, options?: {
    replyTo?: string;
    mediaIds?: string[];
    quoteTweetId?: string;
    sensitive?: boolean;
    premium?: boolean;
    excludeReplyUserIds?: string[];
}): Promise<object>;
/**
 * Post a thread (multiple tweets chained as self-replies).
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {Array<{ text: string, mediaIds?: string[] }>} tweets
 * @param {object} [options]
 * @param {boolean} [options.premium=false]
 * @returns {Promise<object[]>} array of created tweet objects
 */
export function postThread(client: import("./client.js").TwitterHttpClient, tweets: Array<{
    text: string;
    mediaIds?: string[];
}>, options?: {
    premium?: boolean;
}): Promise<object[]>;
/**
 * Delete a tweet via the DeleteTweet GraphQL mutation.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId
 * @returns {Promise<{ success: boolean }>}
 */
export function deleteTweet(client: import("./client.js").TwitterHttpClient, tweetId: string): Promise<{
    success: boolean;
}>;
/**
 * Reply to a tweet. Convenience wrapper around postTweet.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId — tweet to reply to
 * @param {string} text — reply body
 * @param {object} [options]
 * @param {string[]} [options.mediaIds]
 * @param {string[]} [options.excludeReplyUserIds]
 * @param {boolean} [options.premium]
 * @returns {Promise<object>}
 */
export function replyToTweet(client: import("./client.js").TwitterHttpClient, tweetId: string, text: string, options?: {
    mediaIds?: string[];
    excludeReplyUserIds?: string[];
    premium?: boolean;
}): Promise<object>;
/**
 * Quote-tweet another tweet. Convenience wrapper around postTweet.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId — tweet to quote
 * @param {string} text — commentary
 * @param {object} [options]
 * @param {string[]} [options.mediaIds]
 * @param {boolean} [options.premium]
 * @returns {Promise<object>}
 */
export function quoteTweet(client: import("./client.js").TwitterHttpClient, tweetId: string, text: string, options?: {
    mediaIds?: string[];
    premium?: boolean;
}): Promise<object>;
/**
 * Schedule a tweet for future publication via CreateScheduledTweet.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} text
 * @param {Date|number} scheduledAt — Date object or Unix epoch in seconds
 * @param {object} [options]
 * @param {string[]} [options.mediaIds]
 * @param {boolean} [options.premium]
 * @returns {Promise<{ scheduledTweetId: string }>}
 */
export function schedulePost(client: import("./client.js").TwitterHttpClient, text: string, scheduledAt: Date | number, options?: {
    mediaIds?: string[];
    premium?: boolean;
}): Promise<{
    scheduledTweetId: string;
}>;
