import IORedis from "ioredis";

const redis = new IORedis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
});

redis.on("connect", () => {
    console.log("Redis connected successfully!");
});

redis.on("error", (err) => {
    console.error("App redis error:", err);
});

export default redis;