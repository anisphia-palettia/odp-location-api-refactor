import path from "node:path";
import fs from "node:fs";
import axios from "axios";

export async function saveFileFromUrl(fileUrl: string, relativeFilePath: string): Promise<{
    fullPath: string,
    fileName: string
}> {
    const fullPath = path.join("public", relativeFilePath);
    const folder = path.dirname(fullPath);

    fs.mkdirSync(folder, {recursive: true});

    const writer = fs.createWriteStream(fullPath);

    const response = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', () => {
            const fileName = path.basename(fullPath);
            resolve({fullPath, fileName});
        });
        writer.on('error', reject);
    });
}