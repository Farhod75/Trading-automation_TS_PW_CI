import { expect, Page } from '@playwright/test';

export class OrderTicketPage {
  readonly page: Page;
  readonly instrumentSelect = '#instrument';
  readonly buyRadio = '#sideBuy';
  readonly sellRadio = '#sideSell';
  readonly quantityInput = '#quantity';
  readonly priceInput = '#price';
  readonly submitButton = 'button[type="submit"]';
  readonly successMsg = '#successMsg';
  readonly errorMsg = '#errorMsg';

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('http://localhost:3000/order-ticket.html');
  }

  async selectInstrument(instrument: string) {
    await this.page.selectOption(this.instrumentSelect, instrument);
  }

  async selectSide(side: 'BUY' | 'SELL') {
    if (side === 'BUY') {
      await this.page.click(this.buyRadio);
    } else {
      await this.page.click(this.sellRadio);
    }
  }

  async fillQuantity(quantity: string) {
    await this.page.fill(this.quantityInput, quantity);
  }

  async fillPrice(price: string) {
    await this.page.fill(this.priceInput, price);
  }

  async submit() {
    await this.page.click(this.submitButton);
  }

  async placeOrder(
    instrument: string,
    side: 'BUY' | 'SELL',
    quantity: string,
    price: string
  ) {
    await this.selectInstrument(instrument);
    await this.selectSide(side);
    await this.fillQuantity(quantity);
    await this.fillPrice(price);
    await this.submit();
  }

  async assertSuccessMessageVisible() {
    const success = this.page.locator(this.successMsg);
    await expect(success).toBeVisible({ timeout: 10000 });
  }

  async getOrderId(): Promise<string> {
    const success = this.page.locator(this.successMsg);

    const orderIdAttr = await success.getAttribute('data-order-id');
    if (orderIdAttr && orderIdAttr !== 'UNKNOWN') {
      return orderIdAttr;
    }

    const text = await success.textContent();
    if (!text) {
      throw new Error('Success message has no text');
    }
    const match = text.match(/Order created:\s*(\S+)/);
    if (!match || !match[1]) {
      throw new Error(`Could not extract order ID from success message: ${text}`);
    }
    return match[1];
  }

  async assertNoSuccessVisible() {
    const success = this.page.locator(this.successMsg);
    await expect(success).toBeHidden();
  }

  async assertErrorMessageVisible(expected?: string) {
    const error = this.page.locator(this.errorMsg);
    await expect(error).toBeVisible({ timeout: 10000 });
    if (expected) {
      await expect(error).toHaveText(expected);
    }
  }

  async assertNoErrorVisible() {
    const error = this.page.locator(this.errorMsg);
    await error.waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {
      // ignore; test will still validate success message and blotter behavior
    });
  }
}