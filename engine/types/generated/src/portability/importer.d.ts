/**
 * Migrate to Bluesky
 *
 * @param {object} options
 * @param {string} options.exportDir - Path to export directory
 * @param {string} [options.handle] - Bluesky handle (e.g. user.bsky.social)
 * @param {string} [options.password] - Bluesky app password
 * @param {boolean} [options.dryRun=true] - If true, only log actions
 * @param {boolean} [options.migrateTweets=true] - Migrate tweets as posts
 * @param {boolean} [options.migrateFollows=true] - Follow matching users
 * @param {number} [options.tweetLimit=50] - Max tweets to migrate
 * @param {function} [options.onProgress] - Progress callback
 * @returns {object} Migration summary
 */
export function migrateToBluesky(options: {
    exportDir: string;
    handle?: string;
    password?: string;
    dryRun?: boolean;
    migrateTweets?: boolean;
    migrateFollows?: boolean;
    tweetLimit?: number;
    onProgress?: Function;
}): object;
/**
 * Migrate to Mastodon
 *
 * @param {object} options
 * @param {string} options.exportDir - Path to export directory
 * @param {string} [options.instanceUrl] - Mastodon instance URL
 * @param {string} [options.accessToken] - Mastodon access token
 * @param {boolean} [options.dryRun=true] - If true, only log actions
 * @param {boolean} [options.migrateTweets=true] - Migrate tweets as toots
 * @param {boolean} [options.migrateFollows=true] - Follow matching users
 * @param {number} [options.tweetLimit=50] - Max tweets to migrate
 * @param {function} [options.onProgress] - Progress callback
 * @returns {object} Migration summary
 */
export function migrateToMastodon(options: {
    exportDir: string;
    instanceUrl?: string;
    accessToken?: string;
    dryRun?: boolean;
    migrateTweets?: boolean;
    migrateFollows?: boolean;
    tweetLimit?: number;
    onProgress?: Function;
}): object;
/**
 * Migrate to a target platform
 *
 * @param {object} options
 * @param {string} [options.exportDir] - Path to export directory (or output dir when source is 'twitterArchive')
 * @param {string} [options.source] - 'twitterArchive' to migrate straight from the official X data export
 * @param {string} [options.archivePath] - The archive zip or folder when source is 'twitterArchive'
 * @param {string} options.platform - 'bluesky' or 'mastodon'
 * @param {boolean} [options.dryRun=true]
 * @param {object} [options.credentials] - Platform-specific credentials
 * @param {function} [options.onProgress]
 * @returns {object} Migration summary
 */
export function migrate(options: {
    exportDir?: string;
    source?: string;
    archivePath?: string;
    platform: string;
    dryRun?: boolean;
    credentials?: object;
    onProgress?: Function;
}): object;
export default migrate;
/**
 * Find best match for a Twitter user on another platform
 * Returns { match, score, method } or null
 */
export function findMatch(twitterUser: any, platformUsers: any): {
    match: any;
    score: number;
    method: string;
};
/**
 * Simple string similarity (Dice coefficient)
 */
export function similarity(a: any, b: any): number;
