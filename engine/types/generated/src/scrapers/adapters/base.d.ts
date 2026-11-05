/**
 * nanomind-x Scraper Adapter — Base Class
 *
 * Abstract interface that all scraper framework adapters must implement.
 * This enables nanomind-x to work with Puppeteer, Playwright, HTTP/Cheerio,
 * or any other scraping framework.
 *
 * @author nich (@nichxbt)
 * @license Apache-2.0
 */
/**
 * @typedef {Object} AdapterBrowser
 * @property {Function} newPage - Create a new page/context
 * @property {Function} close - Close the browser
 * @property {*} _native - The underlying native browser instance
 */
/**
 * @typedef {Object} AdapterPage
 * @property {Function} goto - Navigate to a URL
 * @property {Function} evaluate - Execute JS in page context (browser adapters)
 * @property {Function} querySelectorAll - Query DOM elements
 * @property {Function} setCookie - Set a cookie
 * @property {Function} setViewport - Set viewport size
 * @property {Function} setUserAgent - Set user agent string
 * @property {Function} scroll - Scroll the page
 * @property {Function} close - Close the page
 * @property {*} _native - The underlying native page instance
 */
export class BaseAdapter {
    /** @type {string} Adapter name */
    name: string;
    /** @type {string} Adapter description */
    description: string;
    /** @type {boolean} Whether this adapter supports JavaScript execution */
    supportsJavaScript: boolean;
    /** @type {boolean} Whether this adapter needs a browser binary */
    requiresBrowser: boolean;
    /**
     * Check if this adapter's dependencies are available
     * @returns {Promise<{ available: boolean, message?: string }>}
     */
    checkDependencies(): Promise<{
        available: boolean;
        message?: string;
    }>;
    /**
     * Launch a browser instance (or equivalent context)
     * @param {Object} options
     * @param {boolean} [options.headless=true] - Run in headless mode
     * @param {string[]} [options.args] - Additional browser arguments
     * @param {Object} [options.proxy] - Proxy configuration
     * @returns {Promise<AdapterBrowser>}
     */
    launch(options?: {
        headless?: boolean;
        args?: string[];
        proxy?: any;
    }): Promise<AdapterBrowser>;
    /**
     * Create a new page with realistic settings
     * @param {AdapterBrowser} browser
     * @param {Object} [options]
     * @param {string} [options.userAgent] - Custom user agent
     * @param {{ width: number, height: number }} [options.viewport] - Viewport size
     * @returns {Promise<AdapterPage>}
     */
    newPage(browser: AdapterBrowser, options?: {
        userAgent?: string;
        viewport?: {
            width: number;
            height: number;
        };
    }): Promise<AdapterPage>;
    /**
     * Navigate to a URL
     * @param {AdapterPage} page
     * @param {string} url
     * @param {Object} [options]
     * @param {string} [options.waitUntil] - Wait until condition ('load', 'domcontentloaded', 'networkidle')
     * @param {number} [options.timeout] - Navigation timeout in ms
     * @returns {Promise<void>}
     */
    goto(page: AdapterPage, url: string, options?: {
        waitUntil?: string;
        timeout?: number;
    }): Promise<void>;
    /**
     * Execute JavaScript in page context
     * Only available for browser-based adapters (supportsJavaScript === true)
     * @param {AdapterPage} page
     * @param {Function|string} fn - Function or string to evaluate
     * @param {...*} args - Arguments to pass to the function
     * @returns {Promise<*>} Result of evaluation
     */
    evaluate(page: AdapterPage, fn: Function | string, ...args: any[]): Promise<any>;
    /**
     * Query all matching elements and extract data
     * Works for both browser and HTTP adapters
     * @param {AdapterPage} page
     * @param {string} selector - CSS selector
     * @param {Function} [mapFn] - Function to map each element (receives element)
     * @returns {Promise<Array>}
     */
    queryAll(page: AdapterPage, selector: string, mapFn?: Function): Promise<any[]>;
    /**
     * Get the full HTML content of the page
     * @param {AdapterPage} page
     * @returns {Promise<string>}
     */
    getContent(page: AdapterPage): Promise<string>;
    /**
     * Set a cookie on the page/context
     * @param {AdapterPage} page
     * @param {Object} cookie
     * @param {string} cookie.name
     * @param {string} cookie.value
     * @param {string} cookie.domain
     * @param {string} [cookie.path]
     * @param {boolean} [cookie.httpOnly]
     * @param {boolean} [cookie.secure]
     * @returns {Promise<void>}
     */
    setCookie(page: AdapterPage, cookie: {
        name: string;
        value: string;
        domain: string;
        path?: string;
        httpOnly?: boolean;
        secure?: boolean;
    }): Promise<void>;
    /**
     * Scroll the page
     * @param {AdapterPage} page
     * @param {Object} [options]
     * @param {number} [options.x=0] - Horizontal scroll
     * @param {number} [options.y] - Vertical scroll (defaults to bottom)
     * @returns {Promise<void>}
     */
    scroll(page: AdapterPage, options?: {
        x?: number;
        y?: number;
    }): Promise<void>;
    /**
     * Take a screenshot
     * @param {AdapterPage} page
     * @param {Object} [options]
     * @param {string} [options.path] - File path to save
     * @param {boolean} [options.fullPage] - Capture full page
     * @returns {Promise<Buffer>}
     */
    screenshot(page: AdapterPage, options?: {
        path?: string;
        fullPage?: boolean;
    }): Promise<Buffer>;
    /**
     * Wait for a selector to appear
     * @param {AdapterPage} page
     * @param {string} selector
     * @param {Object} [options]
     * @param {number} [options.timeout=30000]
     * @returns {Promise<void>}
     */
    waitForSelector(page: AdapterPage, selector: string, options?: {
        timeout?: number;
    }): Promise<void>;
    /**
     * Close a page
     * @param {AdapterPage} page
     * @returns {Promise<void>}
     */
    closePage(page: AdapterPage): Promise<void>;
    /**
     * Close a browser instance
     * @param {AdapterBrowser} browser
     * @returns {Promise<void>}
     */
    closeBrowser(browser: AdapterBrowser): Promise<void>;
    /**
     * Get adapter info
     * @returns {Object}
     */
    getInfo(): any;
}
export default BaseAdapter;
export type AdapterBrowser = {
    /**
     * - Create a new page/context
     */
    newPage: Function;
    /**
     * - Close the browser
     */
    close: Function;
    /**
     * - The underlying native browser instance
     */
    _native: any;
};
export type AdapterPage = {
    /**
     * - Navigate to a URL
     */
    goto: Function;
    /**
     * - Execute JS in page context (browser adapters)
     */
    evaluate: Function;
    /**
     * - Query DOM elements
     */
    querySelectorAll: Function;
    /**
     * - Set a cookie
     */
    setCookie: Function;
    /**
     * - Set viewport size
     */
    setViewport: Function;
    /**
     * - Set user agent string
     */
    setUserAgent: Function;
    /**
     * - Scroll the page
     */
    scroll: Function;
    /**
     * - Close the page
     */
    close: Function;
    /**
     * - The underlying native page instance
     */
    _native: any;
};
