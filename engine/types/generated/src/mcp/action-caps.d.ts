/**
 * Directory that holds nanomind-x state. Honours NANOMIND_X_HOME.
 * @returns {string}
 */
export function getNanomindXHome(): string;
/** @returns {string} absolute path of the ledger file */
export function getLedgerPath(): string;
/** @returns {string} absolute path of the optional caps override file */
export function getCapsConfigPath(): string;
/**
 * Effective caps for an account: defaults, then the caps file, then the
 * NANOMIND_X_ACTION_CAPS env var, each layer's global values first and its
 * per-account values on top.
 *
 * @param {string} [account]
 * @returns {Record<string, number>}
 */
export function resolveCaps(account?: string): Record<string, number>;
/**
 * Charge one action against the account's budget for that class, or throw
 * ActionCapExceededError without recording anything.
 *
 * The action is recorded before it runs, not after. An attempt that fails
 * halfway still cost a request to X, and counting attempts keeps the ledger
 * on the safe side of the limit.
 *
 * @param {string} account username without @, or "default"
 * @param {string} actionClass one of ACTION_CLASSES
 * @param {{ now?: number, count?: number }} [options] `count` charges several
 *   actions at once (a bulk tool); `now` overrides the clock
 * @returns {{ account: string, actionClass: string, cap: number, used: number, remaining: number, resetAt: Date | null }}
 */
export function checkAndRecord(account: string, actionClass: string, { now, count }?: {
    now?: number;
    count?: number;
}): {
    account: string;
    actionClass: string;
    cap: number;
    used: number;
    remaining: number;
    resetAt: Date | null;
};
/**
 * Remaining budget per class for an account, without recording anything.
 *
 * @param {string} [account]
 * @param {{ now?: number }} [options]
 * @returns {{ account: string, windowHours: number, classes: Record<string, { cap: number, used: number, remaining: number, resetAt: string | null }> }}
 */
export function remaining(account?: string, { now }?: {
    now?: number;
}): {
    account: string;
    windowHours: number;
    classes: Record<string, {
        cap: number;
        used: number;
        remaining: number;
        resetAt: string | null;
    }>;
};
/**
 * The whole ledger after pruning: every account with its per-class
 * timestamps. Read-only snapshot; editing it changes nothing on disk.
 *
 * @param {{ now?: number }} [options]
 * @returns {{ version: number, accounts: Record<string, Record<string, number[]>> }}
 */
export function ledger({ now }?: {
    now?: number;
}): {
    version: number;
    accounts: Record<string, Record<string, number[]>>;
};
/**
 * Clear recorded actions for one account, or for every account when no
 * account is given. Returns how many recorded actions were dropped.
 *
 * @param {string} [account]
 * @returns {number}
 */
export function resetLedger(account?: string): number;
export const LEDGER_FILENAME: "action-ledger.json";
export const CAPS_FILENAME: "action-caps.json";
export const WINDOW_MS: number;
export const DEFAULT_ACCOUNT: "default";
/** Every action class the ledger tracks, in display order. */
export const ACTION_CLASSES: readonly string[];
/**
 * Default daily caps per class. See the module comment for sources.
 * @type {Readonly<Record<string, number>>}
 */
export const DEFAULT_CAPS: Readonly<Record<string, number>>;
/**
 * Thrown by checkAndRecord() when an action would exceed its cap.
 */
export class ActionCapExceededError extends Error {
    /**
     * @param {object} info
     * @param {string} info.account
     * @param {string} info.actionClass
     * @param {number} info.cap
     * @param {number} info.used
     * @param {Date} info.resetAt when the oldest counted action leaves the window
     */
    constructor({ account, actionClass, cap, used, resetAt }: {
        account: string;
        actionClass: string;
        cap: number;
        used: number;
        resetAt: Date;
    });
    code: string;
    account: string;
    actionClass: string;
    cap: number;
    used: number;
    resetAt: Date;
}
declare namespace _default {
    export { LEDGER_FILENAME };
    export { CAPS_FILENAME };
    export { WINDOW_MS };
    export { DEFAULT_ACCOUNT };
    export { ACTION_CLASSES };
    export { DEFAULT_CAPS };
    export { ActionCapExceededError };
    export { getNanomindXHome };
    export { getLedgerPath };
    export { getCapsConfigPath };
    export { resolveCaps };
    export { checkAndRecord };
    export { remaining };
    export { ledger };
    export { resetLedger };
}
export default _default;
