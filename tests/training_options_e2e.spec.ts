import { test, expect } from '../fixtures/testBase';
import env from '../utils/envHandler';

test.describe('E2E Training Options Navigation STAGING @e2e', () => {

    test('User browses Training Options and explores specific demographic programs', async ({ page, homePage, trainingOptionsPage }) => {
        
        await test.step('Step 1: Open homepage and verify it loads', async () => {
            await homePage.navigate(env.baseUrl);
            await expect(page).toHaveTitle(/.*D1 Training.*/i);
        });

        await test.step('Step 2: Navigate to the Training Options section', async () => {
            await homePage.goToTrainingOptionsPage();
            await expect(page).toHaveURL(/.*training-options/i);
        });

        await test.step('Step 3: User explores Adult Training', async () => {
            // Verify adult description exists
            await trainingOptionsPage.verifyAdultSection();

            // Decides to learn more, clicks CTA and verifies URL successfully transitioned
            await trainingOptionsPage.navigateToAdultLearnMore();
        });

        await test.step('Step 4: User navigates back and investigates Scholastic (Youth) Training', async () => {
            // Go back to Training Options page
            await page.goBack();
            await expect(page).toHaveURL(/.*training-options/i);

            // Verify youth description exists
            await trainingOptionsPage.verifyScholasticSection();

            // Decides to learn more about Youth training
            await trainingOptionsPage.navigateToScholasticLearnMore();
        });

    });

});
