import { Page } from "@playwright/test";

export default class BaseComponent {
    constructor(page: Page) {
        this.page = page;
    }
}