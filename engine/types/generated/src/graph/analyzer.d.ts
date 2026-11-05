/**
 * nanomind-x Social Graph Analyzer
 * Graph algorithms for social network analysis
 *
 * Computes: mutual connections, bridge accounts, clusters,
 * influence scores, ghost followers, orbit analysis.
 *
 * @author nich (@nichxbt) - https://github.com/nirholas
 * @license Apache-2.0
 */
/**
 * Build adjacency lists from a graph's edges
 * @returns {{ outgoing: Map, incoming: Map }}
 */
export function buildAdjacency(graph: any): {
    outgoing: Map<any, any>;
    incoming: Map<any, any>;
};
/**
 * Find mutual follows (A follows B AND B follows A)
 */
export function findMutualConnections(graph: any): {
    a: any;
    b: any;
}[];
/**
 * For a specific user, get their mutual connections
 */
export function getMutualConnectionsFor(graph: any, username: any): any[];
/**
 * Find bridge accounts — users who connect otherwise separate clusters.
 * Uses betweenness centrality approximation (BFS-based).
 * High betweenness = bridge.
 */
export function findBridgeAccounts(graph: any, topN?: number): {
    username: any;
    betweenness: number;
    node: any;
}[];
/**
 * Detect clusters using label propagation algorithm.
 * Simple, fast, no external deps.
 */
export function detectClusters(graph: any, maxIterations?: number): {
    id: number;
    size: any;
    members: any;
    label: string;
}[];
/**
 * Compute influence scores using simplified PageRank.
 * Runs within the scraped subgraph.
 */
export function computeInfluenceScores(graph: any, iterations?: number, dampingFactor?: number): Map<any, any>;
/**
 * Get ranked influence leaderboard
 */
export function getInfluenceRanking(graph: any, topN?: number): {
    username: any;
    influenceScore: any;
    node: any;
}[];
/**
 * Detect ghost followers — accounts that follow a user but never interact.
 * In our subgraph context: followers who have no other edges (no mutual, no interaction)
 */
export function findGhostFollowers(graph: any, username: any): {
    username: any;
    mutualFollow: boolean;
    edgesInGraph: any;
    node: any;
}[];
/**
 * Categorize connections into orbits:
 * - inner circle: mutual follows with high interaction density
 * - active: mutual follows
 * - outer ring: one-way follows
 * - periphery: 2+ degrees away
 */
export function analyzeOrbits(graph: any, username: any): {
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
/**
 * Run all analyses on a graph
 */
export function analyzeGraph(graph: any, seedUsername: any): {
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
declare namespace _default {
    export { buildAdjacency };
    export { findMutualConnections };
    export { getMutualConnectionsFor };
    export { findBridgeAccounts };
    export { detectClusters };
    export { computeInfluenceScores };
    export { getInfluenceRanking };
    export { findGhostFollowers };
    export { analyzeOrbits };
    export { analyzeGraph };
}
export default _default;
