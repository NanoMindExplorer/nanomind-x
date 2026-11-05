/**
 * Where one feed's progress file lives.
 *
 * @param {string} configDir - Usually ~/.nanomind-x
 * @param {string} stateKey - From resolveSource().stateKey, e.g. "profile-nasa"
 * @returns {string}
 */
export function statePath(configDir: string, stateKey: string): string;
/**
 * Open (or create) the progress record for one feed.
 *
 * @param {object} [opts]
 * @param {string} [opts.configDir] - Defaults to ~/.nanomind-x
 * @param {string} opts.stateKey - From resolveSource().stateKey
 * @param {boolean} [opts.enabled=true] - False makes every method a no-op, for --no-resume
 * @param {boolean} [opts.reset=false] - Forget what was recorded before
 * @returns {Promise<{ file: string, done: Record<string, object>, priorCount: number, save: Function, clear: Function }>}
 */
export function createEngageState({ configDir, stateKey, enabled, reset }?: {
    configDir?: string;
    stateKey: string;
    enabled?: boolean;
    reset?: boolean;
}): Promise<{
    file: string;
    done: Record<string, object>;
    priorCount: number;
    save: Function;
    clear: Function;
}>;
/** Default home for sweep state, matching the CLI's config directory. */
export const DEFAULT_CONFIG_DIR: string;
