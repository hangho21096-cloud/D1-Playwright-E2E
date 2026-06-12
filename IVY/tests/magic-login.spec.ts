import { test, expect } from '@playwright/test';
import { getMagicLinkFromEmail, EmailConfig } from '../utils/emailHelper';
import { dismissCookieBanner } from '../utils/cookieHelper';
import resolvedConfig from '../utils/envHandler';

// Email configuration extracted from utils/envHandler.ts
const emailConfig: EmailConfig = {
    user: resolvedConfig.testAccount,
    pass: resolvedConfig.testPass,
    host: 'imap.gmail.com',
    port: 993,
    secure: true
};

test.describe('IVY - Magic Link Login Flow', () => {

    test.beforeEach(async ({ page }) => {
        // Set viewport size suitable for standard laptops (e.g., 14-inch screens)
        await page.setViewportSize({ width: 1280, height: 800 });
    });

    test('Verify login using magic link successfully (TC-LOG-001)', async ({ page }) => {
        // Set Playwright test timeout to 60s for this E2E test to prevent early exit
        test.setTimeout(60000);

        // Step 1: Open the browser and navigate to the login page
        await test.step('Navigate to the login page', async () => {
            await page.goto('https://staging.saas.ivy.com/auth/login');
            // Dismiss cookie popup if present
            await dismissCookieBanner(page);
        });

        // Step 2: Enter valid email and click CONTINUE
        await test.step('Enter valid email and click CONTINUE', async () => {
            await page.getByPlaceholder('Email Address').fill(emailConfig.user);
            await page.getByRole('button', { name: 'CONTINUE', exact: true }).click();
        });

        // Step 3: Verify the success message is displayed
        await test.step('Verify email sent message is visible', async () => {
            await expect(
                page.getByText(/We've sent/i)
                .or(page.getByText(/Check your email/i))
                .or(page.getByText(/sent a link/i))
            ).toBeVisible();
        });

        // Step 4: Retrieve the magic link from the email inbox
        let magicLink = '';
        await test.step('Retrieve Magic Link from inbox', async () => {
            console.log('Waiting for the Magic Link email to be sent...');
            magicLink = await getMagicLinkFromEmail(emailConfig, 45000, emailConfig.user);
            console.log(`Found Magic Link: ${magicLink}`);
        });

        // Step 5: Navigate to the Magic Link
        await test.step('Navigate to the retrieved Magic Link', async () => {
            await page.goto(magicLink);
            // Dismiss cookie popup if it appears after redirection
            await dismissCookieBanner(page);
        });

        // Step 6: Verify successful redirection to dashboard/insights
        await test.step('Verify successful login and redirect to insights', async () => {
            await expect(page).toHaveURL(/.*insights/);
            await expect(
                page.getByText('Dashboard')
                .or(page.getByText('Welcome'))
                .or(page.locator('header'))
            ).toBeVisible();
        });
    });

    test('Verify error message when logging in with a non-existent account (TC-LOG-002)', async ({ page }) => {
        // Step 1: Open the browser and navigate to the login page
        await test.step('Navigate to the login page', async () => {
            await page.goto('https://staging.saas.ivy.com/auth/login');
            // Dismiss cookie popup if present
            await dismissCookieBanner(page);
        });

        // Step 2: Enter an unregistered email and click CONTINUE
        await test.step('Enter an unregistered email and click CONTINUE', async () => {
            const unregisteredEmail = `unregistered-${Date.now()}@gmail.com`;
            await page.getByPlaceholder('Email Address').fill(unregisteredEmail);
            await page.getByRole('button', { name: 'CONTINUE', exact: true }).click();
        });

        // Step 3: Verify error message is displayed
        await test.step('Verify error message "Account Does Not Exist, Please Sign Up!" is visible', async () => {
            await expect(
                page.getByText('Account Does Not Exist, Please Sign Up!')
                .or(page.getByText(/Account Does Not Exist/i))
            ).toBeVisible();
        });
    });

    test('Verify login validation - empty and invalid email formats (TC-LOG-003)', async ({ page }) => {
        // Step 1: Open the browser and navigate to the login page
        await test.step('Navigate to the login page', async () => {
            await page.goto('https://staging.saas.ivy.com/auth/login');
            await dismissCookieBanner(page);
        });

        // Step 2: Verify empty email validation error
        await test.step('Verify validation error for empty email', async () => {
            const emailInput = page.getByPlaceholder('Email Address');
            await emailInput.focus();
            await emailInput.blur();
            
            const continueButton = page.getByRole('button', { name: 'CONTINUE', exact: true });
            await expect(continueButton).toBeDisabled();
        });

        // Step 3: Verify invalid email format validation error
        await test.step('Verify validation error for invalid email formats', async () => {
            const emailInput = page.getByPlaceholder('Email Address');
            const continueButton = page.getByRole('button', { name: 'CONTINUE', exact: true });

            const invalidEmails = ['invalidemail', 'invalid@', 'invalid@domain'];
            for (const email of invalidEmails) {
                await emailInput.fill(email);
                await emailInput.press('Tab');
                
                await expect(page.getByText('Email is invalid.')).toBeVisible();
                await expect(continueButton).toBeDisabled();
            }
        });
    });

    test('Verify successful logout and session clearing (TC-LOG-004)', async ({ page }) => {
        test.setTimeout(60000);

        // Step 1: Navigate to the login page
        await test.step('Navigate to the login page', async () => {
            await page.goto('https://staging.saas.ivy.com/auth/login');
            await dismissCookieBanner(page);
        });

        // Step 2: Enter valid registered email and click CONTINUE
        await test.step('Enter valid email and click CONTINUE', async () => {
            await page.getByPlaceholder('Email Address').fill(emailConfig.user);
            await page.getByRole('button', { name: 'CONTINUE', exact: true }).click();
        });

        // Step 3: Verify email sent message is visible
        await test.step('Verify email sent message is visible', async () => {
            await expect(
                page.getByText(/We've sent/i)
                .or(page.getByText(/Check your email/i))
                .or(page.getByText(/sent a link/i))
            ).toBeVisible();
        });

        // Step 4: Retrieve the magic link from the email inbox
        let magicLink = '';
        await test.step('Retrieve Magic Link from inbox', async () => {
            magicLink = await getMagicLinkFromEmail(emailConfig, 45000, emailConfig.user);
        });

        // Step 5: Navigate to the Magic Link and verify login
        await test.step('Navigate to Magic Link', async () => {
            await page.goto(magicLink);
            await dismissCookieBanner(page);
            await expect(page).toHaveURL(/.*insights/);
        });

        // Step 6: Reload page and verify session persistence
        await test.step('Verify session persists on reload', async () => {
            await page.reload();
            await expect(page).toHaveURL(/.*insights/);
        });

        // Step 7: Click avatar and click LOGOUT
        await test.step('Perform logout', async () => {
            const avatar = page.getByAltText('Profile Picture').or(page.locator('.menu-profile__toggle')).first();
            await avatar.click();

            await page.getByRole('button', { name: 'LOGOUT' }).click();
            await expect(page).toHaveURL(/.*login/);
        });

        // Step 8: Verify that back button does not log the user back in
        await test.step('Verify back button is blocked', async () => {
            await page.goBack();
            // User should either be kept on login, or redirected back to login immediately
            await page.waitForTimeout(3000); // Allow redirect logic to trigger if any
            await expect(page).toHaveURL(/.*login|.*auth/);
        });
    });

});

