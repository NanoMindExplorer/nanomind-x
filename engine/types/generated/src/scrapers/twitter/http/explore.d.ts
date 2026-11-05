/**
 * Parse a GraphQL / guide.json trend item into the nanomind-x trend format.
 *
 * @param {object} raw A `TimelineTrend` item content or a guide.json `trend`
 * @returns {object|null}
 */
export function parseTrend(raw: object): object | null;
/**
 * Pull every trend out of a GraphQL timeline (`ExplorePage`).
 *
 * @param {object[]} instructions
 * @returns {{ items: object[], cursor: string|null }}
 */
export function parseTrendTimeline(instructions: object[]): {
    items: object[];
    cursor: string | null;
};
/**
 * Pull every trend out of a `/2/guide.json` response.
 *
 * @param {object} response
 * @returns {object[]}
 */
export function parseGuideTrends(response: object): object[];
/**
 * Trends for a WOEID via `/1.1/trends/place.json` (1 = worldwide, 23424977 = US).
 *
 * @param {object} client TwitterHttpClient instance
 * @param {number|string} [woeid=1]
 * @returns {Promise<{ location: {name: string, woeid: number}|null, asOf: string|null, trends: object[] }>}
 */
export function scrapeTrendsByWoeid(client: object, woeid?: number | string): Promise<{
    location: {
        name: string;
        woeid: number;
    } | null;
    asOf: string | null;
    trends: object[];
}>;
/**
 * Locations that have trends (`/1.1/trends/available.json`).
 *
 * @param {object} client TwitterHttpClient instance
 * @returns {Promise<Array<{name: string, woeid: number, country: string|null, countryCode: string|null, placeType: string|null}>>}
 */
export function scrapeTrendLocations(client: object): Promise<Array<{
    name: string;
    woeid: number;
    country: string | null;
    countryCode: string | null;
    placeType: string | null;
}>>;
/**
 * Explore tab trends via `/2/guide.json`.
 *
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {object} [options]
 * @param {'trending'|'for-you'|'news'|'sports'|'entertainment'} [options.tab='trending']
 * @param {number} [options.limit=30]
 * @returns {Promise<object[]>} Trends in tab order
 */
export function scrapeTrends(client: object, options?: {
    tab?: "trending" | "for-you" | "news" | "sports" | "entertainment";
    limit?: number;
}): Promise<object[]>;
/**
 * The GraphQL Explore page (`ExplorePage`), which returns the same trend
 * modules the web client renders on /explore.
 *
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {object} [options] `{ limit, cursor, onProgress }`
 * @returns {Promise<object[]>} Trends
 */
export function scrapeExplorePage(client: object, options?: object): Promise<object[]>;
/**
 * A user's Highlights tab (`UserHighlightsTweets`).
 *
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {string|{userId: string}} user Username, numeric id, or `{ userId }`
 * @param {object} [options] `{ limit, cursor, onProgress }`
 * @returns {Promise<object[]>} Parsed tweets
 */
export function scrapeHighlights(client: object, user: string | {
    userId: string;
}, options?: object): Promise<object[]>;
/**
 * A user's Articles tab (`UserArticlesTweets`).
 *
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {string|{userId: string}} user Username, numeric id, or `{ userId }`
 * @param {object} [options] `{ limit, cursor, onProgress }`
 * @returns {Promise<object[]>} Parsed article tweets
 */
export function scrapeArticles(client: object, user: string | {
    userId: string;
}, options?: object): Promise<object[]>;
/**
 * A user's verified followers (`BlueVerifiedFollowers`).
 *
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {string|{userId: string}} user
 * @param {object} [options] `{ limit, cursor, onProgress }`
 * @returns {Promise<object[]>} Users
 */
export function scrapeVerifiedFollowers(client: object, user: string | {
    userId: string;
}, options?: object): Promise<object[]>;
/**
 * Followers of a user that the viewer also follows (`FollowersYouKnow`).
 *
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {string|{userId: string}} user
 * @param {object} [options] `{ limit, cursor, onProgress }`
 * @returns {Promise<object[]>} Users
 */
export function scrapeFollowersYouKnow(client: object, user: string | {
    userId: string;
}, options?: object): Promise<object[]>;
/**
 * Parse a raw `data.audioSpace` object into the nanomind-x Space format.
 *
 * @param {object} raw
 * @returns {object|null}
 */
export function parseAudioSpace(raw: object): object | null;
/**
 * Space details by ID (`AudioSpaceById`).
 *
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {string} spaceId e.g. `1YqKDqWZrVZKV`
 * @returns {Promise<object>} Parsed Space
 * @throws {NotFoundError} when the Space does not exist
 */
export function scrapeAudioSpace(client: object, spaceId: string): Promise<object>;
