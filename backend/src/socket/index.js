/**
 * index.js
 * Main entry point for WebSocket server initialization and event routing.
 */
import { WebSocketServer } from 'ws';
import { socketManager } from './socketManager.js';
import { handleChatMessage } from './handlers/chatHandler.js';
import crypto from 'crypto';

/**
 * Initialize the WebSocket server
 * @param {import('http').Server} server - The HTTP server instance to bind to
 */
export const initWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server });

    console.log('WebSocket server initialized and bound to HTTP server.');

    wss.on('connection', (ws, req) => {
        // Here you would typically authenticate the user using cookies or headers
        // For this example, we generate a random client ID.
        // const userId = authenticateAndGetUserId(req);
        const clientId = crypto.randomUUID(); 

        console.log(`[WebSocket] Client connected: ${clientId}`);
        
        // Register the client in our manager
        socketManager.addClient(clientId, ws);

        // Send a welcome message
        ws.send(JSON.stringify({ type: 'WELCOME', data: { clientId } }));

        // Handle incoming messages
        ws.on('message', (messageAsString) => {
            try {
                const parsedMessage = JSON.parse(messageAsString);
                
                // Simple router based on message type
                switch (parsedMessage.type) {
                    case 'CHAT':
                        handleChatMessage(ws, parsedMessage.payload, clientId);
                        break;
                    case 'PING':
                        ws.send(JSON.stringify({ type: 'PONG', data: { timestamp: new Date() } }));
                        break;
                    default:
                        console.warn(`[WebSocket] Unknown message type: ${parsedMessage.type}`);
                        ws.send(JSON.stringify({ type: 'ERROR', data: 'Unknown message type' }));
                }
            } catch (error) {
                console.error('[WebSocket] Failed to parse message:', error);
                ws.send(JSON.stringify({ type: 'ERROR', data: 'Invalid JSON payload' }));
            }
        });

        // Handle client disconnect
        ws.on('close', () => {
            console.log(`[WebSocket] Client disconnected: ${clientId}`);
            socketManager.removeClient(clientId);
        });
        
        // Handle errors
        ws.on('error', (error) => {
             console.error(`[WebSocket] Error for client ${clientId}:`, error);
        });
    });

    return wss;
};
