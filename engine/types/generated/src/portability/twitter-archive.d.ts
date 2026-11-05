/**
 * Strip the `window.YTD.<name>.partN = ` prefix and parse the JSON body.
 * Returns `{ part, records }`.
 */
export function parseArchiveFile(source: any): {
    part: number;
    records: any[];
};
/**
 * Archive tweet record -> normalised tweet.
 * Keeps the flat `timestamp/likes/retweets/url` fields the exporter, archive
 * viewer and differ already read, and adds the archive-only detail on top.
 */
export function normaliseTweet(record: any, username: any): {
    id: any;
    text: any;
    createdAt: string;
    timestamp: string;
    url: string;
    inReplyTo: {
        tweetId: any;
        userId: any;
        username: any;
    };
    retweeted: boolean;
    media: any;
    metrics: {
        likes: number;
        retweets: number;
    };
    likes: number;
    retweets: number;
    hashtags: any;
    mentions: any;
    links: any;
    lang: any;
    source: any;
};
/**
 * Import an official X/Twitter data export.
 *
 * @param {string} archivePath - Path to the downloaded `.zip` or the extracted folder
 * @param {object} [options]
 * @param {string[]} [options.sections] - Subset of ALL_SECTIONS to load (default: all)
 * @param {function} [options.onProgress] - Called with `{ phase, file, ... }` as entries are scanned and parsed
 * @returns {Promise<object>} Normalised archive: account, profile, tweets, likes, following, followers, blocks, mutes, dms, lists, media
 */
export function importTwitterArchive(archivePath: string, options?: {
    sections?: string[];
    onProgress?: Function;
}): Promise<object>;
/**
 * Open a media file referenced by the import (`result.media[n]` or `tweet.media[n].file`)
 * as a readable stream, from either the zip or the folder.
 */
export function openArchiveMedia(result: any, mediaPath: any): Promise<any>;
/**
 * Summarise an imported archive: counts, date range, per-year activity,
 * top hashtags and mentions, busiest year, reply and retweet share.
 */
export function summarizeArchive(result: any, { top }?: {
    top?: number;
}): {
    source: any;
    archivePath: any;
    format: any;
    username: any;
    accountCreatedAt: any;
    counts: {
        tweets: any;
        replies: number;
        retweets: number;
        original: number;
        withMedia: number;
        likes: any;
        following: any;
        followers: any;
        blocks: any;
        mutes: any;
        dmConversations: any;
        dmMessages: any;
        lists: any;
        mediaFiles: any;
    };
    engagement: {
        likesReceived: number;
        retweetsReceived: number;
    };
    dateRange: {
        first: any;
        last: any;
    };
    tweetsPerYear: {};
    busiestYear: {
        year: string;
        tweets: any;
    };
    topHashtags: {
        value: any;
        count: any;
    }[];
    topMentions: {
        value: any;
        count: any;
    }[];
    sections: any;
};
/**
 * Render a summary as a plain-text report for the terminal.
 */
export function formatArchiveReport(summary: any): string;
/**
 * Write an imported archive to disk in the layout `exportAccount` produces
 * (`profile.json`, `tweets.json`, `following.json`, ...), so `migrate`,
 * `diffExports` and the HTML archive viewer all work on it unchanged.
 *
 * @param {object} result - Return value of importTwitterArchive
 * @param {object} [options]
 * @param {string} [options.outputDir] - Default: exports/<username>_archive_<YYYY-MM-DD>
 * @param {string[]} [options.formats=['json','csv','md','html']]
 * @returns {Promise<object>} `{ dir, files, counts }`
 */
export function exportArchive(result: object, options?: {
    outputDir?: string;
    formats?: string[];
}): Promise<object>;
export const ARCHIVE_SOURCE: "twitterArchive";
export namespace ARCHIVE_SECTIONS {
    namespace account {
        let files: string[];
    }
    namespace profile {
        let files_1: string[];
        export { files_1 as files };
    }
    namespace tweets {
        let files_2: string[];
        export { files_2 as files };
    }
    namespace likes {
        let files_3: string[];
        export { files_3 as files };
    }
    namespace following {
        let files_4: string[];
        export { files_4 as files };
    }
    namespace followers {
        let files_5: string[];
        export { files_5 as files };
    }
    namespace blocks {
        let files_6: string[];
        export { files_6 as files };
    }
    namespace mutes {
        let files_7: string[];
        export { files_7 as files };
    }
    namespace dms {
        let files_8: string[];
        export { files_8 as files };
    }
    namespace lists {
        let files_9: string[];
        export { files_9 as files };
    }
    namespace media {
        let files_10: any[];
        export { files_10 as files };
    }
}
export const ALL_SECTIONS: string[];
export default importTwitterArchive;
