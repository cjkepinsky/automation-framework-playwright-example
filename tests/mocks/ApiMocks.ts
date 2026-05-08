import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Page, Route } from '@playwright/test';
import { appPaths } from 'config/appPaths';
import { buildAppUrl } from 'config/environment';
import plLabels from 'labels/labels-pl.json';
import {
    buildCartDetails,
    buildMiniCart,
    createMockCartState,
} from 'mocks/cartPayloads';
import type { MockCartOptions, MockCartState } from 'mocks/cartPayloads';

type GraphQlRequestBody = {
    operationName?: string;
    variables?: Record<string, unknown>;
};

type GraphQlOperation = {
    name: string;
    body: GraphQlRequestBody | null;
};

type MockStorefrontTemplates = {
    newProductsPage: string;
    cartPage: string;
};

const templatesDirectory = join(process.cwd(), 'tests', 'mocks', 'templates');

export class ApiMocks {
    constructor(private readonly page: Page) {}

    async mockCartApi(options: MockCartOptions = {}): Promise<void> {
        const cartState = createMockCartState(options);

        await this.page.route('**/graphql**', async (route): Promise<void> => {
            const operation = this.getGraphQlOperation(route);

            if (!operation) {
                await route.continue();
                return;
            }

            await this.handleCartOperation(route, operation, cartState);
        });
    }

    async mockStorefrontPage(): Promise<void> {
        const newProductsUrl = buildAppUrl(plLabels.paths.newProducts);
        const cartUrl = buildAppUrl(appPaths.cart);
        const templates = await this.loadMockStorefrontTemplates();

        await this.page.route(newProductsUrl, async (route): Promise<void> => {
            await route.fulfill({
                status: 200,
                contentType: 'text/html',
                body: templates.newProductsPage,
            });
        });

        await this.page.route(cartUrl, async (route): Promise<void> => {
            await route.fulfill({
                status: 200,
                contentType: 'text/html',
                body: templates.cartPage,
            });
        });
    }

    private async handleCartOperation(
        route: Route,
        operation: GraphQlOperation,
        cartState: MockCartState,
    ): Promise<void> {
        switch (operation.name) {
            case 'MiniCartQuery':
                await this.fulfillGraphQl(route, { data: { cart: buildMiniCart(cartState) } });
                return;
            case 'GetCartDetails':
                await this.fulfillGraphQl(route, { data: { cart: buildCartDetails(cartState) } });
                return;
            default:
                await route.continue();
        }
    }

    private getGraphQlOperation(route: Route): GraphQlOperation | null {
        const request = route.request();

        if (request.method() === 'POST') {
            const body: GraphQlRequestBody | null = request.postDataJSON();
            return body?.operationName ? { name: body.operationName, body } : null;
        }

        const url = new URL(request.url());
        const operationName = url.searchParams.get('operationName');
        return operationName ? { name: operationName, body: null } : null;
    }

    private async fulfillGraphQl(route: Route, payload: unknown): Promise<void> {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(payload),
        });
    }

    private async loadMockStorefrontTemplates(): Promise<MockStorefrontTemplates> {
        const [newProductsPageTemplate, cartPageTemplate] = await Promise.all([
            this.readTemplate('newProductsPage.html'),
            this.readTemplate('cartPage.html'),
        ]);

        return {
            newProductsPage: this.renderTemplate(newProductsPageTemplate, {
                showBasketLabel: plLabels.basket.sidebar.showBasket,
            }),
            cartPage: this.renderTemplate(cartPageTemplate, {
                basketTitle: plLabels.basket.page.title,
            }),
        };
    }

    private async readTemplate(fileName: string): Promise<string> {
        return readFile(join(templatesDirectory, fileName), 'utf-8');
    }

    private renderTemplate(template: string, variables: Record<string, string>): string {
        let renderedTemplate = template;

        for (const [name, value] of Object.entries(variables)) {
            renderedTemplate = renderedTemplate.replaceAll(`{{${name}}}`, value);
        }

        return renderedTemplate;
    }
}
