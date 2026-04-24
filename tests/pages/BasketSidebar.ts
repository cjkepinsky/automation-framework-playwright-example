import { expect } from '@playwright/test';
import BaseComponent from './BaseComponent';
import { plLabels } from '../labels';

export default class BasketSidebar extends BaseComponent {
    private readonly basketSidebar = this.page.locator('div[class*="miniCart-footer"]').first();
    private readonly showBasketButton = this.basketSidebar.getByRole('button', {
        name: plLabels.basket.sidebar.showBasket,
        exact: true,
    });

    async isVisible() {
        await expect(this.basketSidebar).toBeVisible({ timeout: 10000 });
    }

    async clickShowBasket() {
        await expect(this.showBasketButton).toBeVisible();
        await this.showBasketButton.click();
    }
}
