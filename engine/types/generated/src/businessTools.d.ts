/**
 * Monitor brand mentions
 * @param {import('puppeteer').Page} page
 * @param {string} brandName - Brand name or @handle to monitor
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export function monitorBrandMentions(page: import("puppeteer").Page, brandName: string, options?: any): Promise<any>;
/**
 * Get audience insights for an account
 * @param {import('puppeteer').Page} page
 * @param {string} username
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export function getAudienceInsights(page: import("puppeteer").Page, username: string, options?: any): Promise<any>;
/**
 * Competitor analysis
 * @param {import('puppeteer').Page} page
 * @param {Array<string>} competitors - Array of usernames to compare
 * @returns {Promise<Object>}
 */
export function analyzeCompetitors(page: import("puppeteer").Page, competitors: Array<string>): Promise<any>;
declare namespace _default {
    export { monitorBrandMentions };
    export { getAudienceInsights };
    export { analyzeCompetitors };
    export { SELECTORS };
}
export default _default;
declare namespace SELECTORS {
    let tweet: string;
    let tweetText: string;
    let userCell: string;
    let searchInput: string;
}
