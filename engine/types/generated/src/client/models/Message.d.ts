/**
 * nanomind-x Client — Message Data Model
 *
 * Represents a direct message from Twitter's DM API.
 *
 * @author nich (@nichxbt) - https://github.com/nirholas
 * @license Apache-2.0
 */
/**
 * Represents a single direct message.
 */
export class Message {
    /**
     * Create a Message from a raw Twitter DM API entry.
     *
     * @param {Object} raw - Raw DM message object
     * @param {string} [conversationId=''] - Conversation ID context
     * @returns {Message|null} Parsed message, or null if unparseable
     */
    static fromRaw(raw: any, conversationId?: string): Message | null;
    /** @type {string} */
    id: string;
    /** @type {string} */
    text: string;
    /** @type {string} */
    senderId: string;
    /** @type {string} */
    recipientId: string;
    /** @type {Date|null} */
    createdAt: Date | null;
    /** @type {string[]} */
    mediaUrls: string[];
    /** @type {string} */
    conversationId: string;
    /**
     * JSON-serializable representation.
     * @returns {Object}
     */
    toJSON(): any;
}
