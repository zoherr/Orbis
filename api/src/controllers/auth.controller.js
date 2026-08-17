import env from "../config/env.config.js";
import {
    checkUserExist,
    checkUserName,
    optVeified,
    registerUser,
    sendOtp,
    refreshUserSession,
    loginUser,
    getUserById,
    passwordChange,
    userForgotPassword,
    invalidateRefreshToken,
} from "../services/auth.service.js";
import { signAccessToken } from "../utils/jwt.js";
import { toPublicUser } from "../dtos/user.dto.js";
import NotFound from "../exceptions/NotFound.js";
import BadRequest from "../exceptions/BadRequest.js";

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
            user: toPublicUser(user),
        });
    } catch (error) {
        next(error);
    }
};

export const userLogin = async (req, res, next) => {
    try {
        const {
            email,
            password
        } = req.body;

        const { user, refreshToken } = await loginUser(
            email,
            password,
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
            message: "User Login successfully!",
            user: toPublicUser(user),
        });

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
}

export const getMe = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await getUserById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found" });
        }

        return res.status(201).json({
            success: true,
            message: "User data fetch successfully!",
            user: toPublicUser(user),
        });
    } catch (error) {
        next(error);
    }
}

export const changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await passwordChange(req.userId, oldPassword, newPassword);
        return res.status(200).json({
            success: true,
            message: "Change Password Successfully!"
        })
    } catch (error) {
        next(error);
    }
}

export const sendForgotPasswordOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await checkUserExist(email);

        if (!user) {
            throw new NotFound("User Not Found")
        }

        const activationToken = await sendOtp(email);

        return res.status(200).json({
            success: true,
            message: "Forgot Password OTP Sent Successfully!",
            activationToken
        })

    } catch (error) {
        next(error)
    }
}

export const forgotPassword = async (req, res, next) => {
    try {
        const { email, otp, activationToken, newPassword } = req.body;

        await userForgotPassword(email, otp, activationToken, newPassword);

        return res.status(200).json({
            success: true,
            message: "Password Changed Successfully!"
        })

    } catch (error) {
        next(error);
    }
}

export const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            await invalidateRefreshToken(refreshToken);
        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            message: "Logout successfully!",
        });
    } catch (error) {
        next(error);
    }
};