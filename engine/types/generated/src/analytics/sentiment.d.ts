/**
 * Analyze sentiment of text
 *
 * @param {string} text - Text to analyze
 * @param {object} [options]
 * @param {string} [options.mode] - 'rules' (default) or 'llm'
 * @param {string} [options.apiKey] - OpenRouter API key for LLM mode
 * @param {string} [options.model] - LLM model for LLM mode
 * @returns {Promise<{ score: number, label: string, confidence: number, keywords: string[] }>}
 */
export function analyzeSentiment(text: string, options?: {
    mode?: string;
    apiKey?: string;
    model?: string;
}): Promise<{
    score: number;
    label: string;
    confidence: number;
    keywords: string[];
}>;
/**
 * Analyze sentiment of multiple texts (batch)
 *
 * @param {string[]} texts - Array of texts to analyze
 * @param {object} [options] - Same options as analyzeSentiment
 * @returns {Promise<Array<{ text: string, score: number, label: string, confidence: number, keywords: string[] }>>}
 */
export function analyzeBatch(texts: string[], options?: object): Promise<Array<{
    text: string;
    score: number;
    label: string;
    confidence: number;
    keywords: string[];
}>>;
/**
 * Compute aggregate statistics from batch results
 *
 * @param {Array<{ score: number, label: string }>} results
 * @returns {{ average: number, median: number, distribution: { positive: number, neutral: number, negative: number }, trend: string }}
 */
export function aggregateResults(results: Array<{
    score: number;
    label: string;
}>): {
    average: number;
    median: number;
    distribution: {
        positive: number;
        neutral: number;
        negative: number;
    };
    trend: string;
};
declare namespace _default {
    export { analyzeSentiment };
    export { analyzeBatch };
    export { aggregateResults };
}
export default _default;
