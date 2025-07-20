import "dotenv/config"
import {serve} from "@hono/node-server"
import app from "@/app";
import {EnvConfig} from "@/config/env.config";
import {dbConnect} from "@/services/db";

async function main() {
    serve({
        fetch: app.fetch,
        port: Number(EnvConfig.APP_PORT),
    })
    await dbConnect()
    console.log(`===> Hono run in port ${EnvConfig.APP_PORT}`)
}

main()