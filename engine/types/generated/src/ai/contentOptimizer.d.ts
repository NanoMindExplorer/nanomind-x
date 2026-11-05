/**
 * Suggest relevant hashtags for a tweet
 */
export function suggestHashtags(tweetText: any, options?: {}): Promise<{
    hashtag: any;
    relevance: number;
    source: string;
}[]>;
/**
 * Optimize a tweet for engagement
 */
export function optimizeTweet(text: any, options?: {}): Promise<{
    original: any;
    optimized: any;
    changes: string[];
    predictedLift: string;
}>;
/**
 * Predict tweet performance
 */
export function predictPerformance(text: any): {
    text: any;
    score: number;
    predictedPerformance: string;
    analysis: {
        length: any;
        wordCount: any;
        hasQuestion: any;
        hasCTA: boolean;
        emojiCount: any;
        hashtagCount: any;
        hasNumbers: boolean;
        hasLink: boolean;
        startsWithYou: any;
    };
    suggestions: string[];
};
/**
 * Generate N variations of a tweet
 */
export function generateVariations(text: any, count?: number): Promise<any>;
/**
 * Analyze a user's writing voice from their tweets
 */
export function analyzeVoice(username: any): Promise<{
    error: string;
    voiceProfile?: undefined;
} | {
    voiceProfile: {
        username: any;
        tweetsAnalyzed: number;
        avgLength: number;
        emojiUsage: string;
        questionUsage: string;
        hashtagUsage: string;
        commonPhrases: {
            phrase: string;
            count: any;
        }[];
        tone: string;
    };
    error?: undefined;
}>;
