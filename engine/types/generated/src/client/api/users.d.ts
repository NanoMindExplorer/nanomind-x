/**
 * Get a user profile by screen name.
 *
 * @param {Object} http - HTTP client with get/post methods
 * @param {string} username - Screen name (without @)
 * @returns {Promise<Profile>}
 * @throws {NotFoundError}
 */
export function getUserByScreenName(http: any, username: string): Promise<Profile>;
/**
 * Get a user profile by REST ID.
 *
 * @param {Object} http
 * @param {string} userId - Numeric user ID
 * @returns {Promise<Profile>}
 * @throws {NotFoundError}
 */
export function getUserById(http: any, userId: string): Promise<Profile>;
/**
 * Get a user's numeric ID from their screen name.
 *
 * @param {Object} http
 * @param {string} username
 * @returns {Promise<string>}
 */
export function getUserIdByScreenName(http: any, username: string): Promise<string>;
/**
 * Get a user's followers with cursor pagination.
 *
 * @param {Object} http
 * @param {string} userId - Numeric user ID
 * @param {number} [count=100] - Maximum profiles to yield
 * @yields {Profile}
 */
export function getFollowers(http: any, userId: string, count?: number): AsyncGenerator<Profile, void, unknown>;
/**
 * Get accounts a user follows with cursor pagination.
 *
 * @param {Object} http
 * @param {string} userId - Numeric user ID
 * @param {number} [count=100] - Maximum profiles to yield
 * @yields {Profile}
 */
export function getFollowing(http: any, userId: string, count?: number): AsyncGenerator<Profile, void, unknown>;
/**
 * Follow a user.
 *
 * @param {Object} http
 * @param {string} userId - Numeric user ID
 * @returns {Promise<void>}
 */
export function followUser(http: any, userId: string): Promise<void>;
/**
 * Unfollow a user.
 *
 * @param {Object} http
 * @param {string} userId - Numeric user ID
 * @returns {Promise<void>}
 */
export function unfollowUser(http: any, userId: string): Promise<void>;
import { Profile } from '../models/Profile.js';
