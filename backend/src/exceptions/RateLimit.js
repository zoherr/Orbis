class RateLimitException extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 429;
        this.name = "RateLimitException";
    }
}

export default RateLimitException