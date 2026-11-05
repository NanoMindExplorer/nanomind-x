/**
 * Generate tweets matching a user's voice
 *
 * @param {object} voiceProfile - VoiceProfile from analyzeVoice()
 * @param {object} options
 * @param {string} options.topic - Topic or prompt for the tweet
 * @param {string} [options.style] - Optional style override: 'hot-take', 'educational', 'personal', 'promotional'
 * @param {number} [options.count=3] - Number of variations to generate (1-5)
 * @param {string} [options.model] - OpenRouter model override
 * @param {string} [options.apiKey] - OpenRouter API key override
 * @returns {Promise<{ tweets: Array<{ text: string, estimatedEngagement: string, reasoning: string }>, model: string }>}
 */
export function generateTweet(voiceProfile: object, options?: {
    topic: string;
    style?: string;
    count?: number;
    model?: string;
    apiKey?: string;
}): Promise<{
    tweets: Array<{
        text: string;
        estimatedEngagement: string;
        reasoning: string;
    }>;
    model: string;
}>;
/**
 * Generate a Twitter thread
 *
 * @param {object} voiceProfile - VoiceProfile from analyzeVoice()
 * @param {object} options
 * @param {string} options.topic - Topic for the thread
 * @param {number} [options.length=5] - Number of tweets in thread (3-10)
 * @param {boolean} [options.hooks=true] - Whether to include a hook opener and CTA closer
 * @param {string} [options.model] - OpenRouter model override
 * @param {string} [options.apiKey] - OpenRouter API key override
 * @returns {Promise<{ thread: Array<{ position: number, text: string, purpose: string }>, model: string }>}
 */
export function generateThread(voiceProfile: object, options?: {
    topic: string;
    length?: number;
    hooks?: boolean;
    model?: string;
    apiKey?: string;
}): Promise<{
    thread: Array<{
        position: number;
        text: string;
        purpose: string;
    }>;
    model: string;
}>;
/**
 * Rewrite/improve an existing tweet
 *
 * @param {object} voiceProfile - VoiceProfile from analyzeVoice()
 * @param {string} originalText - The original tweet to improve
 * @param {object} [options]
 * @param {string} [options.goal='more_engaging'] - 'more_engaging' | 'shorter' | 'add_hook' | 'more_casual' | 'more_formal' | 'add_cta'
 * @param {number} [options.count=3] - Number of variations
 * @param {string} [options.model] - OpenRouter model override
 * @param {string} [options.apiKey] - OpenRouter API key override
 * @returns {Promise<{ original: string, rewrites: Array<{ text: string, improvement: string }>, model: string }>}
 */
export function rewriteTweet(voiceProfile: object, originalText: string, options?: {
    goal?: string;
    count?: number;
    model?: string;
    apiKey?: string;
}): Promise<{
    original: string;
    rewrites: Array<{
        text: string;
        improvement: string;
    }>;
    model: string;
}>;
/**
 * Generate a week's content calendar
 *
 * @param {object} voiceProfile - VoiceProfile from analyzeVoice()
 * @param {object} [options]
 * @param {string[]} [options.topics] - Topics to cover (auto-generated from pillars if not provided)
 * @param {number} [options.postsPerDay=2] - Posts per day (1-5)
 * @param {number} [options.days=7] - Number of days (1-14)
 * @param {string} [options.model] - OpenRouter model override
 * @param {string} [options.apiKey] - OpenRouter API key override
 * @returns {Promise<{ calendar: Array<{ day: string, slot: string, topic: string, text: string, type: string }>, model: string }>}
 */
export function generateWeek(voiceProfile: object, options?: {
    topics?: string[];
    postsPerDay?: number;
    days?: number;
    model?: string;
    apiKey?: string;
}): Promise<{
    calendar: Array<{
        day: string;
        slot: string;
        topic: string;
        text: string;
        type: string;
    }>;
    model: string;
}>;
/**
 * Generate a reply to someone else's tweet
 *
 * @param {object} voiceProfile - VoiceProfile from analyzeVoice()
 * @param {string} originalTweet - The tweet to reply to
 * @param {object} [options]
 * @param {string} [options.tone] - 'agree', 'disagree', 'add-on', 'question', 'funny', 'supportive'
 * @param {number} [options.count=3] - Number of reply variations
 * @param {string} [options.model] - OpenRouter model override
 * @param {string} [options.apiKey] - OpenRouter API key override
 * @returns {Promise<{ originalTweet: string, replies: Array<{ text: string, tone: string, reasoning: string }>, model: string }>}
 */
export function generateReply(voiceProfile: object, originalTweet: string, options?: {
    tone?: string;
    count?: number;
    model?: string;
    apiKey?: string;
}): Promise<{
    originalTweet: string;
    replies: Array<{
        text: string;
        tone: string;
        reasoning: string;
    }>;
    model: string;
}>;
/**
 * Analyze competitor's top-performing patterns and generate tweets for YOUR voice
 * The killer feature: scrape competitor → analyze what works → generate in YOUR voice
 *
 * @param {object} myVoiceProfile - Your VoiceProfile
 * @param {object} competitorVoiceProfile - Competitor's VoiceProfile
 * @param {object} [options]
 * @param {number} [options.count=5] - Number of tweets to generate
 * @param {string} [options.model] - OpenRouter model override
 * @param {string} [options.apiKey] - OpenRouter API key override
 * @returns {Promise<{ insights: string, tweets: Array<{ text: string, inspiredBy: string }>, model: string }>}
 */
export function analyzeCompetitorAndGenerate(myVoiceProfile: object, competitorVoiceProfile: object, options?: {
    count?: number;
    model?: string;
    apiKey?: string;
}): Promise<{
    insights: string;
    tweets: Array<{
        text: string;
        inspiredBy: string;
    }>;
    model: string;
}>;
declare namespace _default {
    export { generateTweet };
    export { generateThread };
    export { rewriteTweet };
    export { generateWeek };
    export { generateReply };
    export { analyzeCompetitorAndGenerate };
}
export default _default;
