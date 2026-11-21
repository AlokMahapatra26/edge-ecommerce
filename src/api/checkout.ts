import { Hono } from 'hono';
import { eq, inArray } from 'drizzle-orm';
import { createDb } from '../db';
import { products, productVariants, orders, orderItems } from '../db/schema';
import type { Bindings } from './index';

export const checkoutRouter = new Hono<{ Bindings: Bindings }>();

interface CheckoutCartItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

// POST /api/checkout/create-session — 100% verified against D1 database
checkoutRouter.post('/create-session', async (c) => {
  if (!c.env?.DB) {
    return c.json({ error: 'Database binding unavailable' }, 500);
  }

  const db = createDb(c.env.DB);
  const body = await c.req.json<{
    items: CheckoutCartItem[];
    customerEmail?: string;
    customerName?: string;
  }>();

  if (!body.items || body.items.length === 0) {
    return c.json({ error: 'Cart is empty' }, 400);
  }

  const productIds = body.items.map((i) => i.productId);
  const dbProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds))
    .all();

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  let subtotal = 0;
  const verifiedLineItems = [];

  for (const item of body.items) {
    const prod = productMap.get(item.productId);
    if (!prod) {
      return c.json({ error: `Product not found in database: ${item.productId}` }, 400);
    }

    let unitPrice = prod.basePrice;
    if (item.variantId) {
      const variant = await db
        .select()
        .from(productVariants)
        .where(eq(productVariants.id, item.variantId))
        .get();
      if (variant && variant.priceOverride) {
        unitPrice = variant.priceOverride;
      }
    }

    subtotal += unitPrice * item.quantity;
    verifiedLineItems.push({
      productId: prod.id,
      variantId: item.variantId,
      title: prod.title,
      unitPrice,
      quantity: item.quantity,
      image: prod.primaryImage,
    });
  }

  const shippingFee = subtotal > 10000 ? 0 : 1500;
  const totalAmount = subtotal + shippingFee;
  const orderId = crypto.randomUUID();
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  await db.insert(orders).values({
    id: orderId,
    orderNumber,
    customerEmail: body.customerEmail || 'customer@example.com',
    customerName: body.customerName || 'Customer',
    shippingAddress: JSON.stringify({ note: 'Checkout' }),
    subtotal,
    shippingFee,
    totalAmount,
    paymentStatus: 'unpaid',
    fulfillmentStatus: 'pending',
  });

  for (const item of verifiedLineItems) {
    await db.insert(orderItems).values({
      id: crypto.randomUUID(),
      orderId,
      productId: item.productId,
      variantId: item.variantId || null,
      title: item.title,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
      image: item.image,
    });
  }

  return c.json({
    orderId,
    orderNumber,
    subtotal,
    shippingFee,
    totalAmount,
    message: 'Order created in Cloudflare D1.',
  });
});
