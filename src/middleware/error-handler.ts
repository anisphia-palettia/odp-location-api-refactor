import {EnvConfig} from "@/config/env.config";
import {Context} from "hono";
import {sendError} from "@/lib/response";
import {HTTPException} from "hono/http-exception";
import {ZodError} from "zod";

const isDev = EnvConfig.NODE_ENV === "development";

export function errorHandler(error: any, c: Context) {
    if (error instanceof ZodError) {
        return sendError(c, {
            status: 400,
            message: "Validation error",
            detail: error.issues.map((err) => ({
                code: err.code,
                path: err.path,
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