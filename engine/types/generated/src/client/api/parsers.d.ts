/**
 * Parse timeline entries and cursor from a GraphQL response.
 *
 * @param {Object} data - Raw GraphQL response
 * @param {string|string[]} timelinePath - Dot-path(s) to the timeline object,
 *   e.g. `USER_TIMELINE_PATHS`. The first path holding `instructions` wins.
 * @returns {{ entries: Object[], cursor: string|null }}
 */
export function parseTimelineEntries(data: any, timelinePath: string | string[]): {
    entries: any[];
    cursor: string | null;
};
/**
 * Parse a single timeline entry into a Tweet.
 *
 * @param {Object} entry - A timeline entry object
 * @returns {Tweet|null}
 */
export function parseTweetEntry(entry: any): Tweet | null;
/**
 * Parse a conversation module entry (multi-tweet thread) into an array of Tweets.
 *
 * @param {Object} entry - A TimelineTimelineModule entry
 * @returns {Tweet[]}
 */
export function parseModuleEntry(entry: any): Tweet[];
/**
 * Parse a single timeline entry into a Profile.
 *
 * @param {Object} entry - A timeline entry object
 * @returns {Profile|null}
 */
export function parseUserEntry(entry: any): Profile | null;
/**
 * Extract a cursor value from timeline entries.
 *
 * @param {Object[]} entries - Array of timeline entries
 * @param {'top'|'bottom'} direction - Cursor direction
 * @returns {string|null}
 */
export function extractCursor(entries: any[], direction?: "top" | "bottom"): string | null;
/**
 * Candidate paths to a user's tweet timeline.
 *
 * x.com renamed the container from `timeline_v2` to `timeline`; both are tried
 * so the client keeps working whichever one an account is served today.
 * @type {string[]}
 */
export const USER_TIMELINE_PATHS: string[];
import { Tweet } from '../models/Tweet.js';
import { Profile } from '../models/Profile.js';
