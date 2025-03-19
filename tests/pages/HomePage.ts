import { expect } from "playwright/test";
import BasePage from "./basePage";

export default class HomePage extends BasePage {

    private loginLinkLocator = this.page.locator('a.accountTrigger-trigger-wml')
    private cookiesDialogAgreeBtnLocator = this.page.locator('button#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll')

    async open() {
        await super.open('https://4f.com.pl/')
    }

    async isLoginLinkVisible() {
        await expect(this.loginLinkLocator).toBeVisible()
    }

    async clickLoginLink() {
        await this.loginLinkLocator.click()
    }

    async closeCookiesDialog() {
        await this.cookiesDialogAgreeBtnLocator.click()
    }

    async isCloseCookiesDialogBtnVisible() {
        await expect(this.cookiesDialogAgreeBtnLocator).toBeVisible()
    }
}