/**
 * @typedef {object} Skill
 * @property {string} id - Directory name under skills/
 * @property {string} name - Frontmatter `name`, falling back to the index entry
 * @property {string} description - Frontmatter `description`
 * @property {string|null} version
 * @property {string} dir - Absolute path to the skill directory
 * @property {string} file - Absolute path to SKILL.md
 */
/**
 * Parse the YAML frontmatter of a SKILL.md.
 *
 * The files use a flat `key: value` layout with occasional folded values that
 * continue on indented lines, and a `metadata:` map. That is small enough to
 * read without a YAML dependency, and the parser refuses to guess: a line it
 * does not understand is skipped rather than misread.
 *
 * @param {string} markdown
 * @returns {{data: Record<string, string>, body: string}}
 */
export function parseFrontmatter(markdown: string): {
    data: Record<string, string>;
    body: string;
};
/**
 * Read the catalogue: skills/index.json cross-checked against each SKILL.md.
 *
 * @param {string} [skillsDir=SKILLS_DIR]
 * @returns {Promise<Skill[]>}
 */
export function listSkills(skillsDir?: string): Promise<Skill[]>;
/**
 * Resolve user-supplied names (ids, display names, case-insensitive) to skills.
 *
 * @param {Skill[]} skills
 * @param {string[]} names
 * @returns {{found: Skill[], missing: string[]}}
 */
export function resolveSkills(skills: Skill[], names: string[]): {
    found: Skill[];
    missing: string[];
};
/**
 * Where a skill lands for a target.
 *
 * @param {string} target
 * @param {Skill|{id: string}} skill
 * @param {{global?: boolean, home?: string, cwd?: string}} [options]
 * @returns {{kind: 'dir'|'file', path: string, global: boolean}}
 */
export function destinationFor(target: string, skill: Skill | {
    id: string;
}, { global, home, cwd }?: {
    global?: boolean;
    home?: string;
    cwd?: string;
}): {
    kind: "dir" | "file";
    path: string;
    global: boolean;
};
/**
 * Wrap a SKILL.md for a rules-file target. The body keeps every relative
 * script path it mentions, so the wrapper says where those paths resolve.
 *
 * @param {'cursor'|'windsurf'} target
 * @param {Skill} skill
 * @param {string} markdown - Raw SKILL.md content
 * @returns {string}
 */
export function wrapForTarget(target: "cursor" | "windsurf", skill: Skill, markdown: string): string;
/**
 * Install one skill for one target.
 *
 * @param {string} target
 * @param {Skill} skill
 * @param {{global?: boolean, home?: string, cwd?: string}} [options]
 * @returns {Promise<{skill: string, target: string, path: string, action: 'installed'|'updated'|'unchanged'}>}
 */
export function installSkill(target: string, skill: Skill, options?: {
    global?: boolean;
    home?: string;
    cwd?: string;
}): Promise<{
    skill: string;
    target: string;
    path: string;
    action: "installed" | "updated" | "unchanged";
}>;
/**
 * Remove one skill for one target.
 *
 * @param {string} target
 * @param {Skill|{id: string}} skill
 * @param {{global?: boolean, home?: string, cwd?: string}} [options]
 * @returns {Promise<{skill: string, target: string, path: string, action: 'removed'|'absent'}>}
 */
export function uninstallSkill(target: string, skill: Skill | {
    id: string;
}, options?: {
    global?: boolean;
    home?: string;
    cwd?: string;
}): Promise<{
    skill: string;
    target: string;
    path: string;
    action: "removed" | "absent";
}>;
/**
 * Rewrite the managed block in AGENTS.md so it lists exactly the installed
 * Codex skills. An empty list removes the block; a file that then contains
 * nothing else is deleted.
 *
 * @param {{cwd?: string, home?: string, global?: boolean}} options
 * @returns {Promise<{path: string, action: 'installed'|'updated'|'unchanged'|'removed'|'absent'}>}
 */
export function syncAgentsMd({ cwd, home, global }?: {
    cwd?: string;
    home?: string;
    global?: boolean;
}): Promise<{
    path: string;
    action: "installed" | "updated" | "unchanged" | "removed" | "absent";
}>;
/**
 * Which targets a skill is installed for, on this machine and in this project.
 *
 * @param {Skill|{id: string}} skill
 * @param {{home?: string, cwd?: string}} [options]
 * @returns {Promise<string[]>} e.g. ['claude (global)', 'cursor']
 */
export function installedTargets(skill: Skill | {
    id: string;
}, options?: {
    home?: string;
    cwd?: string;
}): Promise<string[]>;
/**
 * Count installed skills per target, for `nanomind-x doctor`.
 *
 * Only directories and files whose name matches a bundled skill id count, so
 * a user's own Claude skills are not reported as ours.
 *
 * @param {{home?: string, cwd?: string, skillsDir?: string}} [options]
 * @returns {Promise<{claude: number, cursor: number, codex: number, windsurf: number, total: number}>}
 */
export function countInstalledSkills({ home, cwd, skillsDir }?: {
    home?: string;
    cwd?: string;
    skillsDir?: string;
}): Promise<{
    claude: number;
    cursor: number;
    codex: number;
    windsurf: number;
    total: number;
}>;
/**
 * Register the command group.
 * @param {import('commander').Command} program
 */
export function registerSkillsCommand(program: import("commander").Command): void;
/**
 * The bundled skills directory, resolved against this file rather than the
 * working directory so a global `npm install -g nanomind-x` finds it too.
 */
export const SKILLS_DIR: string;
/** Install targets in the order they are listed to the user. */
export const TARGETS: string[];
export type Skill = {
    /**
     * - Directory name under skills/
     */
    id: string;
    /**
     * - Frontmatter `name`, falling back to the index entry
     */
    name: string;
    /**
     * - Frontmatter `description`
     */
    description: string;
    version: string | null;
    /**
     * - Absolute path to the skill directory
     */
    dir: string;
    /**
     * - Absolute path to SKILL.md
     */
    file: string;
};
