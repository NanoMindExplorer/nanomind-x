#!/usr/bin/env node
/**
 * Close browser (called by server.js on SIGINT/SIGTERM)
 */
export function closeBrowser(): Promise<void>;
export function x_login({ cookie }: {
    cookie: any;
}): Promise<{
    success: boolean;
    message: string;
}>;
export function x_get_profile({ username }: {
    username: any;
}): Promise<any>;
export function x_get_followers({ username, limit }: {
    username: any;
    limit?: number;
}): Promise<any[]>;
export function x_get_following({ username, limit }: {
    username: any;
    limit?: number;
}): Promise<any[]>;
export function x_get_non_followers({ username }: {
    username: any;
}): Promise<{
    nonFollowers: any[];
    count: number;
    totalFollowing: number;
    totalFollowers: number;
}>;
export function x_get_tweets({ username, limit }: {
    username: any;
    limit?: number;
}): Promise<any[]>;
export function x_search_tweets({ query, limit }: {
    query: any;
    limit?: number;
}): Promise<any[]>;
export function x_get_thread({ url }: {
    url: any;
}): Promise<any>;
/**
 * Full account report: engagement, cadence, content mix, timing, top posts.
 *
 * Accepts one username or several. With several it also returns the
 * side-by-side comparison, so an agent asking "who is doing better" gets the
 * answer rather than four reports to reconcile itself.
 *
 * @param {{username: string|string[], limit?: number}} args
 * @returns {Promise<object>}
 */
export function x_account_report({ username, limit }: {
    username: string | string[];
    limit?: number;
}): Promise<object>;
/**
 * When an account's posts actually perform.
 *
 * Derived from the same report as `x_account_report` rather than recomputing
 * its own buckets, so the two tools can never disagree about the best hour.
 *
 * @param {{username: string, limit?: number}} args
 * @returns {Promise<object>}
 */
export function x_best_time_to_post({ username, limit }: {
    username: string;
    limit?: number;
}): Promise<object>;
export function x_follow({ username }: {
    username: any;
}): Promise<{
    success: boolean;
    message: string;
}>;
export function x_unfollow({ username }: {
    username: any;
}): Promise<{
    success: boolean;
    message: string;
}>;
export function x_unfollow_non_followers({ username, maxUnfollows, dryRun }: {
    username: any;
    maxUnfollows?: number;
    dryRun?: boolean;
}): Promise<{
    dryRun: boolean;
    wouldUnfollow: any[];
    count: number;
    unfollowed?: undefined;
    failed?: undefined;
} | {
    unfollowed: any[];
    failed: any[];
    count: number;
    dryRun?: undefined;
    wouldUnfollow?: undefined;
}>;
export function x_detect_unfollowers({ username }: {
    username: any;
}): Promise<{
    username: any;
    currentFollowers: any[];
    count: number;
    timestamp: string;
    note: string;
}>;
export function x_post_tweet({ text }: {
    text: any;
}): Promise<{
    success: boolean;
    message: string;
}>;
export function x_like({ url }: {
    url: any;
}): Promise<{
    success: boolean;
    message: string;
}>;
export function x_retweet({ url }: {
    url: any;
}): Promise<{
    success: boolean;
    message: string;
}>;
/**
 * Sweep a feed: like, repost, and reply to its posts.
 *
 * The same engine the `nanomind-x engage` CLI runs (src/engage/), so a sweep an
 * agent starts and a sweep a human starts behave identically, share the
 * `~/.nanomind-x/engage/` progress files, and skip what the other already did.
 *
 * Replies come from `templates` or, when `prompt` is set, from an LLM given
 * that brief. This runs on the HTTP client, so any provider works: there is
 * no page CSP in the way as there is in the browser script.
 *
 * @param {object} args
 * @param {string} [args.username] - Profile to sweep
 * @param {string} [args.search] - Search query to sweep instead
 * @param {string} [args.list] - List ID to sweep instead
 * @param {boolean} [args.like=true]
 * @param {boolean} [args.repost=false]
 * @param {boolean} [args.comment=false]
 * @param {number} [args.limit=20]
 * @param {string} [args.prompt] - Brief for LLM-written replies
 * @param {string[]} [args.templates] - Reply templates ({author}, {name})
 * @param {boolean} [args.dryRun=true] - Defaults to a preview, on purpose
 * @returns {Promise<object>} Run report
 */
