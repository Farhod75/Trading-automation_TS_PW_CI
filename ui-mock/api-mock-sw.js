const ORDERS_KEY = 'orders';

function readOrders() {
  try {
    const raw = self.localStorage?.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeOrders(orders) {
  try {
    self.localStorage?.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    // ignore write errors in mock
  }
}

async function handleRequest(event) {
  const url = new URL(event.request.url);

  if (!url.pathname.startsWith('/api/')) {
    return;
  }

  event.respondWith(
    (async () => {
      const method = event.request.method;
      const path = url.pathname;

      // GET /api/orders
      if (method === 'GET' && path === '/api/orders') {
        const orders = readOrders();
        return new Response(JSON.stringify(orders), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // POST /api/orders
      if (method === 'POST' && path === '/api/orders') {
        const body = await event.request.json();
        const orders = readOrders();

        const orderId = body.order_id || body.orderId || `ORD-${Date.now()}`;
        const order = {
          order_id: orderId,
          instrument: body.instrument,
          side: body.side,
          quantity: Number(body.quantity),
          price: Number(body.price),
          status: 'NEW',
          timestamp: new Date().toISOString(),
        };
        orders.push(order);
        writeOrders(orders);

        return new Response(JSON.stringify(order), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // PATCH /api/orders/:id - for status updates (real API)
      const patchMatch = path.match(/^\/api\/orders\/([^/]+)$/);
      if (method === 'PATCH' && patchMatch) {
        const orderId = patchMatch[1];
        const body = await event.request.json();

        const orders = readOrders();
        const order = orders.find(o => o.order_id === orderId);
        if (!order) {
          return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (body.status) {
          order.status = body.status;
        }

        writeOrders(orders);
        return new Response(JSON.stringify(order), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // POST /api/orders/:id/route|fill|cancel (legacy mock API)
      const match = path.match(/^\/api\/orders\/([^/]+)\/(route|fill|cancel)$/);
      if (method === 'POST' && match) {
        const orderId = match[1];
        const action = match[2];

        const orders = readOrders();
        const order = orders.find(o => o.order_id === orderId);
        if (!order) {
          return new Response(JSON.stringify({ error: 'Not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        if (action === 'route') {
          order.status = 'ROUTED';
        } else if (action === 'fill') {
          order.status = 'FILLED';
        } else if (action === 'cancel') {
          order.status = 'CANCELLED';
        }

        writeOrders(orders);
        return new Response(JSON.stringify(order), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ error: 'Not implemented in mock' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    })()
  );
}

self.addEventListener('fetch', handleRequest);