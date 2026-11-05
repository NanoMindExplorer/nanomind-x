export class CheerioAdapter extends BaseAdapter {
    checkDependencies(): Promise<{
        available: boolean;
        message?: undefined;
    } | {
        available: boolean;
        message: string;
    }>;
    launch(options?: {}): Promise<{
        _native: any;
        _adapter: string;
        _options: {
            headers: any;
            proxy: any;
            timeout: any;
        };
        _cookies: Map<any, any>;
    }>;
    newPage(browser: any, options?: {}): Promise<{
        _native: any;
        _adapter: string;
        _browser: any;
        _html: string;
        _url: string;
        _cookies: Map<any, any>;
        _headers: any;
        _cheerio: any;
    }>;
    goto(page: any, url: any, options?: {}): Promise<void>;
    evaluate(page: any, fn: any, ...args: any[]): Promise<void>;
    /**
     * Query elements with Cheerio and optionally map them.
     * The mapFn receives a Cheerio-wrapped element and the Cheerio instance.
     *
     * @param {Object} page
     * @param {string} selector
     * @param {Function} [mapFn] - (elements$, $) => array — receives Cheerio collection
     * @returns {Promise<Array>}
     */
    queryAll(page: any, selector: string, mapFn?: Function): Promise<any[]>;
    getContent(page: any): Promise<any>;
    setCookie(page: any, cookie: any): Promise<void>;
    scroll(page: any, options?: {}): Promise<void>;
    screenshot(page: any, options?: {}): Promise<Buffer<any>>;
    waitForSelector(page: any, selector: any, options?: {}): Promise<void>;
    closePage(page: any): Promise<void>;
    closeBrowser(browser: any): Promise<void>;
    /**
     * Cheerio-specific: Parse arbitrary HTML string
     * @param {string} html
     * @returns {Object} Cheerio $ instance
     */
    parseHTML(html: string): any;
    /**
     * Make a raw HTTP request (useful for APIs, JSON endpoints)
     * @param {string} url
     * @param {Object} [options] - fetch() options
     * @returns {Promise<*>} Parsed JSON or text
     */
    fetchJSON(url: string, options?: any): Promise<any>;
    #private;
}
export default CheerioAdapter;
import { BaseAdapter } from './base.js';
