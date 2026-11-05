/**
 * Get the workflow store instance
 * Uses Prisma if DATABASE_URL is set, otherwise falls back to JSON files
 */
export function getStore(): Promise<any>;
/**
 * Reset store instance (for testing)
 */
export function resetStore(): void;
export class FileStore {
    _initialized: boolean;
    _init(): Promise<void>;
    saveWorkflow(workflow: any): Promise<any>;
    getWorkflow(id: any): Promise<any>;
    listWorkflows(): Promise<{
        id: any;
        name: any;
        description: any;
        trigger: any;
        enabled: boolean;
        stepsCount: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    deleteWorkflow(id: any): Promise<boolean>;
    findWorkflowByName(name: any): Promise<any>;
    saveRun(run: any): Promise<any>;
    getRun(workflowId: any, runId: any): Promise<any>;
    listRuns(workflowId: any, limit?: number): Promise<{
        id: any;
        workflowId: any;
        status: any;
        trigger: any;
        startedAt: any;
        completedAt: any;
        stepsCompleted: any;
        totalSteps: any;
        error: any;
    }[]>;
    updateRun(run: any): Promise<any>;
}
export class PrismaStore {
    constructor(prisma: any);
    _prisma: any;
    saveWorkflow(workflow: any): Promise<any>;
    getWorkflow(id: any): Promise<any>;
    listWorkflows(): Promise<any>;
    deleteWorkflow(id: any): Promise<boolean>;
    findWorkflowByName(name: any): Promise<any>;
    saveRun(run: any): Promise<any>;
    getRun(workflowId: any, runId: any): Promise<any>;
    listRuns(workflowId: any, limit?: number): Promise<any>;
    updateRun(run: any): Promise<any>;
}
