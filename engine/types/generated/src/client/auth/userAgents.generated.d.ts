/**
 * Where this pool came from, and when. Read by `nanomind-x doctor` so the age of
 * the fingerprint is a fact rather than a guess.
 * @type {Readonly<{repo: string, ref: string, commit: string, committedAt: string, fetchedAt: string, files: readonly string[]}>}
 */
export const UPSTREAM: Readonly<{
    repo: string;
    ref: string;
    commit: string;
    committedAt: string;
    fetchedAt: string;
    files: readonly string[];
}>;
/**
 * The browser versions upstream observed, for reporting.
 * @type {Readonly<Record<string, string>>}
 */
export const VERSIONS: Readonly<Record<string, string>>;
/**
 * One coherent browser identity per entry: the User-Agent and the request
 * headers that a real install of that browser sends alongside it. Mixing a
 * User-Agent from one row with client hints from another is exactly the
 * inconsistency a fingerprinter looks for, so they travel together.
 *
 * @type {readonly Readonly<{id: string, browser: string, engine: string, platform: string, version: string, userAgent: string, acceptLanguage: string, accept: string|null, acceptEncoding: string|null, secChUa: string|null, secChUaMobile: string|null, secChUaPlatform: string|null}>[]}
 */
export const PROFILES: readonly Readonly<{
    id: string;
    browser: string;
    engine: string;
    platform: string;
    version: string;
    userAgent: string;
    acceptLanguage: string;
    accept: string | null;
    acceptEncoding: string | null;
    secChUa: string | null;
    secChUaMobile: string | null;
    secChUaPlatform: string | null;
}>[];
/**
 * The profile chosen when a caller names none.
 * @type {string}
 */
export const DEFAULT_PROFILE_ID: string;
/**
 * Just the User-Agent strings, in profile order, for the callers that only
 * ever wanted a string.
 * @type {readonly string[]}
 */
export const USER_AGENT_STRINGS: readonly string[];
