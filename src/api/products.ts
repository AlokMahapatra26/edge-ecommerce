import { Hono } from 'hono';
import { eq, desc, and, like } from 'drizzle-orm';
import { createDb } from '../db';
import { products, categories, productVariants, productImages } from '../db/schema';
import type { Bindings } from './index';

export const productsRouter = new Hono<{ Bindings: Bindings }>();

// GET /api/products — Pure D1 query, returns empty array if no products exist
productsRouter.get('/', async (c) => {
  if (!c.env?.DB) {
    return c.json({ products: [] });
  }

  const db = createDb(c.env.DB);
  const categorySlug = c.req.query('category');
  const search = c.req.query('search');
  const featuredOnly = c.req.query('featured') === 'true';

  let categoryId: number | undefined;
  if (categorySlug && categorySlug !== 'all') {
    const foundCat = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .get();
    if (foundCat) {
      categoryId = foundCat.id;
    } else {
      return c.json({ products: [] });
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

  return c.json({ products: items });
});

// GET /api/products/categories — Pure D1 query, returns empty array if no categories exist
productsRouter.get('/categories', async (c) => {
  if (!c.env?.DB) {
    return c.json({ categories: [] });
  }

  const db = createDb(c.env.DB);
  const allCategories = await db.select().from(categories).all();
  return c.json({ categories: allCategories });
});

// GET /api/products/:slug — Pure D1 query, returns 404 if product not found
productsRouter.get('/:slug', async (c) => {
  if (!c.env?.DB) {
    return c.json({ error: 'Database not connected' }, 500);
  }

  const db = createDb(c.env.DB);
  const slug = c.req.param('slug');

  const product = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .get();

  if (!product) {
    return c.json({ error: 'Product not found' }, 404);
  }

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
});
