/**
 * Get live Spaces
 * @param {import('puppeteer').Page} page
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export function getLiveSpaces(page: import("puppeteer").Page, options?: any): Promise<any>;
/**
 * Get scheduled Spaces
 * @param {import('puppeteer').Page} page
 * @param {string} username
 * @returns {Promise<Object>}
 */
export function getScheduledSpaces(page: import("puppeteer").Page, username: string): Promise<any>;
/**
 * Scrape Space metadata
 * @param {import('puppeteer').Page} page
 * @param {string} spaceUrl
 * @returns {Promise<Object>}
 */
export function scrapeSpace(page: import("puppeteer").Page, spaceUrl: string): Promise<any>;
/**
 * Create an event
 * @param {import('puppeteer').Page} page
 * @param {Object} event - { title, description, date, time, location? }
 * @returns {Promise<Object>}
 */
export function createEvent(page: import("puppeteer").Page, event: any): Promise<any>;
declare namespace _default {
    export { getLiveSpaces };
    export { getScheduledSpaces };
    export { scrapeSpace };
    export { createEvent };
    export { SELECTORS };
}
export default _default;
declare namespace SELECTORS {
    let spacesNav: string;
    let startSpace: string;
    let joinSpace: string;
    let spaceSpeakers: string;
    let spaceListeners: string;
    let spaceRecording: string;
    let scheduleSpace: string;
    let spaceTopic: string;
    let spaceTitle: string;
}
