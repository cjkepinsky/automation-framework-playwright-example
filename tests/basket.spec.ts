import { test } from '@playwright/test';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NewProductsPage from './pages/NewProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import BasketPage from './pages/BasketPage';
import { plLabels } from './labels';

test.describe('Logged-in User adds item to Basket', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let newProductsPage: NewProductsPage;
  let productDetailsPage: ProductDetailsPage;
  let basketPage: BasketPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    newProductsPage = new NewProductsPage(page);
    productDetailsPage = new ProductDetailsPage(page);
    basketPage = new BasketPage(page);
    
    await homePage.open();
    await homePage.isCloseCookiesDialogBtnVisible();
    await homePage.closeCookiesDialog();
    await homePage.clickLanguageModalCloseBtn();
    await homePage.isLoginLinkVisible();
    await homePage.clickLoginLink();
    await loginPage.isVisible();
    await loginPage.typeLogin(process.env.FOURF_USER_EMAIL || '');
    await loginPage.typePassword(process.env.FOURF_USER_PASSWORD || '');
    await loginPage.clickLoginButton();

    await dashboardPage.isVisible();
    await dashboardPage.basketSidebar.clickShowBasket();
    await dashboardPage.basketSidebar.removeAllItemsFromBasket();
    await dashboardPage.open();
  });

  test('Logged-in User can add items to Basket', async () => {
    let initialTotalPrice: number;

    await dashboardPage.clickTopMenuOption(plLabels.topMenu.newProducts);
    await newProductsPage.isVisible();
    await newProductsPage.clickProduct(1);
    await productDetailsPage.isVisible();
    await productDetailsPage.clickSizeSelectionButton(plLabels.sizes[1]);
    await productDetailsPage.clickAddToBasket();
    await productDetailsPage.basketSidebar.clickShowBasket();
    initialTotalPrice = await basketPage.getTotalPrice();
    await basketPage.clickIncreaseQuantityForFirstProduct();
    await basketPage.clickUpdateBasket();

    await basketPage.isBasketTotalPriceHigherThan(initialTotalPrice);
  });
});