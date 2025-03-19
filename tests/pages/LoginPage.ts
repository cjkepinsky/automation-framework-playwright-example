import { expect } from '@playwright/test';
import BasePage from "./basePage";

export default class LoginPage extends BasePage {
    async isVisible() {
        await expect(this.page.locator('div.signIn-root-gus form')).toBeVisible()
    }

    async login(email: string, password: string) {
        await this.page.locator('input[name="email"]').fill(email)
        await this.page.locator('input[name="password"]').fill(password)
        await this.page.locator('button[type="submit"]').click()
    }
    
    async typeLogin(login: string) {
        await this.page.locator('input[name="email"]').fill(login)
    }

    async typePassword(password: string) {
        await this.page.locator('input[name="password"]').fill(password)
    }

    async clickLoginButton() {
        await this.page.locator('button[type="submit"]').click()
    }
    
}