import { test, expect } from '../fixtures/testBase';
import env from '../utils/envHandler';

test.describe('D1 Training - Header and Footer Smoke Test @smoke', () => {

    test('Verify Header and Footer presence across pages', async ({ homePage, whatIsD1Page }) => {
        // Run check on Home Page
        await homePage.navigate(env.baseUrl);
        await homePage.verifyHeaderAndFooterVisible();

        // Run check on What is D1 page
        await whatIsD1Page.navigate(`${env.baseUrl}/what-is-d1`);
        await whatIsD1Page.verifyHeaderAndFooterVisible();
    });

});
