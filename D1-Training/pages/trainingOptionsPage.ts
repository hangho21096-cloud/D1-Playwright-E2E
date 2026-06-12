import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class TrainingOptionsPage extends BasePage {

    // 2. Locate elements inside Adult Training
    readonly adultDescriptionText: Locator;
    readonly adultLearnMoreLink: Locator;

    // 3. Locate elements inside Scholastic (Youth) Training
    readonly scholasticDescriptionText: Locator;
    readonly scholasticLearnMoreLink: Locator;

    // 4. Bottom CTAs
    readonly findD1GlobalBtn: Locator;

    constructor(page: Page) {
        super(page);

        // Texts for Adult Staging
        this.adultDescriptionText = page.getByText(/Our adult programs combine strength/i);
        this.adultLearnMoreLink = page.locator('a[href*="adult-training"]').filter({ hasText: 'LEARN MORE' }).first();

        // Texts for Scholastic Staging
        this.scholasticDescriptionText = page.getByText(/We build the foundation for athletic success with age-appropriate/i);
        this.scholasticLearnMoreLink = page.locator('a[href*="youth-training"]').filter({ hasText: 'LEARN MORE' }).first();

        this.findD1GlobalBtn = page.getByRole('link', { name: /FIND A D1/i, exact: false }).last();
    }

    async verifyScholasticSection() {
        await expect(this.scholasticDescriptionText).toBeVisible({ timeout: 10000 });
    }

    async verifyAdultSection() {
        await expect(this.adultDescriptionText).toBeVisible({ timeout: 10000 });
    }

    async navigateToScholasticLearnMore() {
        await expect(this.scholasticLearnMoreLink).toBeVisible();
        await this.scholasticLearnMoreLink.click();
        
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL(/.*youth-training/i, { timeout: 10000 });
    }

    async navigateToAdultLearnMore() {
        await expect(this.adultLearnMoreLink).toBeVisible();
        await this.adultLearnMoreLink.click();
        
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL(/.*adult-training/i, { timeout: 10000 });
    }
}
