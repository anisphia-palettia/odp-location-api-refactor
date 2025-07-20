import {Hono} from "hono";
import {sendSuccess} from "@/lib/response";
import {CoordinateService} from "./coordinate.service"

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
})

export default coordinateRoute