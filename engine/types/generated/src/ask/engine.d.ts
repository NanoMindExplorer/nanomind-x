/** Lowercase word tokens with light stemming; underscores and dots split too. */
export function tokenize(text: any): any[];
/**
 * Build a BM25 searcher over the index chunks. Cheap enough to do on every
 * cold start (a few thousand chunks); cache the result per process.
 */
export function createSearcher(index: any): {
    search: (question: any, { limit, perDoc }?: {
        limit?: number;
        perDoc?: number;
    }) => any[];
    size: any;
};
/**
 * Live GitHub lane: open issues and discussions that match the question. No
 * key needed for search/issues; a GITHUB_TOKEN raises the rate limit and
 * unlocks code search.
 */
export function searchGitHub(question: any, { token, timeoutMs }?: {
    timeoutMs?: number;
}): Promise<{
    t: any;
    u: any;
    p: any;
    k: string;
    x: string;
}[]>;
/**
 * Format retrieved sources as a plain digest of what the documentation says.
 *
 * Used when every LLM lane is exhausted (all the keyless lanes are rate limited
 * per IP, so this is reachable in practice). The user still gets the real
 * passages that matched their question and the links to read further, which is
 * strictly more useful than an error. It is generated text from the index, not
 * a model answer, and the caller labels it as such.
 */
export function docsDigest(question: any, sources: any): string;
/**
 * Merge chunks that share a URL into one numbered source, so the numbers the
 * model cites are exactly the chips the client renders. Text from the merged
 * chunks is joined, best-scoring first, up to a cap.
 */
export function mergeSources(sources: any, { maxChars }?: {
    maxChars?: number;
}): any[];
/** Strip a merged source list to what the client needs. */
export function publicSources(sources: any): any;
/**
 * Answer one question. Emits events through `onEvent`:
 *   { type: 'sources', sources }   retrieval finished
 *   { type: 'lane', lane }         a lane accepted the request
 *   { type: 'delta', text }        streamed answer text
 *   { type: 'done', lane, model, sources }
 *
 * @param {object} args
 * @param {string} args.question
 * @param {Array<{ role: 'user'|'assistant', content: string }>} [args.history]
 * @param {{ search: Function }} args.searcher
 * @param {Record<string, string|undefined>} [args.env]
 * @param {{ provider: string, apiKey: string, model?: string }} [args.byok]
 * @param {boolean} [args.browserSafe]  drop lanes that reject browser origins
 * @param {{ match: Function }} [args.matcher]  action matcher; when present the
 *   answer is followed by the scripts, commands and MCP tools that run it
 * @param {(event: object) => void} args.onEvent
 * @param {AbortSignal} [args.signal]
 */
export function ask({ question, history, searcher, matcher, env, byok, browserSafe, onEvent, signal }: {
    question: string;
    history?: Array<{
        role: "user" | "assistant";
        content: string;
    }>;
    searcher: {
        search: Function;
    };
    env?: Record<string, string | undefined>;
    byok?: {
        provider: string;
        apiKey: string;
        model?: string;
    };
    browserSafe?: boolean;
    matcher?: {
        match: Function;
    };
    onEvent: (event: object) => void;
    signal?: AbortSignal;
}): Promise<{
    lane: string;
    model: string;
    text: string;
    digest: boolean;
    sources: any;
    actions: any;
} | {
    sources: any;
    actions: any;
    lane: string;
    model: string;
    text: string;
    partial?: undefined;
    digest?: undefined;
} | {
    sources: any;
    actions: any;
    lane: string;
    model: string;
    text: string;
    partial: boolean;
    digest?: undefined;
}>;
export const REPO: "NanoMindExplorer/nanomind-x";
export const SITE: "https://github.com/NanoMindExplorer/nanomind-x";
/** Suggested questions shown on the empty state; every one resolves against the index. */
export const SUGGESTED_QUESTIONS: string[];
