/**
 * SQLite-based action logger, metrics tracker, and analytics engine.
 */
export class AgentDatabase {
    /**
     * @param {string} [dbPath] - Path to SQLite database file. Defaults to data/agent.db
     */
    constructor(dbPath?: string);
    db: any;
    /** Create tables if they don't exist. */
    _initTables(): void;
    /**
     * Log an action.
     * @param {string} type - Action type (like, follow, comment, post, search, etc.)
     * @param {string} [targetId] - ID of the target (tweet ID, username, etc.)
     * @param {Object} [metadata] - Additional data to store as JSON
     */
    logAction(type: string, targetId?: string, metadata?: any): void;
    /**
     * Get the count of actions performed today, optionally filtered by type.
     * @param {string} [type] - Action type filter
     * @returns {number}
     */
    getActionsToday(type?: string): number;
    /**
     * Check if an action was already performed on a target (prevent re-engaging).
     * @param {string} type
     * @param {string} targetId
     * @returns {boolean}
     */
    isDuplicate(type: string, targetId: string): boolean;
    /**
     * Get recent actions, optionally filtered by type.
     * @param {number} [limit=50]
     * @param {string} [type]
     * @returns {Array<Object>}
     */
    getRecentActions(limit?: number, type?: string): Array<any>;
    /**
     * Track a new follow.
     * @param {string} username
     * @param {string} [niche]
     */
    trackFollow(username: string, niche?: string): void;
    /**
     * Mark a user as unfollowed.
     * @param {string} username
     */
    trackUnfollow(username: string): void;
    /**
     * Get all currently-followed users.
     * @returns {Array<Object>}
     */
    getFollowing(): Array<any>;
    /**
     * Record a piece of content that was posted.
     * @param {string} type - 'tweet' | 'thread' | 'quote' | 'reply'
     * @param {string} text
     * @returns {number} Content ID
     */
    recordContent(type: string, text: string): number;
    /**
     * Update content metrics (impressions, likes, replies).
     * @param {number} contentId
     * @param {{ impressions?: number, likes?: number, replies?: number }} data
     */
    updateContentMetrics(contentId: number, data: {
        impressions?: number;
        likes?: number;
        replies?: number;
    }): void;
    /**
     * Get recent posts for LLM context (to avoid repeating content).
     * @param {number} [limit=20]
     * @returns {Array<Object>}
     */
    getRecentPosts(limit?: number): Array<any>;
    /**
     * Record or update daily metrics snapshot.
     * @param {{ followers?: number, following?: number, tweets?: number, likes_given?: number, follows_given?: number, comments_given?: number }} data
     */
    recordDailyMetrics(data: {
        followers?: number;
        following?: number;
        tweets?: number;
        likes_given?: number;
        follows_given?: number;
        comments_given?: number;
    }): void;
    /**
     * Record LLM token usage. Aggregates by date + model.
     * @param {string} model - Model identifier (e.g., 'deepseek/deepseek-chat')
     * @param {number} inputTokens
     * @param {number} outputTokens
     */
    recordLLMUsage(model: string, inputTokens: number, outputTokens: number): void;
    /**
     * Get LLM usage stats for a date range.
     * @param {number} [days=7]
     * @returns {Array<Object>}
     */
    getLLMUsage(days?: number): Array<any>;
    /**
     * Get total LLM cost for a period.
     * @param {number} [days=30]
     * @returns {number} Total cost in USD
     */
    getLLMCost(days?: number): number;
    _calculateCost(model: any, inputTokens: any, outputTokens: any): number;
    /**
     * Generate a growth report for the past N days.
     * @param {number} [days=7]
     * @returns {{ followers: Array, engagement: Array, content: Array }}
     */
    getGrowthReport(days?: number): {
        followers: any[];
        engagement: any[];
        content: any[];
    };
    /**
     * Get a summary of today's activity for rate-limit checking.
     * @returns {{ likes: number, follows: number, comments: number, posts: number, total: number }}
     */
    getTodaySummary(): {
        likes: number;
        follows: number;
        comments: number;
        posts: number;
        total: number;
    };
    /**
     * Close the database connection.
     */
    close(): void;
}
