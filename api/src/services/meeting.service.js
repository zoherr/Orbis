import crypto from "node:crypto";
import MeetingModel from "../models/meeting.model.js";
import mongoose from "mongoose";
import NotFound from "../exceptions/NotFound.js";

const checkMeetingCodeExist = async (code) => {
    const meeting = await MeetingModel
        .findOne({ meetingCode: code })
        .select("_id")
        .lean();

    return !!meeting;
};

const checkMeetingExist = async (_id) => {
    const meeting = await MeetingModel
        .findById({ _id: _id })
        .select("_id");

    return !!meeting;
};

const generateMeetingCode = async () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

    const generatePart = (length) =>
        Array.from(
            { length },
            () => chars[crypto.randomInt(0, chars.length)]
        ).join("");

    let meetingCode;

    do {
        meetingCode = `${generatePart(4)}-${generatePart(4)}`;
    } while (await checkMeetingCodeExist(meetingCode));

    return meetingCode;
};

export const create = async (data, userId) => {
    const meetingCode = await generateMeetingCode();

    const meeting = await MeetingModel.create({
        title: data.title,
        meetingDate: data.meetingDate,
        meetingTime: data.meetingTime,
        meetingCode,
        admins: [userId],
        attendees: [],
        createdBy: userId
    });

    return meeting;
};

export const getAllMeetingByUserID = async (userId) => {
    const meetings = await MeetingModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: {
                meetingDate: 1,
                meetingTime: 1
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$meetingDate",
                        timezone: "Asia/Kolkata"
                    }
                },
                meetings: {
                    $push: {
                        _id: "$_id",
                        title: "$title",
                        meetingCode: "$meetingCode",
                        meetingDate: "$meetingDate",
                        meetingTime: "$meetingTime"
                    }
                }
            }
        },
        {
            $sort: {
                _id: 1
            }
        },
        {
            $project: {
                _id: 0,
                date: "$_id",
                meetings: 1
            }
        }
    ]);

    return meetings;
};


export const update = async (data) => {
    const meeting = await MeetingModel.findByIdAndUpdate(
        data._id,
        {
            $set: {
                title: data.title,
                meetingDate: data.meetingDate,
                meetingTime: data.meetingTime
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!meeting) {
        throw new NotFound("Meeting not found");
    }

    return meeting;
};


export const joinMeeting = async (meetingCode, userId) => {
    const meeting = await MeetingModel.findOne({ meetingCode });

    if (!meeting) {
        throw new NotFound("Meeting not found");
    }

    const alreadyJoined = meeting.attendees.some(
        (attendee) => attendee.user.toString() === userId.toString()
    );

    if (alreadyJoined) {
        return meeting;
    }

    meeting.attendees.push({
        user: userId,
        joinTime: new Date()
    });

    await meeting.save();

    return meeting;
};