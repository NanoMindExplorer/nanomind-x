/**
 * Parse a `--fields` value into a list of field names.
 *
 * @param {string|string[]|undefined} value - `"id,text,likes"`, an array, or nothing
 * @returns {string[]|null} Null when no selection was made
 */
export function parseFields(value: string | string[] | undefined): string[] | null;
/**
 * Reduce one record to the canonical flat vocabulary.
 *
 * Tweets arrive in two shapes (the HTTP client's model with `likes` at the top
 * level, and the GraphQL parser's with `metrics.likes` and `author.username`),
 * profiles in two (`followers` versus `followersCount`), and the browser
 * scrapers add a third with `timestamp` strings. This maps all of them to one
 * set of names so `--fields likes` means the same thing on every command.
 *
 * @param {object} record
 * @returns {Record<string, unknown>} Only the fields that had a value
 */
export function flattenRecord(record: object): Record<string, unknown>;
/**
 * Reduce an account report (from `nanomind-x analyze`) to the compact vocabulary.
 * @param {object} report
 * @returns {Record<string, unknown>}
 */
export function flattenReport(report: object): Record<string, unknown>;
/**
 * Render one value for a single-line record. Newlines and tabs are the only
 * characters that would break the line format, so they become spaces.
 * @param {unknown} value
 * @returns {string}
 */
export function formatValue(value: unknown): string;
/**
 * Choose the columns for a record kind, honouring an explicit `--fields`.
 * @param {string} kind
 * @param {string[]|null} fields
 * @returns {string[]}
 */
export function selectFields(kind: string, fields: string[] | null): string[];
/**
 * Format records as compact lines.
 *
 * @param {object|object[]} data - One record or a list
 * @param {object} [options]
 * @param {'tweet'|'profile'|'user'|'media'|'report'|'record'} [options.kind='record']
 * @param {string[]|string|null} [options.fields] - Explicit column selection
 * @returns {string} One line per record, no trailing newline
 */
export function formatCompact(data: object | object[], { kind, fields }?: {
    kind?: "tweet" | "profile" | "user" | "media" | "report" | "record";
    fields?: string[] | string | null;
}): string;
/**
 * Print records in compact form to stdout.
 * @param {object|object[]} data
 * @param {object} [options] - See {@link formatCompact}
 */
export function printCompact(data: object | object[], options?: object): void;
/**
 * Work out which output mode a command is running in.
 *
 * `--json` is declared per command and arrives in the action's options;
 * `--compact` and `--fields` are declared once on the root program so every
 * read command gets them without repeating the declaration. Commander stores
 * root options on the root, so both have to be consulted.
 *
 * @param {import('commander').Command} program - The root command
 * @param {object} [options={}] - The action's own options
 * @returns {{json: boolean, compact: boolean, fields: string[]|null}}
 */
export function resolveOutputMode(program: import("commander").Command, options?: object): {
    json: boolean;
    compact: boolean;
    fields: string[] | null;
};
/**
 * Whether a machine is reading stdout: `--json` or `--compact` was asked for
 * and stdout is not a terminal. Spinners and decoration stay off in that case.
 *
 * @param {{json?: boolean, compact?: boolean}} mode
 * @param {NodeJS.WriteStream} [stdout=process.stdout]
 * @returns {boolean}
 */
export function isMachineOutput(mode: {
    json?: boolean;
    compact?: boolean;
}, stdout?: NodeJS.WriteStream): boolean;
/**
 * Create and start a spinner that knows when to keep quiet.
 *
 * @param {string} text
 * @param {{json?: boolean, compact?: boolean}} [mode={}]
 * @returns {import('ora').Ora}
 */
export function createSpinner(text: string, mode?: {
    json?: boolean;
    compact?: boolean;
}): import("ora").Ora;
/**
 * The canonical flat field names, in the order they print when no `--fields`
 * is given. Every record kind is a subset of this list, so a caller can learn
 * the vocabulary once and use it on any command.
 */
export const CANONICAL_FIELDS: string[];
export namespace DEFAULT_FIELDS {
    let tweet: string[];
    let profile: string[];
    let user: string[];
    let media: string[];
    let report: string[];
}
