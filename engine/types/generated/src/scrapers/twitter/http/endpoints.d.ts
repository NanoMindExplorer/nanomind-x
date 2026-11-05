/**
 * Resolve a GRAPHQL table entry to the query ID currently in use.
 *
 * The table above is the offline fallback. When query-ID discovery
 * (`./queryIds.js`) has a cached ID for the operation, that one wins, because
 * it was read from x.com's live bundle and the table value may have rotated.
 *
 * A key nanomind-x does not track but x.com ships resolves too, straight from the
 * generated table, so reaching one of the other operations in
 * `UPSTREAM_OPERATIONS` does not require editing this file first.
 *
 * @param {keyof typeof GRAPHQL | string} key
 * @returns {{queryId: string, operationName: string, source: 'cache'|'hardcoded'}}
 */
export function resolveGraphQL(key: keyof typeof GRAPHQL | string): {
    queryId: string;
    operationName: string;
    source: "cache" | "hardcoded";
};
/**
 * The exact feature switches one operation declares, with their values.
 *
 * Sending an operation only the switches it asks for is closer to what the web
 * client does than sending the merged default set, and it is the way to satisfy
 * an operation outside the curated table.
 *
 * @param {string} operationName
 * @returns {Record<string, boolean>} empty when x.com ships no such operation
 */
export function operationFeatures(operationName: string): Record<string, boolean>;
/**
 * The exact field toggles one operation declares, with their values.
 *
 * @param {string} operationName
 * @returns {Record<string, boolean>} empty when x.com ships no such operation
 */
export function operationFieldToggles(operationName: string): Record<string, boolean>;
/**
 * Build a full GraphQL GET URL with encoded query params.
 *
 * @param {string} queryId
 * @param {string} operationName
 * @param {object} variables
 * @param {object} [features]
 * @param {object} [fieldToggles]
 * @returns {string}
 */
export function buildGraphQLUrl(queryId: string, operationName: string, variables: object, features?: object, fieldToggles?: object): string;
/**
 * Build the variables object for common GraphQL query types.
 *
 * @param {'UserByScreenName'|'UserByRestId'|'UserTweets'|'UserTweetsAndReplies'|'UserMedia'|'UserLikes'|'TweetDetail'|'TweetResultByRestId'|'SearchTimeline'|'Followers'|'Following'|'Likes'|'Retweeters'|'ListMembers'|'ListTimeline'|'BookmarkTimeline'|'HomeTimeline'|'CreateTweet'|'DeleteTweet'|'FavoriteTweet'|'UnfavoriteTweet'|'CreateRetweet'|'DeleteRetweet'|'CreateBookmark'|'DeleteBookmark'|string} type
 * @param {object} params
 * @returns {object}
 */
export function buildGraphQLVariables(type: "UserByScreenName" | "UserByRestId" | "UserTweets" | "UserTweetsAndReplies" | "UserMedia" | "UserLikes" | "TweetDetail" | "TweetResultByRestId" | "SearchTimeline" | "Followers" | "Following" | "Likes" | "Retweeters" | "ListMembers" | "ListTimeline" | "BookmarkTimeline" | "HomeTimeline" | "CreateTweet" | "DeleteTweet" | "FavoriteTweet" | "UnfavoriteTweet" | "CreateRetweet" | "DeleteRetweet" | "CreateBookmark" | "DeleteBookmark" | string, params?: object): object;
/**
 * Validate that GraphQL endpoint query IDs are still active.
 * Makes a lightweight OPTIONS/HEAD probe to confirm the endpoint returns
 * a recognizable response (not 404). Requires a valid auth cookie or guest token.
 *
 * @param {object} [options]
 * @param {string[]} [options.endpoints] - Specific endpoint keys to check (default: all queries)
 * @param {typeof globalThis.fetch} [options.fetch] - Custom fetch implementation
 * @returns {Promise<{valid: string[], invalid: string[], errors: Record<string, string>}>}
 */
