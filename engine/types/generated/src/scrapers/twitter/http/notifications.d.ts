/**
 * Parse one timeline entry into a notification event.
 *
 * @param {object} entry Timeline entry (as returned by `flattenEntries`)
 * @returns {object|null} `{ id, type, timestamp, message, users, tweets, tweet, url }`
 */
export function parseNotificationEntry(entry: object): object | null;
/**
 * Parse a notifications timeline into events plus the bottom cursor.
 *
 * @param {object[]} instructions `timeline.instructions`
 * @returns {{ items: object[], cursor: string|null }}
 */
export function parseNotificationsTimeline(instructions: object[]): {
    items: object[];
    cursor: string | null;
};
/**
 * Scrape the authenticated user's notifications (`NotificationsTimeline`).
 *
 * @param {object} client TwitterHttpClient instance (authenticated)
 * @param {object} [options]
 * @param {'all'|'mentions'|'verified'} [options.type='all'] Which tab
 * @param {number} [options.limit=50] Maximum events
 * @param {string|null} [options.cursor=null] Resume from cursor
 * @param {string[]} [options.types] Keep only these event types (e.g. `['follow','like']`)
 * @param {Function} [options.onProgress] `({ fetched, limit, page })`
 * @returns {Promise<object[]>} Events, newest first
 *
 * @example
 * const events = await scrapeNotifications(client, { type: 'mentions', limit: 20 });
 * for (const e of events) console.log(e.type, e.users.map((u) => u.username), e.tweet?.text);
 */
export function scrapeNotifications(client: object, options?: {
    type?: "all" | "mentions" | "verified";
    limit?: number;
    cursor?: string | null;
    types?: string[];
    onProgress?: Function;
}): Promise<object[]>;
/**
 * Mentions tab only.
 * @param {object} client
 * @param {object} [options] Same as `scrapeNotifications` minus `type`
 * @returns {Promise<object[]>}
 */
export function scrapeMentions(client: object, options?: object): Promise<object[]>;
/**
 * Verified tab only.
 * @param {object} client
 * @param {object} [options] Same as `scrapeNotifications` minus `type`
 * @returns {Promise<object[]>}
 */
export function scrapeVerifiedNotifications(client: object, options?: object): Promise<object[]>;
