#!/usr/bin/env node
export type AgentConfig = {
    niche: {
        name: string;
        searchTerms: string[];
        influencers: string[];
        keywords: string[];
    };
    persona: {
        name: string;
        handle: string;
        tone: string;
        expertise: string[];
        opinions: string[];
        avoid: string[];
        exampleTweets?: string[];
    };
    llm: {
        provider: string;
        apiKey: string;
        models: {
            fast: string;
            mid: string;
            smart: string;
        };
    };
    schedule: {
        timezone: string;
        sleepHours: [number, number];
    };
    limits: {
        dailyLikes: number;
        dailyFollows: number;
        dailyComments: number;
        dailyPosts: number;
    };
    browser: {
        headless: boolean;
        sessionPath: string;
        proxy?: string;
    };
};
/**
 * The main 24/7 orchestrator for the Thought Leader Agent.
 */
export class ThoughtLeaderAgent {
    /**
     * Load configuration from a JSON file.
     * @param {string} [configPath]
     * @returns {AgentConfig}
     */
    static loadConfig(configPath?: string): AgentConfig;
    /**
     * @param {AgentConfig} config
     */
    constructor(config: AgentConfig);
    config: AgentConfig;
    running: boolean;
    _startedAt: Date;
    _lastSessionSave: number;
    browser: BrowserDriver;
    llm: LLMBrain;
    scheduler: Scheduler;
    db: AgentDatabase;
    persona: Persona;
    calendar: ContentCalendar;
    network: EngagementNetwork;
    limits: {
        dailyLikes: number;
        dailyFollows: number;
        dailyComments: number;
        dailyPosts: number;
    };
    /**
     * Start the agent's main loop.
     */
    start(): Promise<void>;
    /**
     * Gracefully stop the agent.
     */
    stop(): Promise<void>;
    /**
     * Get current agent status.
     * @returns {Object}
     */
    getStatus(): any;
    _executeActivity(activity: any): Promise<void>;
    /**
     * Search for niche content and engage with relevant tweets.
     */
    _searchAndEngage(query: any, tab?: string): Promise<void>;
    /**
     * Browse the home feed and engage with relevant content.
     */
    _browseHomeFeed(): Promise<void>;
    /**
     * Visit an influencer's profile and engage with their content.
     */
    _visitInfluencer(username: any): Promise<void>;
    /**
     * Generate and post original content.
     */
    _createContent(): Promise<void>;
    /**
     * Check own tweet replies and engage back.
     */
    _engageWithReplies(): Promise<void>;
    /**
     * Browse the Explore page for trends and random discovery.
     */
    _browseExplore(): Promise<void>;
    /**
     * Visit own profile briefly (meta-signal).
     */
    _visitOwnProfile(): Promise<void>;
    /**
     * Search for people in the niche and follow qualifying users.
     */
    _searchAndFollow(query: any): Promise<void>;
    _canDo(type: any): boolean;
    _checkLimits(): boolean;
    _handleError(err: any): Promise<void>;
    /**
     * Sleep that can be interrupted by stopping the agent.
     */
    _interruptibleSleep(ms: any): Promise<void>;
}
import { BrowserDriver } from './browserDriver.js';
import { LLMBrain } from './llmBrain.js';
import { Scheduler } from './scheduler.js';
import { AgentDatabase } from './database.js';
import { Persona } from './persona.js';
import { ContentCalendar } from './contentCalendar.js';
import { EngagementNetwork } from './engagementNetwork.js';
