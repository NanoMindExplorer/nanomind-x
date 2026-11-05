/**
 * Get tweets from a list.
 *
 * @param {Object} http
 * @param {string} listId
 * @param {number} [count=100]
 * @returns {AsyncGenerator<Tweet>}
 */
export function getListTweets(http: any, listId: string, count?: number): AsyncGenerator<Tweet>;
/**
 * Get members of a list.
 *
 * @param {Object} http
 * @param {string} listId
 * @param {number} [count=100]
 * @returns {AsyncGenerator<Profile>}
 */
export function getListMembers(http: any, listId: string, count?: number): AsyncGenerator<Profile>;
/**
 * Get list details by ID.
 *
 * @param {Object} http
 * @param {string} listId
 * @returns {Promise<{id: string, name: string, description: string, memberCount: number, subscriberCount: number, createdAt: string}>}
 */
export function getListById(http: any, listId: string): Promise<{
    id: string;
    name: string;
    description: string;
    memberCount: number;
    subscriberCount: number;
    createdAt: string;
}>;
import { Tweet } from '../models/Tweet.js';
import { Profile } from '../models/Profile.js';
