export function closeBrowser(): Promise<void>;
/**
 * Register a workflow action
 */
export function registerAction(name: any, definition: any): void;
/**
 * Get a registered action by name
 */
export function getAction(name: any): any;
/**
 * Get all registered actions with metadata
 */
export function listActions(): {
    name: string;
    description: any;
    params: any;
    category: any;
}[];
/**
 * Execute a workflow action step
 *
 * @param {object} step - The workflow step definition
 * @param {object} context - The workflow variable context
 * @returns {Promise<any>} - The action result
 */
export function executeAction(step: object, context: object): Promise<any>;
export default actions;
declare const actions: {};
