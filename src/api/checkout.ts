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

// POST /api/checkout/create-session
checkoutRouter.post('/create-session', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json<{
    items: CheckoutCartItem[];
    customerEmail?: string;
    customerName?: string;
  }>();

  if (!body.items || body.items.length === 0) {
    return c.json({ error: 'Cart is empty' }, 400);
  }

  // Security Rule: NEVER trust client prices.
  // Fetch real product details from Cloudflare D1
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
      return c.json({ error: `Product not found: ${item.productId}` }, 400);
    }

    let unitPrice = prod.basePrice;

    // Check variant price if variant selected
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

    const itemTotal = unitPrice * item.quantity;
    subtotal += itemTotal;

    verifiedLineItems.push({
      productId: prod.id,
      variantId: item.variantId,
      title: prod.title,
      unitPrice,
      quantity: item.quantity,
      image: prod.primaryImage,
    });
  }

  const shippingFee = subtotal > 10000 ? 0 : 1500; // Free shipping over $100, else $15
  const totalAmount = subtotal + shippingFee;
  const orderId = crypto.randomUUID();
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  // Save Pending Order in D1
  await db.insert(orders).values({
    id: orderId,
    orderNumber,
    customerEmail: body.customerEmail || 'guest@example.com',
    customerName: body.customerName || 'Guest Customer',
    shippingAddress: JSON.stringify({ note: 'Pending checkout' }),
    subtotal,
    shippingFee,
    totalAmount,
    paymentStatus: 'unpaid',
    fulfillmentStatus: 'pending',
  });

  // Save Line Items
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

  // If Stripe Key is provided, create real Stripe Checkout Session
  // Otherwise in local demo mode, return simulated direct checkout URL
  const stripeKey = c.env.STRIPE_SECRET_KEY;
  if (stripeKey && !stripeKey.startsWith('mock_')) {
    try {
      // In production with real Stripe:
      // const stripe = new Stripe(stripeKey, { apiVersion: '2024-11-20' });
      // const session = await stripe.checkout.sessions.create(...);
      // return c.json({ url: session.url, orderNumber });
    } catch (err: any) {
      return c.json({ error: err.message }, 500);
    }
  }

  // Demo / Dev Mode Success simulation
  return c.json({
    orderId,
    orderNumber,
    subtotal,
    shippingFee,
    totalAmount,
    message: 'Order created successfully. Ready for payment gateway redirection.',
  });
});