export function validateEndpoints(options?: {
    endpoints?: string[];
    fetch?: typeof globalThis.fetch;
}): Promise<{
    valid: string[];
    invalid: string[];
    errors: Record<string, string>;
}>;
/**
 * Provenance of the generated half of this module: which upstream commit the
 * query IDs came from, when it was published, and when we fetched it.
 *
 * `nanomind-x doctor` and the endpoint audit read this rather than a date written
 * into a comment, so "last verified on ..." is a fact with a source.
 *
 * @type {typeof UPSTREAM}
 */
export const ENDPOINT_TABLE_SOURCE: typeof UPSTREAM;
export const GRAPHQL_BASE: "https://x.com/i/api/graphql";
export const REST_BASE: "https://x.com/i/api";
export const API_BASE: "https://api.x.com";
export const BEARER_TOKEN: "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";
/**
 * Curated key -> x.com operation name.
 * @type {Readonly<Record<string, string>>}
 */
export const TRACKED_OPERATIONS: Readonly<Record<string, string>>;
/**
 * Hand-pinned query IDs, which win over the generated table.
 *
 * Empty by default, and it should stay that way: the generated table is read
 * from the bundle x.com actually serves. Pin an operation here only to hold it
 * at a known-good ID while a regression is investigated, and write down why.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const QUERY_ID_PINS: Readonly<Record<string, string>>;
/**
 * Tracked operations the generated table does not carry. Populated when x.com
 * retires an operation between syncs; `resolveGraphQL` then fails for that one
 * key with a message naming the fix, instead of the whole module refusing to
 * load. `npm run sync:endpoints:check` exits non-zero when this is non-empty.
 *
 * @type {readonly string[]}
 */
export const MISSING_OPERATIONS: readonly string[];
/**
 * GraphQL Query / Mutation IDs, keyed the way the codebase refers to them.
 *
 * @type {Readonly<Record<string, Readonly<{queryId: string, operationName: string, type: string}>>>}
 */
export const GRAPHQL: Readonly<Record<string, Readonly<{
    queryId: string;
    operationName: string;
    type: string;
}>>>;
export namespace REST {
    let friendshipsCreate: string;
    let friendshipsDestroy: string;
    let blocksCreate: string;
    let blocksDestroy: string;
    let mutesCreate: string;
    let mutesDestroy: string;
    let pinTweet: string;
    let unpinTweet: string;
    let guestActivate: string;
    let verifyCredentials: string;
    let dmNew: string;
    let dmDestroy: string;
    let dmInbox: string;
    let dmConversation: string;
    let dmMarkRead: string;
    let notificationsAll: string;
    let notificationsVerified: string;
    let notificationsMentions: string;
    let guide: string;
    let trendsAvailable: string;
    let trendsPlace: string;
}
/**
 * Feature switches we send regardless of what upstream declares.
 *
 * All three were sent by every client for years and x.com's bundles no longer
 * declare them anywhere. They are kept because established third-party clients
 * still send them and requests still succeed; dropping them is a live-traffic
 * change nobody has tested. Delete the entry to stop sending one.
 *
 * @type {Readonly<Record<string, boolean>>}
 */
export const FEATURE_PINS: Readonly<Record<string, boolean>>;
/**
 * Field-toggle values.
 *
 * Upstream records which operations accept a toggle but not the value the
 * client sends, because a toggle is passed as a request parameter rather than
 * baked into the bundle. A toggle named by an operation and absent here is sent
 * as `false`, which asks for the smaller response and is the safe default; pin
 * a `true` here when a caller needs the extra payload.
 *
 * @type {Readonly<Record<string, boolean>>}
 */
export const FIELD_TOGGLE_VALUES: Readonly<Record<string, boolean>>;
/**
 * Tracked operations whose switches are deliberately kept out of the merged
 * default.
 *
 * Most operations share one broad timeline feature family, so merging them
 * costs nothing. A few carry a family of their own that no other request would
 * ever send, and folding those into the default would put, for example, six
 * `responsive_web_birdwatch_*` switches on a plain `UserTweets` call. Reach
 * these through `operationFeatures(name)` instead, which is the narrower and
 * more faithful set anyway.
 *
 * @type {readonly string[]}
 */
