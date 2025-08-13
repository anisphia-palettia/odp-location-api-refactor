import {z} from "zod";

export const GroupSchema = {
    create: z.object({
        chatCode: z.string().min(1),
    }),
    update: z.object({
        show: z.boolean().optional(),
    }),
};

export const GroupParamSchema = {
    coordinateByGroupId: z.object({
        groupId: z.coerce.number().int().positive(),
    }),
};

export const GroupQuerySchema = {
    coordinateByGroupId: z.object({
        accepted: z
            .enum(['true', 'false', 'null'])
            .optional()
            .transform(v => (v === undefined ? null : v === 'null' ? null : v === 'true')),
        take: z.coerce.number().int().min(1).max(100).optional().default(20),
        cursor: z.coerce.number().int().positive().optional(),
    }),
};

export type GroupCreateBody = z.infer<typeof GroupSchema.create>;
export type GroupUpdateBody = z.infer<typeof GroupSchema.update>;

export type GroupParamCoordinateByGroupId = z.infer<
    typeof GroupParamSchema.coordinateByGroupId
>;
export type GroupQueryCoordinateByGroupId = z.infer<
    typeof GroupQuerySchema.coordinateByGroupId
>;
