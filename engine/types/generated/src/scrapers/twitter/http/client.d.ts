export class WaitingRateLimitStrategy {
    onRateLimit({ resetAt }: {
        resetAt: any;
    }): Promise<void>;
}
export class ErrorRateLimitStrategy {
    onRateLimit({ resetAt, endpoint }: {
        resetAt: any;
        endpoint: any;
    }): Promise<void>;
}
export class TwitterHttpClient {
    /**
     * @param {object} [options]
     * @param {string} [options.cookies] - Cookie string (`name=val; name2=val2`)
     * @param {string} [options.proxy] - Proxy URL (http(s)://, socks5://)
     * @param {'wait'|'error'|object} [options.rateLimitStrategy='error']
     * @param {number} [options.maxRetries=3]
     * @param {string|'rotate'} [options.userAgent]
     * @param {function} [options.fetch] - Custom fetch implementation
     * @param {function} [options.onResponse] - Called after every HTTP response with
     *   `{ url, status, remaining, resetAt }`, where `remaining` / `resetAt` come
     *   from the `x-rate-limit-remaining` / `x-rate-limit-reset` headers (null when
     *   absent, `resetAt` in ms). The account pool uses this to track per-account,
     *   per-operation rate-limit windows without wrapping fetch.
     * @param {boolean} [options.autoRefreshQueryIds] - Re-discover GraphQL query IDs
     *   from x.com's bundles when a call fails with a stale-ID error, and in the
     *   background when the on-disk cache is older than 24h. Defaults to true,
     *   except under vitest where it defaults to false so unit tests never reach
     *   the network unless they opt in.
     * @param {boolean} [options.transactionId] - Sign every request with an
     *   `x-client-transaction-id` header, the way x.com's own web client does.
     *   Defaults to on outside vitest, and can be switched off globally with
     *   `NANOMIND_X_TRANSACTION_ID=0` for debugging. Signing never blocks a
     *   request: if the keys cannot be obtained the request goes out unsigned.
     */
    constructor(options?: {
        cookies?: string;
        proxy?: string;
        rateLimitStrategy?: "wait" | "error" | object;
        maxRetries?: number;
        userAgent?: string | "rotate";
        fetch?: Function;
        onResponse?: Function;
        autoRefreshQueryIds?: boolean;
        transactionId?: boolean;
    });
    _cookies: {};
    _proxy: string;
    _maxRetries: number;
    _fetch: Function;
    _onResponse: Function;
    _proxyDispatcher: import("undici").ProxyAgent;
    _userAgents: string[];
    _autoRefreshQueryIds: boolean;
    _transactionId: boolean;
    _rateLimitStrategy: any;
    _debug: any;
    /**
     * Parse and store cookies from a browser-exported cookie string.
     * @param {string} cookieString - `auth_token=xxx; ct0=yyy; ...`
     */
    setCookies(cookieString: string): void;
    getCsrfToken(): any;
    isAuthenticated(): boolean;
    setProxy(proxyUrl: any): void;
    /**
     * Build (once) the undici ProxyAgent that routes this client's requests
     * through `options.proxy`. Node's global fetch honours the `dispatcher`
     * request option, so no fetch wrapper is needed. A custom `options.fetch`
     * is left alone: it owns its own transport.
     * @private
     */
    private _requestInit;
    /**
     * Build request headers.
     * @param {boolean} [authenticated=true]
     * @returns {object}
     */
    _buildHeaders(authenticated?: boolean): object;
    /**
     * Attach `x-client-transaction-id` to a request's headers, in place.
     *
     * x.com's web client signs every GraphQL and internal REST call with this
     * header; sessions that omit it look unlike any real browser. Generation is
     * best-effort by design, so a signing failure leaves the headers untouched
     * and the request still goes out.
     *
     * @param {string} method
     * @param {string} url
     * @param {object} headers Mutated in place
     * @private
     */
    private _signRequest;
    /**
     * Send an HTTP request with retry logic.
     *
     * @param {string} url
     * @param {object} [options]
     * @param {string} [options.method='GET']
     * @param {object|string} [options.body]
     * @param {object} [options.headers]
     * @param {boolean} [options.authenticated=true]
     * @returns {Promise<object>} Parsed JSON
     */
    request(url: string, options?: {
        method?: string;
        body?: object | string;
        headers?: object;
        authenticated?: boolean;
    }): Promise<object>;
    /**
     * Execute a GraphQL query (GET) or mutation (POST).
     *
     * @param {string} queryId
     * @param {string} operationName
     * @param {object} variables
     * @param {object} [options]
     * @param {object} [options.features]
     * @param {boolean} [options.mutation=false] - If true, sends POST
     * @returns {Promise<object>}
     */
    graphql(queryId: string, operationName: string, variables: object, options?: {
        features?: object;
        mutation?: boolean;
    }): Promise<object>;
    /**
     * One GraphQL round-trip with a fixed query ID.
     * @private
     */
    private _graphqlOnce;
    /**
     * A 404 on a GraphQL URL, or a 400 whose body names the persisted query,
     * means the query ID no longer exists on x.com's side.
     * @private
     */
    private _isStaleQueryIdFailure;
    /**
     * Re-discover query IDs from the live bundles and return the operation's
     * new ID, or null if discovery failed (offline, blocked, no bundle).
     * @private
     */
    private _refreshedQueryId;
    /**
     * Auto-paginating async generator over a GraphQL query.
     *
     * @param {string} queryId
     * @param {string} operationName
     * @param {object} variables
     * @param {object} [options]
     * @param {object} [options.features]
     * @param {number} [options.limit=Infinity] - Stop after this many items
     * @param {function} [options.onProgress] - Called with `{ fetched, limit }`
     * @yields {{ data: object, cursor: string|null }}
     */
    graphqlPaginate(queryId: string, operationName: string, variables: object, options?: {
        features?: object;
        limit?: number;
        onProgress?: Function;
    }): AsyncGenerator<any, void, unknown>;
    /**
     * Extract the "bottom" cursor from a Twitter timeline GraphQL response.
     * Twitter nests cursors in timeline instruction entries with entryId
     * starting with "cursor-bottom".
     *
     * @param {object} json
     * @returns {string|null}
     * @private
     */
    private _extractCursor;
    /**
     * Recursively search the response for a timeline instructions array.
     * @param {object} obj
     * @returns {Array|null}
     * @private
     */
    private _findInstructions;
    /**
     * Execute a REST API call (typically POST with form data).
     *
     * @param {string} path — e.g. `/1.1/friendships/create.json`
     * @param {object} [options]
     * @param {string} [options.method='POST']
     * @param {object} [options.body] - Will be sent as x-www-form-urlencoded for REST
     * @returns {Promise<object>}
     */
    rest(path: string, options?: {
        method?: string;
        body?: object;
    }): Promise<object>;
}
