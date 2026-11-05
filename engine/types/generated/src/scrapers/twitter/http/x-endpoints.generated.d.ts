/**
 * Where this table came from, and when.
 *
 * `nanomind-x doctor` and the endpoint audit read this instead of a date written
 * into a comment by hand, so "last verified" is a fact rather than a claim.
 *
 * @type {Readonly<{repo: string, ref: string, commit: string, committedAt: string, fetchedAt: string, files: readonly string[], operations: number, queries: number, mutations: number, featureSwitches: number, fieldToggles: number, restPaths: number}>}
 */
export const UPSTREAM: Readonly<{
    repo: string;
    ref: string;
    commit: string;
    committedAt: string;
    fetchedAt: string;
    files: readonly string[];
    operations: number;
    queries: number;
    mutations: number;
    featureSwitches: number;
    fieldToggles: number;
    restPaths: number;
}>;
/**
 * Every GraphQL feature switch x.com declares, with the value its own web
 * client sends. No switch is declared with two different values upstream, so a
 * single map is enough.
 * @type {Readonly<Record<string, boolean>>}
 */
export const FEATURE_VALUES: Readonly<Record<string, boolean>>;
/**
 * Feature-switch names, in the order the index lists below refer to them.
 * @type {readonly string[]}
 */
export const FEATURE_NAMES: readonly string[];
/**
 * Field-toggle names, in the order the index lists below refer to them. Upstream
 * records which operations accept a toggle but not what value the client sends,
 * so the values live in `FIELD_TOGGLE_VALUES` in ./endpoints.js.
 * @type {readonly string[]}
 */
export const FIELD_TOGGLE_NAMES: readonly string[];
/**
 * Every operation x.com ships, keyed by operation name.
 *
 * `featureIdx` and `toggleIdx` index into `FEATURE_NAMES` and
 * `FIELD_TOGGLE_NAMES`. They are stored as indexes because spelling every
 * feature name out per operation would make this file roughly five times
 * larger for no extra information. `operationFeatures()` in ./endpoints.js
 * resolves them back to a `{name: boolean}` object.
 *
 * @type {Readonly<Record<string, Readonly<{queryId: string, type: string, featureIdx: readonly number[], toggleIdx: readonly number[]}>>>}
 */
export const OPERATIONS: Readonly<Record<string, Readonly<{
    queryId: string;
    type: string;
    featureIdx: readonly number[];
    toggleIdx: readonly number[];
}>>>;
/**
 * x.com's v1.1 REST dispatch table, keyed by path. Recorded so the hand-written
 * `REST` map in ./endpoints.js can be checked against what the client actually
 * calls, including the HTTP methods and which of the two hosts serves it.
 * @type {Readonly<Record<string, Readonly<{methods: readonly string[], url: string}>>>}
 */
export const REST_V11: Readonly<Record<string, Readonly<{
    methods: readonly string[];
    url: string;
}>>>;
