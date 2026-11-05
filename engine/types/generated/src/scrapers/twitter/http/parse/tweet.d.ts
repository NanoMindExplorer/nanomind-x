/**
 * Transform Twitter's raw GraphQL tweet object into the clean nanomind-x
 * tweet format.
 *
 * Handles `__typename`: `'Tweet'`, `'TweetWithVisibilityResults'`,
 * `'TweetTombstone'`.
 *
 * @param {object} rawTweet — A tweet result object from the GraphQL response
 *   (typically `tweet_results.result` or a timeline entry's
 *   `itemContent.tweet_results.result`).
 * @returns {object|null} Normalised tweet object, or `null` for tombstones /
 *   unparseable entries.
 */
export function parseTweetData(rawTweet: object): object | null;
/**
 * Read the instruction list out of a user timeline payload.
 *
 * x.com renamed the container from `timeline_v2` to `timeline`, and a guest
 * response uses the new name while some authenticated responses still send the
 * old one. Reading only `timeline_v2` silently yields zero tweets, so both are
 * accepted here and every user-timeline caller goes through this.
 *
 * @param {object} payload - `response.data` from client.graphql()
 * @returns {object[]} Timeline instructions, empty when the payload has none.
 */
export function userTimelineInstructions(payload: object): object[];
/**
 * Parse the `instructions` array from a Twitter timeline GraphQL response.
 *
 * Handles entry types:
 * - `TimelineAddEntries` — primary timeline entries and cursors
 * - `TimelineAddToModule` — entries inside conversation modules
 * - `TimelinePinEntry` — pinned tweets
 *
 * @param {object[]} instructions — The `instructions` array.
 * @returns {{ tweets: object[], cursor: string|null }}
 */
export function parseTimelineInstructions(instructions: object[]): {
    tweets: object[];
    cursor: string | null;
};
/**
 * Extract the tweet result object from a standard timeline entry.
 *
 * @param {object} entry
 * @returns {object|null}
 */
export function extractTweetResult(entry: object): object | null;
