import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class AllAccessPage extends BasePage {
    readonly mainCtaButton: Locator;

    constructor(page: Page) {
        super(page);
        this.mainCtaButton = page.getByRole('link', { name: 'Learn More' }).first();
    }

    async navigateToAllAccess() {
        await this.navigate('/allaccess');
    }

    async verifyCtaButtonsFunctional() {
        // Collect buttons count
        const buttonsCount = await this.mainCtaButton.count();
        if(buttonsCount > 0) {
            // Check visibility and click the primary CTA on the page
            await expect(this.mainCtaButton).toBeVisible();
            await this.mainCtaButton.click();
            await this.page.waitForLoadState('domcontentloaded');
            // Go back to check remaining logic if needed or just assert a valid navigation
        }
    }
}
