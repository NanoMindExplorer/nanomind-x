/**
 * Accept every cookie shape a caller might have and return one header string.
 *
 * - `"auth_token=...; ct0=..."`, Netscape cookies.txt text, Cookie-Editor JSON,
 *   Playwright storageState (all through `parseCookieInput`)
 * - an array of `{ name, value }` objects
 * - a `{ auth_token, ct0, ... }` map
 *
 * @param {string|Array<{name:string,value:string}>|Record<string,string>} input
 * @returns {string}
 */
export function normalizeCookies(input: string | Array<{
    name: string;
    value: string;
}> | Record<string, string>): string;
/**
 * Operation name for a request URL: the GraphQL operation for
 * `/i/api/graphql/<id>/<Operation>`, the path for REST calls.
 * @param {string} url
 * @returns {string}
 */
export function operationFromUrl(url: string): string;
/**
 * Create (or reopen) an account pool.
 *
 * @param {object} [options]
 * @param {Array<{name:string, cookies?:any, authToken?:string, ct0?:string, proxy?:string}>} [options.accounts]
 *   Accounts to upsert on creation. Accounts already in the store stay there.
 * @param {string} [options.storePath] - SQLite file. Defaults to
 *   `$NANOMIND_X_HOME/accounts.db` (`~/.nanomind-x/accounts.db`).
 * @param {object} [options.clientOptions] - Passed to every account's
 *   `TwitterHttpClient` (`fetch`, `userAgent`, `maxRetries`, `debug`, ...).
 * @param {number} [options.maxWaitMs=900000] - Default upper bound `acquire`
 *   will wait for a rate-limit reset (15 minutes, one full X window).
 * @param {function} [options.now] - Clock, for tests.
 */
export function createAccountPool(options?: {
    accounts?: Array<{
        name: string;
        cookies?: any;
        authToken?: string;
        ct0?: string;
        proxy?: string;
    }>;
    storePath?: string;
    clientOptions?: object;
    maxWaitMs?: number;
    now?: Function;
}): {
    storePath: string;
    /**
     * Add or update an account. Cookies may be any format `parseCookieInput`
     * understands, an array of `{ name, value }`, a map, or `authToken` + `ct0`.
     */
    add(account: any): {
        name: any;
        proxy: any;
        locked: boolean;
        lockReason: any;
        lockedAt: any;
        lastUsed: any;
        addedAt: any;
        leased: boolean;
        limits: {};
    };
    /**
     * Import accounts from cookie-file text (any supported export format).
     * @param {string} name
     * @param {string} text - Contents of cookies.txt / JSON export / header string
     * @param {object} [extra] - `{ proxy }`
     */
    importCookies(name: string, text: string, extra?: object): {
        name: any;
        proxy: any;
        locked: boolean;
        lockReason: any;
        lockedAt: any;
        lastUsed: any;
        addedAt: any;
        leased: boolean;
        limits: {};
    };
    remove(name: any): boolean;
    get(name: any): {
        name: any;
        proxy: any;
        locked: boolean;
        lockReason: any;
        lockedAt: any;
        lastUsed: any;
        addedAt: any;
        leased: boolean;
        limits: {};
    };
    list(): any;
    size(): any;
    markLocked(name: any, reason?: string): void;
    unlock(name: any): void;
    /**
     * Record a response's rate-limit headers for `(account, operation)`.
     * A 429 with no reset header is treated as a spent window that reopens in
     * 15 minutes, which is X's window length.
     */
    recordResponse(name: any, operation: any, { status, remaining, resetAt }?: {}): void;
    /**
     * Mark an operation's window as spent for an account (used on a thrown
     * RateLimitError, whose `resetAt` came from the 429 response).
     */
    markRateLimited(name: any, operation: any, resetAt: any): void;
    /**
     * Lease the least-recently-used account that can serve `operation`.
     *
     * @param {string} operation - GraphQL operation name (`Followers`, ...)
     * @param {object} [opts]
     * @param {number} [opts.maxWaitMs] - Longest wait for a reset before throwing
     * @param {Iterable<string>} [opts.exclude] - Account names to skip
     * @returns {Promise<{ name: string, client: TwitterHttpClient, release: () => void }>}
     * @throws {AccountPoolError}
     */
    acquire(operation: string, opts?: {
        maxWaitMs?: number;
        exclude?: Iterable<string>;
    }): Promise<{
        name: string;
        client: TwitterHttpClient;
        release: () => void;
    }>;
    release(nameOrLease: any): void;
    stats(): {
        storePath: string;
        total: any;
        locked: any;
        leased: any;
        available: any;
        coolingDown: any;
        nextResetAt: any;
        accounts: any;
    };
    close(): void;
};
/**
 * A drop-in for `TwitterHttpClient` that spreads calls across a pool.
 *
 * @param {ReturnType<typeof createAccountPool>} pool
 * @param {object} [options]
 * @param {number} [options.maxAccounts] - Most accounts one call may try
 *   before the last error is rethrown. Defaults to the pool size at call time.
 * @param {number} [options.maxWaitMs] - Passed to `pool.acquire`.
 * @param {function} [options.onRotate] - `({ from, operation, reason, error })`
 */
