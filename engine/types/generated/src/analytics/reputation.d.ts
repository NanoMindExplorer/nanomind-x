/**
 * @typedef {Object} MonitorConfig
 * @property {string} target - Username (with @) or keyword to monitor
 * @property {string} [type='mentions'] - 'mentions' | 'keyword' | 'replies'
 * @property {number} [intervalMs=900000] - Polling interval (default 15 min)
 * @property {string} [sentimentMode='rules'] - 'rules' or 'llm'
 * @property {object} [alertConfig] - Alert configuration
 * @property {number} [alertConfig.sentimentThreshold=-0.3] - Alert when below
 * @property {number} [alertConfig.volumeMultiplier=3] - Alert when mentions > avg * this
 * @property {string} [alertConfig.webhookUrl] - Webhook URL for alerts
 */
/**
 * @typedef {Object} SentimentDataPoint
 * @property {string} timestamp - ISO timestamp
 * @property {number} score - Sentiment score -1..1
 * @property {string} label - positive/neutral/negative
 * @property {string} text - Original tweet text (truncated)
 * @property {string} [author] - Tweet author
 * @property {string} [tweetUrl] - URL to the tweet
 */
/**
 * @typedef {Object} Monitor
 * @property {string} id
 * @property {string} target
 * @property {string} type
 * @property {string} status - 'active' | 'paused' | 'stopped'
 * @property {number} intervalMs
 * @property {string} sentimentMode
 * @property {object} alertConfig
 * @property {SentimentDataPoint[]} history
 * @property {NodeJS.Timeout|null} timer
 * @property {string} createdAt
 * @property {string} lastPolledAt
 * @property {object} stats
 */
/**
 * Create and start a new reputation monitor
 * @param {MonitorConfig} config
 * @param {object} [deps] - Optional dependencies for scraping
 * @param {Function} [deps.searchFn] - Custom search function (for testing)
 * @param {Function} [deps.onAlert] - Custom alert callback
 * @returns {Monitor}
 */
export function createMonitor(config: MonitorConfig, deps?: {
    searchFn?: Function;
    onAlert?: Function;
}): Monitor;
/**
 * Stop a monitor
 * @param {string} monitorId
 * @returns {{ success: boolean, message: string }}
 */
export function stopMonitor(monitorId: string): {
    success: boolean;
    message: string;
};
/**
 * Get monitor results
 * @param {string} monitorId
 * @returns {Monitor|null}
 */
export function getMonitor(monitorId: string): Monitor | null;
/**
 * Get monitor history (sentiment data points)
 * @param {string} monitorId
 * @param {object} [options]
 * @param {number} [options.limit=100]
 * @param {string} [options.since] - ISO timestamp
 * @returns {SentimentDataPoint[]}
 */
export function getMonitorHistory(monitorId: string, options?: {
    limit?: number;
    since?: string;
}): SentimentDataPoint[];
/**
 * List all active monitors
 * @returns {Monitor[]}
 */
export function listMonitors(): Monitor[];
/**
 * Remove a monitor and its data
 * @param {string} monitorId
 */
export function removeMonitor(monitorId: string): void;
/**
 * Stop all monitors (for graceful shutdown)
 */
export function stopAll(): void;
declare namespace _default {
    export { createMonitor };
    export { stopMonitor };
    export { getMonitor };
    export { getMonitorHistory };
    export { listMonitors };
    export { removeMonitor };
    export { stopAll };
}
export default _default;
export type MonitorConfig = {
    /**
     * - Username (with
     */
    target: string;
};
export type SentimentDataPoint = {
    /**
     * - ISO timestamp
     */
    timestamp: string;
    /**
     * - Sentiment score -1..1
     */
    score: number;
    /**
     * - positive/neutral/negative
     */
    label: string;
    /**
     * - Original tweet text (truncated)
     */
    text: string;
    /**
     * - Tweet author
     */
    author?: string;
    /**
     * - URL to the tweet
     */
    tweetUrl?: string;
};
export type Monitor = {
    id: string;
    target: string;
    type: string;
    /**
     * - 'active' | 'paused' | 'stopped'
     */
    status: string;
    intervalMs: number;
    sentimentMode: string;
    alertConfig: object;
    history: SentimentDataPoint[];
    timer: NodeJS.Timeout | null;
    createdAt: string;
    lastPolledAt: string;
    stats: object;
};
