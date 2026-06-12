import { Page } from '@playwright/test';

/**
 * Automatically detects and dismisses cookie popups if present on the page.
 * @param page Playwright Page instance
 */
export async function dismissCookieBanner(page: Page): Promise<void> {
    try {
        // Find buttons with common cookie accept/dismiss labels or close icons
        const cookieButton = page.getByRole('button', { name: /accept|allow|dismiss|agree|ok|close/i })
            .or(page.locator('[class*="cookie"] button'))
            .or(page.locator('[id*="cookie"] button'));
            
        // Wait up to 3 seconds if the cookie banner loads slowly
        await cookieButton.first().click({ timeout: 3000 });
        console.log('✅ Cookie banner dismissed successfully.');
    } catch (e) {
        // Ignore and proceed if the banner does not appear
        console.log('ℹ️ No cookie banner detected or already accepted.');
    }
}
