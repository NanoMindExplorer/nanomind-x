/**
 * Generate all recommendations for a user based on their graph
 */
export function getRecommendations(graph: any, username: any): {
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
declare namespace _default {
    export { getRecommendations };
}
export default _default;
