/**
 * Flatten the Commander tree into completion data.
 *
 * @param {import('commander').Command} program
 * @returns {{name: string, description: string, options: string[], subcommands: {name: string, description: string, options: string[]}[]}[]}
 */
export function collectCommands(program: import("commander").Command): {
    name: string;
    description: string;
    options: string[];
    subcommands: {
        name: string;
        description: string;
        options: string[];
    }[];
}[];
/**
 * Generate the completion script for a shell.
 *
 * @param {import('commander').Command} program
 * @param {'bash'|'zsh'|'fish'} shell
 * @returns {string}
 */
export function generateCompletion(program: import("commander").Command, shell: "bash" | "zsh" | "fish"): string;
/**
 * Register the completion command.
 *
 * @param {import('commander').Command} program
 */
export function registerCompletionCommand(program: import("commander").Command): void;
/** Shells with a generator here. */
export const SUPPORTED_SHELLS: string[];
