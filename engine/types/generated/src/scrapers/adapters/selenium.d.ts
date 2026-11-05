export class SeleniumAdapter extends BaseAdapter {
    checkDependencies(): Promise<{
        available: boolean;
        message?: undefined;
    } | {
        available: boolean;
        message: string;
    }>;
    /**
     * Launch a Selenium WebDriver browser.
     *
     * Options:
     *   - browser: 'chrome' (default), 'firefox', 'edge', 'safari'
     *   - headless: boolean (default true)
     *   - seleniumServer: URL of remote Selenium Grid (optional)
     */
    launch(options?: {}): Promise<{
        _native: any;
        _adapter: string;
        _browserName: any;
    }>;
    /**
     * newPage in Selenium opens a new tab/window (or reuses the main one).
     * Selenium doesn't have the same page concept as Puppeteer — the driver IS the page.
     */
    newPage(browser: any, options?: {}): Promise<{
        _native: any;
        _adapter: string;
        _windowHandle: any;
        _isNewWindow: boolean;
    }>;
    goto(page: any, url: any, options?: {}): Promise<void>;
    evaluate(page: any, fn: any, ...args: any[]): Promise<any>;
    queryAll(page: any, selector: any, mapFn: any): Promise<any>;
    getContent(page: any): Promise<any>;
    setCookie(page: any, cookie: any): Promise<void>;
    scroll(page: any, options?: {}): Promise<void>;
    screenshot(page: any, options?: {}): Promise<Buffer<ArrayBuffer>>;
    waitForSelector(page: any, selector: any, options?: {}): Promise<void>;
    closePage(page: any): Promise<void>;
    closeBrowser(browser: any): Promise<void>;
    /**
     * Selenium-specific: Open a new tab/window and return a page for it.
     * Use this to manage multiple pages in the same Selenium session.
     */
    newTab(browser: any): Promise<{
        _native: any;
        _adapter: string;
        _windowHandle: any;
        _isNewWindow: boolean;
    }>;
    /**
     * Selenium-specific: Get all window handles.
     */
    getWindowHandles(browser: any): Promise<any>;
    /**
     * Selenium-specific: Execute async script (for scripts that use callbacks).
     */
    executeAsyncScript(page: any, script: any, ...args: any[]): Promise<any>;
    /**
     * Selenium-specific: Wait for a custom condition.
     */
    waitFor(page: any, conditionFn: any, timeout?: number): Promise<void>;
    getNativePage(page: any): any;
    getNativeBrowser(browser: any): any;
    #private;
}
export default SeleniumAdapter;
import { BaseAdapter } from './base.js';
