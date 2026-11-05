/**
 * Convert array of objects to CSV string
 */
export function toCSV(data: any): string;
/**
 * Convert tweets array to readable Markdown
 */
export function tweetsToMarkdown(tweets: any, username: any): string;
/**
 * Convert followers/following to Markdown
 */
export function usersToMarkdown(users: any, title: any): string;
/**
 * Convert profile to Markdown
 */
export function profileToMarkdown(profile: any): string;
/**
 * Convert bookmarks to Markdown
 */
export function bookmarksToMarkdown(bookmarks: any): string;
/**
 * Full account export
 *
 * @param {object} options
 * @param {object} options.page - Puppeteer page (already authenticated)
 * @param {string} options.username - Twitter username (without @)
 * @param {string[]} [options.formats=['json','csv','md']] - Output formats
 * @param {string[]} [options.only] - Subset of phases to export (default: all)
 * @param {number} [options.limit=Infinity] - Max items per phase
 * @param {string} [options.outputDir] - Custom output directory
 * @param {function} [options.onProgress] - Callback: ({phase, completed, total, currentItem})
 * @param {object} options.scrapers - Scraper module (import from src/scrapers/index.js)
 * @returns {object} Export summary
 */
export function exportAccount(options: {
    page: object;
    username: string;
}): object;
export default exportAccount;
