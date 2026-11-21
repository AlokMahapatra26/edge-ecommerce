import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { createDb } from '../db';
import { products, orders, categories, productVariants } from '../db/schema';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '../db/seed-data';
import type { Bindings } from './index';

export const adminRouter = new Hono<{ Bindings: Bindings }>();

// POST /api/admin/seed — Populate D1 with initial rich catalog
adminRouter.post('/seed', async (c) => {
  const db = createDb(c.env.DB);

  // 1. Insert Categories
  for (const cat of SEED_CATEGORIES) {
    await db
      .insert(categories)
      .values(cat)
      .onConflictDoNothing();
  }

  // 2. Insert Products and Variants
  for (const prod of SEED_PRODUCTS) {
    const { variants, ...prodData } = prod;
    await db
      .insert(products)
      .values({
        ...prodData,
        isActive: true,
      })
      .onConflictDoNothing();

    if (variants && variants.length > 0) {
      for (const v of variants) {
        await db
          .insert(productVariants)
          .values({
            id: v.id,
            productId: prod.id,
            sku: v.sku,
            title: v.title,
            inventoryQuantity: v.inventoryQuantity,
          })
          .onConflictDoNothing();
      }
    }
  }

  return c.json({ success: true, message: 'Database successfully seeded with categories and products' });
});

// GET /api/admin/overview — Dashboard metrics
adminRouter.get('/overview', async (c) => {
  const db = createDb(c.env.DB);

  const [allOrders, allProducts] = await Promise.all([
    db.select().from(orders).orderBy(desc(orders.createdAt)).all(),
    db.select().from(products).all(),
  ]);

  const totalRevenue = allOrders
    .filter((o) => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return c.json({
    totalRevenue,
    totalOrders: allOrders.length,
    totalProducts: allProducts.length,
    recentOrders: allOrders.slice(0, 10),
  });
});

// GET /api/admin/orders — List all orders
adminRouter.get('/orders', async (c) => {
  const db = createDb(c.env.DB);
  const orderList = await db.select().from(orders).orderBy(desc(orders.createdAt)).all();
  return c.json({ orders: orderList });
});

// PUT /api/admin/orders/:id/status — Update fulfillment status
adminRouter.put('/orders/:id/status', async (c) => {
  const db = createDb(c.env.DB);
  const orderId = c.req.param('id');
  const body = await c.req.json<{ fulfillmentStatus: string; trackingNumber?: string }>();

  await db
    .update(orders)
    .set({
      fulfillmentStatus: body.fulfillmentStatus,
      trackingNumber: body.trackingNumber || null,
    })
    .where(eq(orders.id, orderId));

  return c.json({ success: true, message: 'Order status updated' });
});

// POST /api/admin/products — Create a new product
adminRouter.post('/products', async (c) => {
  const db = createDb(c.env.DB);
  const body = await c.req.json<{
    title: string;
    slug: string;
    description: string;
    basePrice: number;
    categoryId?: number;
    primaryImage: string;
    featured?: boolean;
  }>();

  const id = crypto.randomUUID();
  await db.insert(products).values({
    id,
    title: body.title,
    slug: body.slug,
    description: body.description,
    basePrice: body.basePrice,
    categoryId: body.categoryId || null,
    primaryImage: body.primaryImage,
    featured: body.featured || false,
    isActive: true,
  });

  return c.json({ success: true, productId: id });
});
