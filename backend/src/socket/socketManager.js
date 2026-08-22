/**
 * socketManager.js
 * Manages active WebSocket connections to allow broadcasting and direct messaging.
 */

class SocketManager {
    constructor() {
        this.clients = new Map();
        this.rooms = new Map();
    }

    addClient(clientId, ws) {
        this.clients.set(clientId, ws);
    }

    removeClient(clientId) {
        this.clients.delete(clientId);
        const removedFromRooms = [];
        for (const [roomId, clients] of this.rooms.entries()) {
            if (clients.has(clientId)) {
                clients.delete(clientId);
                removedFromRooms.push(roomId);
                if (clients.size === 0) {
                    this.rooms.delete(roomId);
                }
            }
        }
        return removedFromRooms;
    }

    getRoomMembers(roomId) {
        const room = this.rooms.get(roomId);
        return room ? Array.from(room) : [];
    }

    sendToClient(clientId, message) {
        const ws = this.clients.get(clientId);
        if (ws && ws.readyState === 1) {
            ws.send(JSON.stringify(message));
        }
    }

    broadcast(message) {
        const messageString = JSON.stringify(message);
        for (const [clientId, ws] of this.clients.entries()) {
            if (ws.readyState === 1) {
                ws.send(messageString);
            }
        }
    }

    joinRoom(clientId, roomId) {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Set());
        }
        this.rooms.get(roomId).add(clientId);
    }

    leaveRoom(clientId, roomId) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.delete(clientId);
            if (room.size === 0) {
                this.rooms.delete(roomId);
            }
        }
    }

    broadcastToRoom(roomId, message, excludeClientId = null) {
        const room = this.rooms.get(roomId);
        if (!room) return;

        const messageString = JSON.stringify(message);
        for (const clientId of room) {
            if (clientId !== excludeClientId) {
                const ws = this.clients.get(clientId);
                if (ws && ws.readyState === 1) {
                    ws.send(messageString);
                }
            }
        }
    }
}

// Export a singleton instance
export const socketManager = new SocketManager();
