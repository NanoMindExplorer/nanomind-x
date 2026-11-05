/**
 * Create an HTTP scraper instance ready to use.
 *
 * @param {Object} options
 * @param {string} [options.cookies] - Browser cookie string for authentication
 * @param {string} [options.proxy] - HTTP/SOCKS5 proxy URL
 * @param {'wait'|'error'} [options.rateLimitStrategy] - How to handle rate limits
 * @returns {Promise<Object>} Scraper with all methods bound to the client
 *
 * @example
 * import { createHttpScraper } from 'nanomind-x/scrapers/twitter/http';
 * const scraper = await createHttpScraper({ cookies: 'auth_token=xxx; ct0=yyy' });
 * const profile = await scraper.scrapeProfile('elonmusk');
 * const tweets = await scraper.scrapeTweets('elonmusk', { limit: 50 });
 */
export function createHttpScraper(options?: {
    cookies?: string;
    proxy?: string;
    rateLimitStrategy?: "wait" | "error";
}): Promise<any>;
export { TwitterAuth } from "./auth.js";
export { GuestTokenManager } from "./guest.js";
export { TwitterHttpClient, WaitingRateLimitStrategy, ErrorRateLimitStrategy } from "./client.js";
export { createAccountPool, createPooledClient, AccountPoolError, normalizeCookies, operationFromUrl } from "./accountPool.js";
export { createCheckpoint, bindCheckpoint } from "./checkpoint.js";
export { harvestSession, SessionPool, createClientFromSession, DEFAULT_SESSION_TTL } from "./playwright-session.js";
export { scrapeProfile, scrapeProfileById, parseUserData } from "./profile.js";
export { scrapeTweets, scrapeTweetsAndReplies, scrapeTweetById, parseTweetData, parseTimelineInstructions } from "./tweets.js";
export { scrapeThread, scrapeFullThread, scrapeConversation, parseConversationModule, reconstructThread } from "./thread.js";
export { scrapeFollowers, scrapeFollowing, scrapeNonFollowers, scrapeLikers, scrapeRetweeters, scrapeListMembers } from "./relationships.js";
export { scrapeCommunity, scrapeCommunityTweets, scrapeCommunityMedia, searchCommunityTweets, scrapeMyCommunities, scrapeCommunityDiscovery, joinCommunity, leaveCommunity, requestToJoinCommunity, parseCommunity, parseCommunityList, parseCommunityTweets } from "./communities.js";
export { scrapeNotifications, scrapeMentions, scrapeVerifiedNotifications, parseNotificationEntry, parseNotificationsTimeline } from "./notifications.js";
export { scrapeTrends, scrapeTrendsByWoeid, scrapeTrendLocations, scrapeExplorePage, scrapeHighlights, scrapeArticles, scrapeVerifiedFollowers, scrapeFollowersYouKnow, scrapeAudioSpace, parseTrend, parseTrendTimeline, parseGuideTrends, parseAudioSpace } from "./explore.js";
export { postTweet, postThread, deleteTweet, replyToTweet, quoteTweet, schedulePost } from "./actions.js";
export { likeTweet, unlikeTweet, retweet, unretweet, followUser, unfollowUser, followByUsername, blockUser, unblockUser, muteUser, unmuteUser, bookmarkTweet, unbookmarkTweet, pinTweet, unpinTweet, bulkUnfollow, bulkLike, bulkBlock } from "./engagement.js";
export { uploadMedia, uploadImage, uploadVideo, uploadGif, setAltText, scrapeMedia, downloadMedia, getVideoUrl } from "./media.js";
export { BEARER_TOKEN, GRAPHQL, REST, DEFAULT_FEATURES, DEFAULT_FIELD_TOGGLES, RATE_LIMITS, USER_AGENTS, buildGraphQLUrl, buildGraphQLVariables } from "./endpoints.js";
export { TwitterApiError, RateLimitError, AuthError, NotFoundError, NetworkError, parseTwitterErrors } from "./errors.js";
