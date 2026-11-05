/**
 * Detect MIME type from a file extension string.
 * @param {string} ext — e.g. '.png'
 * @returns {string|null}
 */
export function mimeFromExtension(ext: string): string | null;
/**
 * Detect MIME from the first bytes of a buffer (magic-byte sniffing).
 * @param {Buffer} buf
 * @returns {string|null}
 */
export function mimeFromBuffer(buf: Buffer): string | null;
/**
 * Resolve a file path or Buffer into { buffer, mediaType }.
 * @param {string|Buffer} input — path or raw bytes
 * @param {string} [explicitMime] — override MIME if provided
 * @returns {Promise<{ buffer: Buffer, mediaType: string }>}
 */
export function resolveInput(input: string | Buffer, explicitMime?: string): Promise<{
    buffer: Buffer;
    mediaType: string;
}>;
/**
 * Execute Twitter's 3-phase chunked upload (INIT → APPEND → FINALIZE).
 * If the finalised media has processing_info (video), polls STATUS until completion.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {Buffer} buffer
 * @param {string} mediaType — MIME e.g. 'image/jpeg'
 * @param {string} mediaCategory — 'tweet_image' | 'tweet_video' | 'tweet_gif'
 * @param {{ onProgress?: (info: { phase: string, percent: number }) => void }} [opts]
 * @returns {Promise<{ mediaId: string, mediaKey: string|null }>}
 */
export function uploadChunked(client: import("./client.js").TwitterHttpClient, buffer: Buffer, mediaType: string, mediaCategory: string, opts?: {
    onProgress?: (info: {
        phase: string;
        percent: number;
    }) => void;
}): Promise<{
    mediaId: string;
    mediaKey: string | null;
}>;
/**
 * Poll the STATUS endpoint until processing succeeds or fails.
 * Uses exponential back-off between polls.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} mediaId
 * @param {Function} [onProgress]
 */
export function pollProcessingStatus(client: import("./client.js").TwitterHttpClient, mediaId: string, onProgress?: Function): Promise<void>;
/**
 * Upload any media file (image, video, GIF) to Twitter.
 *
 * @param {import('./client.js').TwitterHttpClient} client — authenticated client
 * @param {string|Buffer} filePath — file path or Buffer
 * @param {{ mediaType?: string, altText?: string, onProgress?: Function }} [options]
 * @returns {Promise<{ mediaId: string, mediaKey: string|null }>}
 */
export function uploadMedia(client: import("./client.js").TwitterHttpClient, filePath: string | Buffer, options?: {
    mediaType?: string;
    altText?: string;
    onProgress?: Function;
}): Promise<{
    mediaId: string;
    mediaKey: string | null;
}>;
/**
 * Upload an image (JPEG, PNG, GIF, WebP). Max 5 MB.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string|Buffer} imagePathOrBuffer
 * @param {{ altText?: string, mediaType?: string }} [options]
 * @returns {Promise<{ mediaId: string, mediaKey: string|null }>}
 */
export function uploadImage(client: import("./client.js").TwitterHttpClient, imagePathOrBuffer: string | Buffer, options?: {
    altText?: string;
    mediaType?: string;
}): Promise<{
    mediaId: string;
    mediaKey: string | null;
}>;
/**
 * Upload a video (MP4, MOV). Max 512 MB, chunked in 5 MB segments.
 * Polls processing status until complete.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string|Buffer} videoPathOrBuffer
 * @param {{ onProgress?: (info: { phase: string, percent: number }) => void }} [options]
 * @returns {Promise<{ mediaId: string, mediaKey: string|null }>}
 */
export function uploadVideo(client: import("./client.js").TwitterHttpClient, videoPathOrBuffer: string | Buffer, options?: {
    onProgress?: (info: {
        phase: string;
        percent: number;
    }) => void;
}): Promise<{
    mediaId: string;
    mediaKey: string | null;
}>;
/**
 * Upload a GIF. Max 15 MB.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string|Buffer} gifPathOrBuffer
 * @returns {Promise<{ mediaId: string, mediaKey: string|null }>}
 */
export function uploadGif(client: import("./client.js").TwitterHttpClient, gifPathOrBuffer: string | Buffer): Promise<{
    mediaId: string;
    mediaKey: string | null;
}>;
/**
 * Set alt text on an uploaded media item (for accessibility).
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} mediaId
 * @param {string} altText
 */
export function setAltText(client: import("./client.js").TwitterHttpClient, mediaId: string, altText: string): Promise<void>;
/**
 * Parse a single media entity from Twitter's extended_entities / media array.
 *
 * @param {object} media — raw media object from Twitter response
 * @param {string} tweetId
 * @returns {object}
 */
export function parseMediaEntity(media: object, tweetId: string): object;
/**
 * Scrape a user's media tab (photos and videos).
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} username
 * @param {{ limit?: number, cursor?: string }} [options]
 * @returns {Promise<Array<object>>}
 */
export function scrapeMedia(client: import("./client.js").TwitterHttpClient, username: string, options?: {
    limit?: number;
    cursor?: string;
}): Promise<Array<object>>;
/**
 * Download a media file from a URL to a local path.
 * Streams data to avoid memory issues with large videos.
 *
 * @param {string} url
 * @param {string} destPath
 * @param {{ onProgress?: (info: { downloaded: number, total: number|null }) => void }} [options]
 * @returns {Promise<{ bytes: number, path: string }>}
 */
export function downloadMedia(url: string, destPath: string, options?: {
    onProgress?: (info: {
        downloaded: number;
        total: number | null;
    }) => void;
}): Promise<{
    bytes: number;
    path: string;
}>;
/**
 * Extract the highest-quality video URL from a tweet.
 *
 * @param {import('./client.js').TwitterHttpClient} client
 * @param {string} tweetId
 * @returns {Promise<{ url: string, bitrate: number, contentType: string, width: number, height: number }|null>}
 */
export function getVideoUrl(client: import("./client.js").TwitterHttpClient, tweetId: string): Promise<{
    url: string;
    bitrate: number;
    contentType: string;
    width: number;
    height: number;
} | null>;
