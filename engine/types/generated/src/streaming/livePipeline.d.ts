/**
 * Split a topic string into its kind and id.
 * @param {string} topic
 * @returns {{ kind: string|null, id: string|null }}
 */
export function parseTopic(topic: string): {
    kind: string | null;
    id: string | null;
};
/**
 * A frame carries one `payload` object whose keys name the events inside it.
 * Each key becomes one typed event, so a frame with both `dm_update` and
 * `dm_typing` yields two events.
 *
 * @param {object} frame - Parsed JSON frame, `{ topic?, payload }`
 * @param {object} [options]
 * @param {string} [options.receivedAt] - ISO timestamp stamped on every event
 * @returns {Array<{ type: string, topic: string|null, payload: object, receivedAt: string, raw: object }>}
 */
export function normalizeFrame(frame: object, { receivedAt }?: {
    receivedAt?: string;
}): Array<{
    type: string;
    topic: string | null;
    payload: object;
    receivedAt: string;
    raw: object;
}>;
/**
 * Exponential backoff with symmetric jitter.
 *
 * `attempt` is 1 for the first retry after a drop. The un-jittered delay is
 * `minDelayMs * factor^(attempt-1)`, capped at `maxDelayMs`; jitter then
 * spreads it over `+/- jitter` of that value, so a fleet of clients that lost
 * the same connection does not reconnect in lockstep.
 *
 * @param {number} attempt
 * @param {object} [options]
 * @param {number} [options.minDelayMs=1000]
 * @param {number} [options.maxDelayMs=60000]
 * @param {number} [options.factor=2]
 * @param {number} [options.jitter=0.3] - Fraction of the delay, 0 disables jitter
 * @param {function} [options.random=Math.random]
 * @returns {number} Delay in ms
 */
export function computeBackoffDelay(attempt: number, options?: {
    minDelayMs?: number;
    maxDelayMs?: number;
    factor?: number;
    jitter?: number;
    random?: Function;
}): number;
/**
 * Create a live-pipeline client. The connection is not opened until `open()`
 * is awaited, so handlers and topics can be set up first.
 *
 * @param {object} options
 * @param {import('../scrapers/twitter/http/client.js').TwitterHttpClient} options.client
 *   Logged-in HTTP client. Its cookie jar, CSRF token and headers are reused as-is.
 * @param {string[]|Set<string>} [options.topics] - Topics for the opening request. Build them with `Topic`.
 * @param {(event: {type: string, topic: string|null, payload: object, receivedAt: string, raw: object}) => void} [options.onEvent]
 * @param {(error: Error, info: {fatal: boolean, willRetry: boolean, attempt?: number, delayMs?: number}) => void} [options.onError]
 * @param {object|false} [options.reconnect] - `false` disables reconnect; otherwise
 *   `{ enabled, minDelayMs, maxDelayMs, factor, jitter, maxAttempts, random }`.
 * @param {typeof globalThis.fetch} [options.fetch] - Transport override (tests, proxies).
 * @param {string} [options.eventsUrl] - Override the events endpoint.
 * @param {string} [options.subscriptionsUrl] - Override the subscriptions endpoint.
 * @param {number} [options.openTimeoutMs=20000] - How long to wait for the config frame.
 * @param {number} [options.heartbeatTimeoutMs] - Silence watchdog; defaults to
 *   three times the heartbeat interval the server advertises.
 * @returns {LivePipeline}
 *
 * @example
 * ```js
 * import { TwitterHttpClient } from 'nanomind-x/scrapers/twitter/http';
 * import { createLivePipeline, Topic } from 'nanomind-x/streaming';
 *
 * const client = new TwitterHttpClient({ cookies: process.env.X_COOKIES });
 * const pipeline = createLivePipeline({
 *   client,
 *   topics: [Topic.tweetEngagement('1234567890')],
 *   onEvent: (event) => console.log(event.type, event.payload),
 *   onError: (err, info) => console.error(err.message, info),
 * });
 *
 * await pipeline.open();
 * await pipeline.subscribe(Topic.tweetEngagement('9876543210'));
 * // ... later
 * await pipeline.close();
 * ```
 */
export function createLivePipeline(options?: {
    client: import("../scrapers/twitter/http/client.js").TwitterHttpClient;
    topics?: string[] | Set<string>;
    onEvent?: (event: {
        type: string;
        topic: string | null;
        payload: object;
        receivedAt: string;
        raw: object;
    }) => void;
    onError?: (error: Error, info: {
        fatal: boolean;
        willRetry: boolean;
        attempt?: number;
        delayMs?: number;
    }) => void;
    reconnect?: object | false;
    fetch?: typeof globalThis.fetch;
    eventsUrl?: string;
    subscriptionsUrl?: string;
    openTimeoutMs?: number;
    heartbeatTimeoutMs?: number;
}): LivePipeline;
/** Long-lived event stream. One connection carries every subscribed topic. */
export const LIVE_PIPELINE_EVENTS_URL: "https://api.x.com/live_pipeline/events";
/** Mid-session subscription changes. Keyed by the `LivePipeline-Session` header. */
export const LIVE_PIPELINE_SUBSCRIPTIONS_URL: "https://api.x.com/1.1/live_pipeline/update_subscriptions";
/** Every value `event.type` can take. */
export const LIVE_EVENT_TYPES: readonly string[];
/** Defaults for the reconnect schedule. Overridable per pipeline. */
export const DEFAULT_RECONNECT: Readonly<{
    enabled: true;
    minDelayMs: 1000;
    maxDelayMs: 60000;
    factor: 2;
    jitter: 0.3;
    maxAttempts: number;
}>;
/**
 * Any live-pipeline failure that is not an authentication failure.
 * `code` is one of: `not_open`, `no_config`, `open_timeout`, `http_error`,
 * `no_body`, `parse_error`, `handler_error`, `heartbeat_timeout`,
 * `stream_closed`, `reconnect_exhausted`.
 */
