import { Page, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async waitForUrlContains(fragment: string) {
    await expect(this.page).toHaveURL(new RegExp(fragment));
  }

  async click(selector: string) {
    await this.page.click(selector);
  }

  async type(selector: string, value: string) {
    await this.page.fill(selector, value);
  }
}