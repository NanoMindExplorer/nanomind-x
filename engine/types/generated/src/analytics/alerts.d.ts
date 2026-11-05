/**
 * Check for alert conditions given a monitor and new data points
 * @param {object} monitor - The monitor object
 * @param {Array<{ score: number, label: string, text: string }>} newPoints - New data points
 * @returns {Alert[]} - Generated alerts
 */
export function checkAlerts(monitor: object, newPoints: Array<{
    score: number;
    label: string;
    text: string;
}>): Alert[];
/**
 * Get recent alerts
 * @param {object} [options]
 * @param {string} [options.monitorId] - Filter by monitor
 * @param {string} [options.severity] - Filter by severity
 * @param {number} [options.limit=50]
 * @returns {Alert[]}
 */
export function getAlerts(options?: {
    monitorId?: string;
    severity?: string;
    limit?: number;
}): Alert[];
/**
 * Clear alert history
 */
export function clearAlerts(): void;
declare namespace _default {
    export { checkAlerts };
    export { getAlerts };
    export { clearAlerts };
}
export default _default;
export type Alert = {
    id: string;
    /**
     * - 'sentiment_threshold' | 'volume_spike' | 'anomaly'
     */
    type: string;
    /**
     * - 'info' | 'warning' | 'critical'
     */
    severity: string;
    /**
     * - Human-readable description
     */
    message: string;
    monitorId: string;
    target: string;
    /**
     * - Alert-specific data
     */
    data: object;
    timestamp: string;
};
