/**
 * nanomind-x Archive Viewer Generator
 * Generates a self-contained HTML file that displays an exported Twitter account.
 * Single file, zero dependencies, works offline.
 * Dark theme, card-based tweet display, pagination, profile header with stats, search.
 *
 * @author nich (@nichxbt) - https://github.com/nirholas
 * @license Apache-2.0
 */
/**
 * Generate a beautiful self-contained HTML archive viewer
 *
 * @param {object} data
 * @param {object} data.profile - Profile object
 * @param {object[]} data.tweets - Tweets array
 * @param {object[]} data.followers - Followers array
 * @param {object[]} data.following - Following array
 * @param {object[]} data.bookmarks - Bookmarks array
 * @param {object[]} data.likes - Likes array
 * @returns {string} Complete HTML document
 */
export function generateArchiveHTML(data: {
    profile: object;
    tweets: object[];
    followers: object[];
    following: object[];
    bookmarks: object[];
    likes: object[];
}): string;
export default generateArchiveHTML;
