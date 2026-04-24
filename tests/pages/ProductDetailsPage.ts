import { expect, Page } from '@playwright/test';
import BasePage from './BasePage';
import { plLabels } from '../labels';

export default class ProductDetailsPage extends BasePage {
    private readonly productDetailsFormLocator = this.page.locator('form[class*="productFullDetail-mainForm"]').first();
    
    constructor(page: Page) {
        super(page);
    }

    async isVisible() {
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.productDetailsFormLocator).toBeVisible({ timeout: 10000 });
    }

    async clickAddToBasket() {
        const addToBasketButton = this.productDetailsFormLocator.getByRole('button', {
            name: plLabels.basket.addToBasket,
            exact: true,
        });

        await expect(addToBasketButton).toBeVisible();
        await addToBasketButton.click();
    }

    async clickSizeSelectionButton(size: string) {
        const sizeButton = this.productDetailsFormLocator.locator(`button[title="${size}"]`).first();

        await expect(sizeButton).toBeVisible();
        await sizeButton.click();
    }
}
