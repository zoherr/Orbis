class Unauthorized extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 401;
        this.name = "Unauthorized";
    }
}

export default Unauthorized