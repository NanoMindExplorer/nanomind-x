export class GotJsdomAdapter extends BaseAdapter {
    checkDependencies(): Promise<{
        available: boolean;
        message: string;
    } | {
        available: boolean;
        message?: undefined;
    }>;
    /**
     * Launch creates a configured HTTP session context.
     *
     * Options:
     *   - headerGeneratorOptions: got-scraping header generation config
     *   - proxyUrl: single proxy URL
     *   - fingerprint: 'chrome' | 'firefox' | 'safari' (browser to mimic)
     *   - runScripts: 'dangerously' | 'outside-only' | false (JSDOM script execution)
     */
    launch(options?: {}): Promise<{
        _native: any;
        _adapter: string;
        _sessionOptions: {
            headerGeneratorOptions: any;
        };
        _cookies: Map<any, any>;
        _runScripts: any;
        _fingerprint: any;
    }>;
    newPage(browser: any, options?: {}): Promise<{
        _native: any;
        _adapter: string;
        _browser: any;
        _dom: any;
        _window: any;
        _document: any;
        _html: string;
        _url: string;
        _cookies: Map<any, any>;
        _headers: {
            'User-Agent': any;
        };
    }>;
    goto(page: any, url: any, options?: {}): Promise<void>;
    /**
     * Execute JavaScript against the JSDOM window.
     *
     * Note: JSDOM's JS execution is limited. For full browser JS, use
     * puppeteer/playwright. This handles basic DOM manipulation and queries.
     *
     * The function runs with the JSDOM window and document in scope.
     */
    evaluate(page: any, fn: any, ...args: any[]): Promise<any>;
    queryAll(page: any, selector: any, mapFn: any): Promise<any>;
    getContent(page: any): Promise<any>;
    setCookie(page: any, cookie: any): Promise<void>;
    scroll(page: any, options?: {}): Promise<void>;
    screenshot(page: any, options?: {}): Promise<Buffer<any>>;
    waitForSelector(page: any, selector: any, options?: {}): Promise<void>;
    closePage(page: any): Promise<void>;
    closeBrowser(browser: any): Promise<void>;
    /**
     * Got-Scraping specific: Make a raw HTTP request with browser TLS fingerprints.
     * Useful for API endpoints or when you need the raw response.
     *
     * @param {string} url
     * @param {Object} [options] - got-scraping options
     * @returns {Promise<Object>} Response with body, statusCode, headers
     */
    fetch(url: string, options?: any): Promise<any>;
    /**
     * Got-Scraping specific: Make a JSON API request with browser fingerprints.
     */
    fetchJSON(url: any, options?: {}): Promise<any>;
    /**
     * Got-Scraping specific: Switch the TLS fingerprint being mimicked.
     * @param {'chrome'|'firefox'|'safari'} browser
     */
    setFingerprint(browser: "chrome" | "firefox" | "safari", fingerprint: any): void;
    getNativePage(page: any): any;
    getNativeBrowser(browser: any): any;
    #private;
}
export default GotJsdomAdapter;
import { BaseAdapter } from './base.js';
