/**
 * Save account snapshot — inserts a new time-series data point
 */
export function saveAccountSnapshot(username: any, data: any): {
    username: any;
    snapshot_at: string;
};
/**
 * Save tweet snapshot — stores per-tweet metrics at a point in time
 */
export function saveTweetSnapshot(username: any, tweetId: any, metrics: any): {
    tweet_id: any;
    snapshot_at: string;
};
/**
 * Save daily engagement roll-up — upserts for the day
 */
export function saveDailyEngagement(username: any, stats: any): {
    username: any;
    date: any;
};
/**
 * Get account history — returns time-series data with optional interval grouping
 */
export function getAccountHistory(username: any, { from, to, interval }?: {}): any;
/**
 * Get tweet history — per-tweet metric over time
 */
export function getTweetHistory(tweetId: any, { from, to }?: {}): any;
/**
 * Get growth rate — followers gained/lost per day over N days
 */
export function getGrowthRate(username: any, days?: number): {
    username: any;
    days: number;
    dataPoints: any;
    message: string;
    dailyGrowth: any[];
    totalChange: number;
    avgPerDay: number;
    period?: undefined;
    trend?: undefined;
    percentChange?: undefined;
} | {
    username: any;
    days: number;
    dataPoints: any;
    period: {
        from: any;
        to: any;
    };
    totalChange: number;
    avgPerDay: number;
    trend: string;
    percentChange: number;
    dailyGrowth: {
        date: any;
        followers: any;
        change: number;
        percentChange: number;
    }[];
    message?: undefined;
};
/**
 * Compare multiple accounts over time
 */
export function compareAccounts(usernames: any, metric?: string, { from, to }?: {}): {
    metric: string;
    usernames: any;
    timeSeries: {};
    summary: {};
};
/**
 * Export historical data for a user
 */
export function exportHistory(username: any, format?: string): string | {
    username: any;
    accountSnapshots: any;
    tweetSnapshots: any;
    dailyEngagement: any;
};
/**
 * Close database connection (for cleanup)
 */
export function closeDb(): void;
/**
 * Get the database instance (for reuse by other modules like CRM)
 */
export function getDatabase(): any;
