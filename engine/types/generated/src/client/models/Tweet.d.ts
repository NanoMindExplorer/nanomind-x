/**
 * Represents a single tweet from Twitter.
 */
export class Tweet {
    /**
     * Create a Tweet from a raw Twitter GraphQL "tweet_results.result" object.
     *
     * @param {Object} raw - Raw GraphQL tweet result
     * @returns {Tweet|null} Parsed tweet, or null if unparseable/tombstone
     */
    static fromGraphQL(raw: any): Tweet | null;
    /** @type {string} */
    id: string;
    /** @type {string} */
    text: string;
    /** @type {string} */
    fullText: string;
    /** @type {string} */
    username: string;
    /** @type {string} */
    userId: string;
    /** @type {Date|null} */
    timeParsed: Date | null;
    /** @type {number|null} */
    timestamp: number | null;
    /** @type {string[]} */
    hashtags: string[];
    /** @type {string[]} */
    mentions: string[];
    /** @type {string[]} */
    urls: string[];
    /** @type {Array<{id: string, url: string, alt: string|null}>} */
    photos: Array<{
        id: string;
        url: string;
        alt: string | null;
    }>;
    /** @type {Array<{id: string, url: string, preview: string, duration: number|null}>} */
    videos: Array<{
        id: string;
        url: string;
        preview: string;
        duration: number | null;
    }>;
    /** @type {Tweet[]} */
    thread: Tweet[];
    /** @type {string|null} */
    inReplyToStatusId: string | null;
    /** @type {Tweet|null} */
    inReplyToStatus: Tweet | null;
    /** @type {string|null} */
    quotedStatusId: string | null;
    /** @type {Tweet|null} */
    quotedStatus: Tweet | null;
    /** @type {boolean} */
    isRetweet: boolean;
    /** @type {boolean} */
    isReply: boolean;
    /** @type {boolean} */
    isQuote: boolean;
    /** @type {Tweet|null} */
    retweetedStatus: Tweet | null;
    /** @type {number} */
    likes: number;
    /** @type {number} */
    retweets: number;
    /** @type {number} */
    replies: number;
    /** @type {number} */
    views: number;
    /** @type {number} */
    bookmarkCount: number;
    /** @type {Object|null} */
    place: any | null;
    /** @type {boolean} */
    sensitiveContent: boolean;
    /** @type {string} */
    conversationId: string;
    /** @type {Object|null} */
    poll: any | null;
    /**
     * Permanent URL for this tweet.
     * @returns {string}
     */
    get permanentUrl(): string;
    /**
     * JSON-serializable representation.
     * @returns {Object}
     */
    toJSON(): any;
}
