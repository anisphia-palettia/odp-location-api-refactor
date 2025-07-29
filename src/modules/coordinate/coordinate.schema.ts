import { z } from "zod";

export const CoordinateSchema = {
    update: z.object({
        photoTakenAt: z.string()
            .refine(val => !val || !isNaN(Date.parse(val)), {
                message: "Invalid date format"
            })
            .optional(),
        tiangId: z.number().optional(),
        address: z.string().optional(),
    })
};

export type CoordinateUpdateBody = z.infer<typeof CoordinateSchema.update>;
