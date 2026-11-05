export const name: "nanomind-x-plugin-excel";
export const version: "1.0.0";
export const description: "Export scraped X/Twitter data to Excel (.xlsx) files with styling and auto-filters";
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
            filepath: {
                type: string;
                description: string;
            };
            sheetName: {
                type: string;
                description: string;
            };
            columns: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            sheets?: undefined;
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
            sheets: {
                type: string;
                description: string;
            };
            filepath: {
                type: string;
                description: string;
            };
            data?: undefined;
            sheetName?: undefined;
            columns?: undefined;
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
            filepath: {
                type: string;
                description: string;
            };
            sheetName: {
                type: string;
                description: string;
            };
            data?: undefined;
            columns?: undefined;
            sheets?: undefined;
        };
        required: string[];
    };
    handler: (args: any) => Promise<any[]>;
})[];
/**
 * Express route handlers
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
 * Export scraped data to an Excel (.xlsx) file.
 *
 * @param {Object|Object[]} data - Scraped data (raw scraper output or array)
 * @param {Object} options
 * @param {string}  options.filepath - Output file path (.xlsx)
 * @param {string}  [options.sheetName='Data'] - Sheet/tab name
 * @param {string[]} [options.columns] - Explicit column order
 * @param {boolean} [options.autoFilter=true] - Add auto-filter to header row
 * @param {boolean} [options.autoWidth=true] - Auto-fit column widths
 * @param {boolean} [options.styled=true] - Apply header styling and alternating row colors
 * @param {boolean} [options.freezeHeader=true] - Freeze the header row
 * @returns {Promise<Object>} Result summary
 */
export function exportToExcel(data: any | any[], options?: {
    filepath: string;
    sheetName?: string;
    columns?: string[];
    autoFilter?: boolean;
    autoWidth?: boolean;
    styled?: boolean;
    freezeHeader?: boolean;
}): Promise<any>;
/**
 * Export multiple datasets to a multi-sheet Excel workbook.
 *
 * @param {Object} sheets - { sheetName: data, ... }
 * @param {Object} options
 * @param {string} options.filepath - Output file path (.xlsx)
 * @param {boolean} [options.styled=true]
 * @returns {Promise<Object>}
 */
export function exportMultiSheet(sheets: any, options?: {
    filepath: string;
    styled?: boolean;
}): Promise<any>;
/**
 * Read an Excel file into an array of objects (first sheet by default).
 *
 * @param {Object} options
 * @param {string} options.filepath - Path to .xlsx file
 * @param {string} [options.sheetName] - Sheet name (default: first sheet)
 * @returns {Promise<Object[]>}
 */
export function readFromExcel(options?: {
    filepath: string;
    sheetName?: string;
}): Promise<any[]>;
/**
 * Normalize scraped data into a flat array of objects.
 */
export function normalizeData(data: any): any[];
