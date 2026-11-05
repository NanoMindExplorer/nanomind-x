/**
 * Parse a CSV, JSON, or TXT file into an array of clean usernames
 */
export function parseBulkInput(filePath: any): Promise<any[]>;
/**
 * Execute bulk operations on a list of usernames
 */
export function bulkExecute(usernames: any, action: any, options?: {}): Promise<{
    error: string;
} | {
    succeeded: any[];
    failed: any[];
    action: any;
    total: any;
    skippedBlacklist: number;
    duration: string;
    progressFile: string;
    error?: undefined;
}>;
/**
 * Bulk scrape profiles
 */
export function bulkScrape(usernames: any, options?: {}): Promise<{
    error: string;
    results?: undefined;
    count?: undefined;
} | {
    results: any[];
    count: number;
    error?: undefined;
}>;
