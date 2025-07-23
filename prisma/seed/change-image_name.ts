import {v4 as uuidv4} from 'uuid';
import * as fs from 'fs/promises';
import * as path from 'path';
import {db} from "../../src/services/db";

const uploadDir = '/path/to/uploads'; // Ganti ke lokasi folder gambar kamu

async function migrateImageNames() {
    const records = await db.coordinate.findMany({
        where: {
            imageName: {not: null}
        }
    });

    for (const record of records) {
        const oldName = record.imageName!;
        const ext = path.extname(oldName);
        const newName = `${uuidv4()}${ext}`;
        const oldPath = path.join(uploadDir, oldName);
        const newPath = path.join(uploadDir, newName);

        try {
            // Rename file fisik
            await fs.rename(oldPath, newPath);
            console.log(`Renamed: ${oldName} -> ${newName}`);

            // Update database
            await db.coordinate.update({
                where: {id: record.id},
                data: {imageName: newName}
            });
        } catch (err) {
            console.error(`Failed to rename/update: ${oldName}`, err);
        }
    }

    await db.$disconnect();
}

migrateImageNames().catch(console.error);
