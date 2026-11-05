/**
 * Reconcile the declared groups against the commands actually registered.
 *
 * @param {import('commander').Command} program
 * @returns {{title: string, hint: string, entries: {name: string, description: string}[]}[]}
 */
export function groupCommands(program: import("commander").Command): {
    title: string;
    hint: string;
    entries: {
        name: string;
        description: string;
    }[];
}[];
/**
 * Group entries naming a command that is no longer registered.
 *
 * Exported so a test can fail the build when the help text drifts away from the
 * program, rather than shipping a help screen that promises a missing command.
 *
 * @param {import('commander').Command} program
 * @returns {string[]}
 */
export function findStaleGroupEntries(program: import("commander").Command): string[];
/**
 * Render the grouped command list.
 *
 * @param {import('commander').Command} program
 * @returns {string}
 */
export function renderGroupedCommands(program: import("commander").Command): string;
/**
 * The full root help screen, replacing Commander's flat default.
 *
 * @param {import('commander').Command} program
 * @param {string} version
 * @returns {string}
 */
export function renderRootHelp(program: import("commander").Command, version: string): string;
/**
 * Task-shaped command groups, in the order a person actually needs them.
 *
 * `hint` is one line explaining when you would reach for this whole group.
 */
export const GROUPS: {
    title: string;
    hint: string;
    commands: string[];
}[];
