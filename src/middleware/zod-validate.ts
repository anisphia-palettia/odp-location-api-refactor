import {zValidator} from "@hono/zod-validator";
import type {ValidationTargets} from "hono";
import {ZodObject} from "zod";

export function zodValidate(
    target: keyof ValidationTargets,
    schema: ZodObject
) {
    return zValidator(target, schema, (result, c) => {
        if (!result.success) {
            throw result.error;
        }
    });
}
