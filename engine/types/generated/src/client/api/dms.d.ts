/**
 * Send a DM in an existing conversation.
 *
 * @param {Object} http
 * @param {string} conversationId
 * @param {string} text
 * @returns {Promise<{id: string, text: string, createdAt: string}>}
 */
export function sendDm(http: any, conversationId: string, text: string): Promise<{
    id: string;
    text: string;
    createdAt: string;
}>;
/**
 * Send a DM to a user by their ID (creates a new conversation if needed).
 *
 * @param {Object} http
 * @param {string} userId
 * @param {string} text
 * @returns {Promise<{id: string, text: string, createdAt: string}>}
 */
export function sendDmToUser(http: any, userId: string, text: string): Promise<{
    id: string;
    text: string;
    createdAt: string;
}>;
/**
 * Get DM conversations.
 *
 * @param {Object} http
 * @param {number} [count=50]
 * @returns {AsyncGenerator<{id: string, type: string, participants: string[], lastMessage: string, updatedAt: string}>}
 */
export function getDmConversations(http: any, count?: number): AsyncGenerator<{
    id: string;
    type: string;
    participants: string[];
    lastMessage: string;
    updatedAt: string;
}>;
/**
 * Get messages in a DM conversation.
 *
 * @param {Object} http
 * @param {string} conversationId
 * @param {number} [count=50]
 * @returns {AsyncGenerator<Message>}
 */
export function getDmMessages(http: any, conversationId: string, count?: number): AsyncGenerator<Message>;
import { Message } from '../models/Message.js';
