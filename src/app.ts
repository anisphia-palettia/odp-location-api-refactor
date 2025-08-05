import {Hono} from "hono";
import groupRoute from "@/modules/group";
import coordinateRoute from "@/modules/coordinate";
import {errorHandler, loggerRequest} from "@/middleware";
import webhookWhatsappRoute from "@/modules/webhook";
import {serveStatic} from "@hono/node-server/serve-static";
import {cors} from "hono/cors";
import tiangRoute from "@/modules/tiang";
import generateRoute from "@/modules/generate";
import kmlRoute from "@/modules/kml";

const apiApp = new Hono().basePath("/api");
apiApp.use(loggerRequest);
apiApp.route("/group", groupRoute);
apiApp.route("/coordinate", coordinateRoute);
apiApp.route("/tiang", tiangRoute)
apiApp.route("/web-hook", webhookWhatsappRoute);
apiApp.route("/generate", generateRoute);
apiApp.route("/kml", kmlRoute)

const app = new Hono();
app.use("/*", cors());
app.use("/public/*", serveStatic({root: "./"}));
app.route("", apiApp);
app.onError(errorHandler);

export default app;
