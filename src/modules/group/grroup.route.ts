import {Hono} from "hono";
import {sendSuccess} from "@/lib/response";

const groupRoute = new Hono()

groupRoute.get("/", async (c) => {

})

export default groupRoute