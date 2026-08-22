import http from "http";
import app from "./app.js";
import env from "./config/env.config.js";
import connectDb, { disconnectDb } from "./lib/connectDb.js";
import { connectRabbitMQ, disconnectRabbitMQ } from "./lib/rabbitmq.js";
import { initWebSocketServer, closeWebSocketServer } from "./socket/index.js";
import logger from "./lib/logger.js";

let server;

const startServer = async () => {
    try {
        await connectRabbitMQ();
        await connectDb();

        server = http.createServer(app);

        server.on("error", (error) => {
            if (error.code === "EADDRINUSE") {
                logger.error(`Port ${env.PORT} is already in use`);
            } else {
                logger.error("Server error:", error);
            }
            process.exit(1);
        });

        server.listen(env.PORT, "0.0.0.0", () => {
            logger.info(`SERVER IS RUNNING ON PORT:${env.PORT}`);
        });

        initWebSocketServer(server);
    } catch (error) {
        logger.error("Failed to start server:", error);
        process.exit(1);
    }
};

const shutdown = async (signal) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    const forceExit = setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
    }, 10000); // hard cap so it can't hang forever

    try {
        if (server) {
            await new Promise((resolve, reject) => {
                server.close((err) => (err ? reject(err) : resolve()));
            });
            logger.info("HTTP server closed");
        }

        await closeWebSocketServer();
        await disconnectRabbitMQ();
        await disconnectDb();

        clearTimeout(forceExit);
        logger.info("Graceful shutdown complete");
        process.exit(0);
    } catch (error) {
        logger.error("Error during shutdown:", error);
        clearTimeout(forceExit);
        process.exit(1);
    }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Rejection:", reason);
    // don't exit immediately in prod — log, alert, and let it keep running
    // unless you're confident the process is in a corrupted state
});

process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception:", error);
    // this one IS unsafe to continue from — shut down cleanly
    shutdown("uncaughtException");
});

startServer();