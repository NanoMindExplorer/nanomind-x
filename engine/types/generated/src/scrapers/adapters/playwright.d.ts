export class PlaywrightAdapter extends BaseAdapter {
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
        _browserType: any;
    }>;
    newPage(browser: any, options?: {}): Promise<{
        _native: any;
        _context: any;
        _adapter: string;
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
     * Start tracing (Playwright-specific — useful for debugging)
     */
    startTracing(page: any, options?: {}): Promise<void>;
    /**
     * Stop tracing and save
     */
    stopTracing(page: any, path?: string): Promise<void>;
    /**
     * Route interception (Playwright-specific)
     * Block images, CSS, fonts to speed up scraping
     */
    blockResources(page: any, resourceTypes?: string[]): Promise<void>;
    getNativePage(page: any): any;
    getNativeBrowser(browser: any): any;
    #private;
}
export default PlaywrightAdapter;
import { BaseAdapter } from './base.js';
