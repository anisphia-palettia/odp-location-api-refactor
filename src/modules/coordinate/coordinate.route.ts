import {Hono} from "hono";
import {sendSuccess} from "@/lib/response";
import {CoordinateService} from "./coordinate.service"
import {zodValidate} from "@/middleware";
import {CoordinateSchema, CoordinateUpdateBody} from "@/modules/coordinate/coordinate.schema";

const coordinateRoute = new Hono()

coordinateRoute.get("", async (c) => {
    const coordinates = await CoordinateService.getAll();
    return sendSuccess(c, {
        message: "Success get all coordinates",
        data: coordinates
    })
})

coordinateRoute.get("/:id", async (c) => {
    const id = c.req.param("id")
    const coordinate = await CoordinateService.getById(Number(id));
    return sendSuccess(c, {
        message: "Success get the coordinate",
        data: coordinate
    })
})

coordinateRoute.put("/:id", zodValidate("json", CoordinateSchema.update), async (c) => {
    const id = c.req.param("id")
    const data = c.req.valid("json") as CoordinateUpdateBody
    await CoordinateService.updateById(Number(id), data)
})

export default coordinateRoute