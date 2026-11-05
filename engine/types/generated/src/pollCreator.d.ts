/**
 * Create a poll
 * @param {import('puppeteer').Page} page
 * @param {string} question - Poll question text
 * @param {Array<string>} choices - 2-4 poll options
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export function createPoll(page: import("puppeteer").Page, question: string, choices: Array<string>, options?: any): Promise<any>;
/**
 * Get poll results from a tweet
 * @param {import('puppeteer').Page} page
 * @param {string} tweetUrl - URL of the poll tweet
 * @returns {Promise<Object>}
 */
export function getPollResults(page: import("puppeteer").Page, tweetUrl: string): Promise<any>;
declare namespace _default {
    export { createPoll };
    export { getPollResults };
    export { SELECTORS };
}
export default _default;
declare namespace SELECTORS {
    let composeButton: string;
    let tweetTextarea: string;
    let tweetButton: string;
    let addPoll: string;
    function pollOption(i: any): string;
    let addPollOption: string;
    let pollDurationDays: string;
    let pollDurationHours: string;
    let pollDurationMinutes: string;
    let removePoll: string;
    let pollResults: string;
}
