import { Router } from "express";
import { userRegister, userLogin, initiateAuth, refreshAccessToken, getMe, changePassword, sendForgotPasswordOTP, forgotPassword } from "../controllers/auth.controller.js";
import { ValidateSchema } from "../middlewares/validation.middleware.js";
import { changePasswordSchema, forgotPasswordSchema, initiateAuthSchema, loginUserSchema, registerUserSchema, sendForgotPasswordOTPSchema } from "../validations/auth.validation.js";
import authenticate from "../middlewares/auth.middleware.js"

const authRoute = Router();

authRoute.post("/init", ValidateSchema(initiateAuthSchema), initiateAuth)
authRoute.post("/register", ValidateSchema(registerUserSchema), userRegister);
authRoute.post("/login", ValidateSchema(loginUserSchema), userLogin);
authRoute.post("/refresh", refreshAccessToken);
authRoute.get("/me", authenticate, getMe);
authRoute.post("/change-password", authenticate, ValidateSchema(changePasswordSchema), changePassword);
authRoute.post("/forgot-password-otp", ValidateSchema(sendForgotPasswordOTPSchema), sendForgotPasswordOTP);
authRoute.post("/forgot-password", ValidateSchema(forgotPasswordSchema), forgotPassword);

export default authRoute;