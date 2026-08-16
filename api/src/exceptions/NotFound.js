class NotFound extends Error {
    constructor(message = "Resource not found") {
        super(message);
        this.statusCode = 404;
        this.name = "NotFound";
    }
}
export default NotFound;