/**
 * Puppeteer-based browser driver for X.com automation with stealth and anti-detection.
 */
export class BrowserDriver {
    /**
     * @param {Object} [config]
     * @param {boolean} [config.headless=true]
     * @param {string} [config.sessionPath='data/session.json']
     * @param {string} [config.screenshotDir='data/screenshots']
     * @param {string} [config.proxy] - SOCKS5 or HTTP proxy URL
     */
    constructor(config?: {
        headless?: boolean;
        sessionPath?: string;
        screenshotDir?: string;
        proxy?: string;
    });
    headless: boolean;
    sessionPath: string;
    screenshotDir: string;
    proxy: string;
    /** @type {import('puppeteer').Browser|null} */
    browser: import("puppeteer").Browser | null;
    /** @type {import('puppeteer').Page|null} */
    page: import("puppeteer").Page | null;
    antiDetection: AntiDetection;
    _fingerprint: import("./antiDetection.js").SessionFingerprint;
    /**
     * Launch the browser with stealth settings.
     */
    launch(): Promise<void>;
    /**
     * Close the browser cleanly.
     */
    close(): Promise<void>;
    /**
     * Save current cookies to the session file.
     */
    saveSession(): Promise<void>;
    /**
     * Restore cookies from the session file.
     * @returns {boolean} True if session was restored
     */
    restoreSession(): boolean;
    /**
     * Check if currently logged in by looking for the profile link.
     * @returns {Promise<boolean>}
     */
    isLoggedIn(): Promise<boolean>;
    /**
     * Navigate to a URL, waiting for the primary column to load.
     * @param {string} url
     * @param {number} [timeout=30000]
     */
    navigate(url: string, timeout?: number): Promise<void>;
    /**
     * Extract tweets visible on the current page.
     * @returns {Promise<Array<{ id: string, text: string, author: string, isAd: boolean, hasMedia: boolean, likeCount: number }>>}
     */
    extractTweets(): Promise<Array<{
        id: string;
        text: string;
        author: string;
        isAd: boolean;
        hasMedia: boolean;
        likeCount: number;
    }>>;
    /**
     * Extract user cells (follower/following lists, search people results).
     * @returns {Promise<Array<{ username: string, bio: string, followers: string, isFollowing: boolean }>>}
     */
    extractUserCells(): Promise<Array<{
        username: string;
        bio: string;
        followers: string;
        isFollowing: boolean;
    }>>;
    /**
     * Like a specific tweet by its article element or ID.
     * @param {string} tweetId
     * @returns {Promise<boolean>}
     */
    likeTweet(tweetId: string): Promise<boolean>;
    /**
     * Bookmark a specific tweet.
     * @param {string} tweetId
     * @returns {Promise<boolean>}
     */
    bookmarkTweet(tweetId: string): Promise<boolean>;
    /**
     * Retweet a tweet (click retweet + confirm).
     * @param {string} tweetId
     * @returns {Promise<boolean>}
     */
    retweetTweet(tweetId: string): Promise<boolean>;
    /**
     * Reply to a specific tweet.
     * @param {string} tweetId
     * @param {string} text - Reply text
     * @returns {Promise<boolean>}
     */
    replyToTweet(tweetId: string, text: string): Promise<boolean>;
    /**
     * Follow a user from their profile or a user cell.
     * @param {string} [username] - If provided, navigates to their profile first
     * @returns {Promise<boolean>}
     */
    followUser(username?: string): Promise<boolean>;
    /**
     * Search for a query on X.com.
     * @param {string} query
     * @param {'top'|'latest'|'people'|'photos'|'videos'} [tab='top']
     */
    searchFor(query: string, tab?: "top" | "latest" | "people" | "photos" | "videos"): Promise<void>;
    /**
     * Post a new tweet.
     * @param {string} text
     * @returns {Promise<boolean>}
     */
    postTweet(text: string): Promise<boolean>;
    /**
     * Post a multi-tweet thread.
     * @param {string[]} tweets - Array of tweet texts
     * @returns {Promise<boolean>}
     */
    postThread(tweets: string[]): Promise<boolean>;
    /**
     * Scroll down with human-like behavior.
     * @param {number} [pixels] - Pixels to scroll (default: random 300-800)
     */
    scrollDown(pixels?: number): Promise<void>;
    /**
     * Take a screenshot for debugging.
     * @param {string} [filename] - Custom filename (default: timestamp)
     * @returns {Promise<string>} Path to saved screenshot
     */
    screenshot(filename?: string): Promise<string>;
    /**
     * Get trending topics from the Explore page.
     * @returns {Promise<string[]>}
     */
    getTrendingTopics(): Promise<string[]>;
}
import { AntiDetection } from './antiDetection.js';
