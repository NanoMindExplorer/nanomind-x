/**
 * Create a new persona configuration
 */
export function createPersona(options?: {}): {
    id: any;
    name: any;
    preset: any;
    createdAt: string;
    updatedAt: string;
    niche: {
        topics: any;
        searchTerms: any;
        targetAccounts: any;
        avoidTopics: any;
        avoidAccounts: any;
    };
    voice: {
        tone: any;
        commentStyle: any;
        bioTemplate: any;
        postTopics: any;
        emojiUsage: any;
        hashtagUsage: any;
        language: any;
        maxCommentLength: any;
        maxPostLength: any;
    };
    activityPattern: any;
    strategy: any;
    llm: {
        provider: string;
        models: {
            comment: any;
            post: any;
            reply: any;
        };
        apiKey: any;
        temperature: any;
        systemPrompt: any;
    };
    goals: {
        targetFollowers: any;
        targetPostsPerDay: any;
        targetEngagementRate: any;
        milestonesReached: any[];
    };
    state: {
        totalSessions: number;
        totalFollows: number;
        totalLikes: number;
        totalComments: number;
        totalPosts: number;
        totalSearches: number;
        totalProfileVisits: number;
        totalUnfollows: number;
        followedUsers: {};
        engagedPosts: Set<any>;
        lastSessionAt: any;
        lastPostAt: any;
        currentFollowers: number;
        followerHistory: any[];
        errors: any[];
    };
};
/**
 * Save persona to disk
 */
export function savePersona(persona: any): string;
/**
 * Load persona from disk
 */
export function loadPersona(id: any): any;
/**
 * List all saved personas
 */
export function listPersonas(): ({
    id: any;
    name: any;
    preset: any;
    strategy: any;
    totalSessions: any;
    totalFollows: any;
    totalLikes: any;
    totalComments: any;
    currentFollowers: any;
    createdAt: any;
    lastSessionAt: any;
    error?: undefined;
} | {
    id: string;
    name: string;
    error: boolean;
    preset?: undefined;
    strategy?: undefined;
    totalSessions?: undefined;
    totalFollows?: undefined;
    totalLikes?: undefined;
    totalComments?: undefined;
    currentFollowers?: undefined;
    createdAt?: undefined;
    lastSessionAt?: undefined;
})[];
/**
 * Delete a persona
 */
export function deletePersona(id: any): boolean;
/**
 * Build the LLM system prompt from persona config
 */
export function buildPersonaSystemPrompt(persona: any): any;
/**
 * Build a comment generation prompt for a specific tweet
 */
export function buildCommentPrompt(persona: any, tweetText: any, tweetAuthor: any): string;
/**
 * Build a post generation prompt
 */
export function buildPostPrompt(persona: any, context?: {}): string;
/**
 * Build a reply prompt for a specific conversation
 */
export function buildReplyPrompt(persona: any, originalTweet: any, replyTo: any): string;
/**
 * Determine if the persona should be active right now
 */
export function shouldBeActive(persona: any): boolean;
/**
 * Get the intensity multiplier for the current time
 * Peak hours = more activity, off-peak = less
 */
export function getActivityIntensity(persona: any): number;
/**
 * Calculate how long the next session should be (in minutes)
 */
export function getSessionDuration(persona: any): number;
/**
 * Calculate delay until next session (in minutes)
 */
export function getDelayUntilNextSession(persona: any): number;
/**
 * Choose what actions to perform this session
 * Returns a shuffled activity plan
 */
