/** @typedef {'pending' | 'executed' | 'failed'} DraftStatus */
/**
 * @typedef {object} Draft
 * @property {string} id
 * @property {string} tool
 * @property {object} args
 * @property {string} createdAt ISO timestamp
 * @property {DraftStatus} status
 * @property {string} [executedAt]
 * @property {unknown} [result] set when status is "executed"
 * @property {string} [error] set when status is "failed"
 */
/**
 * Directory that holds nanomind-x state. Honours NANOMIND_X_HOME.
 * @returns {string}
 */
export function getNanomindXHome(): string;
/**
 * Absolute path of the drafts file.
 * @returns {string}
 */
export function getDraftsPath(): string;
/**
 * Store a new pending draft.
 * @param {string} tool
 * @param {object} [args]
 * @returns {Draft}
 */
export function createDraft(tool: string, args?: object): Draft;
/**
 * List drafts, newest first. Filter by status when given.
 * @param {{ status?: DraftStatus | 'all' }} [options]
 * @returns {Draft[]}
 */
export function listDrafts({ status }?: {
    status?: DraftStatus | "all";
}): Draft[];
/**
 * Fetch one draft by id.
 * @param {string} id
 * @returns {Draft | null}
 */
export function getDraft(id: string): Draft | null;
/**
 * Remove a draft from the store. Works on any status.
 * @param {string} id
 * @returns {Draft} the removed draft
 */
export function discardDraft(id: string): Draft;
/**
 * Execute a pending draft through the supplied executor and record the
 * outcome on the draft. The executor receives `(tool, args)` and is the
 * same dispatch the live tool call would have used.
 *
 * A draft that already ran is refused so a double-approve cannot post twice.
 *
 * @param {string} id
 * @param {(tool: string, args: object) => Promise<unknown>} execute
 * @returns {Promise<Draft>} the updated draft
 */
export function approveDraft(id: string, execute: (tool: string, args: object) => Promise<unknown>): Promise<Draft>;
/**
 * Remove every draft that is not pending. Returns how many were dropped.
 * @returns {number}
 */
export function pruneDrafts(): number;
export const DRAFTS_FILENAME: "mcp-drafts.json";
declare namespace _default {
    export { DRAFTS_FILENAME };
    export { getNanomindXHome };
    export { getDraftsPath };
    export { createDraft };
    export { listDrafts };
    export { getDraft };
    export { discardDraft };
    export { approveDraft };
    export { pruneDrafts };
}
export default _default;
export type DraftStatus = "pending" | "executed" | "failed";
export type Draft = {
    id: string;
    tool: string;
    args: object;
    /**
     * ISO timestamp
     */
    createdAt: string;
    status: DraftStatus;
    executedAt?: string;
    /**
     * set when status is "executed"
     */
    result?: unknown;
    /**
     * set when status is "failed"
     */
    error?: string;
};
