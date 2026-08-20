import { toPublicMeeting } from "../dtos/meeting.dto.js";
import * as meetingService from "../services/meeting.service.js";

export const createMeeting = async (req, res, next) => {
    try {
        const userId = req.userId;
        const data = req.body;
        const meeting = await meetingService.create(data, userId);
        return res.json({
            success: true,
            message: "Meeting Created Successfully!",
            data: toPublicMeeting(meeting)
        })
    } catch (error) {
        next(error)
    }
}

export const getAllMyMeetings = async (req, res, next) => {
    try {
        const userId = req.userId;
        const meetings = await meetingService.getAllMeetingByUserID(userId);

        const meetingsRes = meetings.map((group) => ({
            date: group.date,
            meetings: group.meetings.map((meeting) => (toPublicMeeting(meeting)))
        }));
        return res.json({
            success: true,
            message: "Meeting fetch Successfully!",
            data: meetingsRes
        })
    } catch (error) {
        next(error);
    }
}

export const updateMeeting = async (req, res, next) => {
    try {
        const data = req.body;
        const meeting = await meetingService.update(data);
        return res.json({
            success: true,
            message: "Meeting Updated Successfully!",
            data: toPublicMeeting(meeting)
        })
    } catch (error) {
        next(error)
    }
}

export const joinMeeting = async (req, res, next) => {
    try {

    } catch (error) {
        next(error);
    }
}