import {Hono} from 'hono'
import {GroupService} from '@/modules/group'
import {generateKml} from "@/helper/generate-kml";
import {HTTPException} from "hono/http-exception";

const kmlRoute = new Hono()

kmlRoute.get('/', async (c) => {
    const groups = await GroupService.getGroupCoordinates({accepted: true})

    console.log(groups)

    const kmlString = generateKml(groups)

    return c.body(kmlString, 200, {
        'Content-Type': 'application/vnd.google-earth.kml+xml',
        'Content-Disposition': 'attachment; filename="coordinates_by_group.kml"'
    })
})

kmlRoute.get("/:groupId", async (c) => {
    const groupId = Number(c.req.param("groupId"))

    const group = await GroupService.getGroupCoordinatesById(groupId, {accepted: true})

    if (!group) {
        throw new HTTPException(404, {message: "Group not found"})
    }

    const kmlString = generateKml([group])

    return c.body(kmlString, 200, {
        'Content-Type': 'application/vnd.google-earth.kml+xml',
        'Content-Disposition': `attachment; filename="${group.name}.kml"`
    })
})

export default kmlRoute
