/**
 * nanomind-x Client — Error Classes
 * Comprehensive error hierarchy for all Twitter API and scraper errors.
 *
 * @author nich (@nichxbt) - https://github.com/nirholas
 * @license Apache-2.0
 */
/**
 * Base error class for all nanomind-x scraper errors.
 */
export class ScraperError extends Error {
    /**
     * @param {string} message - Human-readable error description
     * @param {string} [code='SCRAPER_ERROR'] - Machine-readable error code
     * @param {Object} [options={}]
     * @param {string} [options.endpoint] - The API endpoint that produced the error
     * @param {number} [options.httpStatus] - HTTP status code
     * @param {Date|null} [options.rateLimitReset] - When the rate limit resets
     */
    constructor(message: string, code?: string, options?: {
        endpoint?: string;
        httpStatus?: number;
        rateLimitReset?: Date | null;
    });
    /** @type {string} */
    code: string;
    /** @type {string|undefined} */
    endpoint: string | undefined;
    /** @type {number|undefined} */
    httpStatus: number | undefined;
    /** @type {Date|null} */
    rateLimitReset: Date | null;
}
/**
 * Thrown when authentication fails or is required.
 */
export class AuthenticationError extends ScraperError {
    /**
     * @param {string} message
     * @param {'AUTH_FAILED'|'AUTH_REQUIRED'|'ACCOUNT_SUSPENDED'|'ACCOUNT_LOCKED'|'INVALID_TOKEN'|'PROTECTED_TWEETS'} [code='AUTH_FAILED']
     * @param {Object} [options]
     */
    constructor(message: string, code?: "AUTH_FAILED" | "AUTH_REQUIRED" | "ACCOUNT_SUSPENDED" | "ACCOUNT_LOCKED" | "INVALID_TOKEN" | "PROTECTED_TWEETS", options?: any);
}
/**
 * Thrown when a Twitter rate limit is hit.
 */
export class RateLimitError extends ScraperError {
    /**
     * @param {string} message
     * @param {Object} [options={}]
     * @param {number} [options.retryAfter] - Seconds until retry is safe
     * @param {number} [options.limit] - Total requests allowed in window
     * @param {number} [options.remaining] - Requests remaining in window
     * @param {Date|null} [options.resetAt] - When the limit resets
     * @param {string} [options.endpoint]
     * @param {number} [options.httpStatus]
     */
    constructor(message: string, options?: {
        retryAfter?: number;
        limit?: number;
        remaining?: number;
        resetAt?: Date | null;
        endpoint?: string;
        httpStatus?: number;
    });
    /** @type {number|undefined} */
    retryAfter: number | undefined;
    /** @type {number|undefined} */
    limit: number | undefined;
    /** @type {number|undefined} */
    remaining: number | undefined;
    /** @type {Date|null} */
    resetAt: Date | null;
}
/**
 * Thrown when a requested resource does not exist.
 */
export class NotFoundError extends ScraperError {
    /**
     * @param {string} message
     * @param {'USER_NOT_FOUND'|'TWEET_NOT_FOUND'|'LIST_NOT_FOUND'} [code='NOT_FOUND']
     * @param {Object} [options]
     */
    constructor(message: string, code?: "USER_NOT_FOUND" | "TWEET_NOT_FOUND" | "LIST_NOT_FOUND", options?: any);
}
/**
 * Thrown for general Twitter API errors.
 */
export class TwitterApiError extends ScraperError {
    /**
     * Create an error from a Twitter API error response body.
     *
     * Twitter returns errors in multiple formats:
     *   a. { errors: [{ code: 88, message: "Rate limit exceeded" }] }
     *   b. { data: { errors: [{ message: "..." }] } }  (GraphQL)
     *   c. { error: "Not authorized." }
     *
     * @param {Object} body - Parsed JSON response body
     * @param {Object} [context={}]
     * @returns {ScraperError}
     */
    static fromResponse(body: any, context?: any): ScraperError;
    /**
     * @param {string} message
     * @param {Object} [options={}]
     * @param {number} [options.twitterErrorCode]
     * @param {string} [options.twitterMessage]
     * @param {string} [options.endpoint]
     * @param {number} [options.httpStatus]
     */
    constructor(message: string, options?: {
        twitterErrorCode?: number;
        twitterMessage?: string;
        endpoint?: string;
        httpStatus?: number;
    });
    /** @type {number|undefined} */
    twitterErrorCode: number | undefined;
    /** @type {string|undefined} */
    twitterMessage: string | undefined;
}
