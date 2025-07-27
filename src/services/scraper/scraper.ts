import {getBrowser} from "@/services/scraper/browser-manager";
import {Page} from "playwright";
import {logger} from "@/lib/logger";
import {DateTime} from "luxon";
import {CoordinateData} from "@/services/scraper/types";

export async function getMetadataFromPage(url: string): Promise<CoordinateData | null> {
    const browser = await getBrowser();
    const page: Page = await browser.newPage();

    try {
        await page.goto(url, {waitUntil: 'networkidle'});
        await page.waitForSelector('.content .cardItem', {timeout: 10000});

        const getContentField = async (field: string) =>
            page.locator('.content .cardItem', {
                has: page.locator('.top', {hasText: field})
            }).locator('.bottom').textContent();

        const addressText = await getContentField('Address');
        if (!addressText) return null;

        const gpsText = await getContentField('GPS');

        const metaData: Record<string, string | null> = {};
        const cardItems = await page.locator('.meta-data-card .cardItem');
        for (let i = 0, n = await cardItems.count(); i < n; i++) {
            const key = (await cardItems.nth(i).locator('.top').textContent() || '').trim();
            const val = (await cardItems.nth(i).locator('.bottom').textContent() || '').trim();
            metaData[key] = val;
        }

        const {['Photo Code']: photoCode, Time: time, Date: date, ['Time Zone']: timezone} = metaData;

        let isoTimestamp: string | null = null;
        if (date && time && timezone) {
            try {
                isoTimestamp = DateTime.fromFormat(
                    `${date} ${time}`,
                    "dd LLL yyyy HH:mm",
                    {zone: timezone}
                ).toISO();
            } catch {
            }
        }

        let lat: string | null = null, lng: string | null = null;
        if (gpsText) {
            const parts = gpsText.trim().split(',').map(v => v.trim());
            if (parts.length === 2) {
                [lat, lng] = parts;
            }
        }

        return lat && lng ? {
            lat,
            long: lng,
            address: addressText.trim(),
            photoCode: photoCode ?? null,
            photoTakenAt: isoTimestamp ?? null,
        } as any : null;

    } catch (err) {
        logger.error("Failed to scrape metadata:", err);
        return null;
    } finally {
        await page.close();
    }
}
