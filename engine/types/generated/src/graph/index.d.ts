export default graphModule;
/**
 * Build a social graph and save it
 */
export function build(username: any, options?: {}): Promise<{
    id: any;
    seed: any;
    createdAt: any;
    updatedAt: any;
    nodes: any[];
    edges: any;
    metadata: any;
}>;
/**
 * Get a saved graph (deserialized with Map nodes for analysis)
 */
export function get(graphId: any): Promise<{
    id: any;
    seed: any;
    createdAt: any;
    updatedAt: any;
    nodes: Map<any, any>;
    edges: any;
    metadata: any;
}>;
/**
 * List all graphs
 */
export function list(): Promise<{
    id: any;
    seed: any;
    nodesCount: any;
    edgesCount: any;
    status: any;
    createdAt: any;
    updatedAt: any;
}[]>;
/**
 * Delete a saved graph
 */
export function deleteGraph(graphId: any): Promise<boolean>;
/**
 * Run analysis on a graph
 */
export function analyze(graph: any, seedUsername: any): {
    graphId: any;
    seed: any;
    nodesCount: any;
    edgesCount: any;
    mutualConnections: {
        a: any;
        b: any;
    }[];
    bridgeAccounts: {
        username: any;
        betweenness: number;
        node: any;
    }[];
    clusters: {
        id: number;
        size: any;
        members: any;
        label: string;
    }[];
    influenceRanking: {
        username: any;
        influenceScore: any;
        node: any;
    }[];
    ghostFollowers: {
        username: any;
        mutualFollow: boolean;
        edgesInGraph: any;
        node: any;
    }[];
    orbits: {
        seed: any;
        orbits: {
            innerCircle: any[];
            active: any[];
            outerRing: any[];
            periphery: any[];
        };
        summary: {
            innerCircle: number;
            active: number;
            outerRing: number;
            periphery: number;
        };
    };
    analyzedAt: string;
};
/**
 * Get recommendations from a graph
 */
export function recommend(graph: any, username: any): {
    seed: any;
    followSuggestions: {
        username: any;
        reason: string;
        sharedConnections: any;
        influence: any;
        node: any;
    }[];
    engageSuggestions: {
        username: any;
        reason: string;
        influence: any;
        mutual: any;
        node: any;
    }[];
    competitorWatch: {
        username: any;
        reason: string;
        followedByCount: any;
        aggregateInfluence: number;
        node: any;
    }[];
    safeToUnfollow: {
        username: any;
        reason: string;
        influence: any;
        sharedConnections: number;
        node: any;
    }[];
    generatedAt: string;
};
/**
 * Visualize a graph in the specified format
 * @param {object} graph - Deserialized graph (nodes as Map)
 * @param {'d3'|'gexf'|'html'} format
 */
export function visualize(graph: object, format?: "d3" | "gexf" | "html"): string | {
    nodes: any[];
    links: any[];
};
/**
 * Save a graph to disk
 */
export function saveGraph(graph: any): Promise<{
    id: any;
    seed: any;
    createdAt: any;
    updatedAt: any;
    nodes: any[];
    edges: any;
    metadata: any;
}>;
import { buildGraph } from './builder.js';
import { serializeGraph } from './builder.js';
import { deserializeGraph } from './builder.js';
import { analyzeGraph } from './analyzer.js';
import { findMutualConnections } from './analyzer.js';
import { getMutualConnectionsFor } from './analyzer.js';
import { findBridgeAccounts } from './analyzer.js';
import { detectClusters } from './analyzer.js';
import { computeInfluenceScores } from './analyzer.js';
import { getInfluenceRanking } from './analyzer.js';
import { findGhostFollowers } from './analyzer.js';
import { analyzeOrbits } from './analyzer.js';
import { getRecommendations } from './recommendations.js';
import { toD3 } from './visualizer.js';
import { toGEXF } from './visualizer.js';
import { toHTML } from './visualizer.js';
declare namespace graphModule {
    export { build };
    export { get };
    export { list };
    export { deleteGraph as delete };
    export { analyze };
    export { recommend };
    export { visualize };
    export { saveGraph as save };
    export { buildGraph };
    export { serializeGraph };
    export { deserializeGraph };
    export { analyzeGraph };
    export { findMutualConnections };
    export { getMutualConnectionsFor };
    export { findBridgeAccounts };
    export { detectClusters };
    export { computeInfluenceScores };
    export { getInfluenceRanking };
    export { findGhostFollowers };
    export { analyzeOrbits };
    export { getRecommendations };
    export { toD3 };
    export { toGEXF };
    export { toHTML };
}
export { buildGraph, serializeGraph, deserializeGraph, analyzeGraph, findMutualConnections, getMutualConnectionsFor, findBridgeAccounts, detectClusters, computeInfluenceScores, getInfluenceRanking, findGhostFollowers, analyzeOrbits, getRecommendations, toD3, toGEXF, toHTML };
