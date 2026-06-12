import { test, expect } from '../fixtures/testBase';

test.describe('D1 Training - Learn Page Smoke Test @smoke', () => {

    test('Verify Learn page navigation and interactions', async ({ learnPage }) => {
        // 1. Navigate to Learn
        await learnPage.navigateToLearnPage();

        // 2. Click Articles and Podcast logic
        await learnPage.clickArticlesAndVerify();
        await learnPage.clickPodcastAndVerify();

        // 3. Scroll down and up
        await learnPage.verifyScrolling();

        // 4. Verify video is present
        await learnPage.verifyVideoPresence();
    });

});
