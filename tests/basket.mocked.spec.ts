import { expect, test } from 'fixtures/shop.fixture';
import plLabels from 'labels/labels-pl.json';

test.describe('Guest user sees preloaded mocked basket content', (): void => {
    test('Guest user can open the cart and see the mocked product details', async ({
        apiMocks,
        basketPage,
        newProductsPage,
    }): Promise<void> => {
        const mockedProductName = 'Mocked basket product';
        const mockedSubtotal = 9.99;
        await apiMocks.mockCartApi({
            productName: mockedProductName,
            sizeLabel: plLabels.sizes[2],
            unitPrice: mockedSubtotal,
            quantity: 1,
        });
        await apiMocks.mockStorefrontPage();

        await newProductsPage.open();
        await newProductsPage.isVisible();
        await newProductsPage.openMiniCart();
        await newProductsPage.basketSidebar.clickShowBasket();

        await basketPage.isVisible();
        await basketPage.expectProductName(mockedProductName);
        expect(await basketPage.getTotalPrice()).toBe(mockedSubtotal);
    });
});
