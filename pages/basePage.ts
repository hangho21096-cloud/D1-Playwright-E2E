import { Page, Locator, expect } from '@playwright/test';
import env from '../utils/envHandler';

export class BasePage {
    readonly page: Page;
    readonly header: Locator;
    readonly footer: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator('header').first();
        this.footer = page.locator('footer').first();
    }

    async navigate(urlOrPath: string) {
        if (urlOrPath.startsWith('http')) {
            await this.page.goto(urlOrPath, { waitUntil: 'domcontentloaded' });
        } else {
            const cleanPath = urlOrPath.startsWith('/') ? urlOrPath.slice(1) : urlOrPath;
            await this.page.goto(`${env.baseUrl}${cleanPath}`, { waitUntil: 'domcontentloaded' });
        }
    }

    async verifyHeaderAndFooterVisible() {
        // Assert the primary structural elements of the layout are rendered
        await expect(this.header).toBeVisible();
        await expect(this.footer).toBeVisible();
    }
}
