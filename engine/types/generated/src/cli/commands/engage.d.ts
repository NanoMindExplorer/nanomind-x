/**
 * Register the command.
 *
 * @param {import('commander').Command} program
 * @param {object} deps
 * @param {() => Promise<import('../../client/index.js').Scraper>} deps.createHttpScraper
 * @param {() => Promise<object>} deps.loadConfig
 * @param {string} deps.configDir
 */
export function registerEngageCommand(program: import("commander").Command, { createHttpScraper, loadConfig, configDir }: {
    createHttpScraper: () => Promise<import("../../client/index.js").Scraper>;
    loadConfig: () => Promise<object>;
    configDir: string;
}): void;
/** Provider defaults, exported so the docs check can list them. */
export const ENGAGE_DEFAULT_MODELS: {
    openrouter: string;
    openai: string;
    xai: string;
    ollama: string;
    anthropic: string;
    custom: string;
};
import { selectTweets } from '../../engage/runner.js';
import { parseTemplates } from '../../engage/runner.js';
import { pickTemplate } from '../../engage/runner.js';
import { statePath } from '../../engage/state.js';
export { selectTweets, parseTemplates, pickTemplate, statePath };
