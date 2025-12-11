import { test } from '../../src/utils/testBase';
import { LoginPage } from '../../src/pages/LoginPage';
import { OrderTicketPage } from '../../src/pages/OrderTicketPage';
import { BlotterPage } from '../../src/pages/BlotterPage';
import { DataLoader, OrderScenario } from '../../src/utils/dataLoader';

const orders: OrderScenario[] = DataLoader.loadOrderScenarios();

test.describe('Order Ticket - positive scenarios (YAML-driven)', () => {
  for (const scenario of orders) {
    test(`Place and fill order: ${scenario.id} - ${scenario.description}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const orderTicketPage = new OrderTicketPage(page);
      const blotterPage = new BlotterPage(page);

      // Login
      await loginPage.navigate();
      await loginPage.login('trader', 'trader123');
      await loginPage.assertRedirectedToOrderTicket();

      // Place order from YAML
      await orderTicketPage.placeOrder(
        scenario.instrument,
        scenario.side,
        scenario.quantity,
        scenario.price
      );
      await orderTicketPage.assertNoErrorVisible();
      await orderTicketPage.assertSuccessMessageVisible();
      const orderId = await orderTicketPage.getOrderId();

      // Blotter checks
      await blotterPage.navigate();
      await blotterPage.assertOrderExists(orderId);
      await blotterPage.assertOrderStatus(orderId, 'NEW');

      // Route and fill
      await blotterPage.clickRouteButton(orderId);
      await blotterPage.refresh();
      await blotterPage.assertOrderStatus(orderId, 'ROUTED');

      await blotterPage.clickFillButton(orderId);
      await blotterPage.refresh();
      await blotterPage.assertOrderStatus(
        orderId,
        scenario.expectedStatus || 'FILLED'
      );
    });
  }
});