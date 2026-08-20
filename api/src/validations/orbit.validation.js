import z from "zod";

export const orbitCreateSchema = z.object({
    title: z.string().min(1),
    orbitDate: z.coerce.date().optional(),
    orbitTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time")
        .optional() // 09:30, 18:30
});

export const orbitUpdateSchema = z.object({
    _id: z.string(),
    title: z.string().min(1),
    orbitDate: z.coerce.date().optional(),
    orbitTime: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid time")
        .optional() // 09:30, 18:30
});


export const orbitJoinSchema = z.object({
    orbitCode : z.string().min(8).max(8)
})