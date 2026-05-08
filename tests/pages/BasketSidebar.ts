import { expect } from '@playwright/test';
import plLabels from 'labels/labels-pl.json';
import { BaseComponent } from 'pages/BaseComponent';

export class BasketSidebar extends BaseComponent {
    private readonly basketSidebarFooter = this.page.locator('div[class*="miniCart-footer"]').first();
    private readonly showBasketButton = this.basketSidebarFooter.getByRole('button', {
        name: plLabels.basket.sidebar.showBasket,
        exact: true,
    });

    async isVisible(): Promise<void> {
        await expect(this.basketSidebarFooter).toBeVisible({ timeout: 10000 });
    }

    async clickShowBasket(): Promise<void> {
        await expect(this.showBasketButton).toBeVisible();
        await this.showBasketButton.click();
    }
}
