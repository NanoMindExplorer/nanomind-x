/**
 * Start the algorithm builder — runs continuously with human-like patterns.
 *
 * @param {Object} options
 * @param {string} options.personaId - Persona ID to load
 * @param {string} options.authToken - X/Twitter auth_token cookie value
 * @param {boolean} [options.headless=true] - Run browser in headless mode
 * @param {boolean} [options.dryRun=false] - Log actions without executing
 * @param {number} [options.maxSessions=0] - 0 = infinite, or stop after N sessions
 * @param {Function} [options.onSessionComplete] - Callback after each session
 * @param {AbortSignal} [options.signal] - AbortController signal to stop
 */
export function startAlgorithmBuilder(options?: {
    personaId: string;
    authToken: string;
    headless?: boolean;
    dryRun?: boolean;
    maxSessions?: number;
    onSessionComplete?: Function;
    signal?: AbortSignal;
}): Promise<{
    sessionCount: number;
    persona: any;
}>;
/**
 * Run a single session (useful for testing)
 */
export function runSingleSession(options?: {}): Promise<{
    sessionCount: number;
    persona: any;
}>;
/**
 * Search for a term on X
 */
export function doSearch(page: any, term: any, tab?: string): Promise<boolean>;
/**
 * Browse home timeline
 */
export function browseHome(page: any): Promise<boolean>;
/**
 * Like a tweet on the current page
 */
export function likeTweet(page: any, tweetIndex?: any): Promise<boolean>;
/**
 * Follow a user on the current page
 */
export function followUser(page: any, persona: any, username?: any): Promise<any>;
/**
 * Comment on a tweet using LLM-generated text
 */
export function commentOnTweet(page: any, persona: any, tweet: any): Promise<boolean>;
/**
 * Create an original post using LLM
 */
export function createPost(page: any, persona: any): Promise<boolean>;
/**
 * Visit a user's profile and browse it
 */
export function visitProfile(page: any, username: any): Promise<boolean>;
/**
 * Check own profile (natural behavior)
 */
export function checkOwnProfile(page: any): Promise<boolean>;
/**
 * Check notifications
 */
export function checkNotifications(page: any): Promise<boolean>;
/**
 * Extract visible tweets from the current page
 */
export function extractVisibleTweets(page: any): Promise<any>;
/**
 * Extract visible user cells from the current page
 */
export function extractVisibleUsers(page: any): Promise<any>;
/**
 * Generate a comment for a tweet using persona's voice
 */
export function generateComment(tweetText: any, tweetAuthor: any, persona: any): Promise<any>;
/**
 * Generate an original post using persona's voice
 */
export function generatePost(persona: any, context?: {}): Promise<any>;
