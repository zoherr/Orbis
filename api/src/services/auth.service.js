import UserModel from "../models/user.model.js";
import redis from "../lib/redis.js";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ejs from "ejs";
import { queueEmail } from "./email.service.js";
import { signAccessToken, signRefreshToken, signToken, verifyRefreshToken, verifyToken } from "../utils/jwt.js";
import bcrypt from "bcryptjs";
import { deleteRedis, getRedis, setRedis } from "../utils/redis.js";
import BadRequest from "../exceptions/BadRequest.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;

const hashToken = (token) => {
    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};

const createRefreshSession = async (userId) => {
    const sessionId = crypto.randomUUID();

    const refreshToken = signRefreshToken({
        userId: userId.toString(),
        sessionId,
    });

    const tokenHash = hashToken(refreshToken);


    await setRedis(`refresh:${sessionId}`,
        JSON.stringify({
            userId: userId.toString(),
            tokenHash,
        }), REFRESH_TOKEN_TTL)

    return refreshToken;
};

export const getUserById = async (userId) => {
    const user = await UserModel.findById(userId);
    if (user) {
        return user;
    }
    return false;
}

export const checkUserExist = async (email) => {

    const user = await UserModel.findOne({ email: email });
    if (user) {
        return user;
    }
    return false;
}

export const checkUserName = async (username) => {
    const user = await UserModel.findOne({ username: username });
    if (user) {
        return true;
    }
    return false;
}

export const registerUser = async (
    fullName,
    email,
    password,
    username
) => {
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
        fullName,
        email,
        password: hashPassword,
        username,
    });

    const refreshToken = await createRefreshSession(user._id);

    return {
        user,
        refreshToken,
    };
};

export const loginUser = async (
    email,
    password
) => {
    const user = await checkUserExist(email);

    if (!user) {
        throw new BadRequest("User Not Found");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
        throw new BadRequest("Wrong Password");
    }

    const refreshToken = await createRefreshSession(user._id);

    return {
        user,
        refreshToken,
    };
};

export const sendOtp = async (email) => {
    const otp = crypto.randomInt(100000, 1000000).toString();

    const activationToken = signToken({ email, otp }, { expiresIn: "10m" });

    const templatePath = path.join(
        __dirname,
        "../templates/emails/otp-verification.ejs"
    );

    const html = await ejs.renderFile(templatePath, {
        otp,
        email,
        appName: "Orbis",
        domain: "orbis.app",
        expiryMinutes: 10,
        supportEmail: "support@orbis.app"
    });

    await queueEmail({
        to: email,
        subject: "Your Orbis.app verification code",
        html
    });

    return activationToken;
};

export const optVeified = (email, otp, activationToken) => {
    const decoded = verifyToken(activationToken);

    if (!decoded || typeof decoded !== "object") {
        return false;
    }

    if (decoded.email !== email || decoded.otp !== otp.toString()) {
        return false;
    }

    return true;
};

export const refreshUserSession = async (refreshToken) => {
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
        return null;
    }

    const { userId, sessionId } = payload;

    if (!userId || !sessionId) {
        return null;
    }

    const key = `refresh:${sessionId}`;

    const session = await getRedis(key);

    if (!session) {
        return null;
    }

    const parsedSession = session;

    const tokenHash = hashToken(refreshToken);

    if (parsedSession.tokenHash !== tokenHash) {
        await redis.del(key);
        return null;
    }

    const newRefreshToken = await createRefreshSession(userId);

    await deleteRedis(key);

    const accessToken = signAccessToken({
        userId,
    });

    return {
        accessToken,
        refreshToken: newRefreshToken,
    };
};

export const passwordChange = async (userId, oldPassword, newPassword) => {
    const user = await UserModel.findById(userId);
    if (!user) {
        throw new BadRequest("User Not Found");
    }

    const checkPassword = await bcrypt.compare(oldPassword, user.password);

    if (!checkPassword) {
        throw new BadRequest("Wrong Password");
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashPassword;
    await user.save();

}

export const userForgotPassword = async (email, otp, activationToken, newPassword) => {

    const isOtpCorrect = optVeified(
        email,
        otp,
        activationToken
    );

    if (!isOtpCorrect) {
        throw new BadRequest("OTP is Invalid Or Expired")
    }

    const user = await checkUserExist(email);

    if (!user) {
        throw new BadRequest("User Not Found");
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashPassword;

    await user.save();
}

export const invalidateRefreshToken = async (refreshToken) => {
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
        return null;
    }

    const { userId, sessionId } = payload;

    if (!userId || !sessionId) {
        return null;
    }

    const key = `refresh:${sessionId}`;

    const session = await getRedis(key);

    if (!session) {
        return null;
    }

    await deleteRedis(key);

}