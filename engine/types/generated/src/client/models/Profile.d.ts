/**
 * nanomind-x Client — Profile Data Model
 *
 * Represents a Twitter user profile from the internal GraphQL API.
 * Use Profile.fromGraphQL(raw) to parse raw API responses.
 *
 * @author nich (@nichxbt) - https://github.com/nirholas
 * @license Apache-2.0
 */
/**
 * Represents a Twitter user profile.
 */
export class Profile {
    /**
     * Create a Profile from a raw Twitter GraphQL "user_results.result" object.
     *
     * @param {Object} raw - Raw GraphQL user result
     * @returns {Profile|null} Parsed profile, or null if unparseable
     */
    static fromGraphQL(raw: any): Profile | null;
    /** @type {string} */
    id: string;
    /** @type {string} */
    username: string;
    /** @type {string} */
    name: string;
    /** @type {string} */
    bio: string;
    /** @type {string} */
    location: string;
    /** @type {string} */
    website: string;
    /** @type {Date|null} */
    joined: Date | null;
    /** @type {number} */
    followersCount: number;
    /** @type {number} */
    followingCount: number;
    /** @type {number} */
    tweetCount: number;
    /** @type {number} */
    likesCount: number;
    /** @type {number} */
    listedCount: number;
    /** @type {number} */
    mediaCount: number;
    /** @type {string} */
    avatar: string;
    /** @type {string} */
    banner: string;
    /** @type {boolean} */
    verified: boolean;
    /** @type {boolean} */
    protected: boolean;
    /** @type {Object|null} */
    birthdate: any | null;
    /** @type {string[]} */
    pinnedTweetIds: string[];
    /** @type {boolean} */
    isBlueVerified: boolean;
    /** @type {boolean} */
    isGovernment: boolean;
    /** @type {boolean} */
    isBusiness: boolean;
    /** @type {number} */
    affiliatesCount: number;
    /** @type {boolean} */
    canDm: boolean;
    /** @type {string} */
    platform: string;
    /**
     * Full URL to profile on X.
     * @returns {string}
     */
    get profileUrl(): string;
    /**
     * JSON-serializable representation.
     * @returns {Object}
     */
    toJSON(): any;
}
