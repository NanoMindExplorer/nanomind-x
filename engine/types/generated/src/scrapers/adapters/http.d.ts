export class HttpAdapter extends BaseAdapter {
    checkDependencies(): Promise<{
        available: boolean;
        message?: undefined;
    } | {
        available: boolean;
        message: string;
    }>;
    /**
     * "Launch" for HTTP means creating a client instance (no browser to spawn).
     * @param {Object} options
     * @param {string} [options.cookies] - Browser cookie string for auth
     * @param {string} [options.proxy] - HTTP/SOCKS5 proxy URL
     * @param {'wait'|'error'} [options.rateLimitStrategy] - Rate limit handling
     * @returns {Promise<Object>} Browser-like object wrapping the HTTP scraper
     */
    launch(options?: {
        cookies?: string;
        proxy?: string;
        rateLimitStrategy?: "wait" | "error";
    }): Promise<any>;
    /**
     * HTTP doesn't have pages — return the scraper itself as the "page".
     * @param {Object} browser - Object returned by launch()
     * @param {Object} [options] - Ignored for HTTP
     * @returns {Promise<Object>}
     */
    newPage(browser: any, options?: any): Promise<any>;
    goto(page: any, url: any, options?: {}): Promise<void>;
    evaluate(page: any, fn: any, ...args: any[]): Promise<void>;
    queryAll(page: any, selector: any, mapFn: any): Promise<void>;
    getContent(page: any): Promise<void>;
    /**
     * Set a cookie on the HTTP client.
     * @param {Object} page - Page-like object from newPage()
     * @param {Object} cookie - Cookie to set
     * @param {string} cookie.name
     * @param {string} cookie.value
     */
    setCookie(page: any, cookie: {
        name: string;
        value: string;
    }): Promise<void>;
    scroll(page: any, options?: {}): Promise<void>;
    screenshot(page: any, options?: {}): Promise<void>;
    waitForSelector(page: any, selector: any, options?: {}): Promise<void>;
    closePage(page: any): Promise<void>;
    closeBrowser(browser: any): Promise<void>;
    /**
     * Get the underlying HTTP scraper object for direct access.
     * @param {Object} browser - Object returned by launch()
     * @returns {Object} The scraper with all bound methods
     */
    getScraper(browser: any): any;
}
export default HttpAdapter;
import { BaseAdapter } from './base.js';
