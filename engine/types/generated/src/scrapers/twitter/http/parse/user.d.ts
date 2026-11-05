/**
 * Transform Twitter's raw GraphQL user object into the clean nanomind-x
 * profile format.
 *
 * This is a **pure function** — it performs no I/O and has no side effects.
 *
 * @param {object} rawUser — The `data.user.result` (or equivalent) object
 *   from a Twitter GraphQL response.
 * @returns {object} Normalised nanomind-x profile object.
 * @throws {NotFoundError} If the user is unavailable (suspended / deactivated).
 */
export function parseUserData(rawUser: object): object;
