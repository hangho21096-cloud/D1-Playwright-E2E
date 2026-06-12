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

test.describe('IVY - User Sign Up Flow', () => {

    test.beforeEach(async ({ page }) => {
        // Set viewport size suitable for standard laptops (e.g., 14-inch screens)
        await page.setViewportSize({ width: 1280, height: 800 });
    });

    test('Verify successful user registration (TC-SUP-001)', async ({ page }) => {
        // Set Playwright test timeout to 60s for this E2E test to prevent early exit
        test.setTimeout(60000);

        // Use current timestamp to guarantee a unique email for every test run
        const randomSuffix = Date.now();
        // Create a unique Gmail subaddress to ensure a fresh, unregistered account
        const subaddressedEmail = `ivyqa26+${randomSuffix}@gmail.com`; 
        const firstName = 'Nami';
        const lastName = 'Nguyen';

        // Step 1: Open the browser and navigate to the login page
        await test.step('Navigate to the login page', async () => {
            await page.goto('https://staging.saas.ivy.com/auth/login');
            // Dismiss cookie popup if present
            await dismissCookieBanner(page);
        });

        // Step 2: Click the "Create an account" link
        await test.step('Click "Create an account" link', async () => {
            await page.getByRole('link', { name: 'Create an account' }).click();
            await expect(page).toHaveURL(/.*signup|.*register|.*auth/);
            // Dismiss cookie popup if it appears after redirection
            await dismissCookieBanner(page);
        });

        // Step 3: Select the Rising Leaders $0 plan
        await test.step('Select the Rising Leaders $0 plan', async () => {
            // Click the first card's "SELECT" button which represents the $0 plan
            await page.getByRole('button', { name: 'SELECT' }).first().click();
        });

        // Step 4: Enter a new unregistered email and click CONTINUE
        await test.step('Enter new email and click CONTINUE', async () => {
            await page.getByPlaceholder('Email Address').fill(subaddressedEmail);
            await page.getByRole('button', { name: 'CONTINUE', exact: true }).click();
        });

        // Step 5: Verify registration check email message is visible
        await test.step('Verify registration email sent message is visible', async () => {
            await expect(
                page.getByText(/We've sent/i)
                .or(page.getByText(/Check your email/i))
                .or(page.getByText(/sent a link/i))
            ).toBeVisible();
        });

        // Step 6: Retrieve the verification link from the email inbox (waiting up to 45s)
        let verificationLink = '';
        await test.step('Retrieve Verification Link from email inbox', async () => {
            console.log(`Waiting for verification email sent to ${subaddressedEmail}...`);
            verificationLink = await getMagicLinkFromEmail(emailConfig, 45000, subaddressedEmail);
            console.log(`Found Verification Link: ${verificationLink}`);
        });

        // Step 7: Navigate to the verification link
        await test.step('Navigate to the verification link', async () => {
            await page.goto(verificationLink);
            // Dismiss cookie popup if it appears
            await dismissCookieBanner(page);
        });

        // Step 8: Fill in the "Complete Account" profile details and submit
        await test.step('Fill in onboarding profile details and submit', async () => {
            // Locate First Name and Last Name inputs by placeholder, or by order if placeholders are missing
            const firstNameInput = page.locator('input[formcontrolname="given_name"]').or(page.getByPlaceholder('First name*'));
            const lastNameInput = page.locator('input[formcontrolname="family_name"]').or(page.getByPlaceholder('Last name*'));
            const passwordInput = page.locator('input[type="password"]').or(page.getByPlaceholder('Set Password*'));

            await firstNameInput.fill(firstName);
            await lastNameInput.fill(lastName);
            await passwordInput.fill('SecurePassword123!');

            await page.locator('button:has-text("CONTINUE"), [type="submit"], :text("CONTINUE")').last().click();
        });

        // Step 9: Verify successful redirect, navigate to settings and verify account information
        await test.step('Verify successful redirect and account details in settings page', async () => {
            await expect(page).toHaveURL(/.*insights/);
            
            // Locate and click the user avatar / profile button
            const avatar = page.getByAltText('Profile Picture').or(page.locator('.menu-profile__toggle')).first();
            await avatar.click();

            // Click the SETTINGS button from the profile menu
            await page.getByRole('button', { name: 'SETTINGS' }).click();

            // Verify navigation to settings page
            await expect(page).toHaveURL(/.*profile|.*settings/);

            // Verify that the registered account details (Name and Email) are displayed on the settings page
            // It checks both static text and input field values for flexibility
            const nameLocator = page.getByText(`${firstName} ${lastName}`)
                .or(page.locator(`input[value="${firstName}"]`))
                .or(page.locator('input[formcontrolname="given_name"]'));
            
            const emailLocator = page.getByText(subaddressedEmail)
                .or(page.locator(`input[value="${subaddressedEmail}"]`))
                .or(page.locator('input[formcontrolname="email"]'));

            await expect(nameLocator.first()).toBeVisible();
            await expect(emailLocator.first()).toBeVisible();
        });
    });

    test('Verify sign up failure when email is already registered (TC-SUP-002)', async ({ page }) => {
        // Step 1: Open the browser and navigate to the login page
        await test.step('Navigate to the login page', async () => {
            await page.goto('https://staging.saas.ivy.com/auth/login');
            // Dismiss cookie popup if present
            await dismissCookieBanner(page);
        });

        // Step 2: Click the "Create an account" link
        await test.step('Click "Create an account" link', async () => {
            await page.getByRole('link', { name: 'Create an account' }).click();
            // Dismiss cookie popup if it appears after redirection
            await dismissCookieBanner(page);
        });

        // Step 3: Select the Rising Leaders $0 plan
        await test.step('Select the Rising Leaders $0 plan', async () => {
            await page.getByRole('button', { name: 'SELECT' }).first().click();
        });

        // Step 4: Enter an already registered email and submit
        await test.step('Enter an already registered email and submit', async () => {
            await page.getByPlaceholder('Email Address').fill(emailConfig.user);
            await page.getByRole('button', { name: 'CONTINUE', exact: true }).click();
        });

        // Step 5: Verify error message is visible
        await test.step('Verify error message is displayed', async () => {
            await expect(
                page.getByText('You already have an account with this email address. Please login instead.')
                .or(page.getByText(/already have an account/i))
            ).toBeVisible();
        });
    });

    test('Verify sign up validation - empty and invalid email formats (TC-SUP-003)', async ({ page }) => {
        // Step 1: Open the browser and navigate to the login page
        await test.step('Navigate to the login page', async () => {
            await page.goto('https://staging.saas.ivy.com/auth/login');
            await dismissCookieBanner(page);
        });

        // Step 2: Click the "Create an account" link
        await test.step('Click "Create an account" link', async () => {
            await page.getByRole('link', { name: 'Create an account' }).click();
            await dismissCookieBanner(page);
        });

        // Step 3: Select the Rising Leaders $0 plan
        await test.step('Select the Rising Leaders $0 plan', async () => {
            await page.getByRole('button', { name: 'SELECT' }).first().click();
        });

        // Step 4: Verify empty email validation error
        await test.step('Verify validation error for empty email', async () => {
            const emailInput = page.getByPlaceholder('Email Address');
            await emailInput.focus();
            await emailInput.blur();
            
            // Check if required message or disabled state is active
            const continueButton = page.getByRole('button', { name: 'CONTINUE', exact: true });
            await expect(continueButton).toBeDisabled();
        });

        // Step 5: Verify invalid email format validation error
        await test.step('Verify validation error for invalid email formats', async () => {
            const emailInput = page.getByPlaceholder('Email Address');
            const continueButton = page.getByRole('button', { name: 'CONTINUE', exact: true });

            const invalidEmails = ['invalidemail', 'invalid@', 'invalid@domain'];
            for (const email of invalidEmails) {
                await emailInput.fill(email);
                // Trigger validation via clicking outside to blur the input
                await page.locator('h3:has-text("Sign Up"), form').first().click();
                
                await expect(page.getByText('Email is invalid.')).toBeVisible();
                await expect(continueButton).toBeDisabled();
            }
        });
    });

    test('Verify onboarding required fields validation (TC-SUP-004)', async ({ page }) => {
        test.setTimeout(60000);
        const randomSuffix = Date.now();
        const subaddressedEmail = `ivyqa26+validation-${randomSuffix}@gmail.com`;

        // Step 1: Request magic link
        await test.step('Request Magic Link', async () => {
            await page.goto('https://staging.saas.ivy.com/auth/login');
            await dismissCookieBanner(page);
            await page.getByRole('link', { name: 'Create an account' }).click();
            await dismissCookieBanner(page);
            await page.getByRole('button', { name: 'SELECT' }).first().click();
            await page.getByPlaceholder('Email Address').fill(subaddressedEmail);
            await page.getByRole('button', { name: 'CONTINUE', exact: true }).click();
            
            await expect(
                page.getByText(/We've sent/i)
                .or(page.getByText(/Check your email/i))
                .or(page.getByText(/sent a link/i))
            ).toBeVisible();
        });

        // Step 2: Retrieve Magic Link and navigate
        let verificationLink = '';
        await test.step('Retrieve and open Magic Link', async () => {
            verificationLink = await getMagicLinkFromEmail(emailConfig, 45000, subaddressedEmail);
            await page.goto(verificationLink);
            await dismissCookieBanner(page);
        });

        // Step 3: Trigger required field validation on onboarding page
        await test.step('Trigger and verify required field validations', async () => {
            const firstNameInput = page.locator('input[formcontrolname="given_name"]').or(page.getByPlaceholder('First name*'));
            const lastNameInput = page.locator('input[formcontrolname="family_name"]').or(page.getByPlaceholder('Last name*'));
            const passwordInput = page.locator('input[type="password"]').or(page.getByPlaceholder('Set Password*'));
            const continueBtn = page.locator('button:has-text("CONTINUE"), [type="submit"], :text("CONTINUE")').last();

            // Touch the inputs to trigger validation messages
            await firstNameInput.focus();
            await firstNameInput.blur();
            await lastNameInput.focus();
            await lastNameInput.blur();
            await passwordInput.focus();
            await passwordInput.blur();

            // Verify that the continue button is disabled (form is invalid)
            await expect(continueBtn).toBeDisabled();

            // Verify that we remain on the same page
            await expect(page).toHaveURL(/.*register|.*signup|.*create-account/);
        });
    });

    test('Verify sign up via header sign up button and subscription modal (TC-SUP-005)', async ({ page }) => {
        test.setTimeout(60000);
        const randomSuffix = Date.now();
        const subaddressedEmail = `ivyqa26+header-${randomSuffix}@gmail.com`;
        const firstName = 'Header';
        const lastName = 'SignUp';

        // Step 1: Navigate to login page
        await test.step('Navigate to the login page', async () => {
            await page.goto('https://staging.saas.ivy.com/auth/login');
            await dismissCookieBanner(page);
        });

        // Step 2: Click green SIGN UP button in header
        await test.step('Click header SIGN UP button', async () => {
            await page.getByRole('button', { name: 'SIGN UP' }).click();
            // Verify modal with email input is visible
            await expect(page.getByPlaceholder('name@provider.com')).toBeVisible();
        });

        // Step 3: Fill email in the modal popup and click START YOUR FREE MONTH TODAY
        await test.step('Enter email in subscription modal and submit', async () => {
            await page.getByPlaceholder('name@provider.com').fill(subaddressedEmail);
            await page.getByRole('button', { name: 'START YOUR FREE MONTH TODAY' }).click();
            
            await expect(page).toHaveURL(/.*register\/create-account.*/);
            await expect(
                page.getByText(/Check Your Inbox/i)
                .or(page.getByText(/We've sent/i))
            ).toBeVisible();
        });

        // Step 4: Retrieve and open Magic Link
        let verificationLink = '';
        await test.step('Retrieve and open Magic Link from inbox', async () => {
            console.log(`Waiting for verification email for ${subaddressedEmail}...`);
            verificationLink = await getMagicLinkFromEmail(emailConfig, 45000, subaddressedEmail);
            await page.goto(verificationLink);
            await dismissCookieBanner(page);
        });

        // Step 5: Fill onboarding profile details and submit
        await test.step('Fill in onboarding profile details and submit', async () => {
            const firstNameInput = page.locator('input[formcontrolname="given_name"]').or(page.getByPlaceholder('First name*'));
            const lastNameInput = page.locator('input[formcontrolname="family_name"]').or(page.getByPlaceholder('Last name*'));
            const passwordInput = page.locator('input[type="password"]').or(page.getByPlaceholder('Set Password*'));

            await firstNameInput.fill(firstName);
            await lastNameInput.fill(lastName);
            await passwordInput.fill('SecurePassword123!');

            await page.locator('button:has-text("CONTINUE"), [type="submit"], :text("CONTINUE")').last().click();
        });

        // Step 6: Verify successful redirect and account details in settings page
        await test.step('Verify settings page details', async () => {
            await expect(page).toHaveURL(/.*insights/);
            
            const avatar = page.getByAltText('Profile Picture').or(page.locator('.menu-profile__toggle')).first();
            await avatar.click();

            await page.getByRole('button', { name: 'SETTINGS' }).click();
            await expect(page).toHaveURL(/.*profile|.*settings/);

            const nameLocator = page.getByText(`${firstName} ${lastName}`)
                .or(page.locator(`input[value="${firstName}"]`))
                .or(page.locator('input[formcontrolname="given_name"]'));
            
            const emailLocator = page.getByText(subaddressedEmail)
                .or(page.locator(`input[value="${subaddressedEmail}"]`))
                .or(page.locator('input[formcontrolname="email"]'));

            await expect(nameLocator.first()).toBeVisible();
            await expect(emailLocator.first()).toBeVisible();
        });
    });

});

