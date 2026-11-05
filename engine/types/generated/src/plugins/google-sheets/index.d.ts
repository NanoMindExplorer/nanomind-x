export const name: "nanomind-x-plugin-google-sheets";
export const version: "1.0.0";
export const description: "Export scraped X/Twitter data directly to Google Sheets";
/**
 * MCP tool definitions — AI agents (Claude, GPT) can call these
 */
export const tools: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            data: {
                type: string[];
                description: string;
            };
            spreadsheetId: {
                type: string;
                description: string;
            };
            sheetName: {
                type: string;
                description: string;
            };
            mode: {
                type: string;
                enum: string[];
                description: string;
            };
            columns: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            range?: undefined;
            title?: undefined;
            sheetNames?: undefined;
        };
        required: string[];
    };
    handler: (args: any) => Promise<any>;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            spreadsheetId: {
                type: string;
                description: string;
            };
            sheetName: {
                type: string;
                description: string;
            };
            range: {
                type: string;
                description: string;
            };
            data?: undefined;
            mode?: undefined;
            columns?: undefined;
            title?: undefined;
            sheetNames?: undefined;
        };
        required: string[];
    };
    handler: (args: any) => Promise<any[]>;
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            title: {
                type: string;
                description: string;
            };
            sheetNames: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            data?: undefined;
            spreadsheetId?: undefined;
            sheetName?: undefined;
            mode?: undefined;
            columns?: undefined;
            range?: undefined;
        };
        required: any[];
    };
    handler: (args: any) => Promise<any>;
})[];
/**
 * Express route handlers (mounted under /api/plugins/nanomind-x-plugin-google-sheets/)
 */
export const routes: {
    method: string;
    path: string;
    description: string;
    handler: (req: any, res: any) => Promise<any>;
}[];
export namespace hooks {
    function onLoad(): void;
    function onUnload(): void;
}
declare namespace _default {
    export { name };
    export { version };
    export { description };
    export { tools };
    export { routes };
    export { hooks };
}
export default _default;
/**
 * Export scraped data to a Google Sheet.
 *
 * @param {Object|Object[]} data - Scraped data (raw scraper output or array of objects)
 * @param {Object} options
 * @param {string}  options.spreadsheetId - Google Sheet ID (from the URL)
 * @param {string}  [options.sheetName='Sheet1'] - Target sheet/tab name
 * @param {string}  [options.mode='append'] - 'append' | 'replace' | 'new-sheet'
 * @param {string[]} [options.columns] - Explicit column order
 * @param {boolean} [options.includeHeaders=true] - Write header row
 * @returns {Promise<Object>} Result summary
 */
export function exportToGoogleSheets(data: any | any[], options?: {
    spreadsheetId: string;
    sheetName?: string;
    mode?: string;
    columns?: string[];
    includeHeaders?: boolean;
}): Promise<any>;
/**
 * Read data from a Google Sheet into an array of objects.
 *
 * @param {Object} options
 * @param {string} options.spreadsheetId
 * @param {string} [options.sheetName='Sheet1']
 * @param {string} [options.range] - Custom A1 range (overrides sheetName)
 * @returns {Promise<Object[]>}
 */
export function readFromGoogleSheets(options?: {
    spreadsheetId: string;
    sheetName?: string;
    range?: string;
}): Promise<any[]>;
/**
 * Create a new Google Spreadsheet.
 *
 * @param {Object} options
 * @param {string} options.title - Spreadsheet title
 * @param {string[]} [options.sheetNames=['Sheet1']] - Tab names to create
 * @returns {Promise<Object>} { spreadsheetId, url, title }
 */
export function createSpreadsheet(options?: {
    title: string;
    sheetNames?: string[];
}): Promise<any>;
/**
 * Build an authenticated Google Sheets client from environment variables.
 *
 * Priority:
 *   1. GOOGLE_SERVICE_ACCOUNT_KEY (inline JSON string)
 *   2. GOOGLE_SERVICE_ACCOUNT_KEY_FILE (path to .json key file)
 *   3. GOOGLE_ACCESS_TOKEN (OAuth2 bearer token)
 *   4. GOOGLE_API_KEY (read-only, public sheets only)
 *
 * @returns {Promise<{ sheets: object, authType: string }>}
 */
export function getSheetsClient(): Promise<{
    sheets: object;
    authType: string;
}>;
/**
 * Normalize scraped data into a flat array of objects.
 * Handles the various shapes returned by nanomind-x scrapers.
 */
export function normalizeData(data: any): any[];
/**
 * Flatten an array of objects into a 2D array: [headers, ...rows].
 * Handles nested objects by JSON-stringifying them.
 *
 * @param {Object[]} items
 * @param {string[]} [columns] - Explicit column order; default: union of all keys
 * @returns {{ headers: string[], rows: any[][] }}
 */
export function toSheetRows(items: any[], columns?: string[]): {
    headers: string[];
    rows: any[][];
};
