import {Context, Next} from "hono";
import {logger} from "@/lib/logger";

export async function loggerRequest(c: Context, next: Next) {
    logger.info(`${c.req.method}: ${c.req.url}`);
    await next()
}