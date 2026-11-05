/**
 * Create x402 payment middleware for the MCP HTTP server.
 *
 * Mount this BEFORE the /mcp handler:
 *   app.use(createMcpPaymentMiddleware());
 *   app.all('/mcp', mcpHandler);
 *
 * @returns Express middleware function
 */
export function createMcpPaymentMiddleware(): (req: any, res: any, next: any) => Promise<any>;
/**
 * GET /mcp/pricing — returns per-tool pricing info (no payment required).
 */
export function mcpPricingHandler(_req: any, res: any): void;
export namespace MCP_TOOL_PRICES {
    let x_get_profile: string;
    let x_get_followers: string;
    let x_get_following: string;
    let x_get_tweets: string;
    let x_search_tweets: string;
    let x_get_thread: string;
    let x_get_replies: string;
    let x_get_hashtag: string;
    let x_get_likers: string;
    let x_get_retweeters: string;
    let x_get_media: string;
    let x_get_mentions: string;
    let x_get_quote_tweets: string;
    let x_get_likes: string;
    let x_get_bookmarks: string;
    let x_get_non_followers: string;
    let x_follow: string;
    let x_unfollow: string;
    let x_like: string;
    let x_unlike: string;
    let x_post_tweet: string;
    let x_post_thread: string;
    let x_reply: string;
    let x_retweet: string;
    let x_quote_tweet: string;
    let x_bookmark: string;
    let x_delete_tweet: string;
    let x_unfollow_non_followers: string;
    let x_unfollow_all: string;
    let x_smart_unfollow: string;
    let x_auto_follow: string;
    let x_follow_engagers: string;
    let x_auto_comment: string;
    let x_auto_retweet: string;
    let x_bulk_execute: string;
    let x_detect_unfollowers: string;
    let x_monitor_account: string;
    let x_monitor_keyword: string;
    let x_follower_alerts: string;
    let x_track_engagement: string;
    let x_brand_monitor: string;
    let x_competitor_analysis: string;
    let x_detect_bots: string;
    let x_find_influencers: string;
    let x_smart_target: string;
    let x_monitor_reputation: string;
    let x_reputation_report: string;
    let x_audience_overlap: string;
    let x_analyze_voice: string;
    let x_generate_tweet: string;
    let x_rewrite_tweet: string;
    let x_summarize_thread: string;
    let x_analyze_sentiment: string;
    let x_grok_query: string;
    let x_grok_summarize: string;
    let x_grok_analyze_image: string;
    let x_crypto_analyze: string;
    let x_audience_insights: string;
    let x_engagement_report: string;
    let x_get_post_analytics: string;
    let x_history_get: string;
    let x_growth_rate: string;
    let x_compare_accounts: string;
    let x_download_video: string;
    let x_publish_article: string;
    let x_creator_analytics: string;
    let x_export_account: string;
    let x_migrate_account: string;
    let x_graph_build: string;
    let x_graph_analyze: string;
    let x_graph_recommendations: string;
    let x_send_dm: string;
    let x_get_dm_conversations: string;
    let x_export_dms: string;
    let x_space_join: string;
    let x_workflow_run: string;
}
