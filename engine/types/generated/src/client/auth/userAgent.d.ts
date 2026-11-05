/**
 * Look a profile up by id.
 *
 * @param {string} id
 * @returns {typeof PROFILES[number]}
 * @throws {Error} when no profile carries that id
 */
export function profileById(id: string): (typeof PROFILES)[number];
/**
 * Choose settings for this process.
 *
 * @param {object} [options]
 * @param {string} [options.profileId] Pin a specific profile, e.g. 'firefox-macos'
 * @param {boolean} [options.rotate] Pick a fresh profile per request instead of holding one
 * @returns {typeof PROFILES[number]} the profile now in force
 */
export function configureUserAgent(options?: {
    profileId?: string;
    rotate?: boolean;
}): (typeof PROFILES)[number];
/**
 * Forget the chosen profile and any configuration, so the next call picks
 * again. Mainly for tests and for a long-lived process that has genuinely
 * changed identity (a new proxy, a new account).
 *
 * @returns {void}
 */
export function resetUserAgentSession(): void;
/**
 * Whether rotation is on: an explicit `configureUserAgent({ rotate })` wins,
 * otherwise `NANOMIND_X_ROTATE_USER_AGENT` (`1`, `true`, `yes`), otherwise off.
 *
 * @returns {boolean}
 */
export function isRotationEnabled(): boolean;
/**
 * The profile this session presents. Chosen at random once, then held, so every
 * request from this process tells the same story.
 *
 * @returns {typeof PROFILES[number]}
 */
export function sessionProfile(): (typeof PROFILES)[number];
/**
 * The User-Agent this session presents.
 * @returns {string}
 */
export function sessionUserAgent(): string;
/**
 * A profile picked at random, ignoring the session. Use this when each request
 * really is a separate identity, with its own cookies and its own proxy.
 *
 * @returns {typeof PROFILES[number]}
 */
export function rotateProfile(): (typeof PROFILES)[number];
/**
 * A User-Agent picked at random, ignoring the session.
 * @returns {string}
 */
export function rotateUserAgent(): string;
/**
 * The User-Agent to send.
 *
 * Kept under its original name because callers across the codebase import it,
 * but it no longer rotates by default: it returns the session profile's string
 * unless rotation is switched on with `configureUserAgent({ rotate: true })` or
 * `NANOMIND_X_ROTATE_USER_AGENT=1`. Pass `{ rotate: true }` to rotate this one
 * call.
 *
 * @param {object} [options]
 * @param {boolean} [options.rotate]
 * @returns {string}
 */
export function randomUserAgent(options?: {
    rotate?: boolean;
}): string;
/**
 * The `Sec-CH-UA` client-hint headers that agree with a profile's User-Agent.
 *
 * Chromium sends these on every request and a fingerprinter compares them
 * against the User-Agent; sending one browser's hints with another's string is
 * worse than sending none. Gecko sends no client hints at all, so a Firefox
 * profile returns an empty object.
 *
 * @param {typeof PROFILES[number]} [profile] defaults to the session profile
 * @returns {Record<string, string>}
 */
export function clientHintHeaders(profile?: (typeof PROFILES)[number]): Record<string, string>;
/**
 * Every header a profile implies, ready to spread into a request: the
 * User-Agent, the client hints when the browser sends them, and the
 * `Accept-Language` that browser reports.
 *
 * @param {typeof PROFILES[number]} [profile] defaults to the session profile
 * @returns {Record<string, string>}
 */
export function profileHeaders(profile?: (typeof PROFILES)[number]): Record<string, string>;
/**
 * The browser profiles available: User-Agent plus the headers a real install of
 * that browser sends with it.
 * @type {typeof PROFILES}
 */
export const USER_AGENT_PROFILES: typeof PROFILES;
/**
 * Browser User-Agent strings, one per profile.
 * @type {readonly string[]}
 */
export const USER_AGENTS: readonly string[];
/**
 * Where the pool came from and when, for `nanomind-x doctor`.
 * @type {typeof UPSTREAM}
 */
export const USER_AGENT_SOURCE: typeof UPSTREAM;
/**
 * The browser versions the pool represents.
 * @type {typeof VERSIONS}
 */
export const BROWSER_VERSIONS: typeof VERSIONS;
/**
 * The User-Agent used when a caller has not asked for anything in particular.
 * @type {string}
 */
export const DEFAULT_USER_AGENT: string;
import { PROFILES } from './userAgents.generated.js';
import { UPSTREAM } from './userAgents.generated.js';
import { VERSIONS } from './userAgents.generated.js';
