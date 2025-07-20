import {chromium, type Browser} from 'playwright';

let browser: Browser | null = null;

export async function getBrowser(): Promise<Browser> {
    if (!browser) {
        browser = await chromium.launch({headless: true});
        console.log('===> Browser started');
    }
    return browser;
}

export async function closeBrowser(): Promise<void> {
    if (browser) {
        await browser.close();
        console.log('===> Browser closed');
        browser = null;
    }
}
