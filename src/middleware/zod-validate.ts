import {zValidator} from "@hono/zod-validator";
import type {ValidationTargets} from "hono";
import {ZodMiniObject} from "zod/mini";

export default function zodValidate(
    target: keyof ValidationTargets,
    schema: ZodMiniObject
) {
    return zValidator(target, schema, (result, c) => {
        if (!result.success) {
            throw result.error;
        }
    });
}