export const SPECIALISED_OPERATIONS: readonly string[];
/**
 * Feature switches sent with a GraphQL request when the caller names none:
 * every switch any tracked operation declares, plus `FEATURE_PINS`.
 *
 * X rejects a request that omits a switch the operation requires
 * ("The following features cannot be null"), so the merged set is the safe
 * default. `operationFeatures()` gives the narrower per-operation set.
 *
 * @type {Record<string, boolean>}
 */
export const DEFAULT_FEATURES: Record<string, boolean>;
/**
 * Field toggles sent with a GraphQL request when the caller names none.
 * @type {Record<string, boolean>}
 */
export const DEFAULT_FIELD_TOGGLES: Record<string, boolean>;
export namespace USER_FEATURES {
    let hidden_profile_likes_enabled: boolean;
    let hidden_profile_subscriptions_enabled: boolean;
    let responsive_web_graphql_exclude_directive_enabled: boolean;
    let verified_phone_label_enabled: boolean;
    let subscriptions_verification_info_is_identity_verified_enabled: boolean;
    let subscriptions_verification_info_verified_since_enabled: boolean;
    let highlights_tweets_tab_ui_enabled: boolean;
    let responsive_web_twitter_article_notes_tab_enabled: boolean;
    let creator_subscriptions_tweet_preview_api_enabled: boolean;
    let responsive_web_graphql_skip_user_profile_image_extensions_enabled: boolean;
    let responsive_web_graphql_timeline_navigation_enabled: boolean;
}
export namespace RATE_LIMITS {
    export let UserByScreenName: number;
    export let UserByRestId: number;
    export let UserTweets: number;
    export let UserTweetsAndReplies: number;
    export let UserMedia: number;
    export let UserLikes: number;
    export let TweetDetail: number;
    export let TweetResultByRestId: number;
    export let SearchTimeline: number;
    export let Followers: number;
    export let Following: number;
    export let Likes: number;
    export let Retweeters: number;
    export let ListMembers: number;
    export let ListTimeline: number;
    export let BookmarkTimeline: number;
    export let HomeTimeline: number;
    export let HomeLatestTimeline: number;
    export let FavoriteTweet: number;
    export let UnfavoriteTweet: number;
    export let CreateRetweet: number;
    export let DeleteRetweet: number;
    export let CreateTweet: number;
    export let DeleteTweet: number;
    export let CreateBookmark: number;
    export let DeleteBookmark: number;
    let friendshipsCreate_1: number;
    export { friendshipsCreate_1 as friendshipsCreate };
    let friendshipsDestroy_1: number;
    export { friendshipsDestroy_1 as friendshipsDestroy };
    let blocksCreate_1: number;
    export { blocksCreate_1 as blocksCreate };
    let blocksDestroy_1: number;
    export { blocksDestroy_1 as blocksDestroy };
    let mutesCreate_1: number;
    export { mutesCreate_1 as mutesCreate };
    let mutesDestroy_1: number;
    export { mutesDestroy_1 as mutesDestroy };
    let pinTweet_1: number;
    export { pinTweet_1 as pinTweet };
    let unpinTweet_1: number;
    export { unpinTweet_1 as unpinTweet };
    let dmNew_1: number;
    export { dmNew_1 as dmNew };
    let notificationsAll_1: number;
    export { notificationsAll_1 as notificationsAll };
    let guide_1: number;
    export { guide_1 as guide };
    export let DEFAULT: number;
}
/**
 * Browser User-Agent strings, one per generated profile.
 * @type {string[]}
 */
export const USER_AGENTS: string[];
import { OPERATIONS as UPSTREAM_OPERATIONS } from './x-endpoints.generated.js';
import { REST_V11 } from './x-endpoints.generated.js';
import { UPSTREAM } from './x-endpoints.generated.js';
export { UPSTREAM_OPERATIONS, REST_V11 };
