/**
 * Poll follower data and compute diff.
 *
 * Strategy:
 * 1. Always scrape profile (lightweight) to get follower count.
 * 2. If count === lastCount, return early (no change).
 * 3. If count changed, scrape the follower list and diff.
 *
 * @param {Object} opts
 * @param {string} opts.username - Target username (without @)
 * @param {string[]} opts.lastFollowers - Previously-known follower usernames
 * @param {number|null} opts.lastCount - Previously-known follower count
 * @param {string} [opts.authToken] - Optional auth_token cookie
 * @returns {{ profile: Object, newFollowers: string[], lostFollowers: string[], followers: string[], followerCount: number, countDelta: number }}
 */
export function pollFollowers({ username, lastFollowers, lastCount, authToken }: {
    username: string;
}): {
    profile: any;
    newFollowers: string[];
    lostFollowers: string[];
    followers: string[];
    followerCount: number;
    countDelta: number;
};
