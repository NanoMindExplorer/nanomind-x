/**
 * Apify field mappings:
 * Profile: profileUrl, fullName, biography, followersCount, followingCount, tweetsCount, isVerified, joinDate, location, website
 * Tweet: tweetUrl, tweetText, retweetCount, likeCount, replyCount, quoteCount, viewCount, createdAt
 * Followers: userName, fullName, followsYou, followedByYou, followersCount, followingCount
 */
export function importApifyDataset(data: any): {
    type: string;
    items: any;
    fieldMapping: {};
    unmappedFields: any[];
};
export function exportAsApifyDataset(items: any, type?: string): any;
/**
 * Phantombuster field mappings:
 * Followers Collector: twitterUrl, name, description, followers, following, tweets, verified
 * Profile Scraper: twitterUrl, name, bio, location, website, followers, following
 * Auto Follow: url, action, timestamp, status
 */
export function importPhantomResult(data: any): {
    type: string;
    items: any;
    fieldMapping: {};
};
export function exportAsPhantomResult(items: any, phantomType?: string): string;
export function exportAsSocialBlade(historyData: any): string;
export function autoDetectCSV(data: any): {
    detectedType: string;
    fieldMapping: {};
    items: any;
    confidence: number;
};
export function importData(filePath: any, from?: string): Promise<{
    type: string;
    items: any;
    fieldMapping: {};
} | {
    detectedType: string;
    fieldMapping: {};
    items: any;
    confidence: number;
}>;
export function exportData(items: any, to: any, type?: string): string;
export function convertFormat(data: any, fromFormat: any, toFormat: any, type?: string): string;
