import { Page } from '@playwright/test';
import BasePage from './BasePage';
import { plLabels } from '../labels';

export default class HomePage extends BasePage {
    private readonly cookiesDialog = this.page.locator('#CybotCookiebotDialog');
    private readonly cookiesDialogAgreeBtnLocator = this.page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
    private readonly languageModalCloseBtnLocator = this.page.locator('button.betterMaskFit-closeButton-Mq0');

    constructor(page: Page) {
        super(page);
    }

    async open() {
        await super.open(plLabels.urls.home);
    }

    async acceptCookiesIfVisible() {
        const isDialogVisible = await this.cookiesDialog
            .waitFor({ state: 'visible', timeout: 5000 })
            .then(() => true)
            .catch(() => false);

        if (isDialogVisible) {
            await this.cookiesDialogAgreeBtnLocator.click();
            await this.cookiesDialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => undefined);
        }
    }

    async closeLanguageModalIfVisible() {
        if (await this.languageModalCloseBtnLocator.isVisible()) {
            await this.languageModalCloseBtnLocator.click();
        }
    }
}
