import { Router } from "express";
import { userRegister, userLogin, initiateAuth, refreshAccessToken } from "../controllers/auth.controller.js";
import { ValidateSchema } from "../middlewares/validation.middleware.js";
import { initiateAuthSchema, loginUserSchema, registerUserSchema } from "../validations/auth.validation.js";

const authRoute = Router();

authRoute.post("/init", ValidateSchema(initiateAuthSchema), initiateAuth)
authRoute.post("/register", ValidateSchema(registerUserSchema), userRegister);
authRoute.post("/login", ValidateSchema(loginUserSchema), userLogin);
authRoute.post("/refresh", refreshAccessToken);

export default authRoute;