/**
 * Sync followers/following into CRM
 */
export function syncFollowers(username: any): Promise<{
    error: any;
    synced?: undefined;
    followers?: undefined;
    following?: undefined;
} | {
    synced: number;
    followers: number;
    following: number;
    error?: undefined;
}>;
/**
 * Tag a contact
 */
export function tagContact(username: any, tagName: any): {
    error: string;
    username?: undefined;
    tag?: undefined;
    status?: undefined;
} | {
    username: any;
    tag: any;
    status: string;
    error?: undefined;
};
/**
 * Remove tag from contact
 */
export function untagContact(username: any, tagName: any): {
    error: string;
    username?: undefined;
    tag?: undefined;
    status?: undefined;
} | {
    username: any;
    tag: any;
    status: string;
    error?: undefined;
};
/**
 * Add note to contact
 */
export function addNote(username: any, note: any): {
    error: string;
    username?: undefined;
    note?: undefined;
    status?: undefined;
} | {
    username: any;
    note: any;
    status: string;
    error?: undefined;
};
/**
 * Manually set contact score
 */
export function scoreContact(username: any, score: any): {
    username: any;
    score: any;
};
/**
 * Auto-score contact based on heuristics
 */
export function autoScore(username: any): {
    error: string;
    username?: undefined;
    score?: undefined;
    breakdown?: undefined;
} | {
    username: any;
    score: number;
    breakdown: {
        followerScore: number;
        tweetScore: number;
    };
    error?: undefined;
};
/**
 * Full-text search across contacts
 */
export function searchContacts(query: any): any;
/**
 * Rich filter contacts
 */
export function filterContacts(filters?: {}): any;
/**
 * Create a saved segment
 */
export function createSegment(name: any, filters: any): {
    name: any;
    filters: any;
    status: string;
};
/**
 * Run a saved segment
 */
export function getSegment(name: any): {
    error: string;
    name?: undefined;
    filters?: undefined;
    contacts?: undefined;
    count?: undefined;
} | {
    name: any;
    filters: any;
    contacts: any;
    count: any;
    error?: undefined;
};
/**
 * List all segments
 */
export function listSegments(): any;
/**
 * Bulk tag contacts
 */
export function bulkTag(filterOrUsernames: any, tagName: any): {
    tag: any;
    tagged: number;
};
/**
 * Get contact timeline
 */
export function getContactTimeline(username: any): {
    error: string;
    contact?: undefined;
    notes?: undefined;
    tags?: undefined;
} | {
    contact: any;
    notes: any;
    tags: any;
    error?: undefined;
};
/**
 * Export segment to JSON/CSV
 */
export function exportSegment(name: any, format?: string): string | {
    error: string;
    name?: undefined;
    filters?: undefined;
    contacts?: undefined;
    count?: undefined;
} | {
    name: any;
    filters: any;
    contacts: any;
    count: any;
    error?: undefined;
};
/**
 * Add auto-tag rule
 */
export function addAutoTagRule(rule: any): {
    status: string;
    rule: any;
};
export const BUILT_IN_RULES: ({
    if: {
        minFollowers: number;
        verified?: undefined;
        isFollower?: undefined;
        isFollowing?: undefined;
    };
    then: {
        tag: string;
    };
} | {
    if: {
        verified: boolean;
        minFollowers?: undefined;
        isFollower?: undefined;
        isFollowing?: undefined;
    };
    then: {
        tag: string;
    };
} | {
    if: {
        isFollower: boolean;
        isFollowing: boolean;
        minFollowers?: undefined;
        verified?: undefined;
    };
    then: {
        tag: string;
    };
})[];
