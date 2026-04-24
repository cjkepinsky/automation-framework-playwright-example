import { expect, Locator, Page } from '@playwright/test';

export default class BaseComponent {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    protected async clickByText(container: string | Locator, text: string) {
        const scope = typeof container === 'string' ? this.page.locator(container) : container;
        const target = scope.filter({ hasText: this.createExactTextPattern(text) }).first();

        await expect(target, `Could not find clickable element with text "${text}"`).toBeVisible();
        await target.click();
    }

    private createExactTextPattern(text: string): RegExp {
        const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`^\\s*${escapedText}\\s*$`);
    }
}
