/**
 * Read the plugins registry from ~/.nanomind-x/plugins.json
 * @returns {Promise<Object>} The plugins config { plugins: { name: { version, path, enabled } } }
 */
export function readPluginsConfig(): Promise<any>;
/**
 * Write the plugins registry to ~/.nanomind-x/plugins.json
 * @param {Object} config - The plugins config
 */
export function writePluginsConfig(config: any): Promise<void>;
/**
 * Check if a package name matches the plugin naming convention
 * @param {string} name - Package name
 * @returns {boolean}
 */
export function isValidPluginName(name: string): boolean;
/**
 * Validate a loaded plugin module has the required interface
 * @param {Object} mod - The imported module
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validatePlugin(mod: any): {
    valid: boolean;
    errors: string[];
};
/**
 * Load a single plugin by name or path
 * @param {string} nameOrPath - npm package name or local file path
 * @returns {Promise<Object>} The loaded and validated plugin module
 */
export function loadPlugin(nameOrPath: string): Promise<any>;
/**
 * Load all enabled plugins from the registry
 * @returns {Promise<Object[]>} Array of loaded plugin modules
 */
export function loadAllPlugins(): Promise<any[]>;
/**
 * Discover nanomind-x plugins from node_modules
 * Scans for packages matching the naming convention
 * @returns {Promise<string[]>} Array of discovered plugin package names
 */
export function discoverPlugins(): Promise<string[]>;
export const PLUGINS_FILE: string;
export const CONFIG_DIR: string;
