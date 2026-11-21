import { Hono } from 'hono';
import { eq, desc, and, like } from 'drizzle-orm';
import { createDb } from '../db';
import { products, categories, productVariants, productImages } from '../db/schema';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '../db/seed-data';
import type { Bindings } from './index';

export const productsRouter = new Hono<{ Bindings: Bindings }>();

// GET /api/products — List all products with optional filters
productsRouter.get('/', async (c) => {
  const categorySlug = c.req.query('category');
  const search = c.req.query('search');
  const featuredOnly = c.req.query('featured') === 'true';

  // 1. Try fetching from Cloudflare D1
  if (c.env?.DB) {
    try {
      const db = createDb(c.env.DB);

      let categoryId: number | undefined;
      if (categorySlug) {
        const foundCat = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, categorySlug))
          .get();
        if (foundCat) {
          categoryId = foundCat.id;
        }
      }

      const conditions = [eq(products.isActive, true)];
      if (categoryId) conditions.push(eq(products.categoryId, categoryId));
      if (featuredOnly) conditions.push(eq(products.featured, true));
      if (search) conditions.push(like(products.title, `%${search}%`));

      const items = await db
        .select()
        .from(products)
        .where(and(...conditions))
        .orderBy(desc(products.createdAt))
        .all();

      if (items.length > 0) {
        return c.json({ products: items });
      }
    } catch (d1Err) {
      console.warn('D1 query uninitialized or empty, serving from seed fallback:', d1Err);
    }
  }

  // 2. Safe Fallback: If D1 is not yet seeded or migrated, serve from SEED_PRODUCTS
  let filtered = [...SEED_PRODUCTS] as any[];

  if (categorySlug && categorySlug !== 'all') {
    const cat = SEED_CATEGORIES.find((c) => c.slug === categorySlug);
    if (cat) {
      filtered = filtered.filter((p) => p.categoryId === cat.id);
    }
  }

  if (featuredOnly) {
    filtered = filtered.filter((p) => p.featured);
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  return c.json({ products: filtered });
});

// GET /api/products/categories — List all product categories
productsRouter.get('/categories', async (c) => {
  if (c.env?.DB) {
    try {
      const db = createDb(c.env.DB);
      const allCategories = await db.select().from(categories).all();
      if (allCategories.length > 0) {
        return c.json({ categories: allCategories });
      }
    } catch {
      // Fallback
    }
  }

  return c.json({ categories: SEED_CATEGORIES });
});

// GET /api/products/:slug — Single product with variants & images
productsRouter.get('/:slug', async (c) => {
  const slug = c.req.param('slug');

  if (c.env?.DB) {
    try {
      const db = createDb(c.env.DB);
      const product = await db
        .select()
        .from(products)
        .where(eq(products.slug, slug))
        .get();

      if (product) {
        const [variants, images, category] = await Promise.all([
          db.select().from(productVariants).where(eq(productVariants.productId, product.id)).all(),
          db.select().from(productImages).where(eq(productImages.productId, product.id)).all(),
          product.categoryId
            ? db.select().from(categories).where(eq(categories.id, product.categoryId)).get()
            : null,
        ]);

        return c.json({
          product: {
            ...product,
            variants,
            images,
            category,
          },
        });
      }
    } catch {
      // Fallback
    }
  }

  // Fallback to seed data
  const seedProduct = SEED_PRODUCTS.find((p) => p.slug === slug);
  if (!seedProduct) {
    return c.json({ error: 'Product not found' }, 404);
  }

  const category = SEED_CATEGORIES.find((c) => c.id === seedProduct.categoryId);

  return c.json({
    product: {
      ...seedProduct,
      category,
    },
  });
});
