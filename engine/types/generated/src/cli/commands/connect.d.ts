/**
 * Run the connect flow.
 *
 * @param {object} [options]
 * @param {number} [options.timeout] - Minutes to wait for the login
 * @param {boolean} [options.keepOpen] - Leave the browser open afterwards
 * @returns {Promise<void>}
 */
export function connectCommand(options?: {
    timeout?: number;
    keepOpen?: boolean;
}): Promise<void>;
/**
 * Register the command.
 * @param {import('commander').Command} program
 */
export function registerConnectCommand(program: import("commander").Command): void;
