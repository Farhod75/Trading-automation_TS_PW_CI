import { Page, expect } from '@playwright/test';

export class BlotterPage {
  readonly page: Page;
  readonly blotterTable = '#blotter-body';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/blotter.html');
  }

  async navigate() {
    await this.goto();
    // Wait for the blotter table to load orders (not showing "No orders found")
    await this.waitForOrdersToLoad();
  }

  async refresh() {
    await this.page.reload();
    // Wait for orders to reload after refresh
    await this.waitForOrdersToLoad();
  }

  private async waitForOrdersToLoad() {
    // Wait for the data-loaded attribute which is set after the async fetch completes
    try {
      await this.page.waitForSelector('#blotter-body[data-loaded="true"]', { timeout: 10000 });
    } catch (error) {
      // If timeout, log and continue - the assertion will fail with better error
      console.log('Timeout waiting for orders to load');
    }
  }

  async assertOrderExists(orderId: string) {
    const row = this.page.locator(`tr:has-text("${orderId}")`);
    await expect(row).toBeVisible({ timeout: 10000 });
  }

  async assertOrderStatus(orderId: string, status: string) {
    const statusCell = this.page.locator(`.status-${orderId}`);
    await expect(statusCell).toHaveText(status, { timeout: 10000 });
  }

  async clickRouteButton(orderId: string) {
    // Wait for the button to be visible first
    await this.page.waitForSelector(`button.route-btn[data-order-id="${orderId}"]`, { timeout: 5000 });
    
    // Click and wait for the network request to complete
    await Promise.all([
      this.page.waitForResponse(resp => resp.url().includes(`/api/orders/${orderId}`) && resp.request().method() === 'PATCH', { timeout: 10000 }),
      this.page.click(`button.route-btn[data-order-id="${orderId}"]`)
    ]);
  }

  async clickFillButton(orderId: string) {
    await this.page.waitForSelector(`button.fill-btn[data-order-id="${orderId}"]`, { timeout: 5000 });
    
    await Promise.all([
      this.page.waitForResponse(resp => resp.url().includes(`/api/orders/${orderId}`) && resp.request().method() === 'PATCH', { timeout: 10000 }),
      this.page.click(`button.fill-btn[data-order-id="${orderId}"]`)
    ]);
  }

  async clickCancelButton(orderId: string) {
    await this.page.waitForSelector(`button.cancel-btn[data-order-id="${orderId}"]`, { timeout: 5000 });
    
    await Promise.all([
      this.page.waitForResponse(resp => resp.url().includes(`/api/orders/${orderId}`) && resp.request().method() === 'PATCH', { timeout: 10000 }),
      this.page.click(`button.cancel-btn[data-order-id="${orderId}"]`)
    ]);
  }
}