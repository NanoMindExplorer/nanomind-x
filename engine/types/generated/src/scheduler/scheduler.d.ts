export function getScheduler(): any;
export class Scheduler extends EventEmitter<any> {
    constructor();
    jobs: Map<any, any>;
    running: boolean;
    /**
     * Load saved jobs from disk
     */
    load(): Promise<this>;
    /**
     * Add a new scheduled job
     */
    addJob(config: any): {
        name: any;
        cron: any;
        command: any;
        args: any;
        enabled: any;
        maxRetries: any;
        timeout: any;
        createdAt: string;
    };
    /**
     * Remove a job
     */
    removeJob(name: any): {
        error: string;
        status?: undefined;
        name?: undefined;
    } | {
        status: string;
        name: any;
        error?: undefined;
    };
    /**
     * Enable a job
     */
    enableJob(name: any): {
        error: string;
        status?: undefined;
        name?: undefined;
    } | {
        status: string;
        name: any;
        error?: undefined;
    };
    /**
     * Disable a job
     */
    disableJob(name: any): {
        error: string;
        status?: undefined;
        name?: undefined;
    } | {
        status: string;
        name: any;
        error?: undefined;
    };
    /**
     * List all jobs with status
     */
    listJobs(): {
        name: any;
        cron: any;
        command: any;
        enabled: any;
        lastRun: any;
        lastStatus: any;
        createdAt: any;
    }[];
    /**
     * Get job run history
     */
    getJobHistory(name: any, limit?: number): Promise<any[]>;
    /**
     * Run a job immediately
     */
    runJobNow(name: any): Promise<{
        outputPreview: any;
        name: any;
        command: any;
        startTime: string;
        endTime: string;
        duration: string;
        exitCode: any;
        status: string;
        retries: number;
        error?: undefined;
    } | {
        error: string;
    }>;
    /**
     * Start the scheduler daemon
     */
    start(): {
        status: string;
        jobs: number;
    };
    /**
     * Stop the scheduler daemon
     */
    stop(): {
        status: string;
    };
    _registerJob(config: any): void;
    _executeJob(job: any): Promise<{
        error: string;
    } | {
        outputPreview: any;
        name: any;
        command: any;
        startTime: string;
        endTime: string;
        duration: string;
        exitCode: any;
        status: string;
        retries: number;
        error?: undefined;
    }>;
    _runCommand(command: any, args?: any[], timeout?: number): Promise<any>;
    _save(): void;
}
export const JOB_TEMPLATES: {
    name: string;
    cron: string;
    command: string;
    description: string;
}[];
import { EventEmitter } from 'events';
