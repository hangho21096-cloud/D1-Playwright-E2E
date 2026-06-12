import { test, expect } from '@playwright/test';

test.describe('IVY - Basic Sanity Test', () => {
    test('Verify page title', async ({ page }) => {
        await page.goto('https://playwright.dev/');
        await expect(page).toHaveTitle(/Playwright/);
    });
});
