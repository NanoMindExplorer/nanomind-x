/**
 * Strip X's size suffix so the CDN serves the original upload:
 * `..._normal.jpg` and `..._400x400.jpg` both become `....jpg`.
 */
export function originalImageUrl(url: any): string;
/** A banner is served without a size; asking for /1500x500 gets the large one. */
export function originalBannerUrl(url: any): any;
/**
 * Parse a target string into `{ kind, value, modifier }`.
 *
 * @param {string} target
 */
export function parseTarget(target: string): {
    kind: string;
    value: string;
    modifier?: undefined;
} | {
    kind: string;
    value: string;
    modifier: string;
};
/** Pull every media item out of one parsed tweet. */
export function itemsFromTweet(tweet: any): any;
/**
 * Resolve a target into media items.
 *
 * `scrapers` is the object `createHttpScraper()` returns, so this module never
 * builds a client of its own and inherits whatever session, pool or checkpoint
 * the caller already configured.
 *
 * @param {object} target  from parseTarget
 * @param {object} scrapers
 * @param {{ limit?: number, types?: string[], since?: Date|null, until?: Date|null }} [options]
 * @returns {Promise<Array<object>>}
 */
export function collectItems(target: object, scrapers: object, options?: {
    limit?: number;
    types?: string[];
    since?: Date | null;
    until?: Date | null;
}): Promise<Array<object>>;
/**
 * Apply `--type` and date filters. Kept separate so the CLI, the MCP tool and
 * tests all filter identically.
 */
export function applyFilters(items: any, { types, since, until }?: {}): any;
/** The forms a target string can take. */
export const TARGET_KINDS: readonly string[];
