/**
 * Parse Twitter API error responses and throw the appropriate error class.
 *
 * @param {object} response - Parsed JSON response body
 * @param {number} status - HTTP status code
 * @param {string} [endpoint] - Endpoint path for context
 * @returns {{ handled: boolean, result?: object }} — If handled idempotently, returns result
 * @throws {RateLimitError|AuthError|NotFoundError|TwitterApiError}
 */
export function parseTwitterErrors(response: object, status: number, endpoint?: string): {
    handled: boolean;
    result?: object;
};
/**
 * Twitter HTTP Scraper — Error Classes
 *
 * Structured error hierarchy for all HTTP-based Twitter operations.
 *
 * @author nich (@nichxbt)
 * @license Apache-2.0
 */
/**
 * Base error for all Twitter API errors.
 */
export class TwitterApiError extends Error {
    /**
     * @param {string} message
     * @param {object} [options]
     * @param {number} [options.status] - HTTP status code
     * @param {object} [options.data] - Raw response data
     * @param {string} [options.endpoint] - The endpoint that errored
     */
    constructor(message: string, { status, data, endpoint }?: {
        status?: number;
        data?: object;
        endpoint?: string;
    });
    status: number;
    data: any;
    endpoint: string;
}
/**
 * Thrown when the request is rate-limited (HTTP 429 or Twitter spam error).
 */
export class RateLimitError extends TwitterApiError {
    /**
     * @param {string} message
     * @param {object} [options]
     * @param {number} [options.resetAt] - Unix timestamp (ms) when limit resets
     * @param {number} [options.limit] - Max requests allowed
     * @param {number} [options.remaining] - Remaining requests
     */
    constructor(message: string, { resetAt, limit, remaining, ...rest }?: {
        resetAt?: number;
        limit?: number;
        remaining?: number;
    });
    resetAt: number;
    limit: number;
    remaining: number;
}
/**
 * Thrown when authentication is missing or invalid (HTTP 401/403).
 */
export class AuthError extends TwitterApiError {
    constructor(message: any, options?: {});
}
/**
 * Thrown when the requested resource is not found (HTTP 404).
 */
export class NotFoundError extends TwitterApiError {
    constructor(message: any, options?: {});
}
/**
 * Thrown on network-level failures (connection refused, timeout, DNS).
 */
export class NetworkError extends TwitterApiError {
    constructor(message: any, options?: {});
}
