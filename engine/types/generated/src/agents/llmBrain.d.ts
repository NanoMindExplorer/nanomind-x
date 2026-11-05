export type LLMConfig = {
    provider: "openrouter" | "openai" | "ollama";
    apiKey?: string;
    baseUrl?: string;
    models: {
        fast: string;
        mid: string;
        smart: string;
    };
};
/**
 * Tiered LLM client for scoring, replying, content creation, and strategy analysis.
 */
export class LLMBrain {
    /**
     * @param {LLMConfig} config
     */
    constructor(config?: LLMConfig);
    provider: "openrouter" | "openai" | "ollama";
    apiKey: string;
    baseUrl: string;
    models: {
        fast: string;
        mid: string;
        smart: string;
    };
    /** @type {Map<string, { count: number, resetAt: number }>} Rate limit counters per model */
    _rateLimits: Map<string, {
        count: number;
        resetAt: number;
    }>;
    /** @type {{ [model: string]: { calls: number, inputTokens: number, outputTokens: number } }} */
    _usageToday: {
        [model: string]: {
            calls: number;
            inputTokens: number;
            outputTokens: number;
        };
    };
    _usageDate: string;
    /** @type {((model: string, inputTokens: number, outputTokens: number) => void)|null} */
    onUsage: ((model: string, inputTokens: number, outputTokens: number) => void) | null;
    /**
     * Send a chat completion request to the configured LLM provider.
     * @param {'fast'|'mid'|'smart'} tier - Which model tier to use
     * @param {Array<{ role: string, content: string }>} messages
     * @param {{ temperature?: number, maxTokens?: number }} [options]
     * @returns {Promise<{ text: string, inputTokens: number, outputTokens: number }>}
     */
    _call(tier: "fast" | "mid" | "smart", messages: Array<{
        role: string;
        content: string;
    }>, options?: {
        temperature?: number;
        maxTokens?: number;
    }): Promise<{
        text: string;
        inputTokens: number;
        outputTokens: number;
    }>;
    _checkRateLimit(model: any): Promise<void>;
    _bumpRateLimit(model: any): void;
    _recordUsage(model: any, inputTokens: any, outputTokens: any): void;
    /**
     * Get today's cumulative token usage per model.
     * @returns {{ [model: string]: { calls: number, inputTokens: number, outputTokens: number } }}
     */
    getUsageToday(): {
        [model: string]: {
            calls: number;
            inputTokens: number;
            outputTokens: number;
        };
    };
    /**
     * Score a tweet's relevance to a niche (0-100).
     * Uses the fast model for cost efficiency.
     * @param {string} tweetText
     * @param {string[]} nicheKeywords
     * @returns {Promise<number>} Score from 0 to 100
     */
    scoreRelevance(tweetText: string, nicheKeywords: string[]): Promise<number>;
    /**
     * Generate a contextual reply to a tweet.
     * Uses the mid model for quality/cost balance.
     * @param {{ text: string, author: string }} tweet
     * @param {{ name: string, tone: string, expertise: string[], opinions: string[], avoid: string[] }} persona
     * @param {string} [threadContext] - Previous tweets in thread for context
     * @returns {Promise<string>}
     */
    generateReply(tweet: {
        text: string;
        author: string;
    }, persona: {
        name: string;
        tone: string;
        expertise: string[];
        opinions: string[];
        avoid: string[];
    }, threadContext?: string): Promise<string>;
    /**
     * Generate original content (tweet, thread, or quote commentary).
     * Uses the smart model for highest quality.
     * @param {{ type: 'tweet'|'thread'|'quote', persona: Object, niche: Object, trends?: string[], recentPosts?: Array }} params
     * @returns {Promise<{ type: string, text: string|string[] }>}
     */
    generateContent({ type, persona, niche, trends, recentPosts }: {
        type: "tweet" | "thread" | "quote";
        persona: any;
        niche: any;
        trends?: string[];
        recentPosts?: any[];
    }): Promise<{
        type: string;
        text: string | string[];
    }>;
    /**
     * Analyze agent metrics and generate strategic recommendations.
     * Uses the smart model.
     * @param {{ followers: Array, engagement: Array, content: Array, llmCost: number }} metrics
     * @returns {Promise<string>}
     */
    analyzeStrategy(metrics: {
        followers: any[];
        engagement: any[];
        content: any[];
        llmCost: number;
    }): Promise<string>;
    /**
     * Check if content is consistent with the persona voice.
     * Uses the fast model.
     * @param {string} text - Content to check
     * @param {{ name: string, tone: string, expertise: string[], avoid: string[] }} persona
     * @returns {Promise<{ consistent: boolean, issues: string[] }>}
     */
    checkPersonaConsistency(text: string, persona: {
        name: string;
        tone: string;
        expertise: string[];
        avoid: string[];
    }): Promise<{
        consistent: boolean;
        issues: string[];
    }>;
}
