/**
 * List all datasets
 */
export function listDatasets(): Promise<{
    name: any;
    itemCount: any;
    size: string;
    createdAt: any;
    modifiedAt: any;
}[]>;
export class PaginationEngine {
    constructor(options?: {});
    maxPages: any;
    maxItems: any;
    pageTimeout: any;
    scrollDelay: any;
    retries: any;
    deduplicateBy: any;
    onProgress: any;
    items: any[];
    seen: Set<any>;
    stats: {
        total: number;
        duplicatesRemoved: number;
        pagesScrolled: number;
        errorsRecovered: number;
        duration: number;
    };
    /**
     * Core pagination method — scrolls page and extracts items
     */
    scrapeWithPagination(page: any, extractFn: any, options?: {}): Promise<{
        items: any[];
        stats: {
            total: number;
            duplicatesRemoved: number;
            pagesScrolled: number;
            errorsRecovered: number;
            duration: number;
        };
    }>;
    /**
     * Resume from a saved checkpoint
     */
    resume(checkpointPath: any): Promise<boolean>;
    /**
     * Save checkpoint
     */
    saveCheckpoint(id: any): Promise<string>;
    _sleep(ms: any): Promise<any>;
}
export class RetryPolicy {
    constructor(options?: {});
    maxRetries: any;
    baseDelay: any;
    maxDelay: any;
    backoffMultiplier: any;
    retryOn: any;
    /**
     * Execute an async function with retry logic
     */
    execute(fn: any): Promise<any>;
    _classifyError(error: any): "unknown" | "timeout" | "network-error" | "rate-limit" | "empty-result";
}
export class DatasetStore {
    /**
     * Create a new named dataset
     */
    static create(name: any): DatasetStore;
    constructor(name: any);
    name: any;
    dir: string;
    dataFile: string;
    metaFile: string;
    /**
     * Append items to the dataset (JSONL format)
     */
    pushData(items: any): Promise<{
        added: number;
        total: any;
    }>;
    /**
     * Read items with pagination
     */
    getData({ offset, limit }?: {
        offset?: number;
        limit?: number;
    }): Promise<{
        items: any[];
        total: number;
        offset: number;
        limit: number;
    }>;
    /**
     * Get dataset info
     */
    getInfo(): Promise<{
        name: any;
        itemCount: any;
        size: string;
        createdAt: any;
        modifiedAt: any;
    }>;
    /**
     * Export dataset to JSON, CSV, or JSONL
     */
    export(format?: string): Promise<string>;
    /**
     * Delete the dataset
     */
    delete(): Promise<{
        status: string;
        name: any;
    }>;
    _getMeta(): Promise<any>;
    _saveMeta(meta: any): Promise<void>;
}
