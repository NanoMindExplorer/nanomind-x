/**
 * @typedef {object} DeliveryAttempt
 * @property {string} at ISO timestamp
 * @property {number | null} status HTTP status, or null on a network error
 * @property {string} [error]
 * @property {number} durationMs
 */
/**
 * @typedef {object} DeliveryRecord
 * @property {string} id
 * @property {string} url
 * @property {string} event
 * @property {string} body raw JSON body exactly as signed and sent
 * @property {string} createdAt
 * @property {'delivered' | 'failed'} status
 * @property {boolean} signed
 * @property {DeliveryAttempt[]} attempts
 * @property {string} [replayOf] id of the delivery this one re-sent
 * @property {string} [completedAt]
 */
/** Directory that holds nanomind-x state. Honours NANOMIND_X_HOME. */
export function getNanomindXHome(): string;
/** @returns {string} absolute path of the delivery log */
export function getDeliveriesPath(): string;
/**
 * HMAC-SHA256 of the raw body, hex encoded.
 * @param {string | Buffer} rawBody
 * @param {string} secret
 * @returns {string} e.g. "sha256=ab12..."
 */
export function signWebhookBody(rawBody: string | Buffer, secret: string, timestamp: any): string;
/**
 * Verify a received webhook. Returns an object rather than throwing so an
 * HTTP handler can answer 401 with the reason.
 *
 * @param {string | Buffer} rawBody the request body, unparsed
 * @param {Headers | Record<string, string | string[] | undefined>} headers request headers
 * @param {string} secret the shared NANOMIND_X_WEBHOOK_SECRET
 * @param {{ toleranceSeconds?: number, now?: number }} [options] `toleranceSeconds`
 *   rejects a timestamp further than this from now (default 300; 0 disables);
 *   `now` is unix seconds, for tests
 * @returns {{ valid: boolean, reason?: string, event?: string, deliveryId?: string, timestamp?: number }}
 */
export function verifyWebhookSignature(rawBody: string | Buffer, headers: Headers | Record<string, string | string[] | undefined>, secret: string, options?: {
    toleranceSeconds?: number;
    now?: number;
}): {
    valid: boolean;
    reason?: string;
    event?: string;
    deliveryId?: string;
    timestamp?: number;
};
/**
 * Deliveries, newest first.
 * @param {{ status?: 'delivered' | 'failed' | 'all', limit?: number }} [options]
 * @returns {DeliveryRecord[]}
 */
export function listDeliveries({ status, limit }?: {
    status?: "delivered" | "failed" | "all";
    limit?: number;
}): DeliveryRecord[];
/**
 * One delivery by id.
 * @param {string} id
 * @returns {DeliveryRecord | null}
 */
export function getDelivery(id: string): DeliveryRecord | null;
/**
 * Sign and POST a webhook, retrying on transient failure, and record the
 * outcome in the delivery log. Resolves with the record either way; a
 * delivery that fails every attempt has `status: "failed"` rather than
 * throwing, so a notifier fan-out to other channels is never interrupted.
 *
 * @param {object} options
 * @param {string} options.url receiver URL
 * @param {object | string} options.payload object to JSON-encode, or an already-encoded string
 * @param {string} [options.event] event type header (default "notification")
 * @param {string} [options.secret] HMAC secret; falls back to NANOMIND_X_WEBHOOK_SECRET
 * @param {Record<string, string>} [options.headers] extra headers
 * @param {string} [options.id] delivery id; generated when omitted
 * @param {string} [options.replayOf] id of the delivery this re-sends
 * @param {number} [options.attempts] max attempts (default 3)
 * @param {number} [options.baseDelayMs] first backoff delay (default 500)
 * @param {number} [options.timeoutMs] per-attempt timeout (default 10000)
 * @param {typeof fetch} [options.fetchImpl] fetch replacement, for tests
 * @returns {Promise<DeliveryRecord>}
 */
export function deliverWebhook({ url, payload, event, secret, headers: extraHeaders, id, replayOf, attempts, baseDelayMs, timeoutMs, fetchImpl, }?: {
    url: string;
    payload: object | string;
    event?: string;
    secret?: string;
    headers?: Record<string, string>;
    id?: string;
    replayOf?: string;
    attempts?: number;
    baseDelayMs?: number;
    timeoutMs?: number;
    fetchImpl?: typeof fetch;
}): Promise<DeliveryRecord>;
/**
 * Re-send a logged delivery: same body, same delivery id, fresh timestamp
 * and signature. The replay is recorded as a new delivery that points at the
 * original through `replayOf`, so the log shows both.
 *
 * @param {string} id delivery id
 * @param {{ secret?: string, url?: string, attempts?: number, baseDelayMs?: number, timeoutMs?: number, fetchImpl?: typeof fetch }} [options]
 * @returns {Promise<DeliveryRecord>}
 */
export function replayDelivery(id: string, options?: {
    secret?: string;
    url?: string;
    attempts?: number;
    baseDelayMs?: number;
    timeoutMs?: number;
    fetchImpl?: typeof fetch;
}): Promise<DeliveryRecord>;
export const DELIVERIES_FILENAME: "webhook-deliveries.json";
export const MAX_DELIVERIES: 500;
export const DEFAULT_ATTEMPTS: 3;
export const DEFAULT_BASE_DELAY_MS: 500;
export const DEFAULT_TIMEOUT_MS: 10000;
/** Receivers reject a signed timestamp older than this by default. */
export const DEFAULT_TOLERANCE_SECONDS: 300;
export const HEADER_SIGNATURE: "x-nanomind-x-signature";
export const HEADER_TIMESTAMP: "x-nanomind-x-timestamp";
export const HEADER_EVENT: "x-nanomind-x-event";
export const HEADER_DELIVERY: "x-nanomind-x-delivery";
declare namespace _default {
    export { DELIVERIES_FILENAME };
    export { MAX_DELIVERIES };
    export { HEADER_SIGNATURE };
    export { HEADER_TIMESTAMP };
    export { HEADER_EVENT };
    export { HEADER_DELIVERY };
    export { getNanomindXHome };
    export { getDeliveriesPath };
    export { signWebhookBody };
    export { verifyWebhookSignature };
    export { listDeliveries };
    export { getDelivery };
    export { deliverWebhook };
    export { replayDelivery };
}
export default _default;
export type DeliveryAttempt = {
    /**
     * ISO timestamp
     */
    at: string;
    /**
     * HTTP status, or null on a network error
     */
    status: number | null;
    error?: string;
    durationMs: number;
};
export type DeliveryRecord = {
    id: string;
    url: string;
    event: string;
    /**
     * raw JSON body exactly as signed and sent
     */
    body: string;
    createdAt: string;
    status: "delivered" | "failed";
    signed: boolean;
    attempts: DeliveryAttempt[];
    /**
     * id of the delivery this one re-sent
     */
    replayOf?: string;
    completedAt?: string;
};