export class LivePipelineError extends TwitterApiError {
    constructor(message: any, { code, ...rest }?: {
        code?: string;
    });
    code: string;
}
/**
 * The session cannot open the pipeline: no `auth_token` cookie, or x.com
 * rejected the cookies with 401/403. Guest tokens never work here.
 */
export class LivePipelineAuthError extends AuthError {
    code: string;
}
/**
 * Topic builders. A topic string is what the pipeline subscribes to, and it is
 * echoed back on every frame it produces.
 */
export const Topic: Readonly<{
    /**
     * Engagement counters (likes, retweets, quotes, replies, views) for one post.
     * @param {string|number} tweetId
     * @returns {string} e.g. `/tweet_engagement/1234567890`
     */
    tweetEngagement(tweetId: string | number): string;
    /**
     * New messages in one DM conversation. A conversation id is either a group
     * id (`1234567890`) or `partnerId-yourId` (`1234567890-9876543210`).
     *
     * DM topics are only accepted on the opening connection: x.com answers a
     * mid-session subscribe for a DM topic with an entry in the subscription
     * error list. Pass them to `createLivePipeline({ topics })`.
     *
     * @param {string} conversationId
     * @returns {string} e.g. `/dm_update/1234567890-9876543210`
     */
    dmUpdate(conversationId: string): string;
    /**
     * Typing indicators in one DM conversation. Same mid-session limit as
     * `dmUpdate`.
     * @param {string} conversationId
     * @returns {string} e.g. `/dm_typing/1234567890-9876543210`
     */
    dmTyping(conversationId: string): string;
}>;
export class LivePipeline {
    constructor(options: any);
    _client: any;
    _fetch: any;
    _eventsUrl: any;
    _subscriptionsUrl: any;
    _openTimeoutMs: any;
    _configuredHeartbeatTimeoutMs: any;
    _heartbeatTimeoutMs: any;
    _onEvent: any;
    _onError: any;
    _reconnect: any;
    _topics: Set<any>;
    _sessionId: any;
    _state: string;
    _controller: AbortController;
    _reader: any;
    _ready: {
        settled: boolean;
    };
    _readDone: Promise<{
        ok: boolean;
    }>;
    _loopPromise: Promise<void>;
    _heartbeatTimer: NodeJS.Timeout;
    _openTimer: NodeJS.Timeout;
    _subscriptionTimer: NodeJS.Timeout;
    _sleepTimer: any;
    _sleepResolve: (value: any) => void;
    _stats: {
        connects: number;
        reconnects: number;
        frames: number;
        events: number;
        malformedFrames: number;
        lastFrameAt: any;
        lastError: any;
    };
    get sessionId(): any;
    get topics(): any[];
    get state(): string;
    get isOpen(): boolean;
    get stats(): {
        topics: number;
        connects: number;
        reconnects: number;
        frames: number;
        events: number;
        malformedFrames: number;
        lastFrameAt: any;
        lastError: any;
    };
    /**
     * Open the stream and resolve once x.com has sent the session config frame.
     * Rejects (without retrying) when the connection cannot be established, so
     * a caller can fall back to another transport. Reconnect with backoff only
     * governs a session that opened and later dropped.
     *
     * @returns {Promise<{ sessionId: string, topics: string[] }>}
     */
    open(): Promise<{
        sessionId: string;
        topics: string[];
    }>;
    /**
     * Add topics to the running session without reconnecting.
     * @param {string|string[]|Set<string>} topics
     * @returns {Promise<{ topics: string[], errors: any[], raw: object }|null>}
     */
    subscribe(topics: string | string[] | Set<string>): Promise<{
        topics: string[];
        errors: any[];
        raw: object;
    } | null>;
    /**
     * Drop topics from the running session without reconnecting.
     * @param {string|string[]|Set<string>} topics
     * @returns {Promise<{ topics: string[], errors: any[], raw: object }|null>}
     */
    unsubscribe(topics: string | string[] | Set<string>): Promise<{
        topics: string[];
        errors: any[];
        raw: object;
    } | null>;
    /**
     * Shut the connection down. Resolves once the read loop and the reconnect
     * supervisor have both finished, so nothing is left running after it.
     * @returns {Promise<void>}
     */
    close(): Promise<void>;
    /**
     * One connection attempt. Resolves when the config frame arrives; the read
     * loop keeps running in the background afterwards.
     */
    _connect(): Promise<void>;
    _buildEventsUrl(): string;
    /** Read the body, split it into lines, and turn each line into events. */
    _readStream(res: any): Promise<void>;
    _handleLine(rawLine: any): void;
    _applyConfig(config: any): void;
    _deliver(event: any): void;
    /** Watch the open connection and reconnect it, with backoff, when it drops. */
    _supervise(): void;
    _waitForDrop(): Promise<any>;
    _isStopping(): boolean;
    _fail(cause: any): void;
    _emitError(error: any, info: any): void;
    _postSubscriptions(subscribeTopics: any, unsubscribeTopics: any): Promise<{
        errors: any;
        raw: any;
    }>;
    /** Re-assert the current topics before the server's TTL drops them. */
    _scheduleSubscriptionRefresh(ttlMillis: any): void;
    /** Restart the silence watchdog. Fires when no bytes arrive for too long. */
    _armHeartbeat(): void;
    _sleep(ms: any): Promise<any>;
    _wakeSleep(): void;
    _clearTimers(): void;
    _abort(reason: any): void;
}
import { TwitterApiError } from '../scrapers/twitter/http/errors.js';
import { AuthError } from '../scrapers/twitter/http/errors.js';
