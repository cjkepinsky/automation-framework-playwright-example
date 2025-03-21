import { expect, Page } from "@playwright/test";
import BasePage from "./BasePage";
import { plLabels } from "../labels";

export default class BasketPage extends BasePage {
    private totalPriceSelector = 'div.summary-grandTotal-oU3 span.summary-amount-dfs';

    async isVisible() {
        await expect(this.page.locator('h1')).toHaveText(plLabels.basket.page.title);
    }

    async getTotalPrice(): Promise<number> {
        const priceText = await this.page.locator(this.totalPriceSelector).textContent();
        if (!priceText) throw new Error('Total Basket price not found');
        
        const price = parseFloat(priceText.replace(` ${plLabels.currency.short}`, '').replace(',', '.'));
        return price;
    }

    async clickIncreaseQuantityForFirstProduct() {
        await this.page.locator('table.cart-productListing--0q tr:first-of-type button.quantity-plus-xvN').click();
    }

    async clickUpdateBasket() {
        await this.page.locator('button.quantity-confirmButton-dUK').click();
        await this.page.waitForTimeout(3000);
    }

    async isBasketTotalPriceHigherThan(initialTotalPrice: number) {
        let newTotalPrice = await this.getTotalPrice();
    
        expect(newTotalPrice).toBeGreaterThan(initialTotalPrice);
    }
}