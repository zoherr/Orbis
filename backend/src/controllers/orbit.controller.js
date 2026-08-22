import { toPublicOrbit } from "../dtos/orbit.dto.js";
import * as orbitService from "../services/orbit.service.js";
import NotFound from "../exceptions/NotFound.js";
import mongoose from "mongoose";

export const createOrbit = async (req, res, next) => {
    try {
        const userId = req.userId;
        const data = req.body;
        const orbit = await orbitService.create(data, userId);
        return res.json({
            success: true,
            message: "Orbit Created Successfully!",
            data: toPublicOrbit(orbit)
        })
    } catch (error) {
        next(error)
    }
}

export const getAllMyOrbits = async (req, res, next) => {
    try {
        const userId = req.userId;
        const orbits = await orbitService.getAllOrbitByUserID(userId);

        const orbitsRes = orbits.map((group) => ({
            date: group.date,
            orbits: group.orbits.map((orbit) => (toPublicOrbit(orbit)))
        }));
        return res.json({
            success: true,
            message: "Orbit fetch Successfully!",
            data: orbitsRes
        })
    } catch (error) {
        next(error);
    }
}

export const updateOrbit = async (req, res, next) => {
    try {
        const data = req.body;
        const orbit = await orbitService.update(data);
        return res.json({
            success: true,
            message: "Orbit Updated Successfully!",
            data: toPublicOrbit(orbit)
        })
    } catch (error) {
        next(error)
    }
}

export const joinOrbit = async (req, res, next) => {
    try {
        const { id } = req.body;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw new NotFound("Invalid Orbit");
        }
        const userId = req.userId;
        const orbit = await orbitService.joinOrbit(id, userId);

        return res.json({
            success: true,
            message: "Joined Orbit Successfully!",
            data: toPublicOrbit(orbit)
        });
    } catch (error) {
        next(error);
    }
};

export const getRecentJoinedOrbits = async (req, res, next) => {
    try {
        const userId = req.userId;

        const orbits = await orbitService.getRecentJoinedOrbits(userId);

        const orbitsRes = orbits.map((group) => ({
            date: group.date,
            orbits: group.orbits.map((orbit) => toPublicOrbit(orbit))
        }));

        return res.json({
            success: true,
            message: "Recent joined Orbits fetched successfully!",
            data: orbitsRes
        });
    } catch (error) {
        next(error);
    }
};

export const orbitCodeVerify = async (req, res, next) => {
    try {
        const { code } = req.params;

        if (!code || code.length !== 8) {
            throw new NotFound("Invalid Orbit Code");
        }

        const orbitCode = code.toLowerCase();

        const orbit = await orbitService.checkOrbitCode(orbitCode);

        if (!orbit) {
            throw new NotFound("Orbit Not Found");
        }

        return res.json({
            success: true,
            message: "Orbit Fetch Successfully!",
            data: toPublicOrbit(orbit)
        });
    } catch (error) {
        next(error);
    }
};