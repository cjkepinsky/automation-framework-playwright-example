import { test as base } from '@playwright/test';
import { ApiMocks } from 'mocks/ApiMocks';
import { BasketPage } from 'pages/BasketPage';
import { HomePage } from 'pages/HomePage';
import { NewProductsPage } from 'pages/NewProductsPage';
import { ProductDetailsPage } from 'pages/ProductDetailsPage';
import { ShopSession } from 'support/ShopSession';

type ShopFixtures = {
    homePage: HomePage;
    newProductsPage: NewProductsPage;
    productDetailsPage: ProductDetailsPage;
    basketPage: BasketPage;
    shopSession: ShopSession;
    apiMocks: ApiMocks;
};

export const test = base.extend<ShopFixtures>({
    homePage: async ({ page }, use): Promise<void> => {
        await use(new HomePage(page));
    },
    newProductsPage: async ({ page }, use): Promise<void> => {
        await use(new NewProductsPage(page));
    },
    productDetailsPage: async ({ page }, use): Promise<void> => {
        await use(new ProductDetailsPage(page));
    },
    basketPage: async ({ page }, use): Promise<void> => {
        await use(new BasketPage(page));
    },
    shopSession: async ({ homePage, newProductsPage, productDetailsPage, basketPage }, use): Promise<void> => {
        await use(new ShopSession({
            homePage,
            newProductsPage,
            productDetailsPage,
            basketPage,
        }));
    },
    apiMocks: async ({ page }, use): Promise<void> => {
        await use(new ApiMocks(page));
    },
});

export { expect } from '@playwright/test';
