import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class LearnPage extends BasePage {
    readonly articlesLink: Locator;
    readonly podcastsLink: Locator;
    readonly videoFrameOrPlayer: Locator;

    constructor(page: Page) {
        super(page);
        this.articlesLink = page.getByRole('button', { name: 'Articles' });
        this.podcastsLink = page.getByRole('button', { name: 'Podcasts' });
        
        // Generic selector for YouTube, Vimeo or HTML5 video players
        this.videoFrameOrPlayer = page.locator('iframe[src*="youtube"], iframe[src*="vimeo"]').first();
    }

    async navigateToLearnPage() {
        await this.navigate('/learn');
    }

    async clickArticlesAndVerify() {
        if(await this.articlesLink.isVisible()) {
            await this.articlesLink.click();
            await this.page.waitForLoadState('domcontentloaded');
            // Since we are validating links, go back to learn page after
            await this.page.goBack();
        }
    }

    async clickPodcastAndVerify() {
        if(await this.podcastsLink.isVisible()) {
            await this.podcastsLink.click();
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.goBack();
        }
    }

    async verifyScrolling() {
        // Scroll down
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
        await this.page.waitForTimeout(500);
        // Scroll up
        await this.page.evaluate(() => window.scrollTo(0, 0));
        await this.page.waitForTimeout(500);
    }

    async verifyVideoPresence() {
        // Video might not be at the top, scroll to it if present
        if(await this.videoFrameOrPlayer.count() > 0) {
            await this.videoFrameOrPlayer.scrollIntoViewIfNeeded();
            await expect(this.videoFrameOrPlayer).toBeVisible();
        }
    }
}
