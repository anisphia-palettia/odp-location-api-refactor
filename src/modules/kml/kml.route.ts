import {Hono} from 'hono'
import {GroupService} from '@/modules/group'
import {generateKmlFromGroups} from "@/helper/generate-kml-from-groups";

const kmlRoute = new Hono()

kmlRoute.get('/', async (c) => {
    const groups = await GroupService.getGroupCoordinates({accepted: true})

    const kmlString = generateKmlFromGroups(groups)

    return c.body(kmlString, 200, {
        'Content-Type': 'application/vnd.google-earth.kml+xml',
        'Content-Disposition': 'attachment; filename="coordinates_by_group.kml"'
    })
})

kmlRoute

export default kmlRoute
