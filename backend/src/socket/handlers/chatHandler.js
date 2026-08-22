/**
 * chatHandler.js
 * Handles WebSocket events related to chat functionality.
 */
import { socketManager } from "../socketManager.js";

/**
 * Handle incoming chat messages
 * @param {WebSocket} ws - The WebSocket connection instance of the sender
 * @param {object} payload - The parsed message payload
 * @param {string} clientId - The sender's client ID
 */
export const handleChatMessage = (ws, payload, clientId) => {
    console.log(`[Chat] Received message from ${clientId}:`, payload);
    
    // Example logic: broadcast the message to all connected clients
    // In a real application, you might save this to the database first,
    // or send it only to specific users in a chat room.
    const responseMessage = {
        type: 'CHAT_MESSAGE',
        data: {
            senderId: clientId,
            text: payload.text || '',
            timestamp: new Date().toISOString()
        }
    };

    // Broadcast to everyone (or use socketManager.sendToClient to send to a specific user)
    socketManager.broadcast(responseMessage);
};
