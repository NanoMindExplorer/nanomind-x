/**
 * @typedef {Object} Cookie
 * @property {string} name
 * @property {string} value
 * @property {string} [domain='.x.com']
 * @property {string} [path='/']
 * @property {Date|null} [expires=null]
 * @property {boolean} [httpOnly=false]
 * @property {boolean} [secure=false]
 * @property {string} [sameSite='Lax']
 */
/**
 * Lightweight cookie jar for Twitter session cookies.
 */
export class CookieJar {
    /**
     * Deserialize from a JSON array.
     *
     * @param {Array<Cookie>} json
     * @returns {CookieJar}
     */
    static fromJSON(json: Array<Cookie>): CookieJar;
    /**
     * Load cookies from a JSON file.
     * Returns an empty CookieJar if the file doesn't exist.
     *
     * @param {string} filePath
     * @returns {Promise<CookieJar>}
     */
    static loadFromFile(filePath: string): Promise<CookieJar>;
    /**
     * @param {Array<Cookie>} [cookies] - Optional initial cookies
     */
    constructor(cookies?: Array<Cookie>);
    /** @private @type {Map<string, Cookie>} */
    private _cookies;
    /**
     * Add or update a cookie by name.
     *
     * @param {Cookie|{name: string, value: string}} cookie
     */
    set(cookie: Cookie | {
        name: string;
        value: string;
    }): void;
    /**
     * Get a cookie by name.
     *
     * @param {string} name
     * @returns {Cookie|null}
     */
    get(name: string): Cookie | null;
    /**
     * Get all cookies as an array.
     *
     * @returns {Array<Cookie>}
     */
    getAll(): Array<Cookie>;
    /**
     * Get just the value of a cookie by name.
     *
     * @param {string} name
     * @returns {string|null}
     */
    getValue(name: string): string | null;
    /**
     * Remove a cookie by name.
     *
     * @param {string} name
     */
    remove(name: string): void;
    /**
     * Remove all cookies.
     */
    clear(): void;
    /**
     * Check if a cookie exists.
     *
     * @param {string} name
     * @returns {boolean}
     */
    has(name: string): boolean;
    /**
     * Format as HTTP Cookie header value: "name1=value1; name2=value2".
     *
     * @returns {string}
     */
    toCookieString(): string;
    /**
     * Serialize to a JSON-safe array.
     *
     * @returns {Array<Cookie>}
     */
    toJSON(): Array<Cookie>;
    /**
     * Save cookies to a JSON file.
     * Creates the directory if it doesn't exist.
     *
     * @param {string} filePath
     * @returns {Promise<void>}
     */
    saveToFile(filePath: string): Promise<void>;
    /**
     * Check if a specific cookie has expired.
     *
     * @param {string} name
     * @returns {boolean}
     */
    isExpired(name: string): boolean;
    /**
     * Remove all expired cookies.
     */
    removeExpired(): void;
    /**
     * Get the number of stored cookies.
     *
     * @returns {number}
     */
    get size(): number;
}
export default CookieJar;
export type Cookie = {
    name: string;
    value: string;
    domain?: string;
    path?: string;
    expires?: Date | null;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: string;
};