export function x_engage(args?: {
    username?: string;
    search?: string;
    list?: string;
    like?: boolean;
    repost?: boolean;
    comment?: boolean;
    limit?: number;
    prompt?: string;
    templates?: string[];
    dryRun?: boolean;
}): Promise<object>;
export function x_download_video({ tweetUrl }: {
    tweetUrl: any;
}): Promise<{
    success: boolean;
    message: string;
    videos?: undefined;
    bestQuality?: undefined;
} | {
    success: boolean;
    videos: any;
    bestQuality: any;
    message: string;
}>;
export function x_update_profile({ name, bio, location, website }: {
    name: any;
    bio: any;
    location: any;
    website: any;
}): Promise<{
    success: boolean;
    message: string;
}>;
export function x_post_thread({ tweets }: {
    tweets: any;
}): Promise<{
    success: boolean;
    message: string;
}>;
export function x_create_poll({ question, options, durationMinutes }: {
    question: any;
    options: any;
    durationMinutes?: number;
}): Promise<{
    success: boolean;
    message: string;
}>;
export function x_schedule_post({ text, scheduledAt }: {
    text: any;
    scheduledAt: any;
}): Promise<{
    success: boolean;
    message: string;
}>;
export function x_delete_tweet({ url }: {
    url: any;
}): Promise<{
    success: boolean;
    message: string;
}>;
export function x_reply({ url, text }: {
    url: any;
    text: any;
}): Promise<{
    success: boolean;
    message: string;
}>;
export function x_bookmark({ url }: {
    url: any;
}): Promise<{
    success: boolean;
    message: string;
}>;
export function x_get_bookmarks({ limit }: {
    limit?: number;
}): Promise<any[]>;
export function x_clear_bookmarks(): Promise<{
    success: boolean;
    message: string;
}>;
export function x_auto_like({ keywords, maxLikes }: {
    keywords?: any[];
    maxLikes?: number;
}): Promise<{
    success: boolean;
    liked: number;
    message: string;
}>;
export function x_get_trends({ category, limit }: {
    category: any;
    limit?: number;
}): Promise<any>;
export function x_get_explore({ category, limit }: {
    category: any;
    limit?: number;
}): Promise<any>;
export function x_get_notifications({ limit, filter }: {
    limit?: number;
    filter?: string;
}): Promise<any[]>;
export function x_mute_user({ username }: {
    username: any;
}): Promise<{
    success: boolean;
    message: string;
}>;
export function x_unmute_user({ username }: {
    username: any;
}): Promise<{
    success: boolean;
    message: string;
}>;
export function x_send_dm({ username, message }: {
    username: any;
    message: any;
}): Promise<{
    success: boolean;
    message: string;
}>;
export function x_get_conversations({ limit }: {
    limit?: number;
}): Promise<any>;
export function x_export_dms({ limit }: {
    limit?: number;
}): Promise<{
    conversations: {
        conversation: any;
        messages: any;
    }[];
    total: any;
}>;
export function x_grok_query({ query, mode }: {
    query: any;
    mode?: string;
}): Promise<{
    success: boolean;
    message: string;
    response?: undefined;
    mode?: undefined;
} | {
    success: boolean;
    response: any;
    mode: string;
    message?: undefined;
}>;
export function x_grok_summarize({ topic }: {
    topic: any;
}): Promise<{
    success: boolean;
    message: string;
    response?: undefined;
    mode?: undefined;
} | {
    success: boolean;
    response: any;
    mode: string;
    message?: undefined;
}>;
export function x_get_lists({ limit }: {
    limit?: number;
}): Promise<any>;
export function x_get_list_members({ listUrl, limit }: {
    listUrl: any;
    limit?: number;
}): Promise<any[]>;
export function x_get_spaces({ filter, topic, limit }: {
    filter?: string;
    topic: any;
    limit?: number;
}): Promise<any[]>;
export function x_scrape_space({ url }: {
    url: any;
}): Promise<any>;
export function x_get_analytics({ period }: {
    period?: string;
}): Promise<{
    period: string;
    analytics: any;
}>;
export function x_get_post_analytics({ url }: {
    url: any;
}): Promise<any>;
export function x_get_settings(): Promise<any>;
export function x_toggle_protected({ enabled }: {
    enabled: any;
}): Promise<{
    success: boolean;
    protected: any;
    message: string;
} | {
    success: boolean;
    message: string;
    protected?: undefined;
}>;
export function x_get_blocked({ limit }: {
    limit?: number;
}): Promise<any[]>;
export function x_brand_monitor({ brand, limit, sentiment }: {
    brand: any;
    limit?: number;
    sentiment?: boolean;
}): Promise<{
    brand: any;
    mentions: any[];
    count: number;
    sentiment?: undefined;
} | {
    brand: any;
    mentions: any[];
    count: number;
    sentiment: {
        positive: number;
        neutral: number;
        negative: number;
    };
}>;
export function x_competitor_analysis({ handles }: {
    handles: any;
}): Promise<{
    success: boolean;
    message: string;
    accounts?: undefined;
    comparison?: undefined;
} | {
    accounts: any[];
    comparison: {
        username: any;
        followers: any;
        following: any;
        tweetCount: any;
    }[];
    success?: undefined;
    message?: undefined;
}>;
export function x_check_premium(): Promise<any>;
export function x_publish_article({ title, body, publish }: {
    title: any;
    body: any;
    publish?: boolean;
}): Promise<{
    success: boolean;
    message: string;
}>;
export function x_creator_analytics({ period }: {
    period?: string;
}): Promise<any>;
/** Get a user's profile using the HTTP client (no browser needed). */
export function x_client_get_profile({ username }: {
    username: any;
}): Promise<import("../client/index.js").Profile>;
/** Get a single tweet by ID using the HTTP client. */
export function x_client_get_tweet({ tweetId }: {
    tweetId: any;
}): Promise<import("../client/index.js").Tweet>;
/** Search tweets using the HTTP client. */
export function x_client_search({ query, count, mode }: {
    query: any;
    count?: number;
    mode?: string;
}): Promise<import("../client/index.js").Tweet[]>;
/** Post a tweet using the HTTP client (requires saved auth cookies). */
export function x_client_send_tweet({ text }: {
    text: any;
}): Promise<import("../client/index.js").Tweet>;
/** Get a user's followers using the HTTP client. */
export function x_client_get_followers({ username, count }: {
    username: any;
    count?: number;
}): Promise<import("../client/index.js").Profile[]>;
/** Get trending topics using the HTTP client. */
export function x_client_get_trends(): Promise<{
    name: string;
    tweetCount: string;
    url: string;
    context: string;
}[]>;
export namespace toolMap {
    export { x_login };
    export { x_get_profile };
    export { x_get_followers };
    export { x_get_following };
    export { x_get_non_followers };
    export { x_get_tweets };
    export { x_search_tweets };
    export { x_get_thread };
    export { x_best_time_to_post };
    export { x_account_report };
    export { x_follow };
    export { x_unfollow };
    export { x_unfollow_non_followers };
    export { x_detect_unfollowers };
    export { x_post_tweet };
    export { x_like };
    export { x_retweet };
    export { x_download_video };
    export { x_update_profile };
    export { x_post_thread };
    export { x_create_poll };
    export { x_schedule_post };
    export { x_delete_tweet };
    export { x_reply };
    export { x_bookmark };
    export { x_get_bookmarks };
    export { x_clear_bookmarks };
    export { x_auto_like };
    export { x_engage };
    export { x_get_trends };
    export { x_get_explore };
    export { x_get_notifications };
    export { x_mute_user };
    export { x_unmute_user };
    export { x_send_dm };
    export { x_get_conversations };
    export { x_export_dms };
    export { x_grok_query };
    export { x_grok_summarize };
    export { x_get_lists };
    export { x_get_list_members };
    export { x_get_spaces };
    export { x_scrape_space };
    export { x_get_analytics };
    export { x_get_post_analytics };
    export { x_get_settings };
    export { x_toggle_protected };
    export { x_get_blocked };
    export { x_brand_monitor };
    export { x_competitor_analysis };
    export { x_check_premium };
    export { x_publish_article };
    export { x_creator_analytics };
    export { x_client_get_profile };
    export { x_client_get_tweet };
    export { x_client_search };
    export { x_client_send_tweet };
    export { x_client_get_followers };
    export { x_client_get_trends };
    export { closeBrowser };
}
export default toolMap;
