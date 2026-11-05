export class ContentCalendar {
    constructor(config?: {});
    config: {};
    persona: any;
    niche: any;
    postsPerDay: any;
    threadPerWeek: any;
    contentMix: any;
    calendar: any;
    _load(): any;
    _save(): void;
    /**
     * Generate a weekly content plan
     * @param {string} weekId - ISO week string (e.g., "2025-W03")
     * @param {object} llm - LLMBrain instance for content generation
     * @returns {object} Weekly plan with daily slots
     */
    generateWeeklyPlan(weekId: string, llm: object): object;
    /**
     * Add content to the review queue
     */
    addToQueue(content: any): void;
    /**
     * Get pending items in the review queue
     */
    getQueue(): any;
    /**
     * Approve a queued item (mark ready to publish)
     */
    approveItem(itemId: any): boolean;
    /**
     * Reject a queued item
     */
    rejectItem(itemId: any, reason: any): boolean;
    /**
     * Get the next content item that should be posted
     * @returns {object|null} Content item ready to post
     */
    getNextToPost(): object | null;
    /**
     * Mark content as published
     */
    markPublished(itemId: any, tweetId: any): boolean;
    /**
     * Record performance metrics for published content
     */
    recordPerformance(tweetId: any, metrics: any): void;
    /**
     * Get performance summary by content type
     * @returns {object} Aggregated performance by type
     */
    getPerformanceSummary(): object;
    /**
     * Get best-performing content type
     */
    getBestContentType(): string;
    _pickContentType(): string;
    _getOptimalTime(slotIndex: any, totalSlots: any): string;
    _getWeekId(date: any): string;
    /**
     * Get statistics about the calendar
     */
    getStats(): {
        weeksPlanned: number;
        totalPlanned: number;
        published: any;
        queued: any;
        performance: any;
    };
}
