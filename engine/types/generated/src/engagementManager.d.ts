/**
 * Like a tweet by URL
 * @param {import('puppeteer').Page} page
 * @param {string} tweetUrl
 * @returns {Promise<Object>}
 */
export function likeTweet(page: import("puppeteer").Page, tweetUrl: string): Promise<any>;
/**
 * Unlike a tweet by URL
 * @param {import('puppeteer').Page} page
 * @param {string} tweetUrl
 * @returns {Promise<Object>}
 */
export function unlikeTweet(page: import("puppeteer").Page, tweetUrl: string): Promise<any>;
/**
 * Reply to a tweet
 * @param {import('puppeteer').Page} page
 * @param {string} tweetUrl
 * @param {string} replyText
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export function replyToTweet(page: import("puppeteer").Page, tweetUrl: string, replyText: string, options?: any): Promise<any>;
/**
 * Bookmark a tweet
 * @param {import('puppeteer').Page} page
 * @param {string} tweetUrl
 * @returns {Promise<Object>}
 */
export function bookmarkTweet(page: import("puppeteer").Page, tweetUrl: string): Promise<any>;
/**
 * Remove a bookmark
 * @param {import('puppeteer').Page} page
 * @param {string} tweetUrl
 * @returns {Promise<Object>}
 */
export function unbookmarkTweet(page: import("puppeteer").Page, tweetUrl: string): Promise<any>;
/**
 * Hide a reply on your post
 * @param {import('puppeteer').Page} page
 * @param {string} replyUrl
 * @returns {Promise<Object>}
 */
export function hideReply(page: import("puppeteer").Page, replyUrl: string): Promise<any>;
/**
 * Auto-like posts in a feed based on keywords
 * @param {import('puppeteer').Page} page
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export function autoLikeByKeyword(page: import("puppeteer").Page, options?: any): Promise<any>;
/**
 * Get engagement analytics for a post
 * @param {import('puppeteer').Page} page
 * @param {string} tweetUrl
 * @returns {Promise<Object>}
 */
export function getEngagementAnalytics(page: import("puppeteer").Page, tweetUrl: string): Promise<any>;
declare namespace _default {
    export { likeTweet };
    export { unlikeTweet };
    export { replyToTweet };
    export { bookmarkTweet };
    export { unbookmarkTweet };
    export { hideReply };
    export { autoLikeByKeyword };
    export { getEngagementAnalytics };
    export { SELECTORS };
}
export default _default;
declare namespace SELECTORS {
    export let like: string;
    export let unlike: string;
    export let reply: string;
    export let retweet: string;
    export let bookmark: string;
    export let removeBookmark: string;
    export let share: string;
    export let tweet: string;
    export let tweetText: string;
    export let replyInput: string;
    export let replySubmit: string;
    let hideReply_1: string;
    export { hideReply_1 as hideReply };
    export let caret: string;
    export let replyRestriction: string;
    export let analyticsLink: string;
    export let impressionCount: string;
}
