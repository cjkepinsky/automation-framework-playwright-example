import { expect, Page } from "@playwright/test";
import BasePage from "./basePage";

export default class ProductDetailsPage extends BasePage {
    private productDetailsFormLocator = this.page.locator('form.productFullDetail-mainForm-EW7');
    private addToBasketButtonLocator = this.productDetailsFormLocator.locator('button:has-text("Dodaj do koszyka")');
    
    constructor(page: Page) {
        super(page);
    }

    async isVisible() {
        await expect(this.productDetailsFormLocator).toBeVisible()
    }

    async clickAddToBasket() {
        await this.addToBasketButtonLocator.click();
    }

    async clickSizeSelectionButton(size: "S" | "M" | "L" | "XL" | "XXL") {
        await this.page.locator(`div.option-rootSizeOptions-okg button:has-text("${size}")`).click();
    }

}