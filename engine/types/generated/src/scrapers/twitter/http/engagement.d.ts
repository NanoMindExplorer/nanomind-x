/**
 * Like a tweet.
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId
 * @returns {Promise<{ success: boolean }>}
 */
export function likeTweet(client: import("./client.js").TwitterHttpClient, tweetId: string): Promise<{
    success: boolean;
}>;
/**
 * Unlike a tweet.
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId
 * @returns {Promise<{ success: boolean }>}
 */
export function unlikeTweet(client: import("./client.js").TwitterHttpClient, tweetId: string): Promise<{
    success: boolean;
}>;
/**
 * Retweet a tweet.
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId
 * @returns {Promise<{ success: boolean }>}
 */
export function retweet(client: import("./client.js").TwitterHttpClient, tweetId: string): Promise<{
    success: boolean;
}>;
/**
 * Undo a retweet.
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId
 * @returns {Promise<{ success: boolean }>}
 */
export function unretweet(client: import("./client.js").TwitterHttpClient, tweetId: string): Promise<{
    success: boolean;
}>;
/**
 * Follow a user by user ID.
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} userId
 * @returns {Promise<{ success: boolean }>}
 */
export function followUser(client: import("./client.js").TwitterHttpClient, userId: string): Promise<{
    success: boolean;
}>;
/**
 * Unfollow a user by user ID.
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} userId
 * @returns {Promise<{ success: boolean }>}
 */
export function unfollowUser(client: import("./client.js").TwitterHttpClient, userId: string): Promise<{
    success: boolean;
}>;
/**
 * Follow a user by username. Resolves the username to a user ID first
 * via the UserByScreenName GraphQL query, then calls followUser.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} username - Screen name without `@`
 * @returns {Promise<{ success: boolean }>}
 */
export function followByUsername(client: import("./client.js").TwitterHttpClient, username: string): Promise<{
    success: boolean;
}>;
/**
 * Block a user.
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} userId
 * @returns {Promise<{ success: boolean }>}
 */
export function blockUser(client: import("./client.js").TwitterHttpClient, userId: string): Promise<{
    success: boolean;
}>;
/**
 * Unblock a user.
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} userId
 * @returns {Promise<{ success: boolean }>}
 */
export function unblockUser(client: import("./client.js").TwitterHttpClient, userId: string): Promise<{
    success: boolean;
}>;
/**
 * Mute a user.
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} userId
 * @returns {Promise<{ success: boolean }>}
 */
export function muteUser(client: import("./client.js").TwitterHttpClient, userId: string): Promise<{
    success: boolean;
}>;
/**
 * Unmute a user.
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} userId
 * @returns {Promise<{ success: boolean }>}
 */
export function unmuteUser(client: import("./client.js").TwitterHttpClient, userId: string): Promise<{
    success: boolean;
}>;
/**
 * Bookmark a tweet.
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId
 * @returns {Promise<{ success: boolean }>}
 */
export function bookmarkTweet(client: import("./client.js").TwitterHttpClient, tweetId: string): Promise<{
    success: boolean;
}>;
/**
 * Remove a bookmark.
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId
 * @returns {Promise<{ success: boolean }>}
 */
export function unbookmarkTweet(client: import("./client.js").TwitterHttpClient, tweetId: string): Promise<{
    success: boolean;
}>;
/**
 * Pin a tweet to profile.
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId
 * @returns {Promise<{ success: boolean }>}
 */
export function pinTweet(client: import("./client.js").TwitterHttpClient, tweetId: string): Promise<{
    success: boolean;
}>;
/**
 * Unpin a tweet from profile.
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId
 * @returns {Promise<{ success: boolean }>}
 */
export function unpinTweet(client: import("./client.js").TwitterHttpClient, tweetId: string): Promise<{
    success: boolean;
}>;
/**
 * Bulk unfollow users — nanomind-x' core use case.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string[]} userIds
 * @param {object} [options]
 * @param {number} [options.delayMs=2000]
 * @param {function} [options.onProgress]
 * @param {boolean} [options.dryRun=false]
 * @returns {Promise<{ unfollowed: number, failed: Array<{ userId: string, error: string }> }>}
 */
export function bulkUnfollow(client: import("./client.js").TwitterHttpClient, userIds: string[], options?: {
    delayMs?: number;
    onProgress?: Function;
    dryRun?: boolean;
}): Promise<{
    unfollowed: number;
    failed: Array<{
        userId: string;
        error: string;
    }>;
}>;
/**
 * Bulk like tweets.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string[]} tweetIds
 * @param {object} [options]
 * @param {number} [options.delayMs=1000]
 * @param {function} [options.onProgress]
 * @param {boolean} [options.dryRun=false]
 * @returns {Promise<{ liked: number, failed: Array<{ tweetId: string, error: string }> }>}
 */
export function bulkLike(client: import("./client.js").TwitterHttpClient, tweetIds: string[], options?: {
    delayMs?: number;
    onProgress?: Function;
    dryRun?: boolean;
}): Promise<{
    liked: number;
    failed: Array<{
        tweetId: string;
        error: string;
    }>;
}>;
/**
 * Bulk block users.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string[]} userIds
 * @param {object} [options]
 * @param {number} [options.delayMs=1000]
 * @param {function} [options.onProgress]
 * @param {boolean} [options.dryRun=false]
 * @returns {Promise<{ blocked: number, failed: Array<{ userId: string, error: string }> }>}
 */
export function bulkBlock(client: import("./client.js").TwitterHttpClient, userIds: string[], options?: {
    delayMs?: number;
    onProgress?: Function;
    dryRun?: boolean;
}): Promise<{
    blocked: number;
    failed: Array<{
        userId: string;
        error: string;
    }>;
}>;
