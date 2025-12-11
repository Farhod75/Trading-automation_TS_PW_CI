import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Locators
  private usernameInput = '#username';
  private passwordInput = '#password';
  private loginButton = '#loginButton';
  private errorMsg = '#errorMsg';

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.goto('/login.html');
  }

  async login(username: string, password: string) {
    await this.type(this.usernameInput, username);
    await this.type(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  async assertErrorVisible() {
    const error = this.page.locator(this.errorMsg);
    await expect(error).toBeVisible();
  }

  async assertRedirectedToOrderTicket() {
    await this.waitForUrlContains('order-ticket.html');
  }
}