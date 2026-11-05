/**
 * Create a checkpoint handle.
 *
 * @param {object} options
 * @param {string} options.key - Identifies the scrape, e.g. `followers:elonmusk`.
 *   Two runs with the same key share one checkpoint.
 * @param {string} [options.dir] - Directory for the file. Defaults to
 *   `$NANOMIND_X_HOME/checkpoints`.
 * @returns {{
 *   key: string,
 *   path: string,
 *   save: (state: { cursor: string|null, count?: number, meta?: object }) => object,
 *   resume: () => ({ cursor: string|null, count: number, updatedAt: string, meta: object }|null),
 *   clear: () => void,
 *   exists: () => boolean,
 * }}
 */
export function createCheckpoint({ key, dir }?: {
    key: string;
    dir?: string;
}): {
    key: string;
    path: string;
    save: (state: {
        cursor: string | null;
        count?: number;
        meta?: object;
    }) => object;
    resume: () => ({
        cursor: string | null;
        count: number;
        updatedAt: string;
        meta: object;
    } | null);
    clear: () => void;
    exists: () => boolean;
};
/**
 * Bind an optional checkpoint to one pagination loop.
 *
 * Every paginated scraper (`scrapeFollowers`, `scrapeTweets`, `searchTweets`,
 * ...) calls this once before its loop. With no checkpoint it is a no-op
 * pass-through; with one, it resumes the cursor, shrinks the limit by what
 * earlier runs already collected, records the cursor after each page, and
 * deletes the file when the scrape completes.
 *
 * @param {object|null|undefined} checkpoint - Handle from `createCheckpoint`.
 * @param {object} initial
 * @param {string|null} [initial.cursor] - Explicit cursor passed by the caller;
 *   a saved checkpoint cursor takes precedence over it.
 * @param {number} initial.limit - Requested item limit for the whole scrape.
 * @param {object} [initial.meta] - Stored alongside the cursor (username, query, ...).
 * @returns {{
 *   cursor: string|null,
 *   limit: number,
 *   resumed: boolean,
 *   record: (cursor: string|null, fetchedThisRun: number) => void,
 *   complete: () => void,
 * }}
 */
export function bindCheckpoint(checkpoint: object | null | undefined, { cursor, limit, meta }?: {
    cursor?: string | null;
    limit: number;
    meta?: object;
}): {
    cursor: string | null;
    limit: number;
    resumed: boolean;
    record: (cursor: string | null, fetchedThisRun: number) => void;
    complete: () => void;
};
