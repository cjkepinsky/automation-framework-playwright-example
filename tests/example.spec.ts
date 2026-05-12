import { test } from 'fixtures/shop.fixture';
import plLabels from 'labels/labels-pl.json';

test.describe('Guest user adds item to basket', (): void => {
    test('Guest user can add an item and see total increase after quantity change', async ({
        // basketPage,
        // newProductsPage,
        // productDetailsPage,
        // shopSession,
    }): Promise<void> => {
        // await shopSession.prepareGuestBasketFlow();
        //
        // await newProductsPage.clickProduct(1);
        // await productDetailsPage.isVisible();
        // await productDetailsPage.clickSizeSelectionButton(plLabels.sizes[2]);
        // await productDetailsPage.clickAddToBasket();
        // await productDetailsPage.basketSidebar.clickShowBasket();
        // await basketPage.isVisible();
        // const initialTotalPrice = await basketPage.getTotalPrice();
        //
        // await basketPage.changeQuantityForFirstProduct(2);
        //
        // await basketPage.isBasketTotalPriceHigherThan(initialTotalPrice);
    });
});
