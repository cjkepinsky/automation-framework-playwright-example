import { expect } from "@playwright/test";
import BaseComponent from "./baseComponent";

export default class BasketSidebar extends BaseComponent {

    private basketSidebarSelector = 'div.miniCart-footer-xKn';
    private showBasketButtonSelector = `${this.basketSidebarSelector} button`;
    private removeItemButtonSelector = 'button.removeAllItemsFromBasket';

    async isVisible() {
        await expect(this.page.locator(this.basketSidebarSelector)).toBeVisible()
    }

    async clickShowBasket() {
        await this.clickByText(
            this.showBasketButtonSelector, 
            'Pokaż koszyk'
        );
    }

    async removeAllItemsFromBasket() {
        const removeButtons = await this.page.locator(this.removeItemButtonSelector).all();
        
        for (const button of removeButtons) {
            await button.click();
            await this.page.waitForTimeout(2000); // czekamy 2 sekundy po każdym kliknięciu
        }
    }
}