/**
 * Register the quickstart command.
 *
 * @param {import('commander').Command} program
 * @param {{version: string}} deps
 */
export function registerQuickstartCommand(program: import("commander").Command, deps?: {
    version: string;
}): void;
