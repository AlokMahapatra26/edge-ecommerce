import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Categories Table
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
});

// Products Table
export const products = sqliteTable('products', {
  id: text('id').primaryKey(), // crypto.randomUUID()
  categoryId: integer('category_id').references(() => categories.id),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  basePrice: integer('base_price').notNull(), // in cents (e.g. 9900 = $99.00)
  compareAtPrice: integer('compare_at_price'), // optional original price for discounts
  primaryImage: text('primary_image').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

// Product Images Table
export const productImages = sqliteTable('product_images', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  displayOrder: integer('display_order').notNull().default(0),
});

// Product Variants Table (Sizes, Colors, SKUs, Stock)
export const productVariants = sqliteTable('product_variants', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  sku: text('sku').notNull().unique(),
  title: text('title').notNull(), // e.g. "Space Black / XL"
  priceOverride: integer('price_override'), // optional price override in cents
  inventoryQuantity: integer('inventory_quantity').notNull().default(10),
});

// Orders Table
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name').notNull(),
  shippingAddress: text('shipping_address_json').notNull(), // JSON stringified address
  subtotal: integer('subtotal').notNull(),
  discountAmount: integer('discount_amount').notNull().default(0),
  shippingFee: integer('shipping_fee').notNull().default(0),
  totalAmount: integer('total_amount').notNull(),
  paymentStatus: text('payment_status').notNull().default('unpaid'), // 'unpaid' | 'paid' | 'refunded'
  fulfillmentStatus: text('fulfillment_status').notNull().default('pending'), // 'pending' | 'processing' | 'shipped' | 'delivered'
  stripeSessionId: text('stripe_session_id'),
  trackingNumber: text('tracking_number'),
  createdAt: text('created_at').notNull().$defaultFn(() => new Date().toISOString()),
});

// Order Items Table
export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').notNull(),
  variantId: text('variant_id'),
  title: text('title').notNull(),
  variantTitle: text('variant_title'),
  unitPrice: integer('unit_price').notNull(),
  quantity: integer('quantity').notNull(),
  image: text('image'),
});

// Promo Codes / Coupons Table
export const coupons = sqliteTable('coupons', {
  code: text('code').primaryKey(),
  discountType: text('discount_type').notNull(), // 'percent' | 'fixed'
  value: integer('value').notNull(), // percent (e.g. 20) or cents (e.g. 1500 = $15)
  minOrderValue: integer('min_order_value').default(0),
  maxUses: integer('max_uses').default(100),
  usedCount: integer('used_count').default(0),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  expiresAt: text('expires_at'),
});
