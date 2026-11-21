import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { createDb } from '../db';
import { products, orders, categories, productVariants, adminUsers } from '../db/schema';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '../db/seed-data';
import {
  hashPassword,
  verifyPassword,
  createAdminToken,
  verifyAdminToken,
} from '../lib/auth';
import type { Bindings } from './index';

export const adminRouter = new Hono<{ Bindings: Bindings }>();

const DEFAULT_JWT_SECRET = 'edge-commerce-super-secret-jwt-key-2026';

// -----------------------------------------------------------------------------
// PUBLIC AUTH & SETUP ENDPOINTS
// -----------------------------------------------------------------------------

// GET /api/admin/auth/status — Checks if store already has a Master Admin
adminRouter.get('/auth/status', async (c) => {
  if (!c.env?.DB) {
    return c.json({ hasAdmin: false });
  }

  const db = createDb(c.env.DB);
  const existingAdmin = await db.select().from(adminUsers).limit(1).get();

  return c.json({ hasAdmin: !!existingAdmin });
});

// POST /api/admin/auth/setup — First-Time Onboarding: Create Master Admin in D1
adminRouter.post('/auth/setup', async (c) => {
  if (!c.env?.DB) {
    return c.json({ error: 'Database binding unavailable' }, 500);
  }

  const db = createDb(c.env.DB);

  const existingAdmin = await db.select().from(adminUsers).limit(1).get();
  if (existingAdmin) {
    return c.json(
      { error: 'Setup is locked: Master Admin account has already been initialized.' },
      403
    );
  }

  const body = await c.req.json<{ name?: string; email?: string; password?: string }>();
  const name = body.name?.trim() || 'Store Administrator';
  const email = body.email?.trim().toLowerCase() || '';
  const password = body.password || '';

  if (!email || !password || password.length < 6) {
    return c.json(
      { error: 'Please provide a valid email and a password with at least 6 characters.' },
      400
    );
  }

  const passwordHash = await hashPassword(password);
  const adminId = crypto.randomUUID();

  await db.insert(adminUsers).values({
    id: adminId,
    name,
    email,
    passwordHash,
  });

  const jwtSecret = (c.env as any).JWT_SECRET || DEFAULT_JWT_SECRET;
  const token = await createAdminToken(email, jwtSecret);

  c.header(
    'Set-Cookie',
    `admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
  );

  return c.json({
    success: true,
    user: { id: adminId, name, email, role: 'admin' },
    message: 'Master Admin account created successfully in Cloudflare D1.',
  });
});

// POST /api/admin/auth/login — Verify credentials against Cloudflare D1
adminRouter.post('/auth/login', async (c) => {
  if (!c.env?.DB) {
    return c.json({ error: 'Database binding unavailable' }, 500);
  }

  const body = await c.req.json<{ email?: string; password?: string }>();
  const email = body.email?.trim().toLowerCase() || '';
  const password = body.password || '';

  const db = createDb(c.env.DB);
  const admin = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .get();

  if (!admin) {
    return c.json({ error: 'Invalid admin credentials' }, 401);
  }

  const isValid = await verifyPassword(password, admin.passwordHash);
  if (!isValid) {
    return c.json({ error: 'Invalid admin credentials' }, 401);
  }

  const jwtSecret = (c.env as any).JWT_SECRET || DEFAULT_JWT_SECRET;
  const token = await createAdminToken(email, jwtSecret);

  c.header(
    'Set-Cookie',
    `admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`
  );

  return c.json({
    success: true,
    user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' },
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

  for (const cat of SEED_CATEGORIES) {
    await db
      .insert(categories)
      .values(cat)
      .onConflictDoNothing();
  }

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

// GET /api/admin/products — List all products with categories for admin table
adminRouter.get('/products', async (c) => {
  if (!c.env?.DB) return c.json({ products: [] });
  const db = createDb(c.env.DB);
  const items = await db.select().from(products).orderBy(desc(products.createdAt)).all();
  return c.json({ products: items });
});

// POST /api/admin/products — Create a new product in D1
adminRouter.post('/products', async (c) => {
  if (!c.env?.DB) {
    return c.json({ error: 'DB binding not available' }, 500);
  }
  const db = createDb(c.env.DB);
  const body = await c.req.json<{
    title: string;
    slug?: string;
    description: string;
    basePrice: number; // in cents
    compareAtPrice?: number | null;
    categoryId?: number | null;
    primaryImage?: string;
    featured?: boolean;
  }>();

  if (!body.title || !body.basePrice) {
    return c.json({ error: 'Product title and price are required' }, 400);
  }

  const id = crypto.randomUUID();
  const slug =
    body.slug ||
    body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') +
      '-' +
      Math.floor(1000 + Math.random() * 9000);

  await db.insert(products).values({
    id,
    title: body.title,
    slug,
    description: body.description || '',
    basePrice: body.basePrice,
    compareAtPrice: body.compareAtPrice || null,
    categoryId: body.categoryId || null,
    primaryImage: body.primaryImage || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    featured: body.featured || false,
    isActive: true,
  });

  return c.json({ success: true, productId: id, message: 'Product created in Cloudflare D1' });
});

// DELETE /api/admin/products/:id — Delete a product from D1
adminRouter.delete('/products/:id', async (c) => {
  if (!c.env?.DB) return c.json({ error: 'DB not available' }, 500);
  const db = createDb(c.env.DB);
  const productId = c.req.param('id');
  await db.delete(products).where(eq(products.id, productId));
  return c.json({ success: true, message: 'Product deleted' });
});

// GET /api/admin/categories — List categories
adminRouter.get('/categories', async (c) => {
  if (!c.env?.DB) return c.json({ categories: [] });
  const db = createDb(c.env.DB);
  const list = await db.select().from(categories).all();
  return c.json({ categories: list });
});

// POST /api/admin/categories — Create a category in D1
adminRouter.post('/categories', async (c) => {
  if (!c.env?.DB) return c.json({ error: 'DB not available' }, 500);
  const db = createDb(c.env.DB);
  const body = await c.req.json<{ name: string; slug?: string; description?: string }>();

  if (!body.name) {
    return c.json({ error: 'Category name is required' }, 400);
  }

  const slug =
    body.slug ||
    body.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

  await db.insert(categories).values({
    name: body.name,
    slug,
    description: body.description || null,
  });

  return c.json({ success: true, message: 'Category created in Cloudflare D1' });
});

// DELETE /api/admin/categories/:id — Delete a category
adminRouter.delete('/categories/:id', async (c) => {
  if (!c.env?.DB) return c.json({ error: 'DB not available' }, 500);
  const db = createDb(c.env.DB);
  const catId = parseInt(c.req.param('id'), 10);
  await db.delete(categories).where(eq(categories.id, catId));
  return c.json({ success: true, message: 'Category deleted' });
});

// GET /api/admin/orders — List all orders
adminRouter.get('/orders', async (c) => {
  if (!c.env?.DB) return c.json({ orders: [] });
  const db = createDb(c.env.DB);
  const orderList = await db.select().from(orders).orderBy(desc(orders.createdAt)).all();
  return c.json({ orders: orderList });
});

// PUT /api/admin/orders/:id/status — Update fulfillment status in D1
adminRouter.put('/orders/:id/status', async (c) => {
  if (!c.env?.DB) return c.json({ error: 'DB binding not available' }, 500);
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
