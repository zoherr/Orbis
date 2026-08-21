import crypto from "node:crypto";
import OrbitModel from "../models/orbit.model.js";
import mongoose from "mongoose";
import NotFound from "../exceptions/NotFound.js";

const checkOrbitCodeExist = async (code) => {
    const orbit = await OrbitModel
        .findOne({ orbitCode: code })
        .select("_id")
        .lean();

    return !!orbit;
};

const checkOrbitExist = async (_id) => {
    const orbit = await OrbitModel
        .findById({ _id: _id })
        .select("_id");

    return !!orbit;
};

const generateOrbitCode = async () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";

    const generatePart = (length) =>
        Array.from(
            { length },
            () => chars[crypto.randomInt(0, chars.length)]
        ).join("");

    let orbitCode;

    do {
        orbitCode = `${generatePart(4)}${generatePart(4)}`;
    } while (await checkOrbitCodeExist(orbitCode));

    return orbitCode;
};

export const create = async (data, userId) => {
    const orbitCode = await generateOrbitCode();

    const orbit = await OrbitModel.create({
        title: data.title,
        orbitDate: data.orbitDate,
        orbitTime: data.orbitTime,
        type: data.type,
        orbitCode,
        admins: [userId],
        attendees: [],
        createdBy: userId
    });

    return orbit;
};

export const getAllOrbitByUserID = async (userId) => {
    const orbits = await OrbitModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: {
                orbitDate: 1,
                orbitTime: 1
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$orbitDate",
                        timezone: "Asia/Kolkata"
                    }
                },
                orbits: {
                    $push: {
                        _id: "$_id",
                        title: "$title",
                        orbitCode: "$orbitCode",
                        orbitDate: "$orbitDate",
                        orbitTime: "$orbitTime",
                        type: "$type"
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
                orbits: 1
            }
        }
    ]);

    return orbits;
};


export const update = async (data) => {
    const orbit = await OrbitModel.findByIdAndUpdate(
        data._id,
        {
            $set: {
                title: data.title,
                orbitDate: data.orbitDate,
                orbitTime: data.orbitTime,
                type: data.type
            }
        },
        {
            new: true,
            runValidators: true
        }
    );

    if (!orbit) {
        throw new NotFound("Orbit not found");
    }

    return orbit;
};


export const joinOrbit = async (orbitCode, userId) => {
    const orbit = await OrbitModel.findOne({ orbitCode });

    if (!orbit) {
        throw new NotFound("Orbit not found");
    }

    const alreadyJoined = orbit.attendees.some(
        (attendee) => attendee.user.toString() === userId.toString()
    );

    if (alreadyJoined) {
        return orbit;
    }

    orbit.attendees.push({
        user: userId,
        joinTime: new Date()
    });

    await orbit.save();

    return orbit;
};

export const getRecentJoinedOrbits = async (userId) => {
    const orbits = await OrbitModel.aggregate([
        {
            $match: {
                "attendees.user": new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $unwind: "$attendees"
        },
        {
            $match: {
                "attendees.user": new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: {
                "attendees.joinTime": -1
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$attendees.joinTime",
                        timezone: "Asia/Kolkata"
                    }
                },
                orbits: {
                    $push: {
                        _id: "$_id",
                        title: "$title",
                        orbitCode: "$orbitCode",
                        orbitDate: "$orbitDate",
                        orbitTime: "$orbitTime",
                        type: "$type",
                        joinTime: "$attendees.joinTime"
                    }
                }
            }
        },
        {
            $sort: {
                _id: -1
            }
        },
        {
            $project: {
                _id: 0,
                date: "$_id",
                orbits: 1
            }
        }
    ]);

    return orbits;
};