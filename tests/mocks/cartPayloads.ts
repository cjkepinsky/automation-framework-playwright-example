export type MockCartOptions = {
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

export type MockCartState = Required<MockCartOptions>;

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

export function createMockCartState(options: MockCartOptions = {}): MockCartState {
    return {
        ...defaultCartState,
        ...options,
    };
}

export function buildItemCountCart(state: MockCartState) {
    return {
        id: state.cartId,
        total_quantity: state.quantity,
        total_summary_quantity_including_config: state.quantity,
        __typename: 'Cart',
    };
}

export function buildMiniCart(state: MockCartState) {
    return {
        id: state.cartId,
        total_quantity: state.quantity,
        prices: {
            subtotal_including_tax: money(state, cartTotal(state)),
            __typename: 'CartPrices',
        },
        items: state.quantity > 0 ? [buildMiniCartItem(state)] : [],
        __typename: 'Cart',
    };
}

export function buildCartDetails(state: MockCartState) {
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

export function buildDeferredCart() {
    return {
        id: '',
        items: [],
        __typename: 'DeferredCart',
    };
}

export function buildDeliveryDelayCart(state: MockCartState) {
    return {
        id: state.cartId,
        delivery_delay: {
            is_delay: false,
            description: null,
            __typename: 'ProductDeliveryDelay',
        },
        __typename: 'Cart',
    };
}

export function buildFreeShippingCart(state: MockCartState) {
    return {
        id: state.cartId,
        prices: {
            grand_total: money(state, cartTotal(state)),
            __typename: 'CartPrices',
        },
        __typename: 'Cart',
    };
}

export function buildPriceSummaryCart(state: MockCartState) {
    return {
        id: state.cartId,
        items: state.quantity > 0 ? [buildPriceSummaryItem(state)] : [],
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
                amount: money(state, Number((cartTotal(state) * 0.23).toFixed(2))),
                __typename: 'CartTaxItem',
            }],
            discounts: null,
            grand_total: money(state, cartTotal(state)),
            grand_total_excluding_shipping: money(state, cartTotal(state)),
            savings_summary: money(state, 0),
            subtotal_excluding_tax: money(state, netValue(cartTotal(state))),
            subtotal_including_tax: money(state, cartTotal(state)),
            cash_on_delivery_fee: money(state, 0),
            __typename: 'CartPrices',
        },
        free_pickup_info_enabled: true,
        __typename: 'Cart',
    };
}

export function buildProductListingCart(state: MockCartState) {
    return {
        id: state.cartId,
        items: state.quantity > 0 ? [buildProductListingItem(state)] : [],
        __typename: 'Cart',
    };
}

function buildMiniCartItem(state: MockCartState) {
    return {
        uid: state.itemUid,
        product: buildMiniCartProduct(state),
        last_piece: null,
        prices: {
            row_total_including_tax: money(state, cartTotal(state)),
            __typename: 'CartItemPrices',
        },
        quantity: state.quantity,
        personalized: false,
        configurable_options: [buildSelectedSizeOption(state)],
        customizable_options: [],
        __typename: 'ConfigurableCartItem',
    };
}

function buildMiniCartProduct(state: MockCartState) {
    return {
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
            maximum_price: buildProductPrice(state),
            omnibus_price: buildEmptyOmnibusPrice(),
            __typename: 'PriceRange',
        },
        __typename: 'ConfigurableProduct',
    };
}

function buildPriceSummaryItem(state: MockCartState) {
    return {
        uid: state.itemUid,
        quantity: state.quantity,
        errors: null,
        product: {
            uid: state.productUid,
            is_mobile_only: false,
            __typename: 'ConfigurableProduct',
        },
        __typename: 'ConfigurableCartItem',
    };
}

function buildProductListingItem(state: MockCartState) {
    return {
        uid: state.itemUid,
        cart_item_delay: {
            is_delay: false,
            __typename: 'ProductDeliveryDelay',
        },
        product: buildProductListingProduct(state),
        last_piece: {
            salable_qty: 10,
            label: '',
            is_last_item: false,
            is_last_items: false,
            __typename: 'LastPieceData',
        },
        total_price_incl_tax: money(state, cartTotal(state)),
        quantity: state.quantity,
        errors: null,
        configurable_options: [{
            id: 1,
            ...buildSelectedSizeOption(state),
            value_id: 1011,
        }],
        customizable_options: [],
        prices: {
            price: money(state, netValue(state.unitPrice)),
            row_total: {
                value: netValue(cartTotal(state)),
                __typename: 'Money',
            },
            row_total_including_tax: {
                value: cartTotal(state),
                __typename: 'Money',
            },
            total_item_discount: {
                value: 0,
                __typename: 'Money',
            },
            __typename: 'CartItemPrices',
        },
        __typename: 'ConfigurableCartItem',
    };
}

function buildProductListingProduct(state: MockCartState) {
    return {
        id: state.productId,
        uid: state.productUid,
        name: state.productName,
        sku: state.parentSku,
        url_key: state.productUrlKey,
        ec_brand: '4F',
        product_breadcrumbs: [],
        colors: [],
        thumbnail: productImage(state),
        stock_status: 'IN_STOCK',
        small_image: productImage(state),
        is_mobile_only: false,
        price: {
            regularPrice: {
                amount: money(state, state.unitPrice),
                __typename: 'Price',
            },
            __typename: 'ProductPrices',
        },
        price_range: {
            minimum_price: {
                final_price: money(state, state.unitPrice),
                regular_price: money(state, state.unitPrice),
                __typename: 'ProductPrice',
            },
            omnibus_price: buildEmptyOmnibusPrice(),
            uom_price: {
                final_price: {
                    value: null,
                    currency: null,
                    uom: null,
                    __typename: 'UnitOfMeasureMoney',
                },
                __typename: 'UnitOfMeasurePrice',
            },
            maximum_price: buildProductPrice(state),
            __typename: 'PriceRange',
        },
        is_promo_allowed: false,
        discount_percentage: null,
        variants: [buildSelectedVariant(state)],
        __typename: 'ConfigurableProduct',
    };
}

function buildSelectedVariant(state: MockCartState) {
    return {
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
            small_image: productImage(state),
            __typename: 'SimpleProduct',
        },
        __typename: 'ConfigurableVariant',
    };
}

function buildSelectedSizeOption(state: MockCartState) {
    return {
        configurable_product_option_uid: 'mock-size-option',
        option_label: 'Rozmiar',
        configurable_product_option_value_uid: 'mock-size-value',
        value_label: state.sizeLabel,
        __typename: 'SelectedConfigurableOption',
    };
}

function buildProductPrice(state: MockCartState) {
    return {
        final_price: money(state, state.unitPrice),
        regular_price: money(state, state.unitPrice),
        discount: {
            amount_off: 0,
            __typename: 'ProductDiscount',
        },
        __typename: 'ProductPrice',
    };
}

function buildEmptyOmnibusPrice() {
    return {
        final_price: {
            value: null,
            currency: null,
            __typename: 'Money',
        },
        __typename: 'OmnibusPrice',
    };
}

function productImage(state: MockCartState) {
    return {
        url: state.thumbnailUrl,
        __typename: 'ProductImage',
    };
}

function money(state: MockCartState, value: number) {
    return {
        currency: state.currency,
        value,
        __typename: 'Money',
    };
}

function cartTotal(state: MockCartState) {
    return state.unitPrice * state.quantity;
}

function netValue(value: number) {
    return Number((value / 1.23).toFixed(2));
}
