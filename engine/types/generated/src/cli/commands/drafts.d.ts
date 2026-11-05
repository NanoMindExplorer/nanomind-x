/**
 * Human age of an ISO timestamp: `just now`, `4m`, `3h`, `2d`.
 * @param {string} iso
 * @param {number} [now=Date.now()]
 * @returns {string}
 */
export function formatAge(iso: string, now?: number): string;
/**
 * One-line summary of a tool's arguments: `text="Shipping..." username=nasa`.
 * Strings are quoted and cut, everything else is JSON, and the whole line is
 * capped so a long post never wraps the table.
 * @param {object} args
 * @param {number} [max=ARGS_SUMMARY_MAX]
 * @returns {string}
 */
export function summarizeArgs(args: object, max?: number): string;
/**
 * `drafts list`.
 * @param {{status?: string, json?: boolean}} options
 */
export function listCommand(options?: {
    status?: string;
    json?: boolean;
}): import("../../mcp/drafts.js").Draft[];
/**
 * `drafts show <id>`.
 * @param {string} id
 * @param {{json?: boolean}} options
 */
export function showCommand(id: string, options?: {
    json?: boolean;
}): import("../../mcp/drafts.js").Draft;
/**
 * `drafts approve <id>` or `drafts approve --all`. Runs each pending draft
 * through the executor and records the outcome on it. A draft that already
 * ran is refused by the store, so nothing posts twice.
 *
 * @param {string|undefined} id
 * @param {{all?: boolean, json?: boolean}} options
 * @param {{loadExecutor?: () => Promise<Function>}} [deps]
 * @returns {Promise<import('../../mcp/drafts.js').Draft[]>}
 */
export function approveCommand(id: string | undefined, options?: {
    all?: boolean;
    json?: boolean;
}, deps?: {
    loadExecutor?: () => Promise<Function>;
}): Promise<import("../../mcp/drafts.js").Draft[]>;
/**
 * `drafts discard <id>`.
 * @param {string} id
 * @param {{json?: boolean}} options
 */
export function discardCommand(id: string, options?: {
    json?: boolean;
}): import("../../mcp/drafts.js").Draft;
/**
 * `drafts clear`: drop every executed and failed draft, keep the pending ones.
 * @param {{json?: boolean}} options
 */
export function clearCommand(options?: {
    json?: boolean;
}): number;
/**
 * Register `nanomind-x drafts` and its sub-commands.
 * @param {import('commander').Command} program
 */
export function registerDraftsCommand(program: import("commander").Command): void;
/** Statuses `--status` accepts. */
export const DRAFT_STATUSES: string[];
