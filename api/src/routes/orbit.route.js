import { Router } from "express";
import { ValidateSchema } from "../middlewares/validation.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js"
import { orbitCreateSchema, orbitJoinSchema, orbitUpdateSchema } from "../validations/orbit.validation.js";
import { createOrbit, getAllMyOrbits, updateOrbit, joinOrbit, getRecentJoinedOrbits, orbitCodeVerify } from "../controllers/orbit.controller.js";

const orbitRoute = Router();

orbitRoute.post("/create", authenticate, ValidateSchema(orbitCreateSchema), createOrbit);
orbitRoute.get("/my-orbits", authenticate, getAllMyOrbits);
orbitRoute.put("/update", authenticate, ValidateSchema(orbitUpdateSchema), updateOrbit);
orbitRoute.post("/join", authenticate, ValidateSchema(orbitJoinSchema), joinOrbit);
orbitRoute.get("/recent-joined", authenticate, getRecentJoinedOrbits)
orbitRoute.get("/verify/:code", authenticate, orbitCodeVerify);

export default orbitRoute; 