import redis from "../lib/redis.js";

export const setRedis = async (key, value, expiry = null) => {
    const data = typeof value === "string" ? value : JSON.stringify(value);

    if (expiry) {
        return await redis.set(key, data, "EX", expiry);
    }

    return await redis.set(key, data);
};

export const getRedis = async (key) => {
    const data = await redis.get(key);

    if (!data) return null;

    try {
        return JSON.parse(data);
    } catch {
        return data;
    }
};

export const deleteRedis = async (key) => {
    return await redis.del(key);
};