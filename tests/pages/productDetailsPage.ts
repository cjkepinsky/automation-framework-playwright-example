import { expect, Page } from "@playwright/test";
import BasePage from "./basePage";

export default class ProductDetailsPage extends BasePage {
    private productDetailsFormLocator = this.page.locator('form.productFullDetail-mainForm-EW7');
    private addToBasketButtonLocator = this.page.locator('form.productFullDetail-mainForm-EW7 button[type="submit"]:has-text("Dodaj do koszyka")');
    
    constructor(page: Page) {
        super(page);
    }

    async isVisible() {
        await this.page.waitForLoadState('load');
        await expect(this.productDetailsFormLocator).toBeVisible({ timeout: 10000 });
    }

    async clickAddToBasket() {
        await this.addToBasketButtonLocator.click();
    }

    async clickSizeSelectionButton(size: "S" | "M" | "L" | "XL" | "XXL") {
        await this.page.evaluate((size) => {
            const element = document.querySelector(`div.option-rootSizeOptions-okg button[title="${size}"]`) as HTMLButtonElement;
            if (element) {
                element.click();
            }
        }, size);
    }

}