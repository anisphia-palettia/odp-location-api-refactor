import { z } from "zod";

export const GenerateSchema = {
    create: z.object({
        photoPath: z.string().min(1)
    }),
};

export type GenerateCreateBody = z.infer<typeof GenerateSchema.create>;
