import { Page, Route } from '@playwright/test';
import {
    buildCartDetails,
    buildDeferredCart,
    buildDeliveryDelayCart,
    buildFreeShippingCart,
    buildItemCountCart,
    buildMiniCart,
    buildPriceSummaryCart,
    buildProductListingCart,
    createMockCartState,
} from 'mocks/cartPayloads';
import type { MockCartOptions, MockCartState } from 'mocks/cartPayloads';

type GraphQlRequestBody = {
    operationName?: string;
    variables?: Record<string, unknown>;
};

export async function mockCartApi(page: Page, options: MockCartOptions = {}) {
    const state = createMockCartState(options);

    await page.route('**/graphql**', async (route) => {
        const operation = getGraphQlOperation(route);

        if (!operation) {
            await route.continue();
            return;
        }

        switch (operation.name) {
            case 'createCart':
                await fulfillGraphQl(route, { data: { cartId: state.cartId } });
                return;
            case 'getItemCount':
                await fulfillGraphQl(route, { data: { cart: buildItemCountCart(state) } });
                return;
            case 'MiniCartQuery':
                await fulfillGraphQl(route, { data: { cart: buildMiniCart(state) } });
                return;
            case 'GetCartDetails':
                await fulfillGraphQl(route, { data: { cart: buildCartDetails(state) } });
                return;
            case 'GetDeferredCartDetails':
                await fulfillGraphQl(route, { data: { deferredCartPwa: buildDeferredCart() } });
                return;
            case 'GetDeliveryDelay':
                await fulfillGraphQl(route, { data: { cart: buildDeliveryDelayCart(state) } });
                return;
            case 'getProductListing':
                await fulfillGraphQl(route, { data: { cart: buildProductListingCart(state) } });
                return;
            case 'getPriceSummary':
                await fulfillGraphQl(route, { data: { cart: buildPriceSummaryCart(state) } });
                return;
            case 'GetCartDetailsForFreeShipping':
                await fulfillGraphQl(route, { data: { cart: buildFreeShippingCart(state) } });
                return;
            case 'addConfigurableProductToCart':
                updateCartStateFromAddToCartMutation(state, operation.body);
                await fulfillGraphQl(route, {
                    data: {
                        addConfigurableProductsToCart: {
                            cart: buildMiniCart(state),
                            __typename: 'AddConfigurableProductsToCartOutput',
                        },
                    },
                });
                return;
            default:
                await route.continue();
        }
    });
}

function getGraphQlOperation(route: Route) {
    const request = route.request();

    if (request.method() === 'POST') {
        const body: GraphQlRequestBody | null = request.postDataJSON();
        return body?.operationName ? { name: body.operationName, body } : null;
    }

    const url = new URL(request.url());
    const operationName = url.searchParams.get('operationName');
    return operationName ? { name: operationName, body: null } : null;
}

function updateCartStateFromAddToCartMutation(state: MockCartState, body: GraphQlRequestBody | null) {
    state.quantity = Number(body?.variables?.quantity ?? 1);
    state.cartId = readStringVariable(body, 'cartId') ?? state.cartId;
    state.parentSku = readStringVariable(body, 'parentSku') ?? state.parentSku;
    state.sku = readStringVariable(body, 'sku') ?? state.sku;
}

async function fulfillGraphQl(route: Route, payload: unknown) {
    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(payload),
    });
}

function readStringVariable(body: GraphQlRequestBody | null, key: string) {
    const value = body?.variables?.[key];
    return typeof value === 'string' ? value : null;
}
