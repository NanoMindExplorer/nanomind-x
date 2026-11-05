/**
 * Scrape a user profile by screen name via the `UserByScreenName` GraphQL
 * endpoint.
 *
 * Works with both **guest tokens** (for public profiles) and **auth tokens**
 * (any visible profile).
 *
 * @param {import('./client.js').TwitterHttpClient} client — Configured HTTP client.
 * @param {string} username — The screen name (without leading `@`).
 * @returns {Promise<object>} nanomind-x profile object.
 * @throws {NotFoundError} Non-existent or suspended username.
 * @throws {AuthError} Protected account accessed without auth.
 * @throws {TwitterApiError} Other API errors.
 */
export function scrapeProfile(client: import("./client.js").TwitterHttpClient, username: string): Promise<object>;
/**
 * Scrape a user profile by REST ID via the `UserByRestId` GraphQL endpoint.
 *
 * @param {import('./client.js').TwitterHttpClient} client — Configured HTTP client.
 * @param {string} userId — The numeric user ID.
 * @returns {Promise<object>} nanomind-x profile object.
 * @throws {NotFoundError} Unknown user ID.
 * @throws {AuthError} Protected account without auth.
 * @throws {TwitterApiError} Other API errors.
 */
export function scrapeProfileById(client: import("./client.js").TwitterHttpClient, userId: string): Promise<object>;
export { parseUserData } from "./parse/user.js";
