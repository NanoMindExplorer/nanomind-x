/**
 * Load an optional package asynchronously.
 *
 * @param {string} name - Package specifier, e.g. 'puppeteer-extra'.
 * @param {OptionalDepOptions} [options]
 * @returns {Promise<any>} The module namespace, with a CJS default unwrapped.
 * @throws {MissingOptionalDependencyError} When the package is not installed.
 */
export function importOptional(name: string, options?: OptionalDepOptions): Promise<any>;
/**
 * Load an optional CommonJS package synchronously.
 *
 * Only for call sites that cannot be async (class constructors, sync factory
 * functions). ESM-only packages must use {@link importOptional}.
 *
 * @param {string} name - Package specifier, e.g. 'better-sqlite3'.
 * @param {OptionalDepOptions} [options]
 * @returns {any} The module's export, with a CJS default unwrapped.
 * @throws {MissingOptionalDependencyError} When the package is not installed.
 */
export function requireOptional(name: string, options?: OptionalDepOptions): any;
/**
 * Report whether an optional package can be resolved, without loading it.
 *
 * Lets callers branch on capability (the CLI prints which extras are present)
 * instead of catching an error to find out.
 *
 * @param {string} name
 * @returns {boolean}
 */
export function hasOptional(name: string): boolean;
/**
 * Thrown when an optional extra is requested but absent. Carries the package
 * name and install command as fields so a UI can render them itself.
 */
export class MissingOptionalDependencyError extends Error {
    /**
     * @param {string} name
     * @param {OptionalDepOptions} [options]
     */
    constructor(name: string, options?: OptionalDepOptions);
    code: string;
    /** @type {string} */
    dependency: string;
    /** @type {string} */
    installCommand: string;
    /** @type {string|undefined} */
    feature: string | undefined;
}
export type OptionalDepOptions = {
    /**
     * - Human name of the feature that needs the package.
     */
    feature?: string;
    /**
     * - Full install argument list, when one package is not enough.
     */
    install?: string;
    /**
     * - A path that works without installing anything.
     */
    alternative?: string;
};
