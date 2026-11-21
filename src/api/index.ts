import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { productsRouter } from './products';
import { checkoutRouter } from './checkout';
import { adminRouter } from './admin';

export type Bindings = {
  DB: D1Database;
  IMAGES_BUCKET?: R2Bucket;
  ENVIRONMENT?: string;
  APP_NAME?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Global Middlewares
app.use('*', logger());
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health Check
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    app: c.env.APP_NAME || 'Edge Commerce',
    timestamp: new Date().toISOString(),
    runtime: 'Cloudflare Workers (Edge)',
  });
});

// Domain Sub-Routers
app.route('/api/products', productsRouter);
app.route('/api/checkout', checkoutRouter);
app.route('/api/admin', adminRouter);

export default app;
