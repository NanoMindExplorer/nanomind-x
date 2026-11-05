/**
 * Create a new empty graph
 */
export function createGraph(seedUsername: any): {
    id: `${string}-${string}-${string}-${string}-${string}`;
    seed: any;
    createdAt: string;
    updatedAt: string;
    nodes: Map<any, any>;
    edges: any[];
    metadata: {
        nodesCount: number;
        edgesCount: number;
        depth: number;
        status: string;
        progress: {
            phase: string;
            completed: number;
            total: number;
        };
    };
};
/**
 * Add a node (account) to the graph
 */
export function addNode(graph: any, username: any, data?: {}): any;
/**
 * Add an edge (relationship) to the graph
 */
export function addEdge(graph: any, source: any, target: any, type?: string, weight?: number): void;
/**
 * Build a social graph by crawling from a seed account
 *
 * @param {string} seedUsername - Starting account
 * @param {object} options
 * @param {number} [options.depth=2] - How many degrees to crawl (1 = direct connections only)
 * @param {number} [options.maxFollowers=200] - Max followers to scrape per user
 * @param {number} [options.maxFollowing=200] - Max following to scrape per user
 * @param {number} [options.maxNodes=500] - Hard cap on total nodes
 * @param {string} [options.authToken] - X/Twitter session cookie
 * @param {function} [options.onProgress] - Progress callback
 * @param {function} [options.isCancelled] - Cancellation check
 * @param {object} [options.scrapers] - Scraper module (injected for testability)
 * @returns {Promise<object>} - The completed graph
 */
export function buildGraph(seedUsername: string, options?: {
    depth?: number;
    maxFollowers?: number;
    maxFollowing?: number;
    maxNodes?: number;
    authToken?: string;
    onProgress?: Function;
    isCancelled?: Function;
    scrapers?: object;
}): Promise<object>;
/**
 * Serialize a graph to a plain JSON-safe object
 */
export function serializeGraph(graph: any): {
    id: any;
    seed: any;
    createdAt: any;
    updatedAt: any;
    nodes: any[];
    edges: any;
    metadata: any;
};
/**
 * Deserialize from JSON back to a graph with Map for nodes
 */
export function deserializeGraph(data: any): {
    id: any;
    seed: any;
    createdAt: any;
    updatedAt: any;
    nodes: Map<any, any>;
    edges: any;
    metadata: any;
};
declare namespace _default {
    export { createGraph };
    export { addNode };
    export { addEdge };
    export { buildGraph };
    export { serializeGraph };
    export { deserializeGraph };
}
export default _default;
