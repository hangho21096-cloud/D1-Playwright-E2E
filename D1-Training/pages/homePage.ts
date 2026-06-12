import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
    readonly acceptCookiesButton: Locator;
    readonly trainLikeAthleteText: Locator;
    readonly whatIsD1Link: Locator;

    // --- Training Options Module ---
    readonly trainingOptionsLink: Locator;
    readonly learnMoreLink: Locator;

    constructor(page: Page) {
        super(page);
        this.trainLikeAthleteText = page.getByText('TRAIN LIKE AN ATHLETEHelping');
        this.acceptCookiesButton = page.getByRole('button', { name: 'Accept' });
        this.whatIsD1Link = page.getByRole('link', { name: 'What is D1?' });
        
        // Navigation to Training Options
        this.trainingOptionsLink = page.getByRole('link', { name: 'Training Options' });
        this.learnMoreLink = page.getByRole('link', { name: 'Navigate to LEARN MORE' }).first();
    }

    async acceptCookies() {
        // Interact with cookie banner if present
        await this.acceptCookiesButton.click();
    }

    async goToWhatIsD1() {
        await this.trainLikeAthleteText.click();
        await this.whatIsD1Link.click();
    }

    async goToTrainingOptionsPage() {
        // Instead of relying on potentially flaky hover menus or bad redirects,
        // we use direct URL navigation (matching your recording's fallback)
        // to ensure 100% reliability for E2E tests.
        await this.page.goto('https://staging.d1training.com/training-options');
    }
}
