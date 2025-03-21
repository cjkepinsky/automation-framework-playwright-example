import { expect, Page } from "@playwright/test";
import BasePage from "./BasePage";
import { plLabels } from "../labels";

export default class ProductDetailsPage extends BasePage {
    private productDetailsFormLocator = this.page.locator('form.productFullDetail-mainForm-EW7');
    
    constructor(page: Page) {
        super(page);
    }

    async isVisible() {
        await this.page.waitForLoadState('load');
        await expect(this.productDetailsFormLocator).toBeVisible({ timeout: 10000 });
    }

    async clickAddToBasket() {
        await this.clickByText(
            'form.productFullDetail-mainForm-EW7 button[type="submit"]', 
            plLabels.basket.addToBasket
        );
    }

    async clickSizeSelectionButton(size: typeof plLabels.sizes[number]) {
        await this.clickByText(
            `div.option-rootSizeOptions-okg button[title="${plLabels.sizes[size]}"]`,
            plLabels.sizes[size]
        );
    }
}