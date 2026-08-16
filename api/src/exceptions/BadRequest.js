class BadRequest extends Error {
    constructor(message = "Bad request") {
        super(message);
        this.statusCode = 400;
        this.name = "BadRequest";
    }
}

export default BadRequest