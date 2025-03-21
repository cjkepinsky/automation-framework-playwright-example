import { expect, Page } from "@playwright/test";
import BasePage from "./BasePage"

export default class NewProductsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async isVisible() {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForSelector('.indicator-loader', { state: 'hidden', timeout: 10000 });
        await expect(this.page.locator('h1:has-text("Nowości")')).toBeVisible({ timeout: 10000 });
    }

    async clickProduct(productNumber: number) {
        const productLocator = this.page.locator('a.itemQuarticon-images-tVx').first();
        await productLocator.scrollIntoViewIfNeeded();
        await productLocator.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(1000);
        
        await this.page.evaluate((selector) => {
            const element = document.querySelector(selector) as HTMLElement;
            if (element) {
                element.click();
            }
        }, 'a.itemQuarticon-images-tVx');
        await this.page.waitForLoadState('networkidle');
    }
}