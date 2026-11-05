export type Activity = {
    /**
     * - Activity type
     */
    type: string;
    /**
     * - 0.0 to 1.0
     */
    intensity: number;
    /**
     * - When to execute
     */
    scheduledFor: Date;
    /**
     * - Estimated duration
     */
    durationMinutes: number;
    /**
     * - Search query for search-engage
     */
    query?: string;
    /**
     * - Username for influencer-visit
     */
    username?: string;
};
/**
 * Circadian rhythm activity scheduler with human-like variance.
 */
export class Scheduler {
    /**
     * @param {Object} [config]
     * @param {string} [config.timezone='America/New_York']
     * @param {[number, number]} [config.sleepHours=[23, 6]] - [start, end] in 24h format
     * @param {string[]} [config.searchTerms] - Search queries for search-engage activities
     * @param {string[]} [config.influencers] - Usernames for influencer-visit activities
     * @param {number} [config.varianceMinutes=20] - Base variance in minutes
     */
    constructor(config?: {
        timezone?: string;
        sleepHours?: [number, number];
        searchTerms?: string[];
        influencers?: string[];
        varianceMinutes?: number;
    });
    timezone: string;
    sleepStart: number;
    sleepEnd: number;
    searchTerms: string[];
    influencers: string[];
    varianceMinutes: number;
    /** @type {Activity[]} Today's planned activities */
    _dailyPlan: Activity[];
    _planDate: any;
    _activityIndex: number;
    /**
     * Get the current hour in the configured timezone.
     * @returns {number} Hour (0-23)
     */
    _getCurrentHour(): number;
    /**
     * Get current day of week in configured timezone (0=Sun, 6=Sat).
     * @returns {number}
     */
    _getCurrentDow(): number;
    /**
     * Check if the current moment is during sleep hours.
     * @returns {boolean}
     */
    _isSleepHour(hour: any): boolean;
    /**
     * Check if it's currently an active hour.
     * @returns {boolean}
     */
    isActiveHour(): boolean;
    /**
     * Get the activity intensity multiplier for the current hour.
     * @returns {number} 0.0-1.0
     */
    getActivityMultiplier(): number;
    /**
     * Generate today's activity plan (called once per day or when plan is stale).
     * @returns {Activity[]}
     */
    _generateDailyPlan(): Activity[];
    /**
     * Get the next activity to execute.
     * @returns {Activity}
     */
    getNextActivity(): Activity;
    /**
     * Add a global variance offset to all scheduled times.
     * @param {number} minutes - ± minutes to shift all activities
     */
    addVariance(minutes: number): void;
    /**
     * Get today's planned activities for logging/display.
     * @returns {Activity[]}
     */
    getDailyPlan(): Activity[];
}
