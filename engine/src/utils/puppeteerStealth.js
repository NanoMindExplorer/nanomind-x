// Copyright (c) 2024-2026 nich (@nichxbt). Licensed under the Apache License, Version 2.0.
/**
 * nanomind-x — Stealth Puppeteer loader
 *
 * Puppeteer plus its stealth plugin is the heaviest thing nanomind-x can touch:
 * the package pulls a ~180 MB Chromium download on install. It is an optional
 * extra, so every browser-backed module resolves it here, on first launch,
 * instead of at import time. Importing `nanomind-x` therefore costs nothing for
 * the many users who only ever touch the browserless client.
 *
 * The stealth plugin is registered exactly once per process, no matter how many
 * modules ask for the instance.
 *
 * @author nich (@nichxbt) - https://github.com/nirholas
 * @see https://github.com/NanoMindExplorer/nanomind-x
 * @license Apache-2.0
 */

import { importOptional } from './optionalDeps.js';

/** Resolved, stealth-enabled puppeteer-extra instance. */
let instance = null;
/** In-flight load, so concurrent launches share one import. */
let pending = null;

const INSTALL = 'puppeteer puppeteer-extra puppeteer-extra-plugin-stealth';
const ALTERNATIVE = 'Scrape without a browser: import { Scraper } from "nanomind-x/client"';

/**
 * Load puppeteer-extra with the stealth plugin applied.
 *
 * @param {object} [options]
 * @param {string} [options.feature] - Feature name used in the install hint.
 * @returns {Promise<any>} The stealth-enabled puppeteer-extra instance.
 * @throws {import('./optionalDeps.js').MissingOptionalDependencyError} When the extra is absent.
 */
export async function getStealthPuppeteer(options = {}) {
  if (instance) return instance;
  if (pending) return pending;

  const feature = options.feature || 'Browser automation';
  pending = (async () => {
    const loaded = await importOptional('puppeteer-extra', {
      feature,
      install: INSTALL,
      alternative: ALTERNATIVE,
    });
    // Local fix 2026-11-05 (hero): importOptional returns the ESM namespace
    // for puppeteer-extra (it has named keys), so .use lives on .default.
    const puppeteer = typeof loaded.use === 'function' ? loaded : loaded.default;
    const StealthPlugin = await importOptional('puppeteer-extra-plugin-stealth', {
      feature,
      install: INSTALL,
      alternative: ALTERNATIVE,
    });
    puppeteer.use(StealthPlugin());
    instance = puppeteer;
    return instance;
  })();

  try {
    return await pending;
  } finally {
    pending = null;
  }
}

/**
 * Load plain puppeteer, for the few call sites that need the driver itself
 * (browser pools, connect-over-CDP) rather than the stealth wrapper.
 *
 * @param {object} [options]
 * @param {string} [options.feature]
 * @returns {Promise<any>}
 */
export async function getPuppeteer(options = {}) {
  return importOptional('puppeteer', {
    feature: options.feature || 'Browser automation',
    install: INSTALL,
    alternative: ALTERNATIVE,
  });
}
