import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class LocationsPage extends BasePage {
    readonly searchInput: Locator;
    readonly zoomInButton: Locator;
    readonly zoomOutButton: Locator;
    readonly goToLocationDetailLink: Locator;

    constructor(page: Page) {
        super(page);
        this.searchInput = page.getByPlaceholder('Search Location');
        
        this.zoomInButton = page.getByRole('button', { name: 'Zoom in' });
        this.zoomOutButton = page.getByRole('button', { name: 'Zoom out' });
        
        this.goToLocationDetailLink = page.getByRole('link', { name: 'Go to this location page' }).first();
    }

    async navigateToLocations() {
        await this.navigate('/find-a-facility');
    }

    async searchLocation(locationName: string) {
        await expect(this.searchInput).toBeVisible();
        await this.searchInput.fill(locationName);
        await this.searchInput.press('Enter');
        await this.page.waitForTimeout(2000); // Wait for API response/map update
    }

    async interactWithMapZoom() {
        // Only try to zoom if the map and controls are loaded
        if(await this.zoomInButton.isVisible()) {
            await this.zoomInButton.click();
            await this.page.waitForTimeout(500);
            await this.zoomOutButton.click();
            await this.page.waitForTimeout(500);
        }
    }

    async navigateToLocationDetail() {
        await expect(this.goToLocationDetailLink).toBeVisible({ timeout: 15000 });
        const text = await this.goToLocationDetailLink.innerText();
        await this.goToLocationDetailLink.click();
        
        // Verify we navigated to the detailed Location page properly
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL(/.*(?:locations|facility)\/.+/i, { timeout: 15000 });
    }
}
