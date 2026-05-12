import { expect, Page } from '@playwright/test';
import { buildAppUrl } from 'config/environment';
import { BaseComponent } from 'pages/BaseComponent';
import { BasketSidebar } from 'pages/BasketSidebar';

export class BasePage extends BaseComponent {
    public basketSidebar: BasketSidebar;
    private readonly miniCartTrigger = this.page.getByRole('button', { name: /Przełącz mini koszyk/i });

    constructor(page: Page) {
        super(page);
        this.basketSidebar = new BasketSidebar(page);
    }

    public async open(path = '/'): Promise<void> {
        await this.page.goto(buildAppUrl(path), {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
    }

    public async clickTopMenuOption(optionText: string): Promise<void> {
        await this.clickByText(this.page.locator('nav a'), optionText);
    }

    public async openMiniCart(): Promise<void> {
        await expect(this.miniCartTrigger).toBeVisible();
        await this.miniCartTrigger.click();
    }
}
