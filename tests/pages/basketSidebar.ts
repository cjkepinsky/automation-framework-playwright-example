import { expect, Page } from "@playwright/test";

export default class BasketSidebar {
    private page :Page

    constructor(page: Page) {
        this.page = page;
    }

    async isVisible() {
        await expect(this.page.locator('div.miniCart-footer-xKn')).toBeVisible()
    }

    async clickShowBasket() {
        await this.page.locator('div.miniCart-footer-xKn button:has-text("Pokaż koszyk")').click();
    }
    
    
}