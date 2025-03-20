import { expect } from "@playwright/test";
import BaseComponent from "./baseComponent";

export default class BasketSidebar extends BaseComponent {

    private basketSidebarSelector = 'div.miniCart-footer-xKn';
    private showBasketButtonSelector = `${this.basketSidebarSelector} button`;

    async isVisible() {
        await expect(this.page.locator(this.basketSidebarSelector)).toBeVisible()
    }

    async clickShowBasket() {
        await this.clickByText(
            this.showBasketButtonSelector, 
            'Pokaż koszyk'
        );
    }
}