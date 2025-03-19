import { expect } from "@playwright/test";
import BasePage from "./basePage";

export default class DashboardPage extends BasePage {
    async isVisible() {
        await expect(this.page.locator('div.dashboard')).toBeVisible()
    }
}