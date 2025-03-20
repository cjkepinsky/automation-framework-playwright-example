import { test } from '@playwright/test';
import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import DashboardPage from './pages/dashboardPage';
import NewProductsPage from './pages/newProductsPage';
import ProductDetailsPage from './pages/productDetailsPage';
import BasketPage from './pages/basketPage';

test.describe('User authentication', () => {
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

    await homePage.isLoginLinkVisible();
    await homePage.clickLoginLink();
    await loginPage.isVisible();
    await loginPage.typeLogin('cjkepinsky@gmail.com');
    await loginPage.typePassword('B^c4zZM#6abV9Z4Q');
    await loginPage.clickLoginButton();

    await dashboardPage.isVisible();
  });

  test('User can add items to basket', async () => {
    let initialTotalPrice: number;

    await dashboardPage.clickTopMenuOption('Nowości');
    await newProductsPage.isVisible();
    await newProductsPage.clickProduct(1);
    await productDetailsPage.isVisible();
    await productDetailsPage.clickSizeSelectionButton('S');
    await productDetailsPage.clickAddToBasket();
    await productDetailsPage.basketSidebar.isVisible();
    await productDetailsPage.basketSidebar.clickShowBasket();
    await basketPage.isVisible();
    initialTotalPrice = await basketPage.getTotalPrice();
    await basketPage.clickIncreaseQuantityForFirstProduct();
    await basketPage.clickUpdateBasket();

    await basketPage.isBasketTotalPRiceHigherThan(initialTotalPrice);
  });

});
