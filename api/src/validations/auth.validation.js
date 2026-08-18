import { email, z } from "zod";


export const initiateAuthSchema = z.object({
    email: z.email()
});

export const registerUserSchema = z.object({
    fullName: z.string().trim().min(5).max(20),
    email: z.email(),
    username: z.string().trim().min(5).max(20),
    password: z.string().trim().min(8).max(20),
    otp: z.number(),
    activationToken: z.string()
});

export const loginUserSchema = z.object({
    email: z.email(),
    password: z.string().trim().min(8).max(20)
});

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8)
}).refine((data) => data.oldPassword !== data.newPassword, {
    message: "Old password and new password can not be same!",
    path: ["newPassword"],
});

export const sendForgotPasswordOTPSchema = z.object({
    email: z.email()
})

export const forgotPasswordSchema = z.object({
    email: z.email(),
    newPassword: z.string().trim().min(8).max(20),
    otp: z.number(),
    activationToken: z.string()
});

export const checkUsername = z.object({
    username: z.string().trim().min(5).max(20)
})

export const resendOTPSchema = z.object({
    email: z.email()
});