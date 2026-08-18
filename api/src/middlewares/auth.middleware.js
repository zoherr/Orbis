import Unauthorized from "../exceptions/Unauthorized.js";
import { verifyAccessToken } from "../utils/jwt.js";

export const authenticate = async (req, res, next) => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        throw new Unauthorized("User is not authenticated")
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
        throw new Unauthorized("Invalid Access Token")
    }

    req.userId = payload.userId;

    next();
}

export const checkAuth = async (req, res, next) => {
    const accessToken = req.cookies?.accessToken;

    if (accessToken) {
        const payload = verifyAccessToken(accessToken);
        if (payload) {
            req.userId = payload.userId;
        }
    }

    next();
}