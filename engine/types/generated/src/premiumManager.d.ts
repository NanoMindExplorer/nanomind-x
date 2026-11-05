/**
 * Check a user's Premium tier
 * @param {import('puppeteer').Page} page
 * @param {string} username
 * @returns {Promise<Object>}
 */
export function checkPremiumStatus(page: import("puppeteer").Page, username: string): Promise<any>;
/**
 * Get features available for a tier
 * @param {string} tier - 'free', 'basic', 'premium', 'premium+', 'supergrok'
 * @returns {Object}
 */
export function getTierFeatures(tier: string): any;
/**
 * Compare two tiers
 * @param {string} tier1
 * @param {string} tier2
 * @returns {Object}
 */
export function compareTiers(tier1: string, tier2: string): any;
/**
 * Check revenue sharing eligibility
 * @param {import('puppeteer').Page} page
 * @param {string} username
 * @returns {Promise<Object>}
 */
export function checkRevenueEligibility(page: import("puppeteer").Page, username: string): Promise<any>;
declare namespace _default {
    export { checkPremiumStatus };
    export { getTierFeatures };
    export { compareTiers };
    export { checkRevenueEligibility };
    export { TIER_FEATURES };
    export { SELECTORS };
}
export default _default;
/**
 * Tier feature definitions
 */
declare const TIER_FEATURES: {
    free: {
        tier: string;
        price: string;
        features: {
            postLength: number;
            videoLength: string;
            adReduction: string;
            verification: boolean;
            editPost: boolean;
            scheduling: boolean;
            bookmarkFolders: boolean;
            formatting: boolean;
            revenueShare: boolean;
            articles: boolean;
            radarSearch: boolean;
            grokLevel: string;
            replyBoost: string;
        };
    };
    basic: {
        tier: string;
        price: string;
        features: {
            postLength: number;
            videoLength: string;
            adReduction: string;
            verification: boolean;
            editPost: boolean;
            scheduling: boolean;
            bookmarkFolders: boolean;
            formatting: boolean;
            revenueShare: boolean;
            articles: boolean;
            radarSearch: boolean;
            grokLevel: string;
            replyBoost: string;
        };
    };
    premium: {
        tier: string;
        price: string;
        features: {
            postLength: number;
            videoLength: string;
            adReduction: string;
            verification: boolean;
            editPost: boolean;
            scheduling: boolean;
            bookmarkFolders: boolean;
            formatting: boolean;
            revenueShare: boolean;
            articles: boolean;
            radarSearch: boolean;
            grokLevel: string;
            replyBoost: string;
        };
    };
    'premium+': {
        tier: string;
        price: string;
        features: {
            postLength: number;
            videoLength: string;
            adReduction: string;
            verification: boolean;
            editPost: boolean;
            scheduling: boolean;
            bookmarkFolders: boolean;
            formatting: boolean;
            revenueShare: boolean;
            articles: boolean;
            radarSearch: boolean;
            grokLevel: string;
            replyBoost: string;
        };
    };
    supergrok: {
        tier: string;
        price: string;
        features: {
            unlimited_grok: boolean;
            unlimited_agents: boolean;
            dedicated_apps: string;
            project_org: boolean;
            advanced_ai: boolean;
        };
    };
};
declare namespace SELECTORS {
    let premiumNav: string;
    let verificationBadge: string;
    let subscriptionInfo: string;
    let premiumBanner: string;
}
