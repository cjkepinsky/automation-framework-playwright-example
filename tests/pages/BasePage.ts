import { Page } from '@playwright/test';
import BaseComponent from './baseComponent';
import BasketSidebar from './basketSidebar';

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

    public async clickTopMenuOption(optionName: string) {
        await this.page.locator(`nav a:has-text("${optionName}")`).click();
        await this.page.waitForLoadState('networkidle');
    }
}