import { z } from "zod";

export const GroupSchema = {
    create: z.object({
        chatId: z.string().min(1)
    }),
    update: z.object({
        show: z.boolean().optional()
    }),
};

export type GroupCreateBody = z.infer<typeof GroupSchema.create>;
export type GroupUpdateBody = z.infer<typeof GroupSchema.update>;
