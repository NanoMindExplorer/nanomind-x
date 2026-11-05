/**
 * Send a direct message
 * @param {import('puppeteer').Page} page
 * @param {string} username - Recipient username
 * @param {string} message - Message text
 * @returns {Promise<Object>}
 */
export function sendDM(page: import("puppeteer").Page, username: string, message: string): Promise<any>;
/**
 * Get DM conversations list
 * @param {import('puppeteer').Page} page
 * @param {Object} options
 * @returns {Promise<Array>}
 */
export function getConversations(page: import("puppeteer").Page, options?: any): Promise<any[]>;
/**
 * Export messages from a conversation
 * @param {import('puppeteer').Page} page
 * @param {string} conversationUrl - URL of the DM conversation
 * @param {Object} options
 * @returns {Promise<Object>}
 */
export function exportConversation(page: import("puppeteer").Page, conversationUrl: string, options?: any): Promise<any>;
/**
 * Get message requests
 * @param {import('puppeteer').Page} page
 * @returns {Promise<Array>}
 */
export function getMessageRequests(page: import("puppeteer").Page): Promise<any[]>;
/**
 * Update DM privacy settings
 * @param {import('puppeteer').Page} page
 * @param {Object} settings
 * @returns {Promise<Object>}
 */
export function updateDMSettings(page: import("puppeteer").Page, settings?: any): Promise<any>;
declare namespace _default {
    export { sendDM };
    export { getConversations };
    export { exportConversation };
    export { getMessageRequests };
    export { updateDMSettings };
    export { SELECTORS };
}
export default _default;
declare namespace SELECTORS {
    let messagesTab: string;
    let conversation: string;
    let messageInput: string;
    let sendButton: string;
    let newDmButton: string;
    let searchPeople: string;
    let messageEntry: string;
    let reactionButton: string;
    let requestsTab: string;
    let acceptRequest: string;
    let deleteRequest: string;
}
