import {Hono} from "hono";
import groupRoute from "@/modules/group/group.route";
import loggerRequest from "@/middleware/logger-request";
import errorHandler from "@/middleware/error-handler";

const app = new Hono().basePath("/api")

app.use(loggerRequest);

app.route("/group", groupRoute)

app.onError(errorHandler)

export default app