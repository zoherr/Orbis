import env from "../config/env.config.js";
import {
    checkUserExist,
    checkUserName,
    optVeified,
    registerUser,
    sendOtp,
    refreshUserSession,
} from "../services/auth.service.js";
import { signAccessToken } from "../utils/jwt.js";

export const initiateAuth = async (req, res, next) => {
    try {
        const { email } = req.body;

        const isExist = await checkUserExist(email);

        if (!isExist) {
            const activationToken = await sendOtp(email);

            return res.json({
                success: true,
                message: "OTP Sent Successfully!",
                activationToken,
                isExistingUser: false,
            });
        }

        return res.json({
            success: true,
            message: "User Found Successfully!",
            isExistingUser: true,
        });
    } catch (error) {
        next(error);
    }
};

export const userRegister = async (req, res, next) => {
    try {
        const {
            fullName,
            email,
            password,
            username,
            otp,
            activationToken,
        } = req.body;

        const isOtpCorrect = optVeified(
            email,
            otp,
            activationToken
        );

        if (!isOtpCorrect) {
            return res.status(400).json({
                success: false,
                message: "Wrong OTP!",
            });
        }

        const usernameExists = await checkUserName(username);

        if (usernameExists) {
            return res.status(409).json({
                success: false,
                message: "Username already exists",
            });
        }

        const { user, refreshToken } = await registerUser(
            fullName,
            email,
            password,
            username
        );

        const accessToken = signAccessToken({
            userId: user._id.toString(),
        });

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully!",
            user,
        });
    } catch (error) {
        next(error);
    }
};

export const userLogin = async (req, res, next) => {
    try {
        res.json({
            success: true,
            message: "User Login Successfully!"
        })
    } catch (error) {
        next(error);
    }
}

export const refreshAccessToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token required",
            });
        }

        const session = await refreshUserSession(refreshToken);

        if (!session) {
            res.clearCookie("refreshToken");

            return res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token",
            });
        }

        res.cookie("accessToken", session.accessToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", session.refreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Access token refreshed",
        });
    } catch (error) {
        next(error);
    }
};