import { test, expect } from '../fixtures/testBase';
import env from '../utils/envHandler';

test.describe('E2E Training Options Navigation @e2e', () => {

    test('User browses to Training Options and views all program categories', async ({ page, homePage, trainingOptionsPage }) => {
        
        await test.step('Step 1: Open homepage and verify it loads', async () => {
            // Navigate dynamically based on executed environments
            await page.goto(env.baseUrl);
            await expect(page).toHaveTitle(/.*D1 Training.*/i);
        });

        await test.step('Step 2: Navigate to the Training Options section', async () => {
            await homePage.goToTrainingOptionsPage();
            
            // Wait for URL change to confirm we are safely inside the training options page
            await expect(page).toHaveURL(/.*training-options/i);
        });

        await test.step('Step 3: Explore Scholastic/Youth Training Programs', async () => {
            await trainingOptionsPage.exploreScholasticTraining();
            // Optional: Assert that one of the buttons was successfully clicked/is active
            await expect(trainingOptionsPage.scholasticGroupTrainingBtn).toBeVisible();
        });

        await test.step('Step 4: Explore Collegiate & Pro Training', async () => {
            await trainingOptionsPage.exploreProTraining();
            await expect(trainingOptionsPage.collegiateProTrainingBtn).toBeVisible();
        });

        await test.step('Step 5: Explore Adult & Special Training Options', async () => {
            await trainingOptionsPage.exploreAdultTraining();
            // Validate that we reached the end of the user flow successfully
            await expect(trainingOptionsPage.d1OnCampusBtn).toBeVisible();
        });
        
    });

});
