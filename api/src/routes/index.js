import { Router } from "express";
import authRoute from "./auth.route.js";
import meetingRoute from "./meeting.route.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/meeting", meetingRoute);

export default router;