import {z} from "zod";

export const CoordinateSchema = {
    update: z.object({
        photoTakenAt: z.string()
            .refine(val => !val || !isNaN(Date.parse(val)), {
                message: "Invalid date format"
            })
            .optional(),
        poleId: z.number().optional(),
        address: z.string().optional(),
        photoCode: z.string().optional().nullable(),
        isAccepted: z.boolean().optional(),
        isReject: z.boolean().optional(),
    })
};

export type CoordinateUpdateBody = z.infer<typeof CoordinateSchema.update>;
