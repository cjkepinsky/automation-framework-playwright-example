import { Page } from "@playwright/test";

export default class BaseComponent {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    protected async clickByText(containerSelector: string, text: string) {
        await this.page.evaluate(
            ({ container, searchText }) => {
                const elements = document.querySelectorAll(container);
                const element = Array.from(elements)
                    .find(el => el.textContent?.includes(searchText));
                if (element) (element as HTMLElement).click();
            },
            { container: containerSelector, searchText: text }
        );
    }
}