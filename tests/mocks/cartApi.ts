import { Page, Route } from '@playwright/test';

type GraphQlRequestBody = {
    operationName?: string;
    variables?: Record<string, unknown>;
};

type MockCartOptions = {
    cartId?: string;
    currency?: string;
    parentSku?: string;
    sku?: string;
    productId?: number;
    productUid?: string;
    itemUid?: string;
    productName?: string;
    productUrlKey?: string;
    thumbnailUrl?: string;
    sizeLabel?: string;
    unitPrice?: number;
    quantity?: number;
};

type MockCartState = Required<MockCartOptions>;

const defaultCartState: MockCartState = {
    cartId: 'mocked-cart-id',
    currency: 'PLN',
    parentSku: '4FRSS26TFSHM1622-65S',
    sku: '4FRSS26TFSHM1622-65S-M',
    productId: 409535,
    productUid: 'mock-product-uid',
    itemUid: 'mock-cart-item-uid',
    productName: 'Mocked training shorts',
    productUrlKey: 'mocked-training-shorts',
    thumbnailUrl: 'https://cdn.4f.com.pl/media/catalog/product/placeholder/default/mock-product.jpg',
    sizeLabel: 'M',
    unitPrice: 149.99,
    quantity: 0,
};

export async function mockCartApi(page: Page, options: MockCartOptions = {}) {
    const state: MockCartState = {
        ...defaultCartState,
        ...options,
    };

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
                await fulfillGraphQl(route, {
                    data: {
                        cart: {
                            id: state.cartId,
                            total_quantity: state.quantity,
                            total_summary_quantity_including_config: state.quantity,
                            __typename: 'Cart',
                        },
                    },
                });
                return;
            case 'MiniCartQuery':
                await fulfillGraphQl(route, {
                    data: {
                        cart: buildMiniCart(state),
                    },
                });
                return;
            case 'GetCartDetails':
                await fulfillGraphQl(route, {
                    data: {
                        cart: buildCartDetails(state),
                    },
                });
                return;
            case 'GetDeferredCartDetails':
                await fulfillGraphQl(route, {
                    data: {
                        deferredCartPwa: {
                            id: '',
                            items: [],
                            __typename: 'DeferredCart',
                        },
                    },
                });
                return;
            case 'GetDeliveryDelay':
                await fulfillGraphQl(route, {
                    data: {
                        cart: {
                            id: state.cartId,
                            delivery_delay: {
                                is_delay: false,
                                description: null,
                                __typename: 'ProductDeliveryDelay',
                            },
                            __typename: 'Cart',
                        },
                    },
                });
                return;
            case 'getProductListing':
                await fulfillGraphQl(route, {
                    data: {
                        cart: buildProductListingCart(state),
                    },
                });
                return;
            case 'getPriceSummary':
                await fulfillGraphQl(route, {
                    data: {
                        cart: buildPriceSummaryCart(state),
                    },
                });
                return;
            case 'GetCartDetailsForFreeShipping':
                await fulfillGraphQl(route, {
                    data: {
                        cart: {
                            id: state.cartId,
                            prices: {
                                grand_total: {
                                    value: state.unitPrice * state.quantity,
                                    currency: state.currency,
                                    __typename: 'Money',
                                },
                                __typename: 'CartPrices',
                            },
                            __typename: 'Cart',
                        },
                    },
                });
                return;
            case 'addConfigurableProductToCart': {
                const requestedQuantity = Number(operation.body?.variables?.quantity ?? 1);
                state.quantity = requestedQuantity;
                state.cartId = readStringVariable(operation.body, 'cartId') ?? state.cartId;
                state.parentSku = readStringVariable(operation.body, 'parentSku') ?? state.parentSku;
                state.sku = readStringVariable(operation.body, 'sku') ?? state.sku;

                await fulfillGraphQl(route, {
                    data: {
                        addConfigurableProductsToCart: {
                            cart: buildMiniCart(state),
                            __typename: 'AddConfigurableProductsToCartOutput',
                        },
                    },
                });
                return;
            }
            default:
                await route.continue();
        }
    });
}

