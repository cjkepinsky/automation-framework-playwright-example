import { expect } from "playwright/test";
import BasePage from "./basePage";

export default class BasketPage extends BasePage {
    async isVisible() {
        await expect(this.page.locator('h1')).toHaveText('Twój koszyk');
    }
}