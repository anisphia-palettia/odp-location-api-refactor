import {getBrowser} from "@/services/scraper/browser-manager";
import {Page} from "playwright";
import {logger} from "@/lib/logger";
import {CoordinateData} from "@/services/scraper/types";

export async function getCoordinatesFromPage(url: string): Promise<CoordinateData | null> {
    const browser = await getBrowser();
    const page: Page = await browser.newPage();

    try {
        await page.goto(url, {waitUntil: 'networkidle'});
        await page.waitForSelector('.content .cardItem', {timeout: 10000});

        const addressText = await page.locator('.content .cardItem', {
            has: page.locator('.top', {hasText: 'Address'})
        }).locator('.bottom').textContent();

        if (!addressText) {
            return null
        }

        const gpsText = await page.locator('.content .cardItem', {
            has: page.locator('.top', {hasText: 'GPS'})
        }).locator('.bottom').textContent();


        if (gpsText) {
            const parts = gpsText.trim().split(',').map(v => v.trim());

            if (parts.length === 2 && parts[0] && parts[1]) {
                const [lat, lng] = parts;
                const urlParts = url.split('/');
                const urlId = urlParts[4];
                return {lat, long: lng, address: addressText, urlId};
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (err) {
        logger.error("Failed to scrape coordinates:", err);
        return null;
    } finally {
        await page.close();
    }
}