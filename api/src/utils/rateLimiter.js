import { rateLimit, ipKeyGenerator } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redis from "../lib/redis.js";

export const createRateLimiter = ({
    windowMs,
    max,
    message = "Too many requests. Please try again later.",
}) => {
    return rateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,

        keyGenerator: (req) => {
            return `${ipKeyGenerator(req.ip)}:${req.path}`;
        },

        store: new RedisStore({
            prefix: "rate-limit:",
            sendCommand: (command, ...args) => {
                return redis.call(command, ...args);
            },
        }),

        handler: (req, res) => {
            res.status(429).json({
                success: false,
                message,
            });
        },
    });
};