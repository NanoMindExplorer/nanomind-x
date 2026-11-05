/**
 * Pick a live `:free` model on OpenRouter. Free model ids are retired without
 * notice, so the id is read from the live list (cached 10 minutes) instead of
 * being hardcoded.
 */
export function pickOpenRouterFreeModel(apiKey: any, fetchImpl?: typeof fetch): Promise<any>;
/**
 * Build the ordered lane chain for one request.
 *
 * @param {Record<string, string|undefined>} env  process.env, the Worker env, or {} in the browser
 * @param {{ byok?: { provider: string, apiKey: string, model?: string }, browserSafe?: boolean }} [opts]
 * @returns {Array<{ name: string, url: string, model: string|(() => Promise<string>), key?: string, headers?: Record<string,string>, keyless?: boolean, noStream?: boolean, browser?: boolean }>}
 */
export function buildLaneChain(env?: Record<string, string | undefined>, opts?: {
    byok?: {
        provider: string;
        apiKey: string;
        model?: string;
    };
    browserSafe?: boolean;
}): Array<{
    name: string;
    url: string;
    model: string | (() => Promise<string>);
    key?: string;
    headers?: Record<string, string>;
    keyless?: boolean;
    noStream?: boolean;
    browser?: boolean;
}>;
/**
 * Stream a completion through the chain. Calls `onLane(name)` when a lane is
 * selected and `onDelta(text)` for every token. Resolves with the lane that
 * answered and the full text; rejects only when every lane failed.
 *
 * @param {ReturnType<typeof buildLaneChain>} chain
 * @param {Array<{ role: string, content: string }>} messages
 * @param {{ onLane?: (name: string) => void, onDelta?: (text: string) => void, timeoutMs?: number, maxTokens?: number, signal?: AbortSignal }} [opts]
 */
export function streamCompletion(chain: ReturnType<typeof buildLaneChain>, messages: Array<{
    role: string;
    content: string;
}>, opts?: {
    onLane?: (name: string) => void;
    onDelta?: (text: string) => void;
    timeoutMs?: number;
    maxTokens?: number;
    signal?: AbortSignal;
}): Promise<{
    lane: string;
    model: string;
    text: string;
    partial?: undefined;
} | {
    lane: string;
    model: string;
    text: string;
    partial: boolean;
}>;
export namespace BYOK_PROVIDERS {
    namespace groq {
        let label: string;
        let url: string;
        let model: string;
    }
    namespace openrouter {
        let label_1: string;
        export { label_1 as label };
        let url_1: string;
        export { url_1 as url };
        let model_1: string;
        export { model_1 as model };
    }
    namespace xai {
        let label_2: string;
        export { label_2 as label };
        let url_2: string;
        export { url_2 as url };
        let model_2: string;
        export { model_2 as model };
    }
    namespace openai {
        let label_3: string;
        export { label_3 as label };
        let url_3: string;
        export { url_3 as url };
        let model_3: string;
        export { model_3 as model };
    }
    namespace gemini {
        let label_4: string;
        export { label_4 as label };
        let url_4: string;
        export { url_4 as url };
        let model_4: string;
        export { model_4 as model };
    }
    namespace mistral {
        let label_5: string;
        export { label_5 as label };
        let url_5: string;
        export { url_5 as url };
        let model_5: string;
        export { model_5 as model };
    }
    namespace cerebras {
        let label_6: string;
        export { label_6 as label };
        let url_6: string;
        export { url_6 as url };
        let model_6: string;
        export { model_6 as model };
    }
}
