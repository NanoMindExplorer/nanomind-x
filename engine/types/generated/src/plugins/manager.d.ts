/**
 * Install a plugin by npm package name
 * @param {string} name - Package name (e.g., nanomind-x-plugin-analytics)
 * @returns {Promise<Object>} The installed plugin info
 */
export function installPlugin(name: string): Promise<any>;
/**
 * Remove a plugin by name
 * @param {string} name - Plugin name (as declared in plugin.name)
 * @returns {Promise<boolean>}
 */
export function removePlugin(name: string): Promise<boolean>;
/**
 * List all registered plugins with their status
 * @returns {Promise<Object[]>}
 */
export function listPlugins(): Promise<any[]>;
/**
 * Enable a plugin
 * @param {string} name
 */
export function enablePlugin(name: string): Promise<void>;
/**
 * Disable a plugin
 * @param {string} name
 */
export function disablePlugin(name: string): Promise<void>;
/**
 * Execute a named hook across all loaded plugins
 * @param {string} hookName - Hook name (e.g., 'beforeAction', 'afterAction')
 * @param {Object} context - Context passed to each hook function
 */
export function executeHook(hookName: string, context?: any): Promise<void>;
/**
 * Initialize the plugin system — load all enabled plugins
 * @returns {Promise<number>} Number of plugins loaded
 */
export function initializePlugins(): Promise<number>;
/** Get all MCP tools contributed by plugins */
export function getPluginTools(): any[];
/** Get all scrapers contributed by plugins */
export function getPluginScrapers(): any[];
/** Get all Express routes contributed by plugins */
export function getPluginRoutes(): any[];
/** Get all browser actions contributed by plugins */
export function getPluginActions(): any[];
/** Get a loaded plugin by name */
export function getPlugin(name: any): any;
/** Get count of loaded plugins */
export function getLoadedCount(): number;
declare namespace _default {
    export { installPlugin };
    export { removePlugin };
    export { listPlugins };
    export { enablePlugin };
    export { disablePlugin };
    export { initializePlugins };
    export { executeHook };
    export { getPluginTools };
    export { getPluginScrapers };
    export { getPluginRoutes };
    export { getPluginActions };
    export { getPlugin };
    export { getLoadedCount };
}
export default _default;
