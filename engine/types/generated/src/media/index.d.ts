/**
 * Resolve a target and download everything it names.
 *
 * @param {string} target  "@user", "@user:avatar", a tweet URL or id, "search:<query>", "community:<id>"
 * @param {object} options
 * @param {object} options.scrapers      the object createHttpScraper() returns
 * @param {string} options.outputDir     where files land
 * @param {string} [options.template]    filename template
 * @param {string|null} [options.archivePath]  JSONL archive; null disables recording
 * @param {number} [options.limit]       how many source items to walk
 * @param {string[]} [options.types]     photo | video | gif
 * @param {Date|null} [options.since]
 * @param {Date|null} [options.until]
 * @param {number} [options.concurrency]
 * @param {boolean} [options.overwrite]
 * @param {boolean} [options.dryRun]
 * @param {Function} [options.onResult]
 * @param {Function} [options.onProgress]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<{ target: object, items: Array<object>, results: Array<object>, summary: object }>}
 */
export function downloadMediaFor(target: string, options?: {
    scrapers: object;
    outputDir: string;
    template?: string;
    archivePath?: string | null;
    limit?: number;
    types?: string[];
    since?: Date | null;
    until?: Date | null;
    concurrency?: number;
    overwrite?: boolean;
    dryRun?: boolean;
    onResult?: Function;
    onProgress?: Function;
    signal?: AbortSignal;
}): Promise<{
    target: object;
    items: Array<object>;
    results: Array<object>;
    summary: object;
}>;
export { DEFAULT_ARCHIVE, hashBytes, identityKey, openArchive } from "./archive.js";
export { OUTCOMES, downloadAll, downloadItem } from "./download.js";
export { TARGET_KINDS, applyFilters, collectItems, itemsFromTweet, originalBannerUrl, originalImageUrl, parseTarget } from "./sources.js";
export { DEFAULT_TEMPLATE, TEMPLATE_KEYS, cdnBasename, extensionFor, renderTemplate, resolveWithin, templateValues } from "./template.js";
