/**
 * Get trending topics.
 *
 * @param {Object} http - HTTP client with get/post methods
 * @param {string} [category='trending'] - Category: 'trending', 'for_you', 'news', 'sports', 'entertainment'
 * @returns {Promise<Array<{name: string, tweetCount: string, url: string, context: string}>>}
 */
export function getTrends(http: any, category?: string): Promise<Array<{
    name: string;
    tweetCount: string;
    url: string;
    context: string;
}>>;
/**
 * Get available explore tabs.
 *
 * @param {Object} http - HTTP client with get/post methods
 * @returns {Promise<Array<{id: string, label: string}>>}
 */
export function getExploreTabs(http: any): Promise<Array<{
    id: string;
    label: string;
}>>;
