import {EnvConfig} from "@/config/env.config";
import {Context} from "hono";
import {ZodError} from "zod";
import {sendError} from "@/lib/response";
import {HTTPException} from "hono/http-exception";

const isDev = EnvConfig.NODE_ENV === "development";

export default function errorHandler(error: any, c: Context) {
    if (error instanceof ZodError) {
        return sendError(c, {
            status: 400,
            message: "Validation error",
            detail: error.errors.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            })),
        });
    }

    if (error instanceof HTTPException) {
        return sendError(c, {
            status: error.status,
            message: error.message || "HTTP Error",
            ...(isDev && {stack: error.stack}),
        });
    }

    return sendError(c, {
        status: 500,
        message: typeof error?.message === "string" ? error.message : "Internal Server Error",
        ...(isDev && {stack: error?.stack ?? error}),
    });
}