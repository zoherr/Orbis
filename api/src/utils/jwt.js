import jwt from "jsonwebtoken";
import env from "../config/env.config.js";

export function signToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: "7d"
    });
}

export function verifyToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
}
