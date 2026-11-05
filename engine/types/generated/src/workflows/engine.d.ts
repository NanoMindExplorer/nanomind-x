/**
 * Run a workflow
 *
 * @param {object} workflow - Workflow definition (JSON)
 * @param {object} [options]
 * @param {string} [options.trigger='manual'] - What triggered this run
 * @param {object} [options.initialContext={}] - Initial variables
 * @param {string} [options.authToken] - X/Twitter session cookie
 * @param {string} [options.userId] - User ID for tracking
 * @param {function} [options.onProgress] - Progress callback: (event) => void
 * @param {function} [options.isCancelled] - Cancellation check: () => boolean
 * @returns {Promise<object>} - Execution result with full log
 */
export function runWorkflow(workflow: object, options?: {
    trigger?: string;
    initialContext?: object;
    authToken?: string;
    userId?: string;
    onProgress?: Function;
    isCancelled?: Function;
}): Promise<object>;
/**
 * Validate a workflow definition
 * @param {object} workflow
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateWorkflow(workflow: object): {
    valid: boolean;
    errors: string[];
};
