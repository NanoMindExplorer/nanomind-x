/**
 * Analyze follower overlap between two accounts
 */
export function analyzeOverlap(username1: any, username2: any, options?: {}): Promise<{
    accountA: {
        username: any;
        followerCount: any;
        uniqueCount: number;
    };
    accountB: {
        username: any;
        followerCount: any;
        uniqueCount: number;
    };
    shared: {
        count: number;
        percentage: number;
        users: any[];
    };
    uniqueToA: {
        count: number;
        users: any[];
    };
    uniqueToB: {
        count: number;
        users: any[];
    };
    insights: string[];
}>;
/**
 * Compare 3+ accounts pairwise — overlap matrix
 */
export function multiOverlap(usernames: any, options?: {}): Promise<{
    usernames: any;
    matrix: {};
    coreAudience: {
        count: number;
        users: any[];
    };
    nicheAudience: {};
}>;
/**
 * Rank candidates by audience similarity to target
 */
export function findSimilarAudience(username: any, candidateUsernames: any, options?: {}): Promise<{
    target: any;
    targetFollowers: any;
    rankings: {
        username: any;
        followerCount: any;
        overlapCount: number;
        similarityPercent: number;
    }[];
}>;
/**
 * Generate natural-language insights from overlap data
 */
export function getAudienceInsights(overlapResult: any): string[];
/**
 * Clear the follower cache
 */
export function clearCache(): void;
