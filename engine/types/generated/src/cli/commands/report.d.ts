/**
 * Register the command.
 *
 * @param {import('commander').Command} program
 * @param {object} deps
 * @param {() => Promise<import('../../client/index.js').Scraper>} deps.createHttpScraper
 * @param {(data: object[], options: object, defaultName: string) => Promise<void>} deps.smartOutput
 */
export function registerReportCommand(program: import("commander").Command, { createHttpScraper, smartOutput }: {
    createHttpScraper: () => Promise<import("../../client/index.js").Scraper>;
    smartOutput: (data: object[], options: object, defaultName: string) => Promise<void>;
}): void;
/**
 * Collect a profile and a timeline sample for one account.
 * @param {import('../../client/index.js').Scraper} scraper
 * @param {string} username
 * @param {number} limit
 * @returns {Promise<object>} A report
 */
export function reportFor(scraper: import("../../client/index.js").Scraper, username: string, limit: number): Promise<object>;
/**
 * Print one report to the terminal.
 * @param {object} report
 */
export function printReport(report: object): void;
/**
 * Print a side-by-side table when several accounts were requested.
 * @param {object[]} reports
 */
export function printComparison(reports: object[]): void;
import { WEEKDAYS } from '../../analysis/accountReport.js';
export { WEEKDAYS };
