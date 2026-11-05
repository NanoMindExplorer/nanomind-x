export type SessionFingerprint = {
    viewport: {
        width: number;
        height: number;
    };
    userAgent: string;
    timezone: string;
    locale: string;
    colorDepth: number;
};
/**
 * Anti-detection module — simulates human behavior for Puppeteer pages.
 */
export class AntiDetection {
    /**
     * Generate a randomized session fingerprint.
     * @returns {SessionFingerprint}
     */
    generateFingerprint(): SessionFingerprint;
    /**
     * Move the mouse along a Bezier curve path from current position to (x, y).
     * @param {import('puppeteer').Page} page
     * @param {number} x - Target X coordinate
     * @param {number} y - Target Y coordinate
     */
    moveMouse(page: import("puppeteer").Page, x: number, y: number): Promise<void>;
    _lastMouseX: number;
    _lastMouseY: number;
    /**
     * Human-like click: hover over element, short pause, then click with variable duration.
     * @param {import('puppeteer').Page} page
     * @param {string} selector - CSS selector to click
     */
    humanClick(page: import("puppeteer").Page, selector: string): Promise<void>;
    /**
     * Human-like typing with variable speed and occasional typos.
     * @param {import('puppeteer').Page} page
     * @param {string} selector - CSS selector of input element
     * @param {string} text - Text to type
     */
    humanType(page: import("puppeteer").Page, selector: string, text: string): Promise<void>;
    /**
     * Human-like scrolling with variable velocity, acceleration, and deceleration phases.
     * @param {import('puppeteer').Page} page
     * @param {number} pixels - Total pixels to scroll (positive = down)
     */
    humanScroll(page: import("puppeteer").Page, pixels: number): Promise<void>;
    /**
     * Add Gaussian jitter to a base duration.
     * @param {number} baseDuration - Base duration in ms
     * @returns {number} Jittered duration (always ≥ baseDuration * 0.3)
     */
    addJitter(baseDuration: number): number;
    /**
     * Simulate reading: random micro-movements during a pause, as if scanning content.
     * @param {import('puppeteer').Page} page
     * @param {number} durationMs - How long to "read" in ms
     */
    simulateReading(page: import("puppeteer").Page, durationMs: number): Promise<void>;
    /**
     * Circadian activity intensity multipliers by hour (0-23).
     * Used by the Scheduler for human-like daily rhythm.
     * @returns {number[]} 24-element array of intensity multipliers (0.0-1.0)
     */
    getCircadianPattern(): number[];
}
