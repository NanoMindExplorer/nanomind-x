/**
 * Register the command.
 *
 * @param {import('commander').Command} program
 * @param {object} deps
 * @param {() => Promise<import('../../client/index.js').Scraper>} deps.createHttpScraper
 * @param {() => Promise<object>} deps.loadConfig
 */
export function registerReputationCommand(program: import("commander").Command, { createHttpScraper, loadConfig }: {
    createHttpScraper: () => Promise<import("../../client/index.js").Scraper>;
    loadConfig: () => Promise<object>;
}): void;
