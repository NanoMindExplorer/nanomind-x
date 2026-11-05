/**
 * Join an X Space with an AI agent.
 *
 * @param {object} args
 * @param {string} args.url — Space URL (e.g. https://x.com/i/spaces/abc123)
 * @param {string} [args.provider] — AI provider: openai, claude, groq
 * @param {string} [args.apiKey] — AI provider API key
 * @param {string} [args.systemPrompt] — Custom system prompt
 * @param {string} [args.model] — LLM model name
 * @param {string} [args.voiceId] — TTS voice ID
 * @param {string} [args.ttsProvider] — TTS provider: openai, elevenlabs
 * @param {string} [args.sttProvider] — STT provider: openai, deepgram, groq
 * @param {boolean} [args.headless] — Run browser headless (default: true)
 * @returns {Promise<object>} Join result with status
 */
export function joinSpace(args?: {
    url: string;
    provider?: string;
    apiKey?: string;
    systemPrompt?: string;
    model?: string;
    voiceId?: string;
    ttsProvider?: string;
    sttProvider?: string;
    headless?: boolean;
}): Promise<object>;
/**
 * Leave the currently active Space.
 * @returns {Promise<object>} Leave result
 */
export function leaveSpace(): Promise<object>;
/**
 * Get the status of the currently active Space agent.
 * @returns {object} Current agent status
 */
export function getSpaceAgentStatus(): object;
/**
 * Get recent transcriptions from the active Space.
 * @param {object} [args]
 * @param {number} [args.limit] — Max transcriptions to return (default: 50)
 * @returns {object} Transcription data
 */
export function getSpaceTranscript(args?: {
    limit?: number;
}): object;
declare namespace _default {
    export { joinSpace };
    export { leaveSpace };
    export { getSpaceAgentStatus };
    export { getSpaceTranscript };
}
export default _default;
