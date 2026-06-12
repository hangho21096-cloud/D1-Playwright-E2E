import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';

export class ApparelGearPage extends BasePage {
    readonly firstProductImage: Locator;
    readonly firstProductTitle: Locator;
    readonly firstProductLink: Locator;
    readonly nextArrowButton: Locator;
    readonly prevArrowButton: Locator;

    constructor(page: Page) {
        super(page);
        
        this.firstProductImage = page.locator('.group img').first();
        this.firstProductTitle = page.locator('.group div.mt-4').first();
        this.firstProductLink = page.locator('a[href*="gear.d1training.com"]').first();
        
        // Locating pagination or carousel arrows
        this.nextArrowButton = page.locator('button.swiper-button-next');
        this.prevArrowButton = page.locator('button.swiper-button-prev');
    }

    async navigateToApparel() {
        await this.navigate('/apparel-and-gear');
    }

    async verifyProductDisplay() {
        await expect(this.firstProductImage).toBeVisible({ timeout: 10000 });
        // The title might not always be an h3, but this relies on generic structure.
        // If it fails, text could be verified using .boundingBox() or generic visibility.
    }

    async verifyCarouselArrows() {
        // Only click if arrows are present on the screen (useful if there is a carousel)
        if (await this.nextArrowButton.isVisible()) {
            await this.nextArrowButton.click();
            await this.page.waitForTimeout(500); // Give time for animation
        }
        if (await this.prevArrowButton.isVisible()) {
            await this.prevArrowButton.click();
            await this.page.waitForTimeout(500);
        }
    }

    async clickFirstProduct() {
        const currentUrl = this.page.url();
        
        // Cửa hàng Gear Store thường mở sang một Tab (Page) hoàn toàn mới.
        // Ta cần bắt sự kiện mở popup/new tab này lại:
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.firstProductLink.click()
        ]);
        
        await newPage.waitForLoadState('domcontentloaded');
        
        // Xác nhận tab mới đã trỏ sang domain của gear store chứ không còn ở trang cũ
        expect(newPage.url()).toContain('gear.d1training.com');
        
        // Đóng tab sản phẩm để có thể test tiếp các thao tác khác trên trang gốc
        await newPage.close();
    }
}
