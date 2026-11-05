/**
 * Build the system prompt that shapes every comment.
 *
 * @param {object} opts
 * @param {string} opts.prompt - The user's brief for how comments should sound
 * @param {string} [opts.persona] - Optional persona line ("You are @nichxbt, a founder in web3")
 * @param {boolean} [opts.allowHashtags=false]
 * @param {boolean} [opts.allowEmoji=true]
 * @param {number} [opts.maxLength=280]
 * @returns {string}
 */
export function buildSystemPrompt({ prompt, persona, allowHashtags, allowEmoji, maxLength }: {
    prompt: string;
    persona?: string;
}): string;
/**
 * Build the per-tweet user message.
 *
 * @param {object} tweet
 * @param {string} tweet.text
 * @param {string} [tweet.author] - Handle without the @
 * @param {string} [tweet.authorName]
 * @param {string[]} [recent] - Recent replies already posted in this run, so the model varies its phrasing
 * @returns {string}
 */
export function buildUserPrompt(tweet: {
    text: string;
    author?: string;
    authorName?: string;
}, recent?: string[]): string;
/**
 * Clean a raw model completion into something postable.
 *
 * Strips code fences, surrounding quotes, "Reply:" labels, leading hashtags
 * when not allowed, and collapses whitespace. Returns an empty string when
 * nothing usable remains.
 *
 * @param {string} raw
 * @param {{ allowHashtags?: boolean, maxLength?: number }} [opts]
 * @returns {string}
 */
export function sanitizeComment(raw: string, opts?: {
    allowHashtags?: boolean;
    maxLength?: number;
}): string;
/**
 * True when a comment reads as boilerplate and should be regenerated.
 *
 * @param {string} text
 * @returns {boolean}
 */
export function isGenericComment(text: string): boolean;
/**
 * Resolve the provider config into a request target.
 *
 * @param {object} config
 * @param {'openrouter'|'openai'|'xai'|'ollama'|'anthropic'|'custom'} [config.provider='openrouter']
 * @param {string} [config.apiKey]
 * @param {string} [config.baseUrl] - Full chat-completions URL; required for `custom`
 * @param {string} [config.model]
 * @param {Record<string,string|undefined>} [env=process.env]
 * @returns {{ provider: string, url: string, apiKey: string, model: string }}
 */
export function resolveProvider(config?: {
    provider?: "openrouter" | "openai" | "xai" | "ollama" | "anthropic" | "custom";
    apiKey?: string;
    baseUrl?: string;
    model?: string;
}, env?: Record<string, string | undefined>): {
    provider: string;
    url: string;
    apiKey: string;
    model: string;
};
/**
 * One raw chat completion against the resolved provider, with retry on
 * 429/5xx. Returns the assistant text.
 *
 * @param {{ provider: string, url: string, apiKey: string, model: string }} target
 * @param {Array<{role:string,content:string}>} messages
 * @param {{ temperature?: number, maxTokens?: number, fetchImpl?: typeof fetch, retries?: number }} [opts]
 * @returns {Promise<{ text: string, model: string, usage: object }>}
 */
export function chatCompletion(target: {
    provider: string;
    url: string;
    apiKey: string;
    model: string;
}, messages: Array<{
    role: string;
    content: string;
}>, opts?: {
    temperature?: number;
    maxTokens?: number;
    fetchImpl?: typeof fetch;
    retries?: number;
}): Promise<{
    text: string;
    model: string;
    usage: object;
}>;
/**
 * Create a comment generator bound to one provider and one brief.
 *
 * @param {object} config
 * @param {string} config.prompt - How the comments should sound
 * @param {string} [config.persona]
 * @param {string} [config.provider]
 * @param {string} [config.apiKey]
 * @param {string} [config.baseUrl]
 * @param {string} [config.model]
 * @param {number} [config.temperature=0.9]
 * @param {number} [config.maxLength=280]
 * @param {boolean} [config.allowHashtags=false]
 * @param {boolean} [config.allowEmoji=true]
 * @param {typeof fetch} [config.fetchImpl]
 * @returns {{
 *   generate: (tweet: {text:string, author?:string, authorName?:string, quotedText?:string, hasMedia?:boolean}) => Promise<{ text: string, model: string, attempts: number }>,
 *   history: string[],
 *   target: { provider: string, url: string, model: string },
 * }}
 */
export function createCommentGenerator(config: {
    prompt: string;
    persona?: string;
    provider?: string;
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    temperature?: number;
    maxLength?: number;
    allowHashtags?: boolean;
    allowEmoji?: boolean;
    fetchImpl?: typeof fetch;
}): {
    generate: (tweet: {
        text: string;
        author?: string;
        authorName?: string;
        quotedText?: string;
        hasMedia?: boolean;
    }) => Promise<{
        text: string;
        model: string;
        attempts: number;
    }>;
    history: string[];
    target: {
        provider: string;
        url: string;
        model: string;
    };
};
export namespace PROVIDER_URLS {
    let openrouter: string;
    let openai: string;
    let xai: string;
    let ollama: string;
    let anthropic: string;
}
export namespace DEFAULT_MODELS {
    let openrouter_1: string;
    export { openrouter_1 as openrouter };
    let openai_1: string;
    export { openai_1 as openai };
    let xai_1: string;
    export { xai_1 as xai };
    let ollama_1: string;
    export { ollama_1 as ollama };
    let anthropic_1: string;
    export { anthropic_1 as anthropic };
    export let custom: string;
}
export namespace PROVIDER_ENV_KEYS {
    let openrouter_2: string[];
    export { openrouter_2 as openrouter };
    let openai_2: string[];
    export { openai_2 as openai };
    let xai_2: string[];
    export { xai_2 as xai };
    let anthropic_2: string[];
    export { anthropic_2 as anthropic };
    let ollama_2: any[];
    export { ollama_2 as ollama };
    let custom_1: string[];
    export { custom_1 as custom };
}
/**
 * Openers that make a reply read as automated. A generated comment that
 * starts with one of these is rejected and regenerated once.
 */
export const GENERIC_OPENERS: string[];
