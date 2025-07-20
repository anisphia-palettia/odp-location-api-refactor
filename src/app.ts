import {Hono} from "hono";
import groupRoute from "@/modules/group";
import coordinateRoute from "@/modules/coordinate";
import {errorHandler, loggerRequest} from "@/middleware";
import webhookWhatsappRoute from "@/modules/webhook";

const app = new Hono().basePath("/api")

app.use(loggerRequest);

app.route("/group", groupRoute)
app.route("/coordinate", coordinateRoute)
app.route("/web-hook", webhookWhatsappRoute)

app.onError(errorHandler)

export default app