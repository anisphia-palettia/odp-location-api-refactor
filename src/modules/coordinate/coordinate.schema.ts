import {z} from "zod/mini";

export const CoordinateSchema = {
    update: z.object({
        photoTakenAt: z.optional(z.string().check(z.refine(val => !val || !isNaN(Date.parse(val)), {
            message: "Invalid date format"
        }))),
        tiangId: z.optional(z.number()),
        address: z.optional(z.string()),
    })
}

export  type CoordinateUpdateBody = z.infer<typeof CoordinateSchema.update>;