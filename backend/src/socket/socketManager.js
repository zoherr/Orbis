/**
 * socketManager.js
 * Manages active WebSocket connections to allow broadcasting and direct messaging.
 */

class SocketManager {
    constructor() {
        // Map to store connected clients. 
        // Example: Key could be userId, Value could be the WebSocket instance.
        this.clients = new Map();
    }

    /**
     * Add a new connection
     * @param {string} clientId - Unique identifier for the client (e.g., userId)
     * @param {WebSocket} ws - The WebSocket connection instance
     */
    addClient(clientId, ws) {
        this.clients.set(clientId, ws);
    }

    /**
     * Remove a connection
     * @param {string} clientId - Unique identifier for the client
     */
    removeClient(clientId) {
        this.clients.delete(clientId);
    }

    /**
     * Send a message to a specific client
     * @param {string} clientId - Unique identifier for the client
     * @param {object} message - The message object to send
     */
    sendToClient(clientId, message) {
        const ws = this.clients.get(clientId);
        if (ws && ws.readyState === 1) { // 1 means OPEN
            ws.send(JSON.stringify(message));
        }
    }

    /**
     * Broadcast a message to all connected clients
     * @param {object} message - The message object to broadcast
     */
    broadcast(message) {
        const messageString = JSON.stringify(message);
        for (const [clientId, ws] of this.clients.entries()) {
            if (ws.readyState === 1) { // 1 means OPEN
                ws.send(messageString);
            }
        }
    }
}

// Export a singleton instance
export const socketManager = new SocketManager();
