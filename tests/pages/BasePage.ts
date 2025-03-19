import { Page } from '@playwright/test';

export default class BasePage {
    protected page: Page;

    constructor(page: Page) {
      this.page = page;
    }

    public async open(url: string) {
        await this.page.goto(url, { 
            waitUntil: 'load',
            timeout: 30000
        });
    }

}