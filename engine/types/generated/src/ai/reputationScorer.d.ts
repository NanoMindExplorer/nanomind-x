/**
 * The dimensions to score for a given config: the built-ins the caller asked
 * for (default: all of them), plus one optional custom question.
 *
 * @param {{ dimensions?: string[], customQuestion?: string }} [opts]
 * @returns {Array<{ key: string, label: string, question: string }>}
 */
export function resolveDimensions({ dimensions, customQuestion }?: {
    dimensions?: string[];
    customQuestion?: string;
}): Array<{
    key: string;
    label: string;
    question: string;
}>;
/**
 * Build the system prompt: the rubric, and a strict JSON output contract so
 * the response parses without a second round trip.
 *
 * @param {{ dimensions?: string[], customQuestion?: string }} [opts]
 * @returns {string}
 */
export function buildRiskSystemPrompt(opts?: {
    dimensions?: string[];
    customQuestion?: string;
}): string;
/**
 * Build the per-post user message.
 *
 * @param {{ text: string, author?: string, authorName?: string, quotedText?: string, hasMedia?: boolean, isReply?: boolean }} post
 * @returns {string}
 */
export function buildRiskUserPrompt(post: {
    text: string;
    author?: string;
    authorName?: string;
    quotedText?: string;
    hasMedia?: boolean;
    isReply?: boolean;
}): string;
/**
 * Parse a raw completion into a validated per-dimension score, clamp every
 * number into 0..100, and compute the overall verdict.
 *
 * The overall score is the MAX across dimensions, not the average: one
 * dimension at 95 and three at 0 is still a post worth flagging, and
 * averaging would wash that out to 24.
 *
 * @param {string} raw
 * @param {Array<{ key: string, label: string }>} dims
 * @returns {{ dimensions: Record<string, {score:number, reason:string}>, overall: number, verdict: 'clean'|'review'|'flagged', worstDimension: string }}
 */
export function parseRiskResponse(raw: string, dims: Array<{
    key: string;
    label: string;
}>): {
    dimensions: Record<string, {
        score: number;
        reason: string;
    }>;
    overall: number;
    verdict: "clean" | "review" | "flagged";
    worstDimension: string;
};
/**
 * Score one post.
 *
 * @param {{ id?: string, text: string, author?: string, authorName?: string, quotedText?: string, hasMedia?: boolean, isReply?: boolean }} post
 * @param {object} [config] - Same shape as commentGenerator's provider config (provider, apiKey, baseUrl, model, fetchImpl, retries), plus:
 * @param {string[]} [config.dimensions] - Subset of DIMENSIONS keys. Default: all.
 * @param {string} [config.customQuestion] - An extra rubric line specific to this scan.
 * @returns {Promise<{ postId: string, dimensions: object, overall: number, verdict: string, worstDimension: string, model: string }>}
 */
export function scorePost(post: {
    id?: string;
    text: string;
    author?: string;
    authorName?: string;
    quotedText?: string;
    hasMedia?: boolean;
    isReply?: boolean;
}, config?: {
    dimensions?: string[];
    customQuestion?: string;
}): Promise<{
    postId: string;
    dimensions: object;
    overall: number;
    verdict: string;
    worstDimension: string;
    model: string;
}>;
/**
 * Score many posts with bounded concurrency. A failure on one post never
 * aborts the batch; it comes back as `{ postId, error }` so the caller can
 * report it against that one post instead of losing the whole scan.
 *
 * @param {Array<object>} posts - Same shape scorePost takes, one per post.
 * @param {object} [config] - Same as scorePost, plus:
 * @param {number} [config.concurrency=4] - Parallel requests in flight, capped at 8.
 * @param {(done: number, total: number, result: object) => void} [config.onProgress]
 * @returns {Promise<Array<object>>} One result per post, same order as input.
 */
export function scorePosts(posts: Array<object>, config?: {
    concurrency?: number;
    onProgress?: (done: number, total: number, result: object) => void;
}): Promise<Array<object>>;
/**
 * Convert a 0..100 risk score (where 0 is safest) to a reputation grade
 * letter. The reputation score shown to the user is the inverse (100 -
 * risk), so a clean account reads as a high, encouraging number.
 *
 * @param {number} reputationScore - 0..100, higher is better
 * @returns {string} One of A+, A, B, C, D, F
 */
export function scoreToGrade(reputationScore: number): string;
/**
 * Roll a batch of scored posts into a report: an overall reputation score,
 * a letter grade, per-dimension averages, and the posts most worth acting on.
 *
 * @param {Array<object>} posts - The original posts, same order as `scores`.
 * @param {Array<object>} scores - scorePosts() output, same order as `posts`.
 * @param {number} [topN=10] - How many flagged/review posts to surface.
 * @returns {{
 *   scanned: number, scoredOk: number, errors: number,
 *   reputationScore: number, grade: string,
 *   verdictCounts: { clean: number, review: number, flagged: number },
 *   dimensionAverages: Record<string, number>,
 *   dimensionPeaks: Record<string, number>,
 *   worstPosts: Array<{ post: object, score: object }>,
 * }}
 */
export function summarizeReport(posts: Array<object>, scores: Array<object>, topN?: number): {
    scanned: number;
    scoredOk: number;
    errors: number;
    reputationScore: number;
    grade: string;
    verdictCounts: {
        clean: number;
        review: number;
        flagged: number;
    };
    dimensionAverages: Record<string, number>;
    dimensionPeaks: Record<string, number>;
    worstPosts: Array<{
        post: object;
        score: object;
    }>;
};
/**
 * Built-in risk dimensions. Each is scored 0 (no risk) to 100 (high risk) by
 * the model in a single call, so a five-dimension scan costs the same one
 * request per post as a one-dimension scan.
 */
export const DIMENSIONS: Readonly<{
    professional: {
        label: string;
        emoji: string;
        question: string;
    };
    hostile: {
        label: string;
        emoji: string;
        question: string;
    };
    legal: {
        label: string;
        emoji: string;
        question: string;
    };
    spam: {
        label: string;
        emoji: string;
        question: string;
    };
}>;
/** Overall score at or above this is worth removing outright. */
export const FLAG_THRESHOLD: 70;
/** Overall score at or above this, below FLAG_THRESHOLD, is worth a human look. */
export const REVIEW_THRESHOLD: 40;
