import plLabels from 'labels/labels-pl.json';
import { BasePage } from 'pages/BasePage';

export class HomePage extends BasePage {
    private readonly cookiesDialog = this.page.locator('#CybotCookiebotDialog');
    private readonly cookiesDialogAgreeBtnLocator = this.page.locator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
    private readonly languageModalCloseBtnLocator = this.page.locator('button.betterMaskFit-closeButton-Mq0');

    async open(): Promise<void> {
        await super.open();
    }

    async acceptCookiesIfVisible(): Promise<void> {
        const isDialogVisible = await this.cookiesDialog
            .waitFor({ state: 'visible', timeout: 5000 })
            .then(() => true)
            .catch(() => false);

        if (isDialogVisible) {
            await this.cookiesDialogAgreeBtnLocator.click();
            await this.cookiesDialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => undefined);
        }
    }

    async closeLanguageModalIfVisible(): Promise<void> {
        if (await this.languageModalCloseBtnLocator.isVisible()) {
            await this.languageModalCloseBtnLocator.click();
        }
    }
}
