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
        const productLocator = this.page.locator(`div.gallery-items-IuB div.item-root-qu4:nth-child(${productNumber})`);
        await productLocator.click({ force: true });
    }
}