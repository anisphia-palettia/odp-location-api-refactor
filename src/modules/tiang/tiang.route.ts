import {Hono} from "hono";
import {TiangService} from "./tiang.service";
import {sendSuccess} from "@/lib/response";

const tiangRoute = new Hono();

tiangRoute.get("", async (c) => {
    const tiangs = await TiangService.getAll();
    return sendSuccess(c, {
        message: "Success get all tiangs",
        data: tiangs
    })
})

tiangRoute.get("/:id", async (c) => {
    const id = c.req.param("id")
    const tiang = await TiangService.getById(Number(id));
    return sendSuccess(c, {
        message: "Success get the tiang",
        data: tiang
    })
})

export default tiangRoute