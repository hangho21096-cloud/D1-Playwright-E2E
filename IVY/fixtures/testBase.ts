import { test as baseTest } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { WhatIsD1Page } from '../pages/whatIsD1Page';
import { TrainingOptionsPage } from '../pages/trainingOptionsPage';
import { ApparelGearPage } from '../pages/apparelGearPage';
import { LearnPage } from '../pages/learnPage';
import { AllAccessPage } from '../pages/allAccessPage';
import { LocationsPage } from '../pages/locationsPage';

// Declare types for custom fixtures
type D1Fixtures = {
    homePage: HomePage;
    whatIsD1Page: WhatIsD1Page;
    trainingOptionsPage: TrainingOptionsPage;
    apparelGearPage: ApparelGearPage;
    learnPage: LearnPage;
    allAccessPage: AllAccessPage;
    locationsPage: LocationsPage;
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
    },
    apparelGearPage: async ({ page }, use) => {
        const apparelGearPage = new ApparelGearPage(page);
        await use(apparelGearPage);
    },
    learnPage: async ({ page }, use) => {
        const learnPage = new LearnPage(page);
        await use(learnPage);
    },
    allAccessPage: async ({ page }, use) => {
        const allAccessPage = new AllAccessPage(page);
        await use(allAccessPage);
    },
    locationsPage: async ({ page }, use) => {
        const locationsPage = new LocationsPage(page);
        await use(locationsPage);
    }
});

export { expect } from '@playwright/test';
