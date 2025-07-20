import {z} from "zod/mini";

export const GroupSchema = {
    create: z.object({
        chatId: z.string().check(z.minLength(1))
    })
}

export  type GroupCreateBody  = z.infer<typeof GroupSchema.create>;