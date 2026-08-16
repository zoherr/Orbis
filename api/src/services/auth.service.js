import UserModel from "../models/user.model.js";
import redis from "../lib/redis.js";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ejs from "ejs";
import { queueEmail } from "./email.service.js";
import { signToken, verifyToken } from "../utils/jwt.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const checkUserExist = async (email) => {

    const user = await UserModel.findOne({ email: email });
    if (user) {
        return user;
    }
    return false;
}

export const registerUser = async (data) => {

}

export const sendOtp = async (email) => {
    const otp = crypto.randomInt(100000, 1000000).toString();

    const key = `otp:${email}`;

    const activationToken = signToken({ email, otp }, { expiresIn: "10m" });;

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
    if (decoded.email !== email || decoded.otp !== otp) {
        return false;
    }
    return true;
}