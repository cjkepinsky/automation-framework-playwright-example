import { expect } from '@playwright/test';
import BasePage from './BasePage';
import { plLabels } from '../labels';

export default class BasketPage extends BasePage {
    private readonly totalPriceLocator = this.page.locator('[class*="priceSummary-totalPrice"]').first();
    private readonly quantitySelect = this.page.locator('select[name="quantity"]').first();

    async isVisible() {
        await expect(this.page).toHaveURL(/\/cart\b/);
        await expect(this.totalPriceLocator).toBeVisible({ timeout: 10000 });
    }

    async getTotalPrice(): Promise<number> {
        await expect(this.totalPriceLocator).toBeVisible();
        const priceText = await this.totalPriceLocator.textContent();
        if (!priceText) throw new Error('Total Basket price not found');

        const priceMatch = priceText.match(/(\d+[,\d]*)\s*PLN/);
        if (!priceMatch) {
            throw new Error(`Could not parse basket total price from "${priceText}"`);
        }

        return parseFloat(priceMatch[1].replace(',', '.'));
    }

    async changeQuantityForFirstProduct(quantity: number) {
        await expect(this.quantitySelect).toBeVisible();
        await this.quantitySelect.selectOption(String(quantity));
    }

    async isBasketTotalPriceHigherThan(initialTotalPrice: number) {
        await expect
            .poll(() => this.getTotalPrice(), {
                message: `Expected basket total price to be higher than ${initialTotalPrice}`,
            })
            .toBeGreaterThan(initialTotalPrice);
    }
}
