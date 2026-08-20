import { Router } from "express";
import { ValidateSchema } from "../middlewares/validation.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js"
import { meetingCreateSchema, meetingJoinSchema, meetingUpdateSchema } from "../validations/meeting.validation.js";
import { createMeeting, getAllMyMeetings, updateMeeting, joinMeeting } from "../controllers/meeting.controller.js";

const meetingRoute = Router();

meetingRoute.post("/create", authenticate, ValidateSchema(meetingCreateSchema), createMeeting);
meetingRoute.get("/my-meetings", authenticate, getAllMyMeetings);
meetingRoute.put("/update", authenticate, ValidateSchema(meetingUpdateSchema), updateMeeting);
meetingRoute.post("/join", authenticate, ValidateSchema(meetingJoinSchema), joinMeeting);

export default meetingRoute; 