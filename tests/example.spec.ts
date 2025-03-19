import { test, expect } from '@playwright/test';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

test.describe('User authentication', () => {
  let homePage: HomePage;
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    
    await homePage.open();
    await homePage.isCloseCookiesDialogBtnVisible();
    await homePage.closeCookiesDialog();
  });

  test('User can login', async () => {
    await homePage.isLoginLinkVisible();
    await homePage.clickLoginLink();

    await loginPage.isVisible();
  });
});
