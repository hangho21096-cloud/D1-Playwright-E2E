import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class WhatIsD1Page extends BasePage {
    readonly personalTrainingHeading: Locator;
    readonly dynamicWarmUpButton: Locator;
    readonly performanceTrainingButton: Locator;
    readonly strengthDevelopmentButton: Locator;
    readonly coreConditioningButton: Locator;
    readonly coolDownButton: Locator;
    readonly findFacilityLink: Locator;

    constructor(page: Page) {
        super(page);
        this.personalTrainingHeading = page.getByRole('heading', { name: 'PERSONAL Training' });
        this.dynamicWarmUpButton = page.getByRole('button', { name: 'Dynamic warm-up' });
        this.performanceTrainingButton = page.getByRole('button', { name: 'PERFORMANCE Training' });
        this.strengthDevelopmentButton = page.getByRole('button', { name: 'STRENGTH Development' });
        this.coreConditioningButton = page.getByRole('button', { name: 'CORE & CONDITIONING' });
        this.coolDownButton = page.getByRole('button', { name: 'COOL-DOWN' });
        this.findFacilityLink = page.locator('a[href="/find-a-facility"]').first();
    }

    async exploreTrainingTypes() {
        await this.personalTrainingHeading.click();
        await this.dynamicWarmUpButton.click();
        await this.performanceTrainingButton.click();
        await this.strengthDevelopmentButton.click();
        await this.coreConditioningButton.click();
        await this.coolDownButton.click();
    }

    async proceedToFindFacility() {
        await this.findFacilityLink.click();
    }
}
