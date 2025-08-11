import {create} from 'xmlbuilder2'
import {Prisma} from "@/generated/prisma";

type Groups = Prisma.GroupGetPayload<{
    include: {
        coordinates: true
    }
}>[]


export function generateKml(groups: Groups): string {
    const kmlDoc = create({version: '1.0', encoding: 'UTF-8'})
        .ele('kml', {xmlns: 'http://www.opengis.net/kml/2.2'})
        .ele('Document')

    for (let gIndex = 0; gIndex < groups.length; gIndex++) {
        const group = groups[gIndex]
        const folder = kmlDoc.ele('Folder')
        const groupCode = `T${gIndex + 1}` // T1, T2, dst
        folder.ele('name').txt(groupCode)

        let count = 1
        for (const coord of group.coordinates) {
            if (!coord.lat || !coord.lng || !coord.imageName) continue

            const placemark = folder.ele('Placemark')
            placemark.ele('name').txt(`${groupCode}-${count}`)

            const encodedGroup = encodeURIComponent(group.name)
            const encodedImage = encodeURIComponent(coord.imageName)

            placemark.ele('description').dat(`
        <img src="https://odp.tridatafiber.com/public/${encodedGroup}/${encodedImage}" width="300"/><br/>
        ${coord.address || 'No Address'}
      `)

            placemark.ele('Point')
                .ele('coordinates')
                .txt(`${coord.lng},${coord.lat},0`)

            count++
        }
    }

    return kmlDoc.end({prettyPrint: true})
}
