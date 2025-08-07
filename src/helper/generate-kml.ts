import {create} from 'xmlbuilder2'

export function generateKml(groups: any[]): string {
    const kmlDoc = create({version: '1.0', encoding: 'UTF-8'})
        .ele('kml', {xmlns: 'http://www.opengis.net/kml/2.2'})
        .ele('Document')

    for (const group of groups) {
        let i = 1
        const folder = kmlDoc.ele('Folder')
        folder.ele('name').txt(`Tiang teknisi ${i}`)

        for (const coord of group.coordinates) {
            if (!coord.lat || !coord.long || !coord.imageName) continue

            const placemark = folder.ele('Placemark')
            placemark.ele('name').txt(`ODP ${i} - ${group.name}`)

            const encodedGroup = encodeURIComponent(group.name)
            const encodedImage = encodeURIComponent(coord.imageName)

            placemark.ele('description').dat(`
        <img src="https://odp.tridatafiber.com/public/${encodedGroup}/${encodedImage}" width="300"/><br/>
        ${coord.address || 'No Address'}
      `)

            placemark.ele('Point')
                .ele('coordinates')
                .txt(`${coord.long},${coord.lat},0`)

            i++
        }
    }

    return kmlDoc.end({prettyPrint: true})
}
