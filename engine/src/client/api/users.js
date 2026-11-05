// Copyright (c) 2024-2026 nich (@nichxbt). Licensed under the Apache License, Version 2.0.
/**
 * nanomind-x Client — Users API
 *
 * User-related API calls: profiles, followers, following, follow/unfollow.
 * All functions take an HTTP client as the first parameter.
 *
 * @author nich (@nichxbt) - https://github.com/nirholas
 * @license Apache-2.0
 */

import { GRAPHQL_ENDPOINTS, DEFAULT_FEATURES, buildGraphQLUrl } from './graphqlQueries.js';
import { Profile } from '../models/Profile.js';
import { NotFoundError, ScraperError } from '../errors.js';
import { parseTimelineEntries, parseUserEntry } from './parsers.js';

/** @private Random delay between paginated requests */
function randomDelay(min = 1000, max = 2000) {
  return new Promise((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));
}

/**
 * Get a user profile by screen name.
 *
 * @param {Object} http - HTTP client with get/post methods
 * @param {string} username - Screen name (without @)
 * @returns {Promise<Profile>}
 * @throws {NotFoundError}
 */
export async function getUserByScreenName(http, username) {
  const endpoint = GRAPHQL_ENDPOINTS.UserByScreenName;
  const variables = {
    screen_name: username,
    withSafetyModeUserFields: true,
  };
  const url = buildGraphQLUrl(endpoint, variables);
  const data = await http.get(url);

  const userResult = data?.data?.user?.result;
  if (!userResult || userResult.__typename === 'UserUnavailable') {
    throw new NotFoundError(`User "${username}" not found`, 'USER_NOT_FOUND', {
      endpoint: 'UserByScreenName',
    });
  }

  const profile = Profile.fromGraphQL(userResult);
  if (!profile) {
    throw new NotFoundError(`Could not parse user "${username}"`, 'USER_NOT_FOUND', {
      endpoint: 'UserByScreenName',
    });
  }

  return profile;
}

/**
 * Get a user profile by REST ID.
 *
 * @param {Object} http
 * @param {string} userId - Numeric user ID
 * @returns {Promise<Profile>}
 * @throws {NotFoundError}
 */
export async function getUserById(http, userId) {
  const endpoint = GRAPHQL_ENDPOINTS.UserByRestId;
  const variables = {
    userId,
    withSafetyModeUserFields: true,
  };
  const url = buildGraphQLUrl(endpoint, variables);
  const data = await http.get(url);

  const userResult = data?.data?.user?.result;
  if (!userResult || userResult.__typename === 'UserUnavailable') {
    throw new NotFoundError(`User ID "${userId}" not found`, 'USER_NOT_FOUND', {
      endpoint: 'UserByRestId',
    });
  }

  const profile = Profile.fromGraphQL(userResult);
  if (!profile) {
    throw new NotFoundError(`Could not parse user ID "${userId}"`, 'USER_NOT_FOUND', {
      endpoint: 'UserByRestId',
    });
  }

  return profile;
}

/**
 * Get a user's numeric ID from their screen name.
 *
 * @param {Object} http
 * @param {string} username
 * @returns {Promise<string>}
 */
export async function getUserIdByScreenName(http, username) {
  const profile = await getUserByScreenName(http, username);
  return profile.id;
}

/**
 * Get a user's followers with cursor pagination.
 *
 * @param {Object} http
 * @param {string} userId - Numeric user ID
 * @param {number} [count=100] - Maximum profiles to yield
 * @yields {Profile}
 */
export async function* getFollowers(http, userId, count = 100) {
  let yielded = 0;
  let cursor = null;

  while (yielded < count) {
    const endpoint = GRAPHQL_ENDPOINTS.Followers;
    const variables = {
      userId,
      count: 20,
      includePromotedContent: false,
    };
    if (cursor) variables.cursor = cursor;

    const url = buildGraphQLUrl(endpoint, variables);
    const data = await http.get(url);

    const { entries, cursor: nextCursor } = parseTimelineEntries(
      data,
      'data.user.result.timeline.timeline',
    );

    let foundAny = false;
    for (const entry of entries) {
      const profile = parseUserEntry(entry);
      if (profile) {
        yield profile;
        yielded++;
        foundAny = true;
        if (yielded >= count) return;
      }
    }

    if (!nextCursor || !foundAny) return;
    cursor = nextCursor;
    await randomDelay(1000, 2000);
  }
}

/**
 * Get accounts a user follows with cursor pagination.
 *
 * @param {Object} http
 * @param {string} userId - Numeric user ID
 * @param {number} [count=100] - Maximum profiles to yield
 * @yields {Profile}
 */
