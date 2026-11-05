/**
 * Generate a reputation report for a monitor
 *
 * @param {object} monitor - Serialized monitor object (from getMonitor)
 * @param {Array<{ timestamp: string, score: number, label: string, text: string, author: string }>} history - Data points
 * @param {object} [options]
 * @param {string} [options.period='7d'] - '24h', '7d', '30d', 'all'
 * @param {string} [options.format='json'] - 'json' or 'markdown'
 * @returns {{ report: object, markdown?: string }}
 */
export function generateReport(monitor: object, history: Array<{
    timestamp: string;
    score: number;
    label: string;
    text: string;
    author: string;
}>, options?: {
    period?: string;
    format?: string;
}): {
    report: object;
    markdown?: string;
};
declare namespace _default {
    export { generateReport };
}
export default _default;
