/**
 * Get account analytics
 * @param {import('puppeteer').Page} page
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export function getAccountAnalytics(page: import("puppeteer").Page, options?: any): Promise<any>;
/**
 * Get analytics for a specific post
 * @param {import('puppeteer').Page} page
 * @param {string} postUrl
 * @returns {Promise<Object>}
 */
export function getPostAnalytics(page: import("puppeteer").Page, postUrl: string): Promise<any>;
/**
 * Get revenue/earnings data
 * @param {import('puppeteer').Page} page
 * @returns {Promise<Object>}
 */
export function getRevenue(page: import("puppeteer").Page): Promise<any>;
/**
 * Get subscriber list
 * @param {import('puppeteer').Page} page
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export function getSubscribers(page: import("puppeteer").Page, options?: any): Promise<any>;
/**
 * Creator dashboard - combined analytics
 * @param {import('puppeteer').Page} page
 * @returns {Promise<Object>}
 */
export function getCreatorDashboard(page: import("puppeteer").Page): Promise<any>;
declare namespace _default {
    export { getAccountAnalytics };
    export { getPostAnalytics };
    export { getRevenue };
    export { getSubscribers };
    export { getCreatorDashboard };
    export { SELECTORS };
}
export default _default;
declare namespace SELECTORS {
    let analyticsNav: string;
    let impressions: string;
    let engagements: string;
    let followersChart: string;
    let revenueTab: string;
    let monetization: string;
    let subscriptionSettings: string;
    let tipsSettings: string;
    let analyticsExport: string;
}
