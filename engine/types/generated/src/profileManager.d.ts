/**
 * Scrape detailed profile information
 * @param {import('puppeteer').Page} page - Puppeteer page
 * @param {string} username - Twitter username (without @)
 * @returns {Promise<Object>} Profile data
 */
export function getProfile(page: import("puppeteer").Page, username: string): Promise<any>;
/**
 * Filter a user's posts by latest or most liked (2026 feature)
 * @param {import('puppeteer').Page} page
 * @param {string} username
 * @param {string} sort - 'latest' or 'most_liked'
 * @param {Object} options
 * @returns {Promise<Array>} Sorted posts
 */
export function filterPosts(page: import("puppeteer").Page, username: string, sort?: string, options?: any): Promise<any[]>;
/**
 * Update profile fields
 * @param {import('puppeteer').Page} page
 * @param {Object} updates - Fields to update { name, bio, location, website }
 * @returns {Promise<Object>} Update result
 */
export function updateProfile(page: import("puppeteer").Page, updates?: any): Promise<any>;
/**
 * Upload profile picture
 * @param {import('puppeteer').Page} page
 * @param {string} imagePath - Local path to image file
 */
export function uploadAvatar(page: import("puppeteer").Page, imagePath: string): Promise<{
    success: boolean;
    field: string;
    error?: undefined;
} | {
    success: boolean;
    error: string;
    field?: undefined;
}>;
/**
 * Upload header/banner image
 * @param {import('puppeteer').Page} page
 * @param {string} imagePath
 */
export function uploadHeader(page: import("puppeteer").Page, imagePath: string): Promise<{
    success: boolean;
    field: string;
    error?: undefined;
} | {
    success: boolean;
    error: string;
    field?: undefined;
}>;
declare namespace _default {
    export { getProfile };
    export { filterPosts };
    export { updateProfile };
    export { uploadAvatar };
    export { uploadHeader };
    export { SELECTORS };
}
export default _default;
declare namespace SELECTORS {
    let editProfileButton: string;
    let nameInput: string;
    let bioTextarea: string;
    let locationInput: string;
    let websiteInput: string;
    let saveButton: string;
    let avatarEdit: string;
    let headerEdit: string;
    let verificationBadge: string;
    let followerCount: string;
    let followingCount: string;
    let profileName: string;
    let profileBio: string;
    let profileLocation: string;
    let profileUrl: string;
    let profileJoinDate: string;
    let postFilterLatest: string;
    let postFilterLiked: string;
}
