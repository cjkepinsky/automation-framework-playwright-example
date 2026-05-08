import { expect } from '@playwright/test';
import plLabels from 'labels/labels-pl.json';
import { BasePage } from 'pages/BasePage';

export class ProductDetailsPage extends BasePage {
    private readonly productDetailsFormLocator = this.page.locator('form[class*="productFullDetail-mainForm"]').first();

    async isVisible(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.productDetailsFormLocator).toBeVisible({ timeout: 10000 });
    }

    async clickAddToBasket(): Promise<void> {
        const addToBasketButton = this.productDetailsFormLocator.getByRole('button', {
            name: plLabels.basket.addToBasket,
            exact: true,
        });
        await expect(addToBasketButton).toBeVisible();
        await addToBasketButton.click();
    }

    async clickSizeSelectionButton(size: string): Promise<void> {
        const sizeButton = this.productDetailsFormLocator.locator(`button[title="${size}"]`).first();
        await expect(sizeButton).toBeVisible();
        await sizeButton.click();
    }
}
