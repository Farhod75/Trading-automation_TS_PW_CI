import { test, expect } from '@playwright/test';

test.describe('Orders API', () => {
  test('create and list orders via API', async ({ request }) => {
    const createResp = await request.post('/api/orders', {
      data: {
        instrument: 'BOND_US10Y',
        side: 'BUY',
        quantity: 1000,
        price: 99.5,
      },
    });
    expect(createResp.status()).toBe(201);
    const created = await createResp.json();
    expect(created.order_id).toBeTruthy();
    expect(created.status).toBe('NEW');

    const listResp = await request.get('/api/orders');
    expect(listResp.status()).toBe(200);
    const orders = await listResp.json();
    const found = orders.find((o: any) => o.order_id === created.order_id);
    expect(found).toBeTruthy();
  });

  test('route and fill order via API', async ({ request }) => {
    const createResp = await request.post('/api/orders', {
      data: {
        instrument: 'IRS_USD_5Y',
        side: 'SELL',
        quantity: 2000000,
        price: 2.25,
      },
    });
    expect(createResp.status()).toBe(201);
    const created = await createResp.json();
    const orderId = created.order_id;

    const routeResp = await request.post(`/api/orders/${orderId}/route`);
    expect(routeResp.status()).toBe(200);
    const routed = await routeResp.json();
    expect(routed.status).toBe('ROUTED');

    const fillResp = await request.post(`/api/orders/${orderId}/fill`);
    expect(fillResp.status()).toBe(200);
    const filled = await fillResp.json();
    expect(filled.status).toBe('FILLED');
  });

  test('cancel non-existent order returns 404', async ({ request }) => {
    const resp = await request.post('/api/orders/NON_EXISTENT/cancel');
    expect(resp.status()).toBe(404);
  });
});