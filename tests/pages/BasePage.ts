import { Page } from '@playwright/test';
import BasketSidebar from './basketSidebar';

export default class BasePage {
    protected page: Page;
    public basketSidebar: BasketSidebar;

    constructor(page: Page) {
      this.page = page;
      this.basketSidebar = new BasketSidebar(page);
    }

    public async open(url: string) {
        await this.page.goto(url, { 
            waitUntil: 'load',
            timeout: 30000
        });
    }

    public async clickTopMenuOption(optionName: string) {
        await this.page.locator(`div#header-main a:has-text("${optionName}")`).click();
    }

}