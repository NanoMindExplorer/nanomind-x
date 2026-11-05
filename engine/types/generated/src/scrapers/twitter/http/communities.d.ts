/**
 * Parse a raw `Community` result into the nanomind-x community format.
 *
 * @param {object} raw `community_results.result` / `communityResults.result`
 * @returns {object|null} null when the community is unavailable
 */
export function parseCommunity(raw: object): object | null;
/**
 * Parse a communities list timeline (memberships / discovery) into
 * community objects plus the bottom cursor.
 *
 * @param {object[]} instructions
 * @returns {{ items: object[], cursor: string|null }}
 */
export function parseCommunityList(instructions: object[]): {
    items: object[];
    cursor: string | null;
};
/**
 * Parse a tweet timeline (community posts / search) into tweet objects.
 *
 * @param {object[]} instructions
 * @returns {{ items: object[], cursor: string|null }}
 */
export function parseCommunityTweets(instructions: object[]): {
    items: object[];
    cursor: string | null;
};
/**
 * Fetch a community by ID (`CommunityByRestId`).
 *
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {string} communityId
 * @returns {Promise<object>} Parsed community
 * @throws {NotFoundError} when the community does not exist or is unavailable
 */
export function scrapeCommunity(client: object, communityId: string): Promise<object>;
/**
 * Scrape a community's post timeline (`CommunityTweetsTimeline`).
 *
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {string} communityId
 * @param {object} [options]
 * @param {'latest'|'top'} [options.ranking='latest'] Recency or relevance ordering
 * @param {number} [options.limit=100]
 * @param {string|null} [options.cursor=null]
 * @param {Function} [options.onProgress]
 * @returns {Promise<object[]>} Parsed tweets
 */
export function scrapeCommunityTweets(client: object, communityId: string, options?: {
    ranking?: "latest" | "top";
    limit?: number;
    cursor?: string | null;
    onProgress?: Function;
}): Promise<object[]>;
/**
 * Scrape a community's media posts (`CommunityMediaTimeline`).
 *
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {string} communityId
 * @param {object} [options] `{ limit, cursor, onProgress }`
 * @returns {Promise<object[]>} Parsed tweets with media
 */
export function scrapeCommunityMedia(client: object, communityId: string, options?: object): Promise<object[]>;
/**
 * Search posts across all communities (`GlobalCommunitiesPostSearchTimeline`
 * / `GlobalCommunitiesLatestPostSearchTimeline`).
 *
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {string} query Search query (advanced syntax allowed)
 * @param {object} [options]
 * @param {'top'|'latest'} [options.ranking='top']
 * @param {number} [options.limit=100]
 * @param {string|null} [options.cursor=null]
 * @param {Function} [options.onProgress]
 * @returns {Promise<object[]>} Parsed tweets
 */
export function searchCommunityTweets(client: object, query: string, options?: {
    ranking?: "top" | "latest";
    limit?: number;
    cursor?: string | null;
    onProgress?: Function;
}): Promise<object[]>;
/**
 * Communities the authenticated user belongs to
 * (`CommunitiesMembershipsTimeline`).
 *
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {object} [options] `{ limit, cursor, onProgress }`
 * @param {string} [options.userId] Restrict to this user's memberships (defaults to the viewer)
 * @returns {Promise<object[]>} Parsed communities
 */
export function scrapeMyCommunities(client: object, options?: {
    userId?: string;
}): Promise<object[]>;
/**
 * The communities discovery feed (`CommunityDiscoveryTimeline`), which is
 * the closest the current bundle offers to browsing communities by name.
 *
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {object} [options] `{ limit, cursor, onProgress }`
 * @returns {Promise<object[]>} Parsed communities
 */
export function scrapeCommunityDiscovery(client: object, options?: object): Promise<object[]>;
/**
 * Join an open community (`JoinCommunity`).
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {string} communityId
 * @returns {Promise<{success: boolean, communityId: string, role: string|null, community: object|null}>}
 */
export function joinCommunity(client: object, communityId: string): Promise<{
    success: boolean;
    communityId: string;
    role: string | null;
    community: object | null;
}>;
/**
 * Leave a community (`LeaveCommunity`).
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {string} communityId
 * @returns {Promise<{success: boolean, communityId: string, role: string|null, community: object|null}>}
 */
export function leaveCommunity(client: object, communityId: string): Promise<{
    success: boolean;
    communityId: string;
    role: string | null;
    community: object | null;
}>;
/**
 * Ask to join a restricted community (`RequestToJoinCommunity`).
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {string} communityId
 * @param {object} [options]
 * @param {string} [options.answer] Answer to the community's join question
 * @returns {Promise<{success: boolean, communityId: string, role: string|null, community: object|null}>}
 */
export function requestToJoinCommunity(client: object, communityId: string, options?: {
    answer?: string;
}): Promise<{
    success: boolean;
    communityId: string;
    role: string | null;
    community: object | null;
}>;
