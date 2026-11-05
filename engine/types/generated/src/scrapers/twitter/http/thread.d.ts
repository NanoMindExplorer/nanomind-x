/**
 * Parse a single conversation module from the TweetDetail response.
 *
 * Twitter groups replies into `TimelineTimelineModule` entries keyed
 * by `conversationthread-{id}`. Each module contains an `items` array
 * of `TimelineTimelineItem` entries, each holding either a tweet or a
 * "Show more" cursor.
 *
 * @param {object} module — A module entry from the TweetDetail response.
 * @returns {{ tweets: object[], cursors: object[] }}
 */
export function parseConversationModule(module: object): {
    tweets: object[];
    cursors: object[];
};
/**
 * Reconstruct a thread from a flat array of parsed tweets.
 *
 * Produces an ordered flat array and separates author self-replies.
 * Handles self-threads, branching conversations, and missing (deleted)
 * tweets by inspecting each tweet's `inReplyTo` field.
 *
 * @param {object[]} tweets — Flat array of parsed tweets (with `inReplyTo`).
 * @returns {{
 *   rootTweet: object|null,
 *   authorReplies: object[],
 *   conversation: object[],
 *   tree: Map<string|null, object[]>,
 * }}
 */
export function reconstructThread(tweets: object[]): {
    rootTweet: object | null;
    authorReplies: object[];
    conversation: object[];
    tree: Map<string | null, object[]>;
};
/**
 * Scrape a conversation thread starting from any tweet in the chain.
 *
 * Uses the `TweetDetail` GraphQL endpoint which returns the conversation
 * context: parent tweets above, the focal tweet, and replies below.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId — Any tweet in the thread.
 * @param {object} [options]
 * @param {string} [options.cursor] — Resume pagination cursor.
 * @returns {Promise<{
 *   rootTweet: object,
 *   authorReplies: object[],
 *   conversation: object[],
 *   totalReplies: number,
 *   hasMore: boolean,
 *   cursor: string|null,
 * }>}
 */
export function scrapeThread(client: import("./client.js").TwitterHttpClient, tweetId: string, options?: {
    cursor?: string;
}): Promise<{
    rootTweet: object;
    authorReplies: object[];
    conversation: object[];
    totalReplies: number;
    hasMore: boolean;
    cursor: string | null;
}>;
/**
 * Walk up the reply chain to find the root tweet, then scrape the full
 * thread from root to all leaves.
 *
 * Uses `in_reply_to_status_id_str` to traverse parent tweets one by one,
 * then calls `scrapeThread()` on the discovered root.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId — Any tweet in the thread.
 * @param {object} [options]
 * @param {number} [options.maxDepth=50] — Max parent traversals to prevent loops.
 * @returns {Promise<{
 *   rootTweet: object,
 *   authorReplies: object[],
 *   conversation: object[],
 *   totalReplies: number,
 *   hasMore: boolean,
 *   cursor: string|null,
 * }>}
 */
export function scrapeFullThread(client: import("./client.js").TwitterHttpClient, tweetId: string, options?: {
    maxDepth?: number;
}): Promise<{
    rootTweet: object;
    authorReplies: object[];
    conversation: object[];
    totalReplies: number;
    hasMore: boolean;
    cursor: string | null;
}>;
/**
 * Get all replies to a specific tweet (not just the author's).
 * Paginates through "Show more replies" cursors.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId — The tweet to get replies for.
 * @param {object} [options]
 * @param {number} [options.limit=200]
 * @param {'relevance'|'recency'} [options.sortBy='relevance']
 * @param {function} [options.onProgress] — `({ fetched, limit }) => void`
 * @returns {Promise<{
 *   rootTweet: object,
 *   authorReplies: object[],
 *   conversation: object[],
 *   totalReplies: number,
 *   hasMore: boolean,
 *   cursor: string|null,
 * }>}
 */
export function scrapeConversation(client: import("./client.js").TwitterHttpClient, tweetId: string, options?: {
    limit?: number;
    sortBy?: "relevance" | "recency";
    onProgress?: Function;
}): Promise<{
    rootTweet: object;
    authorReplies: object[];
    conversation: object[];
    totalReplies: number;
    hasMore: boolean;
    cursor: string | null;
}>;
