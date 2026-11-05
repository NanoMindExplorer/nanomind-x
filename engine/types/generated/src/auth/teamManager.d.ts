/**
 * Check if a user has permission for an action
 */
export function checkPermission(userRole: any, action: any): any;
/**
 * Create a new team
 */
export function createTeam(name: any, ownerUsername: any): Promise<any>;
/**
 * Invite a user to a team
 */
export function inviteUser(teamId: any, email: any, role?: string): Promise<{
    token: string;
    email: any;
    role: string;
    teamId: any;
}>;
/**
 * Accept an invite
 */
export function acceptInvite(token: any, username: any): Promise<{
    error: string;
    teamId?: undefined;
    team?: undefined;
    role?: undefined;
} | {
    teamId: string;
    team: any;
    role: any;
    error?: undefined;
}>;
/**
 * Remove a user from a team
 */
export function removeUser(teamId: any, username: any): Promise<{
    error: string;
    status?: undefined;
    username?: undefined;
} | {
    status: string;
    username: any;
    error?: undefined;
}>;
/**
 * Update a user's role
 */
export function updateRole(teamId: any, username: any, newRole: any): Promise<{
    error: string;
    username?: undefined;
    role?: undefined;
} | {
    username: any;
    role: any;
    error?: undefined;
}>;
/**
 * List team members
 */
export function listTeamMembers(teamId: any): Promise<any>;
export function logActivity(teamId: any, username: any, action: any, target: any): Promise<void>;
export function getActivityLog(teamId: any, filters?: {}): Promise<any>;
export function createUser(username: any, passwordHash: any, email: any): Promise<{
    username: any;
    email: any;
}>;
export function getUser(username: any): Promise<any>;
export function getUserTeams(username: any): Promise<any[]>;
export function getUserRole(teamId: any, username: any): Promise<any>;
