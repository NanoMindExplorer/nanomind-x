/**
 * Arithmetic mean, rounded to `places`.
 * @param {number[]} values
 * @param {number} [places=2]
 * @returns {number} 0 for an empty list
 */
export function mean(values: number[], places?: number): number;
/**
 * Median of a numeric list. Does not mutate the input.
 * @param {number[]} values
 * @returns {number} 0 for an empty list
 */
export function median(values: number[]): number;
/**
 * Round to a fixed number of decimal places without float drift artefacts.
 * @param {number} value
 * @param {number} [places=2]
 * @returns {number}
 */
export function round(value: number, places?: number): number;
/**
 * Divide safely. A zero or missing denominator yields 0 rather than
 * Infinity or NaN, both of which serialise to junk in JSON.
 * @param {number} numerator
 * @param {number} denominator
 * @param {number} [places=2]
 * @returns {number}
 */
export function ratio(numerator: number, denominator: number, places?: number): number;
/**
 * Resolve a tweet's post time to a Date, whatever shape the parser produced.
 *
 * `timeParsed` is a Date, `timestamp` is seconds since the epoch, and some
 * transports (JSON over the wire, a cached report) hand back an ISO string.
 * All three appear in practice.
 *
 * @param {object} tweet
 * @returns {Date|null} null when the tweet carries no usable time
 */
export function tweetDate(tweet: object): Date | null;
/**
 * Total public interactions on a post.
 *
 * Views are deliberately excluded: X reports them for recent posts only, so
 * including them would make old posts look worse purely because the metric
 * did not exist yet.
 *
 * @param {object} tweet
 * @returns {number}
 */
export function engagementOf(tweet: object): number;
/**
 * Classify a post into exactly one content bucket.
 * Order matters: a retweet of a reply is a retweet, not a reply.
 * @param {object} tweet
 * @returns {'retweet'|'reply'|'quote'|'original'}
 */
export function classifyPost(tweet: object): "retweet" | "reply" | "quote" | "original";
/**
 * Count list entries into a descending frequency table.
 * @param {string[][]} lists - One list per post
 * @param {number} [limit=8]
 * @returns {Array<{value: string, count: number}>}
 */
export function topValues(lists: string[][], limit?: number): Array<{
    value: string;
    count: number;
}>;
/**
 * Median hours between consecutive posts, which describes cadence far better
 * than a mean does when an account posts in bursts.
 * @param {Date[]} dates - Any order
 * @returns {number} 0 when there are fewer than two dated posts
 */
export function medianGapHours(dates: Date[]): number;
/**
 * Format a number the way a person would read it aloud.
 * @param {number} n
 * @returns {string}
 */
export function formatCount(n: number): string;
/**
 * Build the full account report.
 *
 * @param {object} input
 * @param {object} input.profile - A Profile, or any object with its fields
 * @param {object[]} [input.tweets=[]] - Timeline sample, newest first or any order
 * @param {Date} [input.now] - Injectable clock, so tests are deterministic
 * @returns {object} The report
 */
export function buildAccountReport({ profile, tweets, now }: {
    profile: object;
    tweets?: object[];
    now?: Date;
}): object;
/**
 * Compare two or more reports on the fields that survive a like-for-like
 * comparison. Anything that depends on sample size is reported alongside the
 * sample so a reader can see when a comparison is uneven.
 *
 * @param {object[]} reports - Output of buildAccountReport
 * @returns {{accounts: object[], leaders: Record<string, string>}}
 */
export function compareReports(reports: object[]): {
    accounts: object[];
    leaders: Record<string, string>;
};
/** Weekday labels, indexed to match `Date.prototype.getUTCDay()`. */
export const WEEKDAYS: readonly string[];
