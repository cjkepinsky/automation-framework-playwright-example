import { expect, test } from '@playwright/test';
import { plLabels } from 'labels';
import { mockCartApi } from 'mocks/cartApi';
import { mockStorefrontPage } from 'mocks/storefrontPage';
import { ShopSession } from 'support/ShopSession';

test.describe('Guest user sees preloaded mocked basket content', () => {
    test('Guest user can open the cart and see the mocked product details', async ({ page }) => {
        const mockedProductName = 'Mocked basket product';
        const mockedSubtotal = 9.99;
        await mockCartApi(page, {
            productName: mockedProductName,
            sizeLabel: plLabels.sizes[2],
            unitPrice: mockedSubtotal,
            quantity: 1,
        });
        await mockStorefrontPage(page);
        const shopSession = new ShopSession(page);
        const { basketPage, newProductsPage } = shopSession;

        await newProductsPage.open();
        await newProductsPage.isVisible();
        await newProductsPage.openMiniCart();
        await newProductsPage.basketSidebar.clickShowBasket();

        await basketPage.isVisible();
        await basketPage.expectProductName(mockedProductName);
        expect(await basketPage.getTotalPrice()).toBe(mockedSubtotal);
    });
});
