export class EngagementNetwork {
    constructor(config?: {});
    config: {};
    agents: Map<any, any>;
    sharedQueue: any[];
    discoveryLog: any[];
    ethicsPolicy: {
        maxInteractionsPerPair: any;
        minDelayBetweenInteractions: any;
        maxNetworkSize: any;
        allowSelfRetweet: boolean;
        allowCoordinatedLiking: boolean;
        allowContentSharing: boolean;
        allowTrendDiscovery: boolean;
        requireHumanReview: any;
    };
    _load(): void;
    _save(): void;
    /**
     * Register an agent in the network
     * @param {string} id - Unique agent identifier
     * @param {object} agent - Agent metadata
     */
    registerAgent(id: string, agent: object): boolean;
    /**
     * Remove an agent from the network
     */
    unregisterAgent(id: any): void;
    /**
     * Share a discovered piece of high-quality content with the network.
     * Other agents can use this to find relevant content to engage with organically.
     *
     * ⚠️ This is NOT for coordinated engagement. Each agent independently
     * decides whether to engage based on its own persona and relevance scoring.
     *
     * @param {string} fromAgent - Agent ID that discovered the content
     * @param {object} content - Content metadata
     */
    shareDiscovery(fromAgent: string, content: object): boolean;
    /**
     * Get content discoveries relevant to a specific agent
     * Only returns content the agent hasn't seen yet
     */
    getDiscoveriesForAgent(agentId: any, limit?: number): any[];
    /**
     * Mark a discovery as seen by an agent
     */
    markSeen(discoveryId: any, agentId: any): void;
    /**
     * Record that an agent organically engaged with discovered content
     * Enforces interaction limits between agent pairs
     */
    recordEngagement(discoveryId: any, agentId: any): boolean;
    /**
     * Share a trending topic or hashtag across the network.
     * Agents can independently create content about the trend.
     */
    shareTrend(fromAgent: any, trend: any): boolean;
    /**
     * Get recent trends, optionally filtered by niche
     */
    getRecentTrends(niche: any, limit?: number): any[];
    /**
     * Check if an interaction would violate ethics policy
     */
    checkEthics(fromAgent: any, toAgent: any, interactionType: any): {
        allowed: boolean;
        violations: string[];
    };
    /**
     * Get network health metrics
     */
    getNetworkStats(): {
        totalAgents: number;
        activeAgents: number;
        totalDiscoveries: number;
        pendingQueue: number;
        ethicsPolicy: {
            maxInteractionsPerPair: any;
            minDelayBetweenInteractions: any;
            maxNetworkSize: any;
            allowSelfRetweet: boolean;
            allowCoordinatedLiking: boolean;
            allowContentSharing: boolean;
            allowTrendDiscovery: boolean;
            requireHumanReview: any;
        };
    };
    /**
     * Reset the network (clear all data)
     */
    reset(): void;
}
