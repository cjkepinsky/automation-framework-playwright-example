import { expect } from "@playwright/test";
import BasePage from "./basePage";

export default class DashboardPage extends BasePage {
    async isVisible() {
        await expect(this.page.locator('div.dashboard')).toBeVisible()
    }

    async open() {
        await super.open('https://4f.com.pl/customer/account');
    }
}