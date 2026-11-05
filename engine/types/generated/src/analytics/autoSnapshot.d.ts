/**
 * Start auto-snapshots for a username
 * @param {string} username - Twitter username
 * @param {number} intervalMinutes - Minutes between snapshots (default 60)
 * @param {Function} [scrapeFn] - Custom scrape function, defaults to lazy-loading scrapers
 */
export function startAutoSnapshot(username: string, intervalMinutes?: number, scrapeFn?: Function): Promise<{
    status: string;
    username: string;
    intervalMinutes?: undefined;
} | {
    status: string;
    username: string;
    intervalMinutes: number;
}>;
/**
 * Stop auto-snapshots for a username
 */
export function stopAutoSnapshot(username: any): {
    status: string;
    username: any;
};
/**
 * List all active snapshot schedules
 */
export function listActiveSnapshots(): {
    username: any;
    intervalMinutes: any;
    startedAt: any;
}[];
/**
 * Stop all auto-snapshots — for graceful shutdown
 */
export function stopAllSnapshots(): void;
