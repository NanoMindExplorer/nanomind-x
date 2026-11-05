/**
 * Build a full GraphQL URL with encoded variables and features query params.
 *
 * @param {Object} endpoint - Entry from GRAPHQL_ENDPOINTS
 * @param {Object} [variables={}] - GraphQL variables
 * @param {Object} [features] - Feature flags (defaults to DEFAULT_FEATURES)
 * @returns {string} Full URL with query parameters
 */
export function buildGraphQLUrl(endpoint: any, variables?: any, features?: any): string;
/**
 * Public bearer token embedded in Twitter's web client JavaScript.
 * Not a secret — used by all Twitter scrapers.
 * @type {string}
 */
export const BEARER_TOKEN: string;
/**
 * Default feature flags Twitter expects with GraphQL requests.
 * @type {Object}
 */
export const DEFAULT_FEATURES: any;
/**
 * GraphQL endpoint definitions.
 * @type {Object}
 */
export const GRAPHQL_ENDPOINTS: any;
