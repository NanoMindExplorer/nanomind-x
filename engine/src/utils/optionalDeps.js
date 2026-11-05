// Copyright (c) 2024-2026 nich (@nichxbt). Licensed under the Apache License, Version 2.0.
/**
 * nanomind-x — Optional dependency loader
 *
 * `npm install nanomind-x` ships a small core: the HTTP client, the CLI, the MCP
 * server and the browser-script catalog. Everything that would drag a browser
 * binary, a native addon or a whole server stack into every install is declared
 * as an OPTIONAL peer dependency and loaded here, on first use.
 *
 * The contract is that a missing extra never surfaces as a raw
 * `ERR_MODULE_NOT_FOUND`. It surfaces as one line telling the caller which
 * feature they reached, which package it needs, and the command to install it.
 *
 * Usage:
 *   // async call sites (ESM or CJS packages)
 *   const puppeteer = await importOptional('puppeteer-extra', {
 *     feature: 'Browser scraping',
 *     install: 'puppeteer puppeteer-extra puppeteer-extra-plugin-stealth',
 *     alternative: 'Use the browserless client instead: import { Scraper } from "nanomind-x/client"',
 *   });
 *
 *   // synchronous call sites (CommonJS packages only)
 *   const Database = requireOptional('better-sqlite3', { feature: 'Local history' });
 *
 * @author nich (@nichxbt) - https://github.com/nirholas
 * @see https://github.com/NanoMindExplorer/nanomind-x
 * @license Apache-2.0
 */

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/** Module cache, so repeat calls never re-pay the resolution cost. */
const cache = new Map();

/** Node's "this package is not installed" signals, across ESM and CJS loaders. */
const MISSING_CODES = new Set(['ERR_MODULE_NOT_FOUND', 'MODULE_NOT_FOUND', 'ERR_DLOPEN_FAILED']);

/**
 * True when the failure is "the package is absent", not "the package threw".
 *
 * A dependency that exists but crashes on load must keep its own stack: hiding
 * that behind an install hint sends the caller to reinstall something that is
 * already there.
 *
 * @param {unknown} err
 * @param {string} name - The package that was requested.
 * @returns {boolean}
 */
function isMissingModule(err, name) {
  if (!err || typeof err !== 'object') return false;
  const code = /** @type {{ code?: string }} */ (err).code;
  if (!code || !MISSING_CODES.has(code)) return false;
  // Node names the unresolved specifier in the message. When the failing
  // specifier is a DIFFERENT package, the extra is installed and broken.
  const message = String(/** @type {{ message?: string }} */ (err).message || '');
  return message.includes(name);
}

/**
 * Build the one-line, actionable message for a missing extra.
 *
 * @param {string} name
 * @param {OptionalDepOptions} [options]
 * @returns {string}
 */
function missingMessage(name, options = {}) {
  const { feature, install, alternative } = options;
  const what = feature ? `${feature} needs` : 'This feature needs';
  const command = `npm install ${install || name}`;
  const lines = [
    `nanomind-x: ${what} the optional package "${name}", which is not installed.`,
    `  Install it:  ${command}`,
  ];
  if (alternative) lines.push(`  Or:          ${alternative}`);
  lines.push('  Optional extras are listed at https://github.com/NanoMindExplorer/nanomind-x/docs/install');
  return lines.join('\n');
}

/**
 * Load an optional package asynchronously.
 *
 * @param {string} name - Package specifier, e.g. 'puppeteer-extra'.
 * @param {OptionalDepOptions} [options]
 * @returns {Promise<any>} The module namespace, with a CJS default unwrapped.
 * @throws {MissingOptionalDependencyError} When the package is not installed.
 */
export async function importOptional(name, options = {}) {
  if (cache.has(name)) return cache.get(name);
  let mod;
  try {
    mod = await import(name);
  } catch (err) {
    if (isMissingModule(err, name)) throw new MissingOptionalDependencyError(name, options);
    throw err;
  }
  const resolved = unwrap(mod);
  cache.set(name, resolved);
  return resolved;
}

/**
 * Load an optional CommonJS package synchronously.
 *
 * Only for call sites that cannot be async (class constructors, sync factory
 * functions). ESM-only packages must use {@link importOptional}.
 *
 * @param {string} name - Package specifier, e.g. 'better-sqlite3'.
 * @param {OptionalDepOptions} [options]
 * @returns {any} The module's export, with a CJS default unwrapped.
 * @throws {MissingOptionalDependencyError} When the package is not installed.
 */
export function requireOptional(name, options = {}) {
  if (cache.has(name)) return cache.get(name);
  let mod;
  try {
    mod = require(name);
  } catch (err) {
    if (isMissingModule(err, name)) throw new MissingOptionalDependencyError(name, options);
    throw err;
  }
  const resolved = unwrap(mod);
  cache.set(name, resolved);
  return resolved;
}

/**
 * Report whether an optional package can be resolved, without loading it.
 *
 * Lets callers branch on capability (the CLI prints which extras are present)
 * instead of catching an error to find out.
 *
 * @param {string} name
 * @returns {boolean}
 */
export function hasOptional(name) {
  try {
    require.resolve(name);
    return true;
  } catch {
    return false;
  }
}

/**
 * Unwrap the interop default that Node synthesises for CommonJS packages,
 * while leaving real ESM namespaces alone.
 *
 * @param {any} mod
 * @returns {any}
 */
function unwrap(mod) {
  if (mod && typeof mod === 'object' && 'default' in mod) {
    const inner = mod.default;
    // A CJS module.exports that is a function or class arrives as `default`
    // with the named keys copied alongside it. An ESM module with a real
    // default export keeps both, so only collapse when there is nothing else.
    if (typeof inner === 'function') return inner;
    const named = Object.keys(mod).filter((key) => key !== 'default' && key !== '__esModule');
    if (named.length === 0 && inner != null) return inner;
  }
  return mod;
}

/**
 * Thrown when an optional extra is requested but absent. Carries the package
 * name and install command as fields so a UI can render them itself.
 */
export class MissingOptionalDependencyError extends Error {
  /**
   * @param {string} name
   * @param {OptionalDepOptions} [options]
   */
  constructor(name, options = {}) {
    super(missingMessage(name, options));
    this.name = 'MissingOptionalDependencyError';
    this.code = 'NANOMIND_X_MISSING_OPTIONAL_DEPENDENCY';
    /** @type {string} */
    this.dependency = name;
    /** @type {string} */
    this.installCommand = `npm install ${options.install || name}`;
    /** @type {string|undefined} */
    this.feature = options.feature;
  }
}

/**
 * @typedef {object} OptionalDepOptions
 * @property {string} [feature] - Human name of the feature that needs the package.
 * @property {string} [install] - Full install argument list, when one package is not enough.
 * @property {string} [alternative] - A path that works without installing anything.
 */
