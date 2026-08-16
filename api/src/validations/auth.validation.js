import { z } from "zod";


export const initiateAuthSchema = z.object({
    email: z.email()
});

export const registerUserSchema = z.object({
    fullName: z.string().trim().min(5).max(20),
    email: z.email(),
    username: z.string().trim().min(5).max(20),
    password: z.string().trim().min(8).max(20),
    otp: z.number(),
    activationToken : z.string()
});

export const loginUserSchema = z.object({
    email: z.email(),
    password: z.string().trim().min(8).max(20)
});