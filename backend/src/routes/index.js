import { Router } from "express";
import authRoute from "./auth.route.js";
import orbitRoute from "./orbit.route.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/orbit", orbitRoute);

export default router;