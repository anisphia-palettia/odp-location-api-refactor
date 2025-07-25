import {z} from "zod/mini";

export const GroupSchema = {
    create: z.object({
        chatId: z.string().check(z.minLength(1))
    }),
    update: z.object({
        show: z.optional(z.boolean())
    }),
}

export  type GroupCreateBody = z.infer<typeof GroupSchema.create>;
export  type GroupUpdateBody = z.infer<typeof GroupSchema.update>;