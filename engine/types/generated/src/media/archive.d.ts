/** sha256 of a buffer, hex. */
export function hashBytes(buffer: any): string;
/**
 * The identity key for one media item: stable across runs and independent of
 * the template, so changing `--filename` does not re-download everything.
 */
export function identityKey(item: any): string;
/**
 * Open (or create) an archive.
 *
 * @param {string|null} path  JSONL file; null disables recording entirely
 * @returns {Promise<{ has: Function, hashPath: Function, record: Function, size: number, hashes: number, path: string|null }>}
 */
export function openArchive(path: string | null): Promise<{
    has: Function;
    hashPath: Function;
    record: Function;
    size: number;
    hashes: number;
    path: string | null;
}>;
/** Filename used when a caller enables the archive without naming one. */
export const DEFAULT_ARCHIVE: ".nanomind-x-archive.jsonl";
