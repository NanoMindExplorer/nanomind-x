/**
 * Post a tweet
 * @param {import('puppeteer').Page} page
 * @param {string} text - Tweet text
 * @param {Object} options
 * @returns {Promise<Object>} Post result
 */
export function postTweet(page: import("puppeteer").Page, text: string, options?: any): Promise<any>;
/**
 * Post a thread (multiple linked tweets)
 * @param {import('puppeteer').Page} page
 * @param {Array<string|Object>} tweets - Array of tweet texts or { text, media } objects
 * @returns {Promise<Object>} Thread result
 */
export function postThread(page: import("puppeteer").Page, tweets: Array<string | any>): Promise<any>;
/**
 * Create a poll
 * @param {import('puppeteer').Page} page
 * @param {string} question - Poll question
 * @param {Array<string>} choices - 2-4 poll options
 * @param {Object} options
 * @returns {Promise<Object>} Poll result
 */
export function createPoll(page: import("puppeteer").Page, question: string, choices: Array<string>, options?: any): Promise<any>;
/**
 * Schedule a post for later (Premium required)
 * @param {import('puppeteer').Page} page
 * @param {string} text - Tweet text
 * @param {Date|string} scheduledTime - When to post
 * @returns {Promise<Object>} Schedule result
 */
export function schedulePost(page: import("puppeteer").Page, text: string, scheduledTime: Date | string): Promise<any>;
/**
 * Quote a post
 * @param {import('puppeteer').Page} page
 * @param {string} postUrl - URL of the post to quote
 * @param {string} commentary - Your commentary
 * @returns {Promise<Object>}
 */
export function quotePost(page: import("puppeteer").Page, postUrl: string, commentary: string): Promise<any>;
/**
 * Repost/retweet a post
 * @param {import('puppeteer').Page} page
 * @param {string} postUrl
 * @returns {Promise<Object>}
 */
export function repost(page: import("puppeteer").Page, postUrl: string): Promise<any>;
/**
 * Delete a post
 * @param {import('puppeteer').Page} page
 * @param {string} postUrl
 * @returns {Promise<Object>}
 */
export function deletePost(page: import("puppeteer").Page, postUrl: string): Promise<any>;
declare namespace _default {
    export { postTweet };
    export { postThread };
    export { createPoll };
    export { schedulePost };
    export { quotePost };
    export { repost };
    export { deletePost };
    export { SELECTORS };
}
export default _default;
declare namespace SELECTORS {
    let composeButton: string;
    let tweetTextarea: string;
    let tweetButton: string;
    let mediaInput: string;
    let addPoll: string;
    let pollOption1: string;
    let pollOption2: string;
    let pollOption3: string;
    let pollOption4: string;
    let addPollOption: string;
    let pollDuration: string;
    let scheduleButton: string;
    let scheduleDateInput: string;
    let scheduleTimeInput: string;
    let scheduleConfirm: string;
    let addThread: string;
    let gifButton: string;
    let emojiButton: string;
    let altTextInput: string;
    let replyRestriction: string;
    let editButton: string;
    let deleteButton: string;
    let confirmDelete: string;
    let quoteTweet: string;
    let retweetButton: string;
    let retweetConfirm: string;
    let tweetArticle: string;
}
