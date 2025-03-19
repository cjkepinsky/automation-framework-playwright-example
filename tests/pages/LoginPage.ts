import { expect } from '@playwright/test';
import BasePage from "./BasePage";

export default class LoginPage extends BasePage {
    async isVisible() {
        await expect(this.page.locator('div.signIn-root-gus form')).toBeVisible()
    }

    async login(email: string, password: string) {
        await this.page.locator('input[name="email"]').fill(email)
        await this.page.locator('input[name="password"]').fill(password)
        await this.page.locator('button[type="submit"]').click()
    }
}