export function planSession(persona: any): {
    duration: number;
    activities: any[];
};
export const NICHE_PRESETS: {
    'crypto-degen': {
        name: string;
        topics: string[];
        searchTerms: string[];
        targetAccounts: string[];
        tone: string;
        commentStyle: string;
        bioTemplate: string;
        postTopics: string[];
    };
    'tech-builder': {
        name: string;
        topics: string[];
        searchTerms: string[];
        targetAccounts: string[];
        tone: string;
        commentStyle: string;
        bioTemplate: string;
        postTopics: string[];
    };
    'ai-researcher': {
        name: string;
        topics: string[];
        searchTerms: string[];
        targetAccounts: string[];
        tone: string;
        commentStyle: string;
        bioTemplate: string;
        postTopics: string[];
    };
    'growth-marketer': {
        name: string;
        topics: string[];
        searchTerms: string[];
        targetAccounts: string[];
        tone: string;
        commentStyle: string;
        bioTemplate: string;
        postTopics: string[];
    };
    'finance-investor': {
        name: string;
        topics: string[];
        searchTerms: string[];
        targetAccounts: string[];
        tone: string;
        commentStyle: string;
        bioTemplate: string;
        postTopics: string[];
    };
    'creative-writer': {
        name: string;
        topics: string[];
        searchTerms: string[];
        targetAccounts: string[];
        tone: string;
        commentStyle: string;
        bioTemplate: string;
        postTopics: string[];
    };
    custom: {
        name: string;
        topics: any[];
        searchTerms: any[];
        targetAccounts: any[];
        tone: string;
        commentStyle: string;
        bioTemplate: string;
        postTopics: any[];
    };
};
export const ACTIVITY_PATTERNS: {
    'night-owl': {
        name: string;
        description: string;
        activeHours: number[];
        peakHours: number[];
        sleepHours: number[];
    };
    'early-bird': {
        name: string;
        description: string;
        activeHours: number[];
        peakHours: number[];
        sleepHours: number[];
    };
    'nine-to-five': {
        name: string;
        description: string;
        activeHours: number[];
        peakHours: number[];
        sleepHours: number[];
    };
    'always-on': {
        name: string;
        description: string;
        activeHours: number[];
        peakHours: number[];
        sleepHours: number[];
    };
    'weekend-warrior': {
        name: string;
        description: string;
        activeHours: number[];
        peakHours: number[];
        sleepHours: number[];
        weekendMultiplier: number;
    };
};
export namespace ENGAGEMENT_STRATEGIES {
    namespace aggressive {
        let name: string;
        let description: string;
        namespace dailyLimits {
            let follows: number;
            let likes: number;
            let comments: number;
            let posts: number;
            let searches: number;
            let profileVisits: number;
        }
        let followBackRatio: number;
        let likeRatio: number;
        let commentRatio: number;
        let unfollowAfterDays: number;
        namespace sessionLength {
            let min: number;
            let max: number;
        }
        namespace sessionsPerDay {
            let min_1: number;
            export { min_1 as min };
            let max_1: number;
            export { max_1 as max };
        }
    }
    namespace moderate {
        let name_1: string;
        export { name_1 as name };
        let description_1: string;
        export { description_1 as description };
        export namespace dailyLimits_1 {
            let follows_1: number;
            export { follows_1 as follows };
            let likes_1: number;
            export { likes_1 as likes };
            let comments_1: number;
            export { comments_1 as comments };
            let posts_1: number;
            export { posts_1 as posts };
            let searches_1: number;
            export { searches_1 as searches };
            let profileVisits_1: number;
            export { profileVisits_1 as profileVisits };
        }
        export { dailyLimits_1 as dailyLimits };
        let followBackRatio_1: number;
        export { followBackRatio_1 as followBackRatio };
        let likeRatio_1: number;
        export { likeRatio_1 as likeRatio };
        let commentRatio_1: number;
        export { commentRatio_1 as commentRatio };
        let unfollowAfterDays_1: number;
        export { unfollowAfterDays_1 as unfollowAfterDays };
        export namespace sessionLength_1 {
            let min_2: number;
            export { min_2 as min };
            let max_2: number;
            export { max_2 as max };
        }
        export { sessionLength_1 as sessionLength };
        export namespace sessionsPerDay_1 {
            let min_3: number;
            export { min_3 as min };
            let max_3: number;
            export { max_3 as max };
        }
        export { sessionsPerDay_1 as sessionsPerDay };
    }
    namespace conservative {
        let name_2: string;
        export { name_2 as name };
        let description_2: string;
        export { description_2 as description };
        export namespace dailyLimits_2 {
            let follows_2: number;
            export { follows_2 as follows };
            let likes_2: number;
            export { likes_2 as likes };
            let comments_2: number;
            export { comments_2 as comments };
            let posts_2: number;
            export { posts_2 as posts };
            let searches_2: number;
            export { searches_2 as searches };
            let profileVisits_2: number;
            export { profileVisits_2 as profileVisits };
        }
        export { dailyLimits_2 as dailyLimits };
        let followBackRatio_2: number;
        export { followBackRatio_2 as followBackRatio };
        let likeRatio_2: number;
        export { likeRatio_2 as likeRatio };
        let commentRatio_2: number;
        export { commentRatio_2 as commentRatio };
        let unfollowAfterDays_2: number;
        export { unfollowAfterDays_2 as unfollowAfterDays };
        export namespace sessionLength_2 {
            let min_4: number;
            export { min_4 as min };
            let max_4: number;
            export { max_4 as max };
        }
        export { sessionLength_2 as sessionLength };
        export namespace sessionsPerDay_2 {
            let min_5: number;
            export { min_5 as min };
            let max_5: number;
            export { max_5 as max };
        }
        export { sessionsPerDay_2 as sessionsPerDay };
    }
    namespace thoughtleader {
        let name_3: string;
        export { name_3 as name };
        let description_3: string;
        export { description_3 as description };
        export namespace dailyLimits_3 {
            let follows_3: number;
            export { follows_3 as follows };
            let likes_3: number;
            export { likes_3 as likes };
            let comments_3: number;
            export { comments_3 as comments };
            let posts_3: number;
            export { posts_3 as posts };
            let searches_3: number;
            export { searches_3 as searches };
            let profileVisits_3: number;
            export { profileVisits_3 as profileVisits };
        }
        export { dailyLimits_3 as dailyLimits };
        let followBackRatio_3: number;
        export { followBackRatio_3 as followBackRatio };
        let likeRatio_3: number;
        export { likeRatio_3 as likeRatio };
        let commentRatio_3: number;
        export { commentRatio_3 as commentRatio };
        let unfollowAfterDays_3: number;
        export { unfollowAfterDays_3 as unfollowAfterDays };
        export namespace sessionLength_3 {
            let min_6: number;
            export { min_6 as min };
            let max_6: number;
            export { max_6 as max };
        }
        export { sessionLength_3 as sessionLength };
        export namespace sessionsPerDay_3 {
            let min_7: number;
            export { min_7 as min };
            let max_7: number;
            export { max_7 as max };
        }
        export { sessionsPerDay_3 as sessionsPerDay };
    }
}
