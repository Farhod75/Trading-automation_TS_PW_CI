import { test, expect } from '../../src/utils/testBase';
import { LoginPage } from '../../src/pages/LoginPage';
import { OrderTicketPage } from '../../src/pages/OrderTicketPage';
import { BlotterPage } from '../../src/pages/BlotterPage';

test.describe('Trading Order Flow E2E', () => {
  test('Place order, route, and fill', async ({ page }) => {
    const orderTicketPage = new OrderTicketPage(page);
    const blotterPage = new BlotterPage(page);

    // Go to order ticket
    await orderTicketPage.goto();

    // Place order
    await orderTicketPage.placeOrder(
      'BOND_US10Y',
      'BUY',
      '1000',
      '99.50'
    );

    // Instead of blindly expecting success visible, first check if error is visible
    const errorLocator = page.locator('#errorMsg');
    const successLocator = page.locator('#successMsg');

    // Wait a bit for JS/fetch to complete
    await page.waitForTimeout(2000);

    const errorVisible = await errorLocator.isVisible();
    if (errorVisible) {
      const errText = await errorLocator.textContent();
      throw new Error(`Order submission failed in UI. #errorMsg is visible with text: "${errText}"`);
    }

    // Now enforce success should be visible
    await expect(successLocator).toBeVisible({ timeout: 10000 });

    const orderId = await orderTicketPage.getOrderId();

    // Navigate to blotter
    await blotterPage.goto();

    // Validate order appears as NEW
    await blotterPage.assertOrderExists(orderId);
    await blotterPage.assertOrderStatus(orderId, 'NEW');

    // Route the order
    await blotterPage.clickRouteButton(orderId);
    await blotterPage.assertOrderStatus(orderId, 'ROUTED');

    // Fill the order
    await blotterPage.clickFillButton(orderId);
    await blotterPage.assertOrderStatus(orderId, 'FILLED');
  });
});