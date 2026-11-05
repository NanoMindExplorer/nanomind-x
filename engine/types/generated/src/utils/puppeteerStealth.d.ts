/**
 * Load puppeteer-extra with the stealth plugin applied.
 *
 * @param {object} [options]
 * @param {string} [options.feature] - Feature name used in the install hint.
 * @returns {Promise<any>} The stealth-enabled puppeteer-extra instance.
 * @throws {import('./optionalDeps.js').MissingOptionalDependencyError} When the extra is absent.
 */
export function getStealthPuppeteer(options?: {
    feature?: string;
}): Promise<any>;
/**
 * Load plain puppeteer, for the few call sites that need the driver itself
 * (browser pools, connect-over-CDP) rather than the stealth wrapper.
 *
 * @param {object} [options]
 * @param {string} [options.feature]
 * @returns {Promise<any>}
 */
export function getPuppeteer(options?: {
    feature?: string;
}): Promise<any>;
