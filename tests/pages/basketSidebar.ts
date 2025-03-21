import { expect } from "@playwright/test";
import BaseComponent from "./BaseComponent";
import { plLabels } from "../labels";

export default class BasketSidebar extends BaseComponent {

    private basketSidebarSelector = 'div.miniCart-footer-xKn';
    private showBasketButtonSelector = `${this.basketSidebarSelector} button`;
    private removeItemButtonSelector = 'button.removeAllItemsFromBasket';

    async isVisible() {
        await this.page.waitForSelector(this.basketSidebarSelector, { state: 'visible', timeout: 10000 });
        await expect(this.page.locator(this.basketSidebarSelector)).toBeVisible();
    }

    async clickShowBasket() {
        await this.clickByText(
            this.showBasketButtonSelector, 
            plLabels.basket.sidebar.showBasket
        );
    }

    async removeAllItemsFromBasket() {
        const removeButtons = await this.page.locator(this.removeItemButtonSelector).all();
        
        for (const button of removeButtons) {
            await button.click();
            await this.page.waitForTimeout(2000);
        }
    }
}