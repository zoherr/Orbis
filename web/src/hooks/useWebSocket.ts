"use client";

import env from "@/config/env.config";
import { useCallback, useEffect, useRef, useState } from "react";

type WebSocketStatus = "CONNECTING" | "OPEN" | "CLOSING" | "CLOSED";

interface UseWebSocketOptions {
    url: string;
    reconnect?: boolean;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
}

interface UseWebSocketReturn<T> {
    status: WebSocketStatus;
    data: T | null;
    send: (data: unknown) => void;
    disconnect: () => void;
    reconnect: () => void;
}

export function useWebSocket<T = unknown>({
    reconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10,
}: UseWebSocketOptions): UseWebSocketReturn<T> {
    const url = env.NEXT_PUBLIC_WS_URL;
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null
    );
    const reconnectAttemptsRef = useRef(0);
    const manuallyClosedRef = useRef(false);

    const [status, setStatus] = useState<WebSocketStatus>("CLOSED");
    const [data, setData] = useState<T | null>(null);

    const connect = useCallback(() => {
        if (manuallyClosedRef.current) {
            return;
        }

        const existingSocket = socketRef.current;

        if (
            existingSocket &&
            (existingSocket.readyState === WebSocket.OPEN ||
                existingSocket.readyState === WebSocket.CONNECTING)
        ) {
            return;
        }

        setStatus("CONNECTING");

        const socket = new WebSocket(url);

        socketRef.current = socket;

        socket.onopen = () => {
            reconnectAttemptsRef.current = 0;
            setStatus("OPEN");
        };

        socket.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data);
                setData(parsed);
            } catch {
                setData(event.data as T);
            }
        };

        socket.onerror = () => {
            socket.close();
        };

        socket.onclose = () => {
            socketRef.current = null;
            setStatus("CLOSED");

            if (
                reconnect &&
                !manuallyClosedRef.current &&
                reconnectAttemptsRef.current < maxReconnectAttempts
            ) {
                reconnectAttemptsRef.current += 1;

                reconnectTimeoutRef.current = setTimeout(() => {
                    connect();
                }, reconnectInterval);
            }
        };
    }, [
        url,
        reconnect,
        reconnectInterval,
        maxReconnectAttempts,
    ]);

    const send = useCallback((data: unknown) => {
        const socket = socketRef.current;

        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.warn("WebSocket is not connected");
            return;
        }

        socket.send(
            typeof data === "string"
                ? data
                : JSON.stringify(data)
        );
    }, []);

    const disconnect = useCallback(() => {
        manuallyClosedRef.current = true;

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        const socket = socketRef.current;

        if (socket) {
            socket.close();
            socketRef.current = null;
        }

        setStatus("CLOSED");
    }, []);

    const reconnectManually = useCallback(() => {
        manuallyClosedRef.current = false;
        reconnectAttemptsRef.current = 0;

        const socket = socketRef.current;

        if (socket) {
            socket.close();
            socketRef.current = null;
        }

        connect();
    }, [connect]);

    useEffect(() => {
        manuallyClosedRef.current = false;
        connect();

        return () => {
            manuallyClosedRef.current = true;

            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }

            const socket = socketRef.current;

            if (socket) {
                socket.close();
                socketRef.current = null;
            }
        };
    }, [connect]);

    return {
        status,
        data,
        send,
        disconnect,
        reconnect: reconnectManually,
    };
}