import { Hono } from 'hono';
import { eq, desc, and, like } from 'drizzle-orm';
import { createDb } from '../db';
import { products, categories, productVariants, productImages } from '../db/schema';
import type { Bindings } from './index';

export const productsRouter = new Hono<{ Bindings: Bindings }>();

// GET /api/products — List all products with optional filters
productsRouter.get('/', async (c) => {
  const db = createDb(c.env.DB);
  const categorySlug = c.req.query('category');
  const search = c.req.query('search');
  const featuredOnly = c.req.query('featured') === 'true';

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

  // Fetch active products
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

// GET /api/products/categories — List all product categories
productsRouter.get('/categories', async (c) => {
  const db = createDb(c.env.DB);
  const allCategories = await db.select().from(categories).all();
  return c.json({ categories: allCategories });
});

// GET /api/products/:slug — Single product with variants & images
productsRouter.get('/:slug', async (c) => {
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

  // Fetch variants and additional images
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