function getGraphQlOperation(route: Route) {
    const request = route.request();

    if (request.method() === 'POST') {
        const body = request.postDataJSON() as GraphQlRequestBody | null;
        return body?.operationName ? { name: body.operationName, body } : null;
    }

    const url = new URL(request.url());
    const operationName = url.searchParams.get('operationName');
    return operationName ? { name: operationName, body: null } : null;
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

function buildMiniCart(state: MockCartState) {
    return {
        id: state.cartId,
        total_quantity: state.quantity,
        prices: {
            subtotal_including_tax: {
                currency: state.currency,
                value: state.unitPrice * state.quantity,
                __typename: 'Money',
            },
            __typename: 'CartPrices',
        },
        items: state.quantity > 0 ? [buildCartItem(state)] : [],
        __typename: 'Cart',
    };
}

function buildCartItem(state: MockCartState) {
    return {
        uid: state.itemUid,
        product: {
            id: state.productId,
            uid: state.productUid,
            name: state.productName,
            sku: state.parentSku,
            url_key: state.productUrlKey,
            is_promo_allowed: false,
            thumbnail: {
                url: state.thumbnailUrl,
                __typename: 'ProductImage',
            },
            stock_status: 'IN_STOCK',
            is_mobile_only: false,
            variants: [],
            price_range: {
                maximum_price: {
                    final_price: {
                        currency: state.currency,
                        value: state.unitPrice,
                        __typename: 'Money',
                    },
                    regular_price: {
                        currency: state.currency,
                        value: state.unitPrice,
                        __typename: 'Money',
                    },
                    discount: {
                        amount_off: 0,
                        __typename: 'ProductDiscount',
                    },
                    __typename: 'ProductPrice',
                },
                omnibus_price: {
                    final_price: {
                        value: null,
                        currency: null,
                        __typename: 'Money',
                    },
                    __typename: 'OmnibusPrice',
                },
                __typename: 'PriceRange',
            },
            __typename: 'ConfigurableProduct',
        },
        last_piece: null,
        prices: {
            row_total_including_tax: {
                value: state.unitPrice * state.quantity,
                currency: state.currency,
                __typename: 'Money',
            },
            __typename: 'CartItemPrices',
        },
        quantity: state.quantity,
        personalized: false,
        configurable_options: [
            {
                configurable_product_option_uid: 'mock-size-option',
                option_label: 'Rozmiar',
                configurable_product_option_value_uid: 'mock-size-value',
                value_label: state.sizeLabel,
                __typename: 'SelectedConfigurableOption',
            },
        ],
        customizable_options: [],
        __typename: 'ConfigurableCartItem',
    };
}

function buildPriceSummaryCart(state: MockCartState) {
    return {
        id: state.cartId,
        items: state.quantity > 0 ? [{
            uid: state.itemUid,
            quantity: state.quantity,
            errors: null,
            product: {
                uid: state.productUid,
                is_mobile_only: false,
                __typename: 'ConfigurableProduct',
            },
            __typename: 'ConfigurableCartItem',
        }] : [],
        shipping_addresses: [{
            selected_shipping_method: {
                amount: null,
                __typename: 'SelectedShippingMethod',
            },
            street: [''],
            __typename: 'ShippingCartAddress',
        }],
        prices: {
            applied_taxes: [{
                amount: {
                    currency: state.currency,
                    value: Number((state.unitPrice * state.quantity * 0.23).toFixed(2)),
                    __typename: 'Money',
                },
                __typename: 'CartTaxItem',
            }],
            discounts: null,
            grand_total: {
                currency: state.currency,
                value: state.unitPrice * state.quantity,
                __typename: 'Money',
            },
            grand_total_excluding_shipping: {
                currency: state.currency,
                value: state.unitPrice * state.quantity,
                __typename: 'Money',
            },
            savings_summary: {
                currency: state.currency,
                value: 0,
                __typename: 'Money',
            },
            subtotal_excluding_tax: {
                currency: state.currency,
                value: Number((state.unitPrice * state.quantity / 1.23).toFixed(2)),
                __typename: 'Money',
            },
            subtotal_including_tax: {
                currency: state.currency,
                value: state.unitPrice * state.quantity,
                __typename: 'Money',
            },
            cash_on_delivery_fee: {
                currency: state.currency,
                value: 0,
                __typename: 'Money',
            },
            __typename: 'CartPrices',
        },
        free_pickup_info_enabled: true,
        __typename: 'Cart',
    };
}

function buildProductListingCart(state: MockCartState) {
    return {
        id: state.cartId,
        items: state.quantity > 0 ? [{
            uid: state.itemUid,
            cart_item_delay: {
                is_delay: false,
                __typename: 'ProductDeliveryDelay',
            },
            product: {
                id: state.productId,
                uid: state.productUid,
                name: state.productName,
                sku: state.parentSku,
                url_key: state.productUrlKey,
                ec_brand: '4F',
                product_breadcrumbs: [],
                colors: [],
                thumbnail: {
                    url: state.thumbnailUrl,
                    __typename: 'ProductImage',
                },
                stock_status: 'IN_STOCK',
                small_image: {
                    url: state.thumbnailUrl,
                    __typename: 'ProductImage',
                },
                is_mobile_only: false,
                price: {
                    regularPrice: {
                        amount: {
                            currency: state.currency,
                            value: state.unitPrice,
                            __typename: 'Money',
                        },
                        __typename: 'Price',
                    },
                    __typename: 'ProductPrices',
                },
                price_range: {
                    minimum_price: {
                        final_price: {
                            currency: state.currency,
                            value: state.unitPrice,
                            __typename: 'Money',
                        },
                        regular_price: {
                            currency: state.currency,
                            value: state.unitPrice,
                            __typename: 'Money',
                        },
                        __typename: 'ProductPrice',
                    },
                    omnibus_price: {
                        final_price: {
                            value: null,
                            currency: null,
                            __typename: 'Money',
                        },
                        __typename: 'OmnibusPrice',
                    },
                    uom_price: {
                        final_price: {
                            value: null,
                            currency: null,
                            uom: null,
                            __typename: 'UnitOfMeasureMoney',
                        },
                        __typename: 'UnitOfMeasurePrice',
                    },
                    maximum_price: {
                        final_price: {
                            currency: state.currency,
                            value: state.unitPrice,
                            __typename: 'Money',
                        },
                        regular_price: {
                            currency: state.currency,
                            value: state.unitPrice,
                            __typename: 'Money',
                        },
                        discount: {
                            amount_off: 0,
                            __typename: 'ProductDiscount',
                        },
                        __typename: 'ProductPrice',
                    },
                    __typename: 'PriceRange',
                },
                is_promo_allowed: false,
                discount_percentage: null,
                variants: [{
                    attributes: [{
                        uid: 'mock-size-attribute',
                        code: 'size',
                        label: state.sizeLabel,
                        value_index: 1011,
                        __typename: 'ConfigurableAttributeOption',
                    }],
                    product: {
                        uid: `${state.productUid}-variant`,
                        sku: state.sku,
                        stock_status: 'IN_STOCK',
                        small_image: {
                            url: state.thumbnailUrl,
                            __typename: 'ProductImage',
                        },
                        __typename: 'SimpleProduct',
                    },
                    __typename: 'ConfigurableVariant',
                }],
                __typename: 'ConfigurableProduct',
            },
            last_piece: {
                salable_qty: 10,
                label: '',
                is_last_item: false,
                is_last_items: false,
                __typename: 'LastPieceData',
            },
            total_price_incl_tax: {
                currency: state.currency,
                value: state.unitPrice * state.quantity,
                __typename: 'Money',
            },
            quantity: state.quantity,
            errors: null,
            configurable_options: [{
                id: 1,
                configurable_product_option_uid: 'mock-size-option',
                option_label: 'Rozmiar',
                configurable_product_option_value_uid: 'mock-size-value',
                value_label: state.sizeLabel,
                value_id: 1011,
                __typename: 'SelectedConfigurableOption',
            }],
            customizable_options: [],
            prices: {
                price: {
                    currency: state.currency,
                    value: Number((state.unitPrice / 1.23).toFixed(2)),
                    __typename: 'Money',
                },
                row_total: {
                    value: Number((state.unitPrice * state.quantity / 1.23).toFixed(2)),
                    __typename: 'Money',
                },
                row_total_including_tax: {
                    value: state.unitPrice * state.quantity,
                    __typename: 'Money',
                },
                total_item_discount: {
                    value: 0,
                    __typename: 'Money',
                },
                __typename: 'CartItemPrices',
            },
            __typename: 'ConfigurableCartItem',
        }] : [],
        __typename: 'Cart',
    };
}

function buildCartDetails(state: MockCartState) {
    const productListingCart = buildProductListingCart(state);
    const priceSummaryCart = buildPriceSummaryCart(state);

    return {
        id: state.cartId,
        total_quantity: state.quantity,
        applied_coupons: null,
        applied_cashback_coupons: null,
        items: productListingCart.items,
        shipping_addresses: priceSummaryCart.shipping_addresses,
        prices: priceSummaryCart.prices,
        free_pickup_info_enabled: true,
        is_cashback_coupon_allowed: false,
        cart_frame: null,
        __typename: 'Cart',
    };
}
