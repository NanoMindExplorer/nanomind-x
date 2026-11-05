/**
 * Publish a long-form article
 * @param {import('puppeteer').Page} page
 * @param {Object} article - { title, body, coverImage? }
 * @returns {Promise<Object>}
 */
export function publishArticle(page: import("puppeteer").Page, article: any): Promise<any>;
/**
 * Save article as draft
 * @param {import('puppeteer').Page} page
 * @param {Object} article - { title, body }
 * @returns {Promise<Object>}
 */
export function saveDraft(page: import("puppeteer").Page, article: any): Promise<any>;
/**
 * Get published articles
 * @param {import('puppeteer').Page} page
 * @param {string} username
 * @returns {Promise<Object>}
 */
export function getArticles(page: import("puppeteer").Page, username: string): Promise<any>;
/**
 * Get article analytics
 * @param {import('puppeteer').Page} page
 * @param {string} articleUrl
 * @returns {Promise<Object>}
 */
export function getArticleAnalytics(page: import("puppeteer").Page, articleUrl: string): Promise<any>;
declare namespace _default {
    export { publishArticle };
    export { saveDraft };
    export { getArticles };
    export { getArticleAnalytics };
    export { SELECTORS };
}
export default _default;
declare namespace SELECTORS {
    export let articleCompose: string;
    export let titleInput: string;
    export let bodyEditor: string;
    export let publishButton: string;
    let saveDraft_1: string;
    export { saveDraft_1 as saveDraft };
    export let coverImage: string;
    export let articleList: string;
    export let articleCard: string;
}
