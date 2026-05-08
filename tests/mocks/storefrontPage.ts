import { Page } from '@playwright/test';
import { plLabels } from 'labels';

export async function mockStorefrontPage(page: Page) {
    await page.route(plLabels.urls.newProducts, async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: buildNewProductsPageHtml(),
        });
    });

    await page.route('**/cart', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: buildCartPageHtml(),
        });
    });
}

function buildNewProductsPageHtml() {
    return `<!doctype html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <title>Mocked storefront</title>
</head>
<body>
    <main>
        <div class="indicator-loader" hidden></div>
        <article class="item-root">
            <a class="item-images" href="/mocked-product.html">Mocked storefront product</a>
        </article>
        <button type="button" aria-label="Przełącz mini koszyk. Masz 1 przedmiotów w koszyku.">
            Mini cart
        </button>
        <aside class="miniCart-root" hidden>
            <div class="miniCart-footer">
                <button type="button">${plLabels.basket.sidebar.showBasket}</button>
            </div>
        </aside>
    </main>
    <script>
        const miniCartTrigger = document.querySelector('[aria-label^="Przełącz mini koszyk"]');
        const miniCart = document.querySelector('.miniCart-root');
        const showBasketButton = document.querySelector('.miniCart-footer button');

        miniCartTrigger.addEventListener('click', async () => {
            await fetch('/graphql', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ operationName: 'MiniCartQuery' })
            });
            miniCart.hidden = false;
        });

        showBasketButton.addEventListener('click', () => {
            window.location.href = '/cart';
        });
    </script>
</body>
</html>`;
}

function buildCartPageHtml() {
    return `<!doctype html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <title>Mocked cart</title>
</head>
<body>
    <main>
        <h1>${plLabels.basket.page.title}</h1>
        <a data-testid="cart-product-link"></a>
        <div class="priceSummary-totalPrice" hidden></div>
    </main>
    <script>
        const productLink = document.querySelector('[data-testid="cart-product-link"]');
        const totalPrice = document.querySelector('.priceSummary-totalPrice');

        const formatPrice = (value, currency) => value.toFixed(2).replace('.', ',') + ' ' + currency;

        fetch('/graphql', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ operationName: 'GetCartDetails' })
        })
            .then(response => response.json())
            .then(({ data }) => {
                const item = data.cart.items[0];
                const total = data.cart.prices.grand_total;

                productLink.href = '/' + item.product.url_key + '.html';
                productLink.textContent = item.product.name;
                totalPrice.textContent = formatPrice(total.value, total.currency);
                totalPrice.hidden = false;
            });
    </script>
</body>
</html>`;
}
