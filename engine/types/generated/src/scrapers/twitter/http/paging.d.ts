/**
 * Read a dot-separated path from an object.
 *
 * @param {object} obj
 * @param {string} path e.g. 'data.user.result.timeline.timeline.instructions'
 * @returns {*}
 */
export function getPath(obj: object, path: string): any;
/**
 * Locate the timeline instructions array in a GraphQL response.
 *
 * Tries the preferred path first, then walks the response looking for the
 * first `instructions` array, so a bundle that nests the timeline under a
 * renamed key still parses.
 *
 * @param {object} response Raw GraphQL response
 * @param {string} [preferredPath] Dot-path to `instructions`
 * @returns {object[]} Instructions (empty array when none found)
 */
export function findInstructions(response: object, preferredPath?: string): object[];
/**
 * Flatten every entry (and module item) out of a set of instructions.
 *
 * Returns entries in timeline order. Module items are returned as
 * `{ entryId, content: { itemContent } }` so callers can treat them like
 * plain entries. The bottom cursor is returned separately.
 *
 * @param {object[]} instructions
 * @returns {{ entries: object[], cursor: string|null }}
 */
export function flattenEntries(instructions: object[]): {
    entries: object[];
    cursor: string | null;
};
/**
 * Throw when the client has no auth_token cookie.
 *
 * @param {object} client TwitterHttpClient instance
 * @param {string} endpoint Operation name for the error
 * @throws {AuthError}
 */
export function requireAuth(client: object, endpoint: string): void;
/**
 * Page through a GraphQL timeline until `limit` items are collected or the
 * timeline ends.
 *
 * @param {object} client TwitterHttpClient instance
 * @param {{queryId: string, operationName: string}} endpoint GRAPHQL table entry
 * @param {object} baseVariables Variables sent on every page (count/cursor are added)
 * @param {(instructions: object[]) => {items: object[], cursor: string|null}} parsePage
 * @param {object} [options]
 * @param {number} [options.limit=100]
 * @param {string|null} [options.cursor=null]
 * @param {Function} [options.onProgress] `({ fetched, limit, page })`
 * @param {string} [options.path] Preferred dot-path to the instructions
 * @param {(item: object) => string} [options.keyOf] Dedup key (default: `item.id`)
 * @param {object} [options.features] GraphQL feature flags override
 * @returns {Promise<object[]>}
 */
export function paginate(client: object, endpoint: {
    queryId: string;
    operationName: string;
}, baseVariables: object, parsePage: (instructions: object[]) => {
    items: object[];
    cursor: string | null;
}, options?: {
    limit?: number;
    cursor?: string | null;
    onProgress?: Function;
    path?: string;
    keyOf?: (item: object) => string;
    features?: object;
}): Promise<object[]>;
/** Default page size requested from GraphQL timelines */
export const PAGE_COUNT: 20;
