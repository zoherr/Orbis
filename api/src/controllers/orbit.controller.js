import { toPublicOrbit } from "../dtos/orbit.dto.js";
import * as orbitService from "../services/orbit.service.js";

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
        const { orbitCode } = req.body;
        const userId = req.userId;
        const code = orbitCode.toLowerCase();
        const orbit = await orbitService.joinOrbit(code, userId);

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