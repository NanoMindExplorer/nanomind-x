/**
 * Download one item, with retries and archive awareness.
 *
 * @param {object} item
 * @param {object} ctx  { outputDir, template, archive, overwrite, dryRun, retries, timeoutMs, signal, onProgress }
 * @returns {Promise<object>} the item plus `{ outcome, path, bytes, hash, reason }`
 */
export function downloadItem(item: object, ctx: object): Promise<object>;
/**
 * Run a set of items through a fixed-size worker pool.
 *
 * @param {Array<object>} items
 * @param {object} ctx  as downloadItem, plus `{ concurrency, onResult }`
 * @returns {Promise<{ results: Array<object>, summary: Record<string, number> }>}
 */
export function downloadAll(items: Array<object>, ctx?: object): Promise<{
    results: Array<object>;
    summary: Record<string, number>;
}>;
/** Statuses an item can finish in. */
export const OUTCOMES: readonly string[];
