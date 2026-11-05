/**
 * Search tweets.
 *
 * @param {Object} http - HTTP client with get/post methods
 * @param {string} query - Search query (supports advanced operators)
 * @param {number} [count=100] - Maximum number of results
 * @param {string} [mode='Latest'] - SearchMode: 'Top', 'Latest', 'Photos', 'Videos'
 * @yields {Tweet}
 */
export function searchTweets(http: any, query: string, count?: number, mode?: string): AsyncGenerator<Tweet, void, unknown>;
/**
 * Search profiles (people).
 *
 * @param {Object} http - HTTP client with get/post methods
 * @param {string} query - Search query
 * @param {number} [count=100] - Maximum number of results
 * @yields {Profile}
 */
export function searchProfiles(http: any, query: string, count?: number): AsyncGenerator<Profile, void, unknown>;
import { Tweet } from '../models/Tweet.js';
import { Profile } from '../models/Profile.js';
