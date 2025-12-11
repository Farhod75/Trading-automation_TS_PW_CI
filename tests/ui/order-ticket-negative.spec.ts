import { test } from '../../src/utils/testBase';
import { LoginPage } from '../../src/pages/LoginPage';
import { OrderTicketPage } from '../../src/pages/OrderTicketPage';
import { DataLoader, OrderScenario } from '../../src/utils/dataLoader';

const negativeOrders: OrderScenario[] = DataLoader.loadNegativeOrderScenarios();

test.describe('Order Ticket - negative scenarios (YAML-driven)', () => {
  for (const scenario of negativeOrders) {
    test(`Validate order input: ${scenario.id} - ${scenario.description}`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const orderTicketPage = new OrderTicketPage(page);

      // Login
      await loginPage.navigate();
      await loginPage.login('trader', 'trader123');
      await loginPage.assertRedirectedToOrderTicket();

      // Apply fields only when non-empty in YAML
      if (scenario.instrument) {
        await orderTicketPage.selectInstrument(scenario.instrument);
      }
      if (scenario.side) {
        await orderTicketPage.selectSide(scenario.side);
      }
      if (scenario.quantity) {
        await orderTicketPage.enterQuantity(scenario.quantity);
      }
      if (scenario.price) {
        await orderTicketPage.enterPrice(scenario.price);
      }

      await orderTicketPage.submitOrder();

      // Expect error and no success
      await orderTicketPage.assertErrorVisible();
      await orderTicketPage.assertNoSuccessVisible();
    });
  }
});