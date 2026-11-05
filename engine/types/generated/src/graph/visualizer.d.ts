/**
 * Export graph to D3.js force-directed format
 * @returns {{ nodes: Array, links: Array }}
 */
export function toD3(graph: any, options?: {}): {
    nodes: any[];
    links: any[];
};
/**
 * Export graph to GEXF format for Gephi
 */
export function toGEXF(graph: any): string;
/**
 * Generate a self-contained HTML file with an interactive D3.js force graph
 */
export function toHTML(graph: any): string;
declare namespace _default {
    export { toD3 };
    export { toGEXF };
    export { toHTML };
}
export default _default;
