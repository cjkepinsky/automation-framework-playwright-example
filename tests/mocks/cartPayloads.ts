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

type MockGraphQlObject = Record<string, unknown>;

type ProductListingCartPayload = MockGraphQlObject & {
    items: MockGraphQlObject[];
};

type PriceSummaryCartPayload = MockGraphQlObject & {
    shipping_addresses: MockGraphQlObject[];
    prices: MockGraphQlObject;
};

type MockMoney = {
    currency: string;
    value: number;
    __typename: 'Money';
};

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

export function buildMiniCart(cartState: MockCartState): MockGraphQlObject {
    return {
        id: cartState.cartId,
        total_quantity: cartState.quantity,
        prices: {
            subtotal_including_tax: money(cartState, cartTotal(cartState)),
            __typename: 'CartPrices',
        },
        items: cartState.quantity > 0 ? [buildMiniCartItem(cartState)] : [],
        __typename: 'Cart',
    };
}

export function buildCartDetails(cartState: MockCartState): MockGraphQlObject {
    const productListingCart = buildProductListingCart(cartState);
    const priceSummaryCart = buildPriceSummaryCart(cartState);

    return {
        id: cartState.cartId,
        total_quantity: cartState.quantity,
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

function buildProductListingCart(cartState: MockCartState): ProductListingCartPayload {
    return {
        id: cartState.cartId,
        items: cartState.quantity > 0 ? [buildProductListingItem(cartState)] : [],
        __typename: 'Cart',
    };
}

function buildPriceSummaryCart(cartState: MockCartState): PriceSummaryCartPayload {
    return {
        id: cartState.cartId,
        items: [],
        shipping_addresses: [{
            selected_shipping_method: {
                amount: null,
                __typename: 'SelectedShippingMethod',
            },
            street: [''],
            __typename: 'ShippingCartAddress',
        }],
        prices: {
            grand_total: money(cartState, cartTotal(cartState)),
            subtotal_including_tax: money(cartState, cartTotal(cartState)),
            __typename: 'CartPrices',
        },
        free_pickup_info_enabled: true,
        __typename: 'Cart',
    };
}

function buildMiniCartItem(cartState: MockCartState): MockGraphQlObject {
    return {
        uid: cartState.itemUid,
        product: buildMiniCartProduct(cartState),
        prices: {
            row_total_including_tax: money(cartState, cartTotal(cartState)),
            __typename: 'CartItemPrices',
        },
        quantity: cartState.quantity,
        configurable_options: [buildSelectedSizeOption(cartState)],
        customizable_options: [],
        __typename: 'ConfigurableCartItem',
    };
}

function buildMiniCartProduct(cartState: MockCartState): MockGraphQlObject {
    return {
        id: cartState.productId,
        uid: cartState.productUid,
        name: cartState.productName,
        sku: cartState.parentSku,
        url_key: cartState.productUrlKey,
        thumbnail: productImage(cartState),
        stock_status: 'IN_STOCK',
        price_range: {
            maximum_price: buildProductPrice(cartState),
            __typename: 'PriceRange',
        },
        __typename: 'ConfigurableProduct',
    };
}

function buildProductListingItem(cartState: MockCartState): MockGraphQlObject {
    return {
        uid: cartState.itemUid,
        product: buildProductListingProduct(cartState),
        total_price_incl_tax: money(cartState, cartTotal(cartState)),
        quantity: cartState.quantity,
        errors: null,
        configurable_options: [{
            id: 1,
            ...buildSelectedSizeOption(cartState),
            value_id: 1011,
        }],
        customizable_options: [],
        prices: {
            row_total_including_tax: money(cartState, cartTotal(cartState)),
            __typename: 'CartItemPrices',
        },
        __typename: 'ConfigurableCartItem',
    };
}

function buildProductListingProduct(cartState: MockCartState): MockGraphQlObject {
    return {
        id: cartState.productId,
        uid: cartState.productUid,
        name: cartState.productName,
        sku: cartState.parentSku,
        url_key: cartState.productUrlKey,
        thumbnail: productImage(cartState),
        small_image: productImage(cartState),
        stock_status: 'IN_STOCK',
        price_range: {
            minimum_price: buildProductPrice(cartState),
            maximum_price: buildProductPrice(cartState),
            __typename: 'PriceRange',
        },
        variants: [buildSelectedVariant(cartState)],
        __typename: 'ConfigurableProduct',
    };
}

function buildSelectedVariant(cartState: MockCartState): MockGraphQlObject {
    return {
        attributes: [{
            uid: 'mock-size-attribute',
            code: 'size',
            label: cartState.sizeLabel,
            value_index: 1011,
            __typename: 'ConfigurableAttributeOption',
        }],
        product: {
            uid: `${cartState.productUid}-variant`,
            sku: cartState.sku,
            stock_status: 'IN_STOCK',
            small_image: productImage(cartState),
            __typename: 'SimpleProduct',
        },
        __typename: 'ConfigurableVariant',
    };
}

function buildSelectedSizeOption(cartState: MockCartState): MockGraphQlObject {
    return {
        configurable_product_option_uid: 'mock-size-option',
        option_label: 'Rozmiar',
        configurable_product_option_value_uid: 'mock-size-value',
        value_label: cartState.sizeLabel,
        __typename: 'SelectedConfigurableOption',
    };
}

function buildProductPrice(cartState: MockCartState): MockGraphQlObject {
    return {
        final_price: money(cartState, cartState.unitPrice),
        regular_price: money(cartState, cartState.unitPrice),
        __typename: 'ProductPrice',
    };
}

function productImage(cartState: MockCartState): MockGraphQlObject {
    return {
        url: cartState.thumbnailUrl,
        __typename: 'ProductImage',
    };
}

function money(cartState: MockCartState, value: number): MockMoney {
    return {
        currency: cartState.currency,
        value,
        __typename: 'Money',
    };
}

function cartTotal(cartState: MockCartState): number {
    return cartState.unitPrice * cartState.quantity;
}
