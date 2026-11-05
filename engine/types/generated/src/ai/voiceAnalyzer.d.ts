/**
 * Analyze a user's voice/writing style from their tweets
 *
 * @param {string} username - Twitter username
 * @param {Array<object>} tweets - Array of tweet objects from scraper
 * @param {object} [options]
 * @param {number} [options.minTweets=20] - Minimum tweets for reliable analysis
 * @returns {object} VoiceProfile
 */
export function analyzeVoice(username: string, tweets: Array<object>, options?: {
    minTweets?: number;
}): object;
/**
 * Generate a human-readable summary of a voice profile
 *
 * @param {object} profile - VoiceProfile object
 * @returns {string} Human-readable summary
 */
export function summarizeVoiceProfile(profile: object): string;
/**
 * Build a system prompt from a voice profile for LLM tweet generation
 *
 * @param {object} profile - VoiceProfile object
 * @returns {string} System prompt for LLM
 */
export function buildVoicePrompt(profile: object): string;
declare namespace _default {
    export { analyzeVoice };
    export { summarizeVoiceProfile };
    export { buildVoicePrompt };
}
export default _default;
