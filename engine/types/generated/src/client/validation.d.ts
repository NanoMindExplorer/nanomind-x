/**
 * Validate and clean a Twitter username.
 * Strips leading @, enforces 1-15 alphanumeric + underscore chars.
 *
 * @param {string} username
 * @returns {string} Cleaned username
 * @throws {ScraperError}
 */
export function validateUsername(username: string): string;
/**
 * Validate a numeric tweet ID string.
 *
 * @param {string} id
 * @returns {string}
 * @throws {ScraperError}
 */
export function validateTweetId(id: string): string;
/**
 * Validate tweet text length.
 *
 * @param {string} text
 * @param {number} [maxLength=280]
 * @returns {string}
 * @throws {ScraperError}
 */
export function validateTweetText(text: string, maxLength?: number): string;
/**
 * Validate a count parameter.
 *
 * @param {number} count
 * @param {number} [min=1]
 * @param {number} [max=10000]
 * @returns {number}
 * @throws {ScraperError}
 */
export function validateCount(count: number, min?: number, max?: number): number;
/**
 * Validate a numeric user ID.
 *
 * @param {string} userId
 * @returns {string}
 * @throws {ScraperError}
 */
export function validateUserId(userId: string): string;
/**
 * Validate a numeric list ID.
 *
 * @param {string} listId
 * @returns {string}
 * @throws {ScraperError}
 */
export function validateListId(listId: string): string;
/**
 * Validate a URL string.
 *
 * @param {string} url
 * @returns {string}
 * @throws {ScraperError}
 */
export function validateUrl(url: string): string;
