export default workflows;
/**
 * Create a new workflow
 */
export function create(definition: any): Promise<any>;
/**
 * Get a workflow by ID or name
 */
export function get(idOrName: any): Promise<any>;
/**
 * List all workflows
 */
export function list(): Promise<any>;
/**
 * Update a workflow
 */
export function update(id: any, updates: any): Promise<any>;
/**
 * Delete a workflow
 */
export function remove(id: any): Promise<any>;
/**
 * Run a workflow by ID, name, or definition object
 */
export function run(idOrNameOrDef: any, options?: {}): Promise<any>;
/**
 * Get execution runs for a workflow
 */
export function runs(workflowId: any, limit?: number): Promise<any>;
/**
 * Get a specific run
 */
export function getRun(workflowId: any, runId: any): Promise<any>;
/**
 * Initialize trigger listener (connects triggers to the run engine)
 */
export function initTriggers(options?: {}): void;
/**
 * Shutdown workflows (clean up triggers, close browsers)
 */
export function shutdown(): Promise<void>;
import { validateWorkflow } from './engine.js';
import { listActions } from './actions.js';
import { registerAction } from './actions.js';
import { executeAction } from './actions.js';
import { evaluateCondition } from './conditions.js';
import { getAvailableOperators } from './conditions.js';
import triggerManager from './triggers.js';
declare namespace workflows {
    export { create };
    export { get };
    export { list };
    export { update };
    export { remove };
    export { run };
    export { runs };
    export { getRun };
    export { initTriggers };
    export { shutdown };
    export { validateWorkflow as validate };
    export { listActions };
    export { registerAction };
    export { executeAction };
    export { evaluateCondition };
    export { getAvailableOperators };
    export { triggerManager };
}
export { validateWorkflow, listActions, registerAction, executeAction, evaluateCondition, getAvailableOperators, triggerManager };
