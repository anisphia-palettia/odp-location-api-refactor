import {Hono} from "hono";
import {PoleService} from "./pole.service";
import {sendSuccess} from "@/lib/response";

const poleRoute = new Hono();

poleRoute.get("", async (c) => {
    const tiangs = await PoleService.getAll();
    return sendSuccess(c, {
        message: "Success get all tiangs",
        data: tiangs
    })
})

poleRoute.get("/:id", async (c) => {
    const id = c.req.param("id")
    const tiang = await PoleService.getById(Number(id));
    return sendSuccess(c, {
        message: "Success get the tiang",
        data: tiang
    })
})

export default poleRoute