import env from "../config/env.config.js";

const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.log(err);
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        ...(env.NODE_ENV === "development" && {
            stack: err.stack
        })
    });
};

export default errorMiddleware;