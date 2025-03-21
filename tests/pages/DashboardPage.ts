import { expect, Page } from "@playwright/test";
import BasePage from "./BasePage";
import { plLabels } from "../labels";

export default class DashboardPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async isVisible() {
        await expect(this.page.locator('div.dashboard')).toBeVisible()
    }

    async open() {
        await super.open(plLabels.urls.dashboard);
    }
}