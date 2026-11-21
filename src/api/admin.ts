import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { createDb } from '../db';
import { products, orders, categories, productVariants } from '../db/schema';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '../db/seed-data';
import { createAdminToken, verifyAdminToken, constantTimeCompare } from '../lib/auth';
import type { Bindings } from './index';

export const adminRouter = new Hono<{ Bindings: Bindings }>();

const DEFAULT_JWT_SECRET = 'edge-commerce-super-secret-jwt-key-2026';
const DEFAULT_ADMIN_EMAIL = 'admin@edgecommerce.com';
const DEFAULT_ADMIN_PASSWORD = 'admin'; // Default password for instant local demo

// -----------------------------------------------------------------------------
// PUBLIC AUTH ENDPOINTS (No middleware)
// -----------------------------------------------------------------------------

// POST /api/admin/auth/login — Verify credentials and set HttpOnly session cookie
adminRouter.post('/auth/login', async (c) => {
  const body = await c.req.json<{ email?: string; password?: string }>();
  const email = body.email?.trim().toLowerCase() || '';
  const password = body.password || '';

  const configuredEmail = (c.env as any).ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
  const configuredPassword = (c.env as any).ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  const jwtSecret = (c.env as any).JWT_SECRET || DEFAULT_JWT_SECRET;

  const emailMatches = email === configuredEmail.toLowerCase();
  const passwordMatches = constantTimeCompare(password, configuredPassword);

  if (!emailMatches || !passwordMatches) {
    return c.json({ error: 'Invalid admin credentials' }, 401);
  }

  // Issue signed Edge JWT token
  const token = await createAdminToken(email, jwtSecret);

  // Set secure HttpOnly cookie
  c.header(
    'Set-Cookie',
    `admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
  );

  return c.json({
    success: true,
    user: { email, role: 'admin' },
    message: 'Admin session authenticated successfully',
  });
});

// POST /api/admin/auth/logout — Destroy session cookie
adminRouter.post('/auth/logout', (c) => {
  c.header(
    'Set-Cookie',
    'admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
  );
  return c.json({ success: true, message: 'Logged out' });
});

// GET /api/admin/auth/me — Check session status
adminRouter.get('/auth/me', async (c) => {
  const cookieHeader = c.req.header('Cookie') || '';
  const tokenMatch = cookieHeader.match(/admin_session=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : c.req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return c.json({ authenticated: false }, 401);
  }

  const jwtSecret = (c.env as any).JWT_SECRET || DEFAULT_JWT_SECRET;
  const verified = await verifyAdminToken(token, jwtSecret);

  if (!verified) {
    return c.json({ authenticated: false }, 401);
  }

  return c.json({ authenticated: true, user: verified });
});

// -----------------------------------------------------------------------------
// AUTH MIDDLEWARE FOR ALL OPERATIONAL ADMIN ROUTES
// -----------------------------------------------------------------------------
adminRouter.use('*', async (c, next) => {
  // Skip auth checks for login/logout/me
  if (c.req.path.startsWith('/api/admin/auth/')) {
    return next();
  }

  const cookieHeader = c.req.header('Cookie') || '';
  const tokenMatch = cookieHeader.match(/admin_session=([^;]+)/);
  const token = tokenMatch ? tokenMatch[1] : c.req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return c.json({ error: 'Unauthorized: Admin authentication required' }, 401);
  }

  const jwtSecret = (c.env as any).JWT_SECRET || DEFAULT_JWT_SECRET;
  const verified = await verifyAdminToken(token, jwtSecret);

  if (!verified) {
    return c.json({ error: 'Unauthorized: Invalid or expired admin session' }, 401);
  }

  return next();
});

// -----------------------------------------------------------------------------
// PROTECTED ADMIN ENDPOINTS
// -----------------------------------------------------------------------------

// POST /api/admin/seed — Populate D1 with initial rich catalog
adminRouter.post('/seed', async (c) => {
  if (!c.env?.DB) {
    return c.json({ error: 'D1 database binding not available' }, 500);
  }

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

// GET /api/admin/overview — Dashboard metrics strictly from D1
adminRouter.get('/overview', async (c) => {
  if (!c.env?.DB) {
    return c.json({
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      recentOrders: [],
    });
  }

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

// GET /api/admin/orders — List all orders strictly from D1
adminRouter.get('/orders', async (c) => {
  if (!c.env?.DB) {
    return c.json({ orders: [] });
  }

  const db = createDb(c.env.DB);
  const orderList = await db.select().from(orders).orderBy(desc(orders.createdAt)).all();
  return c.json({ orders: orderList });
});

// PUT /api/admin/orders/:id/status — Update fulfillment status in D1
adminRouter.put('/orders/:id/status', async (c) => {
  if (!c.env?.DB) {
    return c.json({ error: 'DB binding not available' }, 500);
  }
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

// POST /api/admin/products — Create a new product in D1
adminRouter.post('/products', async (c) => {
  if (!c.env?.DB) {
    return c.json({ error: 'DB binding not available' }, 500);
  }
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
