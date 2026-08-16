import Unauthorized from "../exceptions/Unauthorized.js";
import { verifyAccessToken } from "../utils/jwt.js";

const authenticate = async (req, res, next) => {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
        throw new Unauthorized("Access Token Required")
    }

    const payload = verifyAccessToken(accessToken);

    if (!payload) {
        throw new Unauthorized("Invalid Access Token")
    }

    req.userId = payload.userId;

    next();
}

export default authenticate;