/**
 * Add an RSS feed to monitor
 */
export function addFeed(config: any): Promise<any>;
/**
 * Remove an RSS feed
 */
export function removeFeed(name: any): Promise<{
    error: string;
    status?: undefined;
    name?: undefined;
} | {
    status: string;
    name: any;
    error?: undefined;
}>;
/**
 * List all feeds
 */
export function listFeeds(): Promise<any[]>;
/**
 * Check a single feed for new items
 */
export function checkFeed(name: any): Promise<{
    name: any;
    newItems: number;
    totalItems: number;
    error?: undefined;
} | {
    error: any;
    name?: undefined;
    newItems?: undefined;
    totalItems?: undefined;
}>;
/**
 * Check all feeds
 */
export function checkAllFeeds(): Promise<({
    name: any;
    newItems: number;
    totalItems: number;
    error?: undefined;
} | {
    error: any;
    name?: undefined;
    newItems?: undefined;
    totalItems?: undefined;
})[]>;
/**
 * Get all drafts
 */
export function getDrafts(): Promise<any>;
/**
 * Post a specific draft
 */
export function postDraft(id: any): Promise<{
    status: string;
    text: any;
    error?: undefined;
} | {
    error: any;
    status?: undefined;
    text?: undefined;
}>;
/**
 * Delete a draft
 */
export function deleteDraft(id: any): Promise<{
    error: string;
    status?: undefined;
    id?: undefined;
} | {
    status: string;
    id: any;
    error?: undefined;
}>;
/**
 * Post all drafts with delay
 */
export function postAllDrafts(delayMs?: number): Promise<{
    status: string;
    message: string;
    posted?: undefined;
    failed?: undefined;
    total?: undefined;
} | {
    posted: number;
    failed: number;
    total: any;
    status?: undefined;
    message?: undefined;
}>;
