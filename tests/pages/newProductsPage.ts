import { expect, Page } from "@playwright/test";
import BasePage from "./basePage"

export default class NewProductsPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async isVisible() {
        await expect(this.page.locator('h1:has-text("Nowości")')).toBeVisible()
    }

    async clickProduct(productNumber: number) {
        // Czekamy na zniknięcie loadera
        await this.page.waitForSelector('.indicator-loader', { state: 'hidden' });
        
        // Czekamy na załadowanie produktów i klikamy w pierwszy
        const productLocator = this.page.locator('a.itemQuarticon-images-tVx').first();
        
        // Scrollujemy do elementu
        await productLocator.scrollIntoViewIfNeeded();
        
        // Czekamy na widoczność elementu
        await productLocator.waitFor({ state: 'visible' });
        
        // Małe opóźnienie po przewinięciu
        await this.page.waitForTimeout(1000);
        
        // Klikamy w produkt używając JavaScript
        await this.page.evaluate((selector) => {
            const element = document.querySelector(selector);
            if (element) {
                element.click();
            }
        }, 'a.itemQuarticon-images-tVx');
        
        // Czekamy na załadowanie nowej strony
        await this.page.waitForLoadState('networkidle');
    }
}