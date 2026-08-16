import jwt from "jsonwebtoken";
import env from "../config/env.config.js";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export const signToken = (payload, options = {}) => {
    return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, env.JWT_SECRET);
    } catch {
        return null;
    }
};

export const signAccessToken = (payload) => {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
};

export const signRefreshToken = (payload) => {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
};

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, env.JWT_SECRET);
    } catch {
        return null;
    }
};

export const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, env.JWT_REFRESH_SECRET);
    } catch {
        return null;
    }
};