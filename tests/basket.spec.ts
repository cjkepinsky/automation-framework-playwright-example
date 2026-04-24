import { test } from './fixtures/shop.fixture';
import { plLabels } from './labels';

test.describe('Guest user adds item to basket', () => {
  test('Guest user can add an item and see total increase after quantity change', async ({ shopSession }) => {
    const { basketPage, newProductsPage, productDetailsPage } = shopSession;

    await newProductsPage.isVisible();
    await newProductsPage.clickProduct(1);
    await productDetailsPage.isVisible();
    await productDetailsPage.clickSizeSelectionButton(plLabels.sizes[2]);
    await productDetailsPage.clickAddToBasket();
    await productDetailsPage.basketSidebar.clickShowBasket();
    await basketPage.isVisible();

    const initialTotalPrice = await basketPage.getTotalPrice();

    await basketPage.changeQuantityForFirstProduct(2);
    await basketPage.isBasketTotalPriceHigherThan(initialTotalPrice);
  });
});
