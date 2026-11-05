/**
 * Get an adapter instance by name. Lazy-loads and caches.
 * @param {string} [name] - Adapter name (defaults to global default)
 * @returns {Promise<BaseAdapter>} Adapter instance
 */
export function getAdapter(name?: string): Promise<BaseAdapter>;
/**
 * Get the best available adapter, with fallback chain.
 * Tries: specified → default → puppeteer → playwright → cheerio
 * @param {string} [preferred] - Preferred adapter name
 * @returns {Promise<BaseAdapter>} First available adapter
 */
export function getAvailableAdapter(preferred?: string): Promise<BaseAdapter>;
/**
 * Set the global default adapter
 * @param {string} name - Adapter name
 */
export function setDefaultAdapter(name: string): void;
/**
 * Get the current default adapter name
 * @returns {string}
 */
export function getDefaultAdapterName(): string;
/**
 * Register a custom adapter
 * @param {string} name - Unique adapter name
 * @param {typeof BaseAdapter} AdapterClass - Adapter class extending BaseAdapter
 */
export function registerAdapter(name: string, AdapterClass: typeof BaseAdapter): void;
/**
 * List all registered adapter names (excluding aliases)
 * @returns {string[]}
 */
export function listAdapters(): string[];
/**
 * Get info about all registered adapters
 * @returns {Promise<Object[]>}
 */
export function getAdapterInfo(): Promise<any[]>;
/**
 * Check which adapters are available on this system
 * @returns {Promise<Object>}
 */
export function checkAvailability(): Promise<any>;
export { BaseAdapter } from "./base.js";
declare namespace _default {
    export { getAdapter };
    export { getAvailableAdapter };
    export { setDefaultAdapter };
    export { getDefaultAdapterName };
    export { registerAdapter };
    export { listAdapters };
    export { getAdapterInfo };
    export { checkAvailability };
    export { BaseAdapter };
}
export default _default;
import { BaseAdapter } from './base.js';