export async function* getFollowing(http, userId, count = 100) {
  let yielded = 0;
  let cursor = null;

  while (yielded < count) {
    const endpoint = GRAPHQL_ENDPOINTS.Following;
    const variables = {
      userId,
      count: 20,
      includePromotedContent: false,
    };
    if (cursor) variables.cursor = cursor;

    const url = buildGraphQLUrl(endpoint, variables);
    const data = await http.get(url);

    const { entries, cursor: nextCursor } = parseTimelineEntries(
      data,
      'data.user.result.timeline.timeline',
    );

    let foundAny = false;
    for (const entry of entries) {
      const profile = parseUserEntry(entry);
      if (profile) {
        yield profile;
        yielded++;
        foundAny = true;
        if (yielded >= count) return;
      }
    }

    if (!nextCursor || !foundAny) return;
    cursor = nextCursor;
    await randomDelay(1000, 2000);
  }
}

/**
 * Follow a user.
 *
 * @param {Object} http
 * @param {string} userId - Numeric user ID
 * @returns {Promise<void>}
 */
export async function followUser(http, userId) {
  const endpoint = GRAPHQL_ENDPOINTS.CreateFollow;
  const url = endpoint.url();
  const body = new URLSearchParams({
    include_profile_interstitial_type: '1',
    include_blocking: '1',
    include_blocked_by: '1',
    include_followed_by: '1',
    include_want_retweets: '1',
    include_mute_edge: '1',
    include_can_dm: '1',
    include_can_media_tag: '1',
    include_ext_is_blue_verified: '1',
    include_ext_verified_type: '1',
    include_ext_profile_image_shape: '1',
    skip_status: '1',
    user_id: userId,
  });
  await http.post(url, body, { contentType: 'application/x-www-form-urlencoded' });
}

/**
 * Unfollow a user.
 *
 * @param {Object} http
 * @param {string} userId - Numeric user ID
 * @returns {Promise<void>}
 */
export async function unfollowUser(http, userId) {
  const endpoint = GRAPHQL_ENDPOINTS.DestroyFollow;
  const url = endpoint.url();
  const body = new URLSearchParams({
    include_profile_interstitial_type: '1',
    include_blocking: '1',
    include_blocked_by: '1',
    include_followed_by: '1',
    include_want_retweets: '1',
    include_mute_edge: '1',
    include_can_dm: '1',
    include_can_media_tag: '1',
    include_ext_is_blue_verified: '1',
    include_ext_verified_type: '1',
    include_ext_profile_image_shape: '1',
    skip_status: '1',
    user_id: userId,
  });
  await http.post(url, body, { contentType: 'application/x-www-form-urlencoded' });
}

/**
 * List the accounts this user has blocked.
 *
 * Local patch 2026-11-06 (hero #15, v2.0.0): BlockedAccountsAll is a
 * timeline-shaped query; the blocked users sit in nested timeline entries,
 * so the parser walks the whole response collecting user legacy objects
 * (screen_name + id_str). Query ID verified live 2026-11-06 — the discovery
 * cache held a stale ID (vSD6QsvM22S5…) that 404s; the live ID
 * XDSJN_rGtdlynilYFJLYOw comes from the engine's generated endpoint table
 * and the cache entry was corrected to match.
 *
 * @param {Object} http
 * @param {number} [count=20]
 * @returns {Promise<Array<{id: string, screenName: string, name: string}>>}
 */
export async function getBlockedUsers(http, count = 20) {
  const endpoint = GRAPHQL_ENDPOINTS.BlockedAccountsAll;
  const url = endpoint.url(endpoint.queryId);
  const data = await http.post(url, {
    variables: { count, cursor: null, includePromotedContent: false },
    features: DEFAULT_FEATURES,
  });
  const seen = new Set();
  const users = [];
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    // New-style user object: result.core { name, screen_name, created_at },
    // id in result.rest_id. Old-style: result.legacy { screen_name, id_str }.
    const core = node.core;
    if (core && typeof core.screen_name === 'string') {
      const id = node.rest_id || node.id || node.legacy?.id_str || '';
      const key = id || core.screen_name;
      if (!seen.has(key)) {
        seen.add(key);
        users.push({ id: String(id), screenName: core.screen_name, name: core.name || '' });
      }
    } else {
      const legacy = node.legacy;
      if (legacy && typeof legacy.screen_name === 'string' && legacy.id_str) {
        const key = legacy.id_str;
        if (!seen.has(key)) {
          seen.add(key);
          users.push({ id: legacy.id_str, screenName: legacy.screen_name, name: legacy.name || '' });
        }
      }
    }
    for (const value of Object.values(node)) walk(value);
  };
  walk(data);
  return users.slice(0, count);
}
