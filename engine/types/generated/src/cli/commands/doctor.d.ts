/**
 * Human age of an ISO timestamp for the query-ID line: `12m old`, `3h old`.
 * @param {string} iso
 * @param {number} [now=Date.now()]
 * @returns {string}
 */
export function formatCacheAge(iso: string, now?: number): string;
/**
 * Turn a query-ID cache status into a check result. Pure, so it is testable
 * without a cache on disk or a network.
 * @param {{cached: boolean, fetchedAt: string|null, count: number, cachePath: string, stale: boolean}} status
 * @param {number} [now=Date.now()]
 * @returns {CheckResult}
 */
export function describeQueryIds(status: {
    cached: boolean;
    fetchedAt: string | null;
    count: number;
    cachePath: string;
    stale: boolean;
}, now?: number): CheckResult;
/**
 * Turn account-pool stats into a check result. Pure, for tests.
 * @param {{storePath: string, total: number, locked: number, available: number, coolingDown: number, nextResetAt: number|null}|null} stats
 *   null when no pool database exists yet
 * @param {string} storePath
 * @param {number} [now=Date.now()]
 * @returns {CheckResult}
 */
export function describeAccounts(stats: {
    storePath: string;
    total: number;
    locked: number;
    available: number;
    coolingDown: number;
    nextResetAt: number | null;
} | null, storePath: string, now?: number): CheckResult;
/**
 * Run every check and summarise.
 * @param {{refreshIds?: boolean}} [options]
 * @returns {Promise<void>}
 */
export function doctorCommand(options?: {
    refreshIds?: boolean;
}): Promise<void>;
/**
 * Register the command.
 * @param {import('commander').Command} program
 */
export function registerDoctorCommand(program: import("commander").Command): void;
export type CheckResult = {
    status: "ok" | "warn" | "fail";
    detail: string;
    fix?: string;
};
