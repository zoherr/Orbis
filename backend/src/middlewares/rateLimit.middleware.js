import { createRateLimiter } from "../utils/rateLimiter.js";

export const rateLimiter = (windowMs, max) => {
    const limiter = createRateLimiter({
        windowMs,
        max,
    });

    return (req, res, next) => {
        req.rateLimitPrefix = req.path;
        return limiter(req, res, next);
    };
};