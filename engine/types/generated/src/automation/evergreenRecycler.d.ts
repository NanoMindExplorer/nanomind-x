/**
 * Analyze tweets and rank evergreen candidates
 */
export function analyzeEvergreenCandidates(username: any, options?: {}): Promise<{
    error: string;
    username?: undefined;
    candidates?: undefined;
    total?: undefined;
} | {
    username: any;
    candidates: {
        tweetId: any;
        text: any;
        likes: any;
        retweets: any;
        replies: any;
        views: any;
        engagementRate: number;
        createdAt: any;
        suggestedRepostTime: string;
    }[];
    total: number;
    error?: undefined;
}>;
/**
 * Create an evergreen queue from candidates
 */
export function createEvergreenQueue(username: any, tweets: any, options?: {}): Promise<{
    username: any;
    frequency: any;
    timeSlots: any;
    maxPerDay: any;
    variation: any;
    items: any[];
    paused: boolean;
    createdAt: string;
    lastPosted: any;
}>;
/**
 * Run one evergreen cycle — post due tweets
 */
export function runEvergreenCycle(): Promise<{
    error: string;
    status?: undefined;
    message?: undefined;
    dueCount?: undefined;
    count?: undefined;
    total?: undefined;
} | {
    status: string;
    message: string;
    error?: undefined;
    dueCount?: undefined;
    count?: undefined;
    total?: undefined;
} | {
    status: string;
    dueCount: number;
    error?: undefined;
    message?: undefined;
    count?: undefined;
    total?: undefined;
} | {
    status: string;
    count: number;
    total: any;
    error?: undefined;
    message?: undefined;
    dueCount?: undefined;
}>;
/**
 * Pause evergreen recycler
 */
export function pauseEvergreen(): Promise<{
    status: string;
    error?: undefined;
} | {
    error: string;
    status?: undefined;
}>;
/**
 * Resume evergreen recycler
 */
export function resumeEvergreen(): Promise<{
    status: string;
    error?: undefined;
} | {
    error: string;
    status?: undefined;
}>;
/**
 * Get evergreen stats
 */
export function getEvergreenStats(): Promise<{
    username: any;
    totalQueued: any;
    posted: any;
    pending: any;
    paused: any;
    lastPosted: any;
    createdAt: any;
    error?: undefined;
} | {
    error: string;
    username?: undefined;
    totalQueued?: undefined;
    posted?: undefined;
    pending?: undefined;
    paused?: undefined;
    lastPosted?: undefined;
    createdAt?: undefined;
}>;
/**
 * Vary a tweet to avoid duplicate detection
 */
export function varyTweet(text: any): {
    original: any;
    varied: any;
    changeDescription: string;
};
