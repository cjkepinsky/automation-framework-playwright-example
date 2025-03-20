import { expect } from "playwright/test";
import BasePage from "./basePage";

export default class BasketPage extends BasePage {
    private totalPriceSelector = 'div.summary-grandTotal-oU3 span.summary-amount-dfs';

    async isVisible() {
        await expect(this.page.locator('h1')).toHaveText('Twój koszyk');
    }

    async getTotalPrice(): Promise<number> {
        const priceText = await this.page.locator(this.totalPriceSelector).textContent();
        if (!priceText) throw new Error('Nie znaleziono ceny');
        
        const price = parseFloat(priceText.replace(' PLN', '').replace(',', '.'));
        console.log("price: ", price);
        return price;
    }

    async clickIncreaseQuantityForFirstProduct() {
        await this.page.locator('table.cart-productListing--0q tr:first-of-type button.quantity-plus-xvN').click();
    }

    async clickUpdateBasket() {
        await this.page.locator('button.quantity-confirmButton-dUK').click();
        await this.page.waitForTimeout(3000);
    }

    async isBasketTotalPRiceHigherThan(initialTotalPrice: number) {
        let newTotalPrice = await this.getTotalPrice();
    
        expect(newTotalPrice).toBeGreaterThan(initialTotalPrice);
    }
}