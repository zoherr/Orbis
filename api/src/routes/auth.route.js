import { Router } from "express";
import { userRegister, userLogin, initiateAuth, refreshAccessToken, getMe, changePassword, sendForgotPasswordOTP, forgotPassword, logout, checkUserNameAvailable, reSendOTP } from "../controllers/auth.controller.js";
import { ValidateSchema } from "../middlewares/validation.middleware.js";
import { changePasswordSchema, checkUsername, forgotPasswordSchema, initiateAuthSchema, loginUserSchema, registerUserSchema, resendOTPSchema, sendForgotPasswordOTPSchema } from "../validations/auth.validation.js";
import { authenticate, checkAuth } from "../middlewares/auth.middleware.js"
import { rateLimiter } from "../middlewares/rateLimit.middleware.js";

const authRoute = Router();

authRoute.post("/init", rateLimiter(15 * 60 * 1000, 10), ValidateSchema(initiateAuthSchema), initiateAuth)
authRoute.post("/register", ValidateSchema(registerUserSchema), userRegister);
authRoute.post("/login", ValidateSchema(loginUserSchema), userLogin);
authRoute.post("/refresh", refreshAccessToken);
authRoute.get("/me", authenticate, getMe);
authRoute.post("/logout", authenticate, logout)
authRoute.post("/change-password", authenticate, ValidateSchema(changePasswordSchema), changePassword);
authRoute.post("/forgot-password-otp", ValidateSchema(sendForgotPasswordOTPSchema), sendForgotPasswordOTP);
authRoute.post("/forgot-password", ValidateSchema(forgotPasswordSchema), forgotPassword);
authRoute.get("/check-username", checkAuth, checkUserNameAvailable);
authRoute.post("/resend-otp", rateLimiter(15 * 60 * 1000, 10), ValidateSchema(resendOTPSchema), reSendOTP);

export default authRoute;