export function createPooledClient(pool: ReturnType<typeof createAccountPool>, options?: {
    maxAccounts?: number;
    maxWaitMs?: number;
    onRotate?: Function;
}): {
    pool: {
        storePath: string;
        /**
         * Add or update an account. Cookies may be any format `parseCookieInput`
         * understands, an array of `{ name, value }`, a map, or `authToken` + `ct0`.
         */
        add(account: any): {
            name: any;
            proxy: any;
            locked: boolean;
            lockReason: any;
            lockedAt: any;
            lastUsed: any;
            addedAt: any;
            leased: boolean;
            limits: {};
        };
        /**
         * Import accounts from cookie-file text (any supported export format).
         * @param {string} name
         * @param {string} text - Contents of cookies.txt / JSON export / header string
         * @param {object} [extra] - `{ proxy }`
         */
        importCookies(name: string, text: string, extra?: object): {
            name: any;
            proxy: any;
            locked: boolean;
            lockReason: any;
            lockedAt: any;
            lastUsed: any;
            addedAt: any;
            leased: boolean;
            limits: {};
        };
        remove(name: any): boolean;
        get(name: any): {
            name: any;
            proxy: any;
            locked: boolean;
            lockReason: any;
            lockedAt: any;
            lastUsed: any;
            addedAt: any;
            leased: boolean;
            limits: {};
        };
        list(): any;
        size(): any;
        markLocked(name: any, reason?: string): void;
        unlock(name: any): void;
        /**
         * Record a response's rate-limit headers for `(account, operation)`.
         * A 429 with no reset header is treated as a spent window that reopens in
         * 15 minutes, which is X's window length.
         */
        recordResponse(name: any, operation: any, { status, remaining, resetAt }?: {}): void;
        /**
         * Mark an operation's window as spent for an account (used on a thrown
         * RateLimitError, whose `resetAt` came from the 429 response).
         */
        markRateLimited(name: any, operation: any, resetAt: any): void;
        /**
         * Lease the least-recently-used account that can serve `operation`.
         *
         * @param {string} operation - GraphQL operation name (`Followers`, ...)
         * @param {object} [opts]
         * @param {number} [opts.maxWaitMs] - Longest wait for a reset before throwing
         * @param {Iterable<string>} [opts.exclude] - Account names to skip
         * @returns {Promise<{ name: string, client: TwitterHttpClient, release: () => void }>}
         * @throws {AccountPoolError}
         */
        acquire(operation: string, opts?: {
            maxWaitMs?: number;
            exclude?: Iterable<string>;
        }): Promise<{
            name: string;
            client: TwitterHttpClient;
            release: () => void;
        }>;
        release(nameOrLease: any): void;
        stats(): {
            storePath: string;
            total: any;
            locked: any;
            leased: any;
            available: any;
            coolingDown: any;
            nextResetAt: any;
            accounts: any;
        };
        close(): void;
    };
    isAuthenticated(): any;
    graphql(queryId: any, operationName: any, variables: any, opts?: {}): Promise<any>;
    request(url: any, opts?: {}): Promise<any>;
    rest(path: any, opts?: {}): Promise<any>;
    graphqlPaginate(queryId: any, operationName: any, variables: any, opts?: {}): any;
};
/**
 * Thrown when the pool cannot hand out an account: none configured, all
 * locked, or the wait for the next reset exceeds `maxWaitMs`.
 */
export class AccountPoolError extends TwitterApiError {
    /**
     * @param {string} message
     * @param {object} [options]
     * @param {string} [options.operation]
     * @param {number|null} [options.nextResetAt] - Earliest reset among cooling accounts (ms)
     */
    constructor(message: string, { operation, nextResetAt }?: {
        operation?: string;
        nextResetAt?: number | null;
    });
    operation: string;
    nextResetAt: number;
}
import { TwitterHttpClient } from './client.js';
import { TwitterApiError } from './errors.js';
