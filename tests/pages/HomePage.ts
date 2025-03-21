import { expect, Page } from "playwright/test";
import BasePage from "./BasePage";
import { plLabels } from "../labels";

export default class HomePage extends BasePage {

    private loginLinkLocator = this.page.locator('a.accountTrigger-trigger-wml')
    private cookiesDialogAgreeBtnLocator = this.page.locator('button#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll')

    constructor(page: Page) {
        super(page);
    }

    async open() {
        await super.open(plLabels.urls.home)
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

    async clickLanguageModalCloseBtn() {
        await this.page.locator('button.betterMaskFit-closeButton-Mq0').click();
    }
}