/**
 * The CDN's own name for a file: `.../media/Go6lFkVWsAAQwOo.jpg?name=orig`
 * becomes `Go6lFkVWsAAQwOo`. Query strings and the extension are dropped so it
 * composes with `{ext}`.
 */
export function cdnBasename(url: any): string;
/**
 * The extension to save under, taken from the URL and falling back to the
 * media type. X serves photos as `.jpg` with a `format=` query, so the query
 * is consulted before the path.
 */
export function extensionFor(item: any): string;
/**
 * Build the substitution map for one media item.
 *
 * @param {object} item  a media entity (see media/sources.js)
 * @returns {Record<string, string>}
 */
export function templateValues(item: object): Record<string, string>;
/**
 * Render a template into a path relative to the output directory.
 *
 * Unknown keys are an error rather than an empty string: a typo like
 * `{tweetid}` should be corrected, not silently collapse every file in a run
 * onto the same name.
 *
 * @param {string} template
 * @param {object} item
 * @returns {string} a relative path using the platform separator
 */
export function renderTemplate(template: string, item: object): string;
/**
 * Resolve a rendered path inside the output directory, refusing anything that
 * escapes it. Returns an absolute path.
 */
export function resolveWithin(outputDir: any, relativePath: any): string;
/** Keys a template may use, with a one-line description for `--help` and the docs. */
export const TEMPLATE_KEYS: Readonly<{
    username: "author's handle, without the @";
    user_id: "author's numeric id";
    tweet_id: "id of the tweet the media belongs to";
    num: "position within the tweet, starting at 1";
    ext: "file extension without the dot (jpg, mp4, ...)";
    type: "photo, video or animated_gif";
    kind: "media, avatar or banner";
    date: "tweet date as YYYY-MM-DD";
    datetime: "tweet date as YYYYMMDD_HHMMSS";
    year: "tweet year";
    month: "tweet month, zero padded";
    day: "tweet day, zero padded";
    width: "pixel width, 0 when unknown";
    height: "pixel height, 0 when unknown";
    bitrate: "video bitrate, 0 for photos";
    media_filename: "X's own CDN filename without the extension";
    cdn_basename: "alias of media_filename";
    hash: "first 16 hex characters of the sha256 of the bytes (resolved after download)";
}>;
/** What a caller gets when it asks for the default. */
export const DEFAULT_TEMPLATE: "{username}/{tweet_id}_{num}.{ext}";
