import { test, expect } from '../fixtures/testBase';

test.describe('D1 Training - Apparel & Gear Smoke Test @smoke', () => {

    test('Verify Apparel & Gear page elements', async ({ apparelGearPage }) => {
        // 1. Navigate to Apparel & Gear
        await apparelGearPage.navigateToApparel();

        // 2. Verify products load
        await apparelGearPage.verifyProductDisplay();

        // 3. Verify pagination/carousel arrows are interactive
        await apparelGearPage.verifyCarouselArrows();

        // 4. Click a product and verify navigation
        await apparelGearPage.clickFirstProduct();
    });

});
