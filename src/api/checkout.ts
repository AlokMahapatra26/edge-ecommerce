import { Hono } from 'hono';
import { eq, inArray } from 'drizzle-orm';
import { createDb } from '../db';
import { products, productVariants, orders, orderItems } from '../db/schema';
import { SEED_PRODUCTS } from '../db/seed-data';
import type { Bindings } from './index';

export const checkoutRouter = new Hono<{ Bindings: Bindings }>();

interface CheckoutCartItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

// POST /api/checkout/create-session
checkoutRouter.post('/create-session', async (c) => {
  const body = await c.req.json<{
    items: CheckoutCartItem[];
    customerEmail?: string;
    customerName?: string;
  }>();

  if (!body.items || body.items.length === 0) {
    return c.json({ error: 'Cart is empty' }, 400);
  }

  const orderId = crypto.randomUUID();
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  let subtotal = 0;
  const verifiedLineItems = [];

  if (c.env?.DB) {
    try {
      const db = createDb(c.env.DB);
      const productIds = body.items.map((i) => i.productId);
      const dbProducts = await db
        .select()
        .from(products)
        .where(inArray(products.id, productIds))
        .all();

      const productMap = new Map(dbProducts.map((p) => [p.id, p]));

      for (const item of body.items) {
        const prod = productMap.get(item.productId) || SEED_PRODUCTS.find((p) => p.id === item.productId);
        if (!prod) continue;

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
        message: 'Order created successfully in Cloudflare D1.',
      });
    } catch (err) {
      console.warn('DB checkout transaction fallback:', err);
    }
  }

  // Fallback demo calculation
  for (const item of body.items) {
    const prod = SEED_PRODUCTS.find((p) => p.id === item.productId);
    const unitPrice = prod ? prod.basePrice : 9900;
    subtotal += unitPrice * item.quantity;
  }
  const shippingFee = subtotal > 10000 ? 0 : 1500;
  const totalAmount = subtotal + shippingFee;

  return c.json({
    orderId,
    orderNumber,
    subtotal,
    shippingFee,
    totalAmount,
    message: 'Demo checkout order placed successfully.',
  });
});
