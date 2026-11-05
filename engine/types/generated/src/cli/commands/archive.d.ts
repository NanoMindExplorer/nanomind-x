/**
 * Parse `--formats json,csv` into a validated list.
 * @param {string|undefined} raw
 * @returns {string[]}
 */
export function parseFormats(raw: string | undefined): string[];
/**
 * Parse `--sections tweets,likes` into a validated list, or undefined for all.
 * @param {string|undefined} raw
 * @param {string[]} allSections
 * @returns {string[]|undefined}
 */
export function parseSections(raw: string | undefined, allSections: string[]): string[] | undefined;
/**
 * Turn an importer progress event into one spinner line.
 * @param {{phase: string, file?: string, completed?: number, total?: number, records?: number}} event
 * @returns {string}
 */
export function progressLine(event: {
    phase: string;
    file?: string;
    completed?: number;
    total?: number;
    records?: number;
}): string;
/**
 * `archive summary <path>`.
 * @param {string} archivePath
 * @param {{json?: boolean, top?: string|number, sections?: string}} options
 * @param {object} mode resolved output mode
 * @returns {Promise<object>} the summary
 */
export function summaryCommand(archivePath: string, options: {
    json?: boolean;
    top?: string | number;
    sections?: string;
}, mode: object): Promise<object>;
/**
 * `archive export <path> --out <dir>`.
 * @param {string} archivePath
 * @param {{out?: string, formats?: string, sections?: string, json?: boolean}} options
 * @param {object} mode resolved output mode
 * @returns {Promise<{dir: string, files: string[], counts: object}>}
 */
export function exportCommand(archivePath: string, options: {
    out?: string;
    formats?: string;
    sections?: string;
    json?: boolean;
}, mode: object): Promise<{
    dir: string;
    files: string[];
    counts: object;
}>;
/**
 * `archive migrate <path> --to <platform>`.
 * @param {string} archivePath
 * @param {object} options
 * @param {object} mode resolved output mode
 * @returns {Promise<object>} the migration summary
 */
export function migrateCommand(archivePath: string, options: object, mode: object): Promise<object>;
/**
 * Register `nanomind-x archive` and its sub-commands.
 * @param {import('commander').Command} program
 */
export function registerArchiveCommand(program: import("commander").Command): void;
/** Output formats `export --formats` accepts. */
export const ARCHIVE_FORMATS: string[];
/** Platforms `migrate --to` accepts. */
export const MIGRATE_TARGETS: string[];
