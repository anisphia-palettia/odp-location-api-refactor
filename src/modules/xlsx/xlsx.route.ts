import { Hono } from 'hono';
import { GroupService } from '@/modules/group';
import ExcelJS from 'exceljs';

const xlsxRoute = new Hono();

function safeSheetName(raw: string, used: Set<string>) {
    let name = (raw ?? 'Sheet').toString().replace(/[:\\/?*\[\]]/g, ' ').slice(0, 31).trim() || 'Sheet';
    let base = name, i = 1;
    while (used.has(name)) {
        const suf = ` (${i++})`;
        name = (base.slice(0, 31 - suf.length) + suf).trim();
    }
    used.add(name);
    return name;
}

xlsxRoute.get('/', async (c) => {
    const groups = await GroupService.getCoordinatesByGroupId({ accepted: true });
    const wb = new ExcelJS.Workbook();

    const usedNames = new Set<string>();

    for (const group of groups) {
        const sheetName = safeSheetName(group.name, usedNames);
        const ws = wb.addWorksheet(sheetName);

        ws.columns = [
            { header: 'No', key: 'no', width: 6 },
            { header: 'Latitude', key: 'latitude', width: 16 },
            { header: 'Longitude', key: 'longitude', width: 16 },
            { header: 'Link Gambar', key: 'link_gambar', width: 40 },
            { header: 'Link Maps', key: 'link_maps', width: 40 },
            { header: 'Link Timemark', key: 'link_timemark', width: 40 },
        ] as Partial<ExcelJS.Column>[];

        const folder = encodeURIComponent(group.name ?? '');

        const mappedRows = (group.coordinates ?? []).map((coordinate: any, index: number) => {
            const lat = coordinate.lat;
            const lng = coordinate.long; // ganti ke coordinate.lng kalau fieldnya 'lng'
            const imgName = coordinate.imageName ?? 'no-image.jpg';
            const photoCode = coordinate.photoCode;

            return {
                no: index + 1,
                latitude: lat,
                longitude: lng,
                link_gambar: lat != null && lng != null ? `https://odp.tridatafiber.com/public/${folder}/${imgName}` : '',
                link_maps: (lat != null && lng != null) ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : '',
                link_timemark: photoCode ? `https://timemark.com/s/${photoCode}/8` : '',
            };
        });

        ws.addRows(mappedRows);

        ws.getRow(1).font = { bold: true };
        ws.autoFilter = { from: 'A1', to: 'F1' };
        ws.views = [{ state: 'frozen', ySplit: 1 }];

        for (let i = 0; i < mappedRows.length; i++) {
            const rowIdx = i + 2;
            const row = ws.getRow(rowIdx);

            const gambar = mappedRows[i].link_gambar;
            const gmaps = mappedRows[i].link_maps;
            const timemark = mappedRows[i].link_timemark;

            if (gambar)   row.getCell('D').value = { text: 'Gambar',   hyperlink: gambar };
            if (gmaps)    row.getCell('E').value = { text: 'Maps',     hyperlink: gmaps };
            if (timemark) row.getCell('F').value = { text: 'Timemark', hyperlink: timemark };
        }

        ws.getColumn('B').numFmt = '0.000000';
        ws.getColumn('C').numFmt = '0.000000';

        const lastRow = ws.lastRow?.number ?? 1;

        ws.getRow(1).eachCell((cell) => {
            cell.border = {
                top:    { style: 'medium' },
                left:   { style: 'medium' },
                bottom: { style: 'medium' },
                right:  { style: 'medium' },
            };
        });

        for (let r = 2; r <= lastRow; r++) {
            ws.getRow(r).eachCell((cell) => {
                cell.border = {
                    top:    { style: 'thin' },
                    left:   { style: 'thin' },
                    bottom: { style: 'thin' },
                    right:  { style: 'thin' },
                };
            });
        }
    }

    const buffer = await wb.xlsx.writeBuffer();

    return new Response(buffer, {
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': 'attachment; filename="group-coordinates.xlsx"',
            'Cache-Control': 'no-store',
        },
    });
});

export default xlsxRoute;
