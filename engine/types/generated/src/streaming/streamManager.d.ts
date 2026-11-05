/**
 * Set the Socket.IO server instance so streams can emit events.
 */
export function setIO(io: any): void;
/**
 * Create and start a new stream.
 *
 * @param {Object} params
 * @param {string} params.type - 'tweet' | 'follower' | 'mention'
 * @param {string} params.username - Target X/Twitter username (without @)
 * @param {number} [params.interval] - Poll interval in ms (default 60 000)
 * @param {string} [params.authToken] - X/Twitter auth_token cookie
 * @param {string} [params.userId] - Owner user ID
 * @param {'poll'|'live'} [params.transport='poll'] - `poll` scrapes on the interval
 *   (unchanged default). `live` holds x.com's live_pipeline open instead and
 *   pushes events as they happen; it needs `topics` and a logged-in session,
 *   and falls back to polling when the pipeline cannot be reached.
 * @param {string[]} [params.topics] - live_pipeline topics, built with the `Topic`
 *   helpers in `./livePipeline.js`. Required when `transport` is `live`.
 * @param {string} [params.cookies] - Full cookie string (`auth_token=...; ct0=...`).
 *   The live transport needs the ct0 cookie for the CSRF header, which
 *   `authToken` alone does not carry.
 * @returns {Promise<Object>} Stream descriptor
 */
export function createStream({ type, username, interval, authToken, userId, transport, topics, cookies, }: {
    type: string;
    username: string;
}): Promise<any>;
/**
 * Stop and remove a stream.
 */
export function stopStream(streamId: any): Promise<{
    success: boolean;
    streamId: any;
}>;
/**
 * Stop all active streams (for shutdown or emergency).
 */
export function stopAllStreams(): Promise<{
    stopped: number;
    failed: number;
    total: number;
}>;
/**
 * Pause a stream (stops polling but retains state).
 */
export function pauseStream(streamId: any): Promise<any>;
/**
 * Resume a paused stream.
 */
export function resumeStream(streamId: any): Promise<any>;
/**
 * Update stream settings (interval).
 */
export function updateStream(streamId: any, updates?: {}): Promise<any>;
/**
 * List all active streams.
 */
export function listStreams(): Promise<any[]>;
/**
 * Get recent event history for a stream.
 * @param {string} streamId
 * @param {number} [limit=50]
 * @param {string} [eventType] - Optional filter: 'stream:tweet', 'stream:follower', 'stream:mention'
 */
export function getStreamHistory(streamId: string, limit?: number, eventType?: string): Promise<any>;
/**
 * Get status information for a single stream.
 */
export function getStreamStatus(streamId: any): Promise<any>;
/**
 * Get aggregate stats across all streams.
 */
export function getStreamStats(): {
    total: number;
    byStatus: {
        running: number;
        paused: number;
        backoff: number;
        stopped: number;
        error: number;
    };
    totalPolls: number;
    totalEvents: number;
    totalErrors: number;
    liveTransports: number;
    pool: {
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
};
/**
 * Health check — Redis connected AND browser pool can serve.
 */
export function isHealthy(): Promise<boolean>;
/**
 * Try to run a stream over x.com's live pipeline.
 *
 * Never throws: a pipeline that cannot open is reported as `attached: false`
 * with the reason, and the caller starts polling instead.
 *
 * @param {Object} meta - Stream metadata (mutated with transport state)
 * @param {Object} [options]
 * @param {function} [options.createPipeline] - Pipeline factory (injectable for tests)
 * @param {function} [options.onStreamEvent] - Sink for normalised stream events
 * @param {function} [options.schedulePoll] - How to start polling on a later fallback
 * @returns {Promise<{ attached: boolean, reason?: string, error?: Error, pipeline?: Object }>}
 */
export function attachLiveTransport(meta: any, options?: {
    createPipeline?: Function;
    onStreamEvent?: Function;
    schedulePoll?: Function;
}): Promise<{
    attached: boolean;
    reason?: string;
    error?: Error;
    pipeline?: any;
}>;
/**
 * Close a stream's live pipeline, if it has one.
 * @param {string} streamId
 * @returns {Promise<boolean>} true when a pipeline was closed
 */
export function detachLiveTransport(streamId: string): Promise<boolean>;
/**
 * Clean shutdown — close pool and queue.
 */
export function shutdown(): Promise<void>;
export const STREAM_TYPES: string[];
/**
 * How a stream receives its data. `poll` is the default and unchanged
 * behaviour: scheduled scrapes on an interval. `live` holds x.com's own event
 * pipeline open and receives pushes, falling back to `poll` when that
 * connection cannot be established or is lost for good.
 */
export const TRANSPORTS: string[];
import { getPoolStatus } from './browserPool.js';
export { getPoolStatus };
