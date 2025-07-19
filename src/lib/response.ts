import {Context} from "hono";
import {ContentfulStatusCode} from "hono/dist/types/utils/http-status";
import {logger} from "@/lib/logger";
import {ResponseError, ResponseSuccess} from "@/types/response";
import {EnvConfig} from "@/config/env.config";

export function sendSuccess<T = any>(
    c: Context,
    {
        message,
        origin,
        status = 200,
        data,
        token,
    }: {
        message: string;
        status?: ContentfulStatusCode;
        data?: T;
        token?: string;
        origin?: string;
    }
) {
    return c.json<ResponseSuccess<T>>(
        {
            success: true,
            origin,
            message: message,
            data: data,
            token: token,
        },
        status
    );
}

export function sendError(
    c: Context,
    {
        message,
        origin,
        detail,
        stack,
        status,
    }: {
        message: string;
        origin?: string;
        detail?: any;
        stack?: string;
        status: ContentfulStatusCode;
    }
) {
    logger.error("ERROR", message, stack);
    return c.json<ResponseError>(
        {
            success: false,
            origin: origin,
            error: {
                message: message,
                details: detail,
                ...(EnvConfig.NODE_ENV !== "production" ? {stack} : {}),
            },
        },
        status
    );
}
