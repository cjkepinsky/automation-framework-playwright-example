import { BasketPage } from 'pages/BasketPage';
import { HomePage } from 'pages/HomePage';
import { NewProductsPage } from 'pages/NewProductsPage';
import { ProductDetailsPage } from 'pages/ProductDetailsPage';

type TestFixturePages = {
    homePage: HomePage;
    newProductsPage: NewProductsPage;
    productDetailsPage: ProductDetailsPage;
    basketPage: BasketPage;
};

export class TestFixture {
    readonly homePage: HomePage;
    readonly newProductsPage: NewProductsPage;
    readonly productDetailsPage: ProductDetailsPage;
    readonly basketPage: BasketPage;

    constructor(pages: TestFixturePages) {
        this.homePage = pages.homePage;
        this.newProductsPage = pages.newProductsPage;
        this.productDetailsPage = pages.productDetailsPage;
        this.basketPage = pages.basketPage;
    }

    async prepareGuestBasketFlow(): Promise<void> {
        await this.newProductsPage.open();
        await this.homePage.acceptCookiesIfVisible();
        await this.homePage.closeLanguageModalIfVisible();
        await this.newProductsPage.isVisible();
    }
}
