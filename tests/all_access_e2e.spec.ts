import { test, expect } from '../fixtures/testBase';

test.describe('D1 Training - All Access Smoke Test @smoke', () => {

    test('Verify All Access buttons are working', async ({ allAccessPage }) => {
        // 1. Navigate to All Access
        await allAccessPage.navigateToAllAccess();

        // 2. Click main CTA button
        await allAccessPage.verifyCtaButtonsFunctional();
    });

});
