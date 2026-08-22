/**
 * index.js
 * Main entry point for WebSocket server initialization and event routing.
 */
import { WebSocketServer } from 'ws';
import { socketManager } from './socketManager.js';
import { handleChatMessage } from './handlers/chatHandler.js';
import { verifyAccessToken } from '../utils/jwt.js';
import { checkOrbitById } from '../services/orbit.service.js';
import crypto from 'crypto';

let wssInstance;

export const initWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server });
    wssInstance = wss;

    wss.on('connection', (ws, req) => {
        // Parse cookie to extract accessToken
        const cookieHeader = req.headers.cookie;
        let accessToken = null;
        if (cookieHeader) {
            const cookies = cookieHeader.split(';').map(c => c.trim());
            for (const cookie of cookies) {
                if (cookie.startsWith('accessToken=')) {
                    accessToken = cookie.split('=')[1];
                    break;
                }
            }
        }

        if (!accessToken) {
            ws.close(1008, 'Unauthorized: No token provided');
            return;
        }

        const payload = verifyAccessToken(accessToken);
        if (!payload || !payload.userId) {
            ws.close(1008, 'Unauthorized: Invalid token');
            return;
        }

        const clientId = payload.userId; 

        // Enforce single connection per account
        if (socketManager.clients.has(clientId)) {
            console.log(`[WebSocket] Closing existing connection for client ${clientId}`);
            const oldWs = socketManager.clients.get(clientId);
            if (oldWs && oldWs.readyState === 1) {
                // Send a friendly ERROR before closing so frontend knows why
                oldWs.send(JSON.stringify({ type: 'ERROR', data: 'Connected from another session. Disconnected.' }));
                oldWs.close(1008, 'Connected from another session');
            }
            // Ensure old state is cleaned up before adding new connection
            socketManager.removeClient(clientId);
        }
        
        socketManager.addClient(clientId, ws);
        ws.send(JSON.stringify({ type: 'WELCOME', data: { clientId } }));

        ws.on('message', async (messageAsString) => {
            try {
                const parsedMessage = JSON.parse(messageAsString);
                switch (parsedMessage.type) {
                    case 'JOIN_ORBIT':
                        if (parsedMessage.payload && parsedMessage.payload.orbitId) {
                            try {
                                const orbit = await checkOrbitById(parsedMessage.payload.orbitId);
                                if (!orbit) {
                                    ws.send(JSON.stringify({ type: 'ERROR', data: 'Orbit not found' }));
                                    return;
                                }

                                socketManager.joinRoom(clientId, parsedMessage.payload.orbitId);
                                console.log(`[WebSocket] Client ${clientId} joined orbit ${parsedMessage.payload.orbitId}`);
                                
                                // Notify others in the room
                                socketManager.broadcastToRoom(parsedMessage.payload.orbitId, {
                                    type: 'USER_JOINED',
                                    data: { clientId }
                                }, clientId);
                            } catch (err) {
                                console.error('[WebSocket] Error authorizing JOIN_ORBIT:', err);
                                ws.send(JSON.stringify({ type: 'ERROR', data: 'Server error during authorization' }));
                            }
                        }
                        break;
                    case 'LEAVE_ORBIT':
                        if (parsedMessage.payload && parsedMessage.payload.orbitId) {
                            socketManager.leaveRoom(clientId, parsedMessage.payload.orbitId);
                            socketManager.broadcastToRoom(parsedMessage.payload.orbitId, {
                                type: 'USER_LEFT',
                                data: { clientId }
                            });
                        }
                        break;
                    case 'CHAT':
                        handleChatMessage(ws, parsedMessage.payload, clientId);
                        break;
                    case 'WEBRTC_OFFER':
                    case 'WEBRTC_ANSWER':
                    case 'WEBRTC_ICE_CANDIDATE':
                        if (parsedMessage.payload && parsedMessage.payload.targetClientId) {
                            socketManager.sendToClient(parsedMessage.payload.targetClientId, {
                                type: parsedMessage.type,
                                data: {
                                    senderId: clientId,
                                    ...parsedMessage.payload
                                }
                            });
                        }
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
            const leftRooms = socketManager.removeClient(clientId);
            leftRooms.forEach(roomId => {
                socketManager.broadcastToRoom(roomId, {
                    type: 'USER_LEFT',
                    data: { clientId }
                });
            });
        });
        
        // Handle errors
        ws.on('error', (error) => {
             console.error(`[WebSocket] Error for client ${clientId}:`, error);
        });
    });

    return wss;
};

export const closeWebSocketServer = async () => {
    return new Promise((resolve, reject) => {
        if (!wssInstance) {
            return resolve();
        }
        wssInstance.close((err) => {
            if (err) {
                console.error("[WebSocket] server close error:", err);
                return reject(err);
            }
            console.log("[WebSocket] server closed");
            resolve();
        });
    });
};
