/**
 * Send a query to Grok AI
 * @param {import('puppeteer').Page} page
 * @param {string} query - The question/prompt for Grok
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export function queryGrok(page: import("puppeteer").Page, query: string, options?: any): Promise<any>;
/**
 * Generate an image with Grok AI (Premium+ required)
 * @param {import('puppeteer').Page} page
 * @param {string} prompt - Image generation prompt
 * @returns {Promise<Object>}
 */
export function generateImage(page: import("puppeteer").Page, prompt: string): Promise<any>;
/**
 * Summarize a topic or thread using Grok
 * @param {import('puppeteer').Page} page
 * @param {string} topic - Topic or thread URL to summarize
 * @returns {Promise<Object>}
 */
export function summarize(page: import("puppeteer").Page, topic: string): Promise<any>;
/**
 * Analyze a post's potential performance
 * @param {import('puppeteer').Page} page
 * @param {string} postText - The post text to analyze
 * @returns {Promise<Object>}
 */
export function analyzePost(page: import("puppeteer").Page, postText: string): Promise<any>;
declare namespace _default {
    export { queryGrok };
    export { generateImage };
    export { summarize };
    export { analyzePost };
    export { SELECTORS };
}
export default _default;
declare namespace SELECTORS {
    let grokNav: string;
    let chatInput: string;
    let sendButton: string;
    let responseArea: string;
    let newChat: string;
    let imageGen: string;
    let chatHistory: string;
    let responseText: string;
}
