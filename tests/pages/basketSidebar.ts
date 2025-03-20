import { expect, Page } from "@playwright/test";

export default class BasketSidebar {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async isVisible() {
        await expect(this.page.locator('div.miniCart-footer-xKn')).toBeVisible()
    }

    async clickShowBasket() {
        await this.page.evaluate(() => {
            const buttons = document.querySelectorAll('div.miniCart-footer-xKn button');
            const showBasketButton = Array.from(buttons).find(button => button.textContent?.includes('Pokaż koszyk'));
            if (showBasketButton) {
                (showBasketButton as HTMLButtonElement).click();
            }
        });
    }
    
    
}