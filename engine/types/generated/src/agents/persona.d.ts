export type PersonaConfig = {
    name: string;
    handle?: string;
    niche?: string;
    tone: string;
    expertise: string[];
    opinions: string[];
    avoid: string[];
    exampleTweets?: string[];
    replyStyles?: {
        question?: number;
        agreement?: number;
        insight?: number;
        humor?: number;
        pushback?: number;
    };
};
/**
 * @typedef {Object} PersonaConfig
 * @property {string} name
 * @property {string} [handle]
 * @property {string} [niche]
 * @property {string} tone
 * @property {string[]} expertise
 * @property {string[]} opinions
 * @property {string[]} avoid
 * @property {string[]} [exampleTweets]
 * @property {{ question?: number, agreement?: number, insight?: number, humor?: number, pushback?: number }} [replyStyles]
 */
/**
 * Persona manager — provides persona context to LLM calls and validates content.
 */
export class Persona {
    /**
     * @param {PersonaConfig} config
     */
    constructor(config: PersonaConfig);
    name: string;
    handle: string;
    niche: string;
    tone: string;
    expertise: string[];
    opinions: string[];
    avoid: string[];
    exampleTweets: string[];
    replyStyles: {
        question: number;
        agreement: number;
        insight: number;
        humor: number;
        pushback: number;
    };
    /** @type {Array<{ text: string, metrics?: Object, addedAt: string }>} */
    _voiceExamples: Array<{
        text: string;
        metrics?: any;
        addedAt: string;
    }>;
    /**
     * Get persona description formatted for LLM system prompts.
     * @returns {string}
     */
    getContext(): string;
    /**
     * Get recent example posts for style reference.
     * @param {number} [n=5]
     * @returns {string[]}
     */
    getExamplePosts(n?: number): string[];
    /**
     * Add a successful post as a voice example.
     * @param {string} text
     * @param {{ likes?: number, impressions?: number, replies?: number }} [metrics]
     */
    addExample(text: string, metrics?: {
        likes?: number;
        impressions?: number;
        replies?: number;
    }): void;
    /**
     * Validate content against persona rules.
     * @param {string} text
     * @returns {{ valid: boolean, issues: string[] }}
     */
    validateContent(text: string): {
        valid: boolean;
        issues: string[];
    };
    /**
     * Get a random comment style weighted by persona's reply style distribution.
     * @returns {'question'|'agreement'|'insight'|'humor'|'pushback'}
     */
    getRandomCommentStyle(): "question" | "agreement" | "insight" | "humor" | "pushback";
    /**
     * Export persona config for serialization.
     * @returns {PersonaConfig}
     */
    toJSON(): PersonaConfig;
}
