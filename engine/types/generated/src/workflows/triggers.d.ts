export default triggerManager;
export class TriggerManager extends EventEmitter<any> {
    constructor();
    _scheduledJobs: Map<any, any>;
    _webhookHandlers: Map<any, any>;
    _eventWatchers: Map<any, any>;
    _queue: any;
    /**
     * Set the Bull queue to use for scheduled triggers
     */
    setQueue(queue: any): void;
    /**
     * Register a trigger for a workflow
     * @param {string} workflowId
     * @param {object} trigger - { type, cron?, interval?, webhook?, event?, ... }
     */
    register(workflowId: string, trigger: object): Promise<{
        type: string;
        workflowId: any;
        cron: any;
    } | {
        type: string;
        workflowId: any;
        interval: any;
    } | {
        type: string;
        workflowId: any;
        webhookId: any;
        url: string;
    } | {
        type: string;
        workflowId: any;
        event: any;
    } | {
        type: string;
        workflowId: string;
    }>;
    /**
     * Unregister all triggers for a workflow
     */
    unregister(workflowId: any): Promise<void>;
    /**
     * Handle incoming webhook
     */
    handleWebhook(webhookId: any, payload: any): boolean;
    /**
     * Get all registered triggers
     */
    getRegisteredTriggers(): ({
        workflowId: any;
        type: any;
        config: any;
        webhookId?: undefined;
    } | {
        workflowId: any;
        type: string;
        webhookId: any;
        config?: undefined;
    })[];
    _registerSchedule(workflowId: any, trigger: any): Promise<{
        type: string;
        workflowId: any;
        cron: any;
    }>;
    _registerInterval(workflowId: any, trigger: any): Promise<{
        type: string;
        workflowId: any;
        interval: any;
    }>;
    _registerWebhook(workflowId: any, trigger: any): Promise<{
        type: string;
        workflowId: any;
        webhookId: any;
        url: string;
    }>;
    _registerEvent(workflowId: any, trigger: any): Promise<{
        type: string;
        workflowId: any;
        event: any;
    }>;
    /**
     * Cleanup all triggers
     */
    shutdown(): Promise<void>;
}
declare const triggerManager: TriggerManager;
import { EventEmitter } from 'events';
