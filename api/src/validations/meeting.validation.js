import z from "zod";

export const meetingCreateSchema = z.object({
    title: z.string().min(1),
    meetingDate: z.coerce.date().optional(),
    meetingTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time")
        .optional() // 09:30, 18:30
});

export const meetingUpdateSchema = z.object({
    _id: z.string(),
    title: z.string().min(1),
    meetingDate: z.coerce.date().optional(),
    meetingTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time")
        .optional() // 09:30, 18:30
});


export const meetingJoinSchema = z.object({
    meetingCode : z.string().min(9).max(9)
})