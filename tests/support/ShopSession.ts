import { Page } from '@playwright/test';
import BasketPage from '../pages/BasketPage';
import HomePage from '../pages/HomePage';
import NewProductsPage from '../pages/NewProductsPage';
import ProductDetailsPage from '../pages/ProductDetailsPage';

export default class ShopSession {
    readonly homePage: HomePage;
    readonly newProductsPage: NewProductsPage;
    readonly productDetailsPage: ProductDetailsPage;
    readonly basketPage: BasketPage;

    constructor(page: Page) {
        this.homePage = new HomePage(page);
        this.newProductsPage = new NewProductsPage(page);
        this.productDetailsPage = new ProductDetailsPage(page);
        this.basketPage = new BasketPage(page);
    }

    async prepareGuestBasketFlow() {
        await this.newProductsPage.open();
        await this.homePage.acceptCookiesIfVisible();
        await this.homePage.closeLanguageModalIfVisible();
        await this.newProductsPage.isVisible();
    }
}
