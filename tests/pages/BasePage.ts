import { Page } from '@playwright/test';
import BaseComponent from './BaseComponent';
import BasketSidebar from './BasketSidebar';

export default class BasePage extends BaseComponent {
    public basketSidebar: BasketSidebar;

    constructor(page: Page) {
        super(page);
        this.basketSidebar = new BasketSidebar(page);
    }

    public async open(url: string) {
        await this.page.goto(url, { 
            waitUntil: 'load',
            timeout: 30000
        });
    }

    public async clickTopMenuOption(optionText: string) {
        await this.clickByText(this.page.locator('nav a'), optionText);
    }
}
