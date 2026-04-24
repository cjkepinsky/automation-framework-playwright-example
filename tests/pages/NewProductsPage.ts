import { expect, Page } from '@playwright/test';
import BasePage from './BasePage';
import { plLabels } from '../labels';

export default class NewProductsPage extends BasePage {
    private readonly productCards = this.page.locator('[class*="item-root"] a[class*="item-images"]');

    constructor(page: Page) {
        super(page);
    }

    async open() {
        await super.open(plLabels.urls.newProducts);
    }

    async isVisible() {
        await this.page.locator('.indicator-loader').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => undefined);
        await expect(this.page).toHaveURL(/nowosci/i);
        await expect(this.productCards.first()).toBeVisible({ timeout: 10000 });
    }

    async clickProduct(productNumber: number) {
        const productIndex = productNumber - 1;

        if (productIndex < 0) {
            throw new Error(`Product number must be greater than 0. Received: ${productNumber}`);
        }

        const productLocator = this.productCards.nth(productIndex);

        await productLocator.scrollIntoViewIfNeeded();
        await productLocator.waitFor({ state: 'visible' });
        await productLocator.click();
        await this.page.waitForLoadState('domcontentloaded');
    }
}
