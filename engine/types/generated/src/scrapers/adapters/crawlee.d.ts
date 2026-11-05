export class CrawleeAdapter extends BaseAdapter {
    checkDependencies(): Promise<{
        available: boolean;
        message?: undefined;
    } | {
        available: boolean;
        message: string;
    }>;
    /**
     * Launch a Crawlee browser pool.
     *
     * Options:
     *   - browserPlugin: 'puppeteer' (default) or 'playwright'
     *   - proxyUrls: string[] of proxy URLs for rotation
     *   - maxConcurrency: max concurrent pages (default 1)
     *   - sessionPoolOptions: Crawlee session pool config
     */
    launch(options?: {}): Promise<{
        _native: any;
        _adapter: string;
        _browserPlugin: any;
        _proxyConfiguration: any;
        _crawlee: any;
    }>;
    newPage(browser: any, options?: {}): Promise<{
        _native: any;
        _adapter: string;
        _browserPool: any;
    }>;
    goto(page: any, url: any, options?: {}): Promise<void>;
    evaluate(page: any, fn: any, ...args: any[]): Promise<any>;
    queryAll(page: any, selector: any, mapFn: any): Promise<any>;
    getContent(page: any): Promise<any>;
    setCookie(page: any, cookie: any): Promise<void>;
    scroll(page: any, options?: {}): Promise<void>;
    screenshot(page: any, options?: {}): Promise<any>;
    waitForSelector(page: any, selector: any, options?: {}): Promise<void>;
    closePage(page: any): Promise<void>;
    closeBrowser(browser: any): Promise<void>;
    /**
     * Crawlee-specific: Create a full PuppeteerCrawler or PlaywrightCrawler
     * for batch crawling jobs with automatic queuing, retry, and proxy rotation.
     *
     * This is the "Crawlee way" — you define a requestHandler and let Crawlee
     * manage the crawl lifecycle.
     *
     * @param {Object} options
     * @param {Function} options.requestHandler - async (context) => { ... }
     * @param {string[]} [options.startUrls] - URLs to crawl
     * @param {number} [options.maxRequestsPerCrawl] - Limit total requests
     * @param {number} [options.maxConcurrency] - Concurrent pages
     * @param {string[]} [options.proxyUrls] - Proxy URLs for rotation
     * @returns {Object} Crawler instance with run() method
     */
    createCrawler(options?: {
        requestHandler: Function;
        startUrls?: string[];
        maxRequestsPerCrawl?: number;
        maxConcurrency?: number;
        proxyUrls?: string[];
    }): any;
    getNativePage(page: any): any;
    getNativeBrowser(browser: any): any;
    #private;
}
export default CrawleeAdapter;
import { BaseAdapter } from './base.js';
