/**
 * Acquire a browser from the pool.
 * Reuses the least-loaded connected browser or spins up a new one.
 * Times out after ACQUIRE_TIMEOUT_MS.
 */
export function acquireBrowser(): Promise<any>;
/**
 * Release a browser slot back to the pool.
 */
export function releaseBrowser(browser: any): void;
/**
 * Create an authenticated page from a pooled browser.
 * Returns { browser, page } — caller must call releasePage() when done.
 */
export function acquirePage(authToken: any): Promise<{
    browser: any;
    page: any;
}>;
/**
 * Release a page and its browser slot.
 */
export function releasePage(browser: any, page: any): Promise<void>;
/**
 * Close all browsers in the pool (for shutdown).
 */
export function closeAll(): Promise<void>;
/**
 * Get pool status.
 */
export function getPoolStatus(): {
    browsers: number;
    maxBrowsers: number;
    maxPagesPerBrowser: number;
    totalActivePages: number;
    details: {
        id: number;
        connected: boolean;
        activePages: number;
        ageMs: number;
    }[];
};
/**
 * Health check — true if at least one browser can be acquired.
 */
export function isHealthy(): Promise<boolean>;
