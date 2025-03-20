import { expect, Page } from "@playwright/test";
import BasePage from "./basePage";

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
            'Dodaj do koszyka'
        );
    }

    async clickSizeSelectionButton(size: "S" | "M" | "L" | "XL" | "XXL") {
        await this.clickByText(
            `div.option-rootSizeOptions-okg button[title="${size}"]`,
            size
        );
    }
}