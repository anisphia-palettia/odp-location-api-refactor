import {z} from "zod/mini";

export const GenerateSchema = {
    create: z.object({
        urlId: z.string().check(z.minLength(1))
    }),
}

export  type GenerateCreateBody = z.infer<typeof GenerateSchema.create>;