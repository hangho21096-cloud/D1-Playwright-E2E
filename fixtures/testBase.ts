import { test as baseTest } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { WhatIsD1Page } from '../pages/whatIsD1Page';
import { TrainingOptionsPage } from '../pages/trainingOptionsPage';

// Declare types for custom fixtures
type D1Fixtures = {
    homePage: HomePage;
    whatIsD1Page: WhatIsD1Page;
    trainingOptionsPage: TrainingOptionsPage;
};

// Extend base Playwright test to include POM fixtures
export const test = baseTest.extend<D1Fixtures>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },
    whatIsD1Page: async ({ page }, use) => {
        const whatIsD1Page = new WhatIsD1Page(page);
        await use(whatIsD1Page);
    },
    trainingOptionsPage: async ({ page }, use) => {
        const trainingOptionsPage = new TrainingOptionsPage(page);
        await use(trainingOptionsPage);
    }
});

export { expect } from '@playwright/test';
