/**
 * Poll a user's tweets and return any new ones since lastSeenIds.
 *
 * @param {Object} opts
 * @param {string} opts.username - Target X/Twitter username (without @)
 * @param {string[]} opts.lastSeenIds - Tweet IDs already seen
 * @param {string} [opts.authToken] - Optional auth_token cookie
 * @returns {{ tweets: Object[], seenIds: string[] }}
 */
export function pollTweets({ username, lastSeenIds, authToken }: {
    username: string;
}): {
    tweets: any[];
    seenIds: string[];
};
