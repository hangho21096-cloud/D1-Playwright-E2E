import { test, expect } from '../fixtures/testBase';
import env from '../utils/envHandler';

test.describe('D1 Training - What is D1? Flow @e2e', () => {

    test('Explore "What is D1" and Find Facility', async ({ page, homePage, whatIsD1Page }) => {
        // 1. Navigate to the dynamic homepage URL based on ENV flag
        await page.goto(env.baseUrl);

        // 2. Accept cookies or initial banners if they exist
        try {
            await homePage.acceptCookies();
        } catch (e) {
            // Ignore if the accept cookies button is not present
        }

        // 3. Navigate to "What Is D1" page
        await homePage.goToWhatIsD1();

        // 4. Explore training methodologies
        await whatIsD1Page.exploreTrainingTypes();

        // 5. Click "Find a Facility" (equivalent to Add to Cart / Checkout flow)
        await whatIsD1Page.proceedToFindFacility();

        // 6. Verify navigation to the facility/locations page
        await expect(page).toHaveURL(/.*locations|.*facility/i,{ timeout: 15000 });
    });

});
