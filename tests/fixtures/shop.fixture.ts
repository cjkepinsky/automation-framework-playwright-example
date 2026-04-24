import { test as base } from '@playwright/test';
import ShopSession from '../support/ShopSession';

type ShopFixtures = {
    shopSession: ShopSession;
};

export const test = base.extend<ShopFixtures>({
    shopSession: async ({ page }, use) => {
        const shopSession = new ShopSession(page);

        await shopSession.prepareGuestBasketFlow();
        await use(shopSession);
    },
});
