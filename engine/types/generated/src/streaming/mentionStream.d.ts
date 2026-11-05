/**
 * Poll mentions of a username and return new ones.
 *
 * @param {Object} opts
 * @param {string} opts.username - Target username (without @)
 * @param {string[]} opts.lastSeenIds - Tweet IDs already seen
 * @param {string} [opts.authToken] - Optional auth_token cookie
 * @returns {{ mentions: Object[], seenIds: string[] }}
 */
export function pollMentions({ username, lastSeenIds, authToken }: {
    username: string;
}): {
    mentions: any[];
    seenIds: string[];
};
