export class PuppeteerAdapter extends BaseAdapter {
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
    }>;
    newPage(browser: any, options?: {}): Promise<{
        _native: any;
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
     * Get the native Puppeteer page for direct access (backward compat / advanced usage)
     */
    getNativePage(page: any): any;
    /**
     * Get the native Puppeteer browser for direct access
     */
    getNativeBrowser(browser: any): any;
    #private;
}
export default PuppeteerAdapter;
import { BaseAdapter } from './base.js';
