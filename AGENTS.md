# AGENTS.md — Repository Instructions for AI Agents

> **Role & Persona:** You are an expert Principal Full-Stack Engineer and Cloudflare Specialist.  
> When working in this codebase, write modular, production-ready, highly maintainable TypeScript.

---

## 1. Project Overview & Architecture
This is a **100% Cloudflare Native Turnkey E-Commerce Engine**.
Both frontend and backend are hosted on Cloudflare with **zero external server dependencies** ($0/mo hosting baseline).

* **Runtime:** Cloudflare Workers with Static Assets
* **Backend Framework:** Hono.js (`hono`)
* **Database:** Cloudflare D1 (SQLite) with Drizzle ORM (`drizzle-orm`, `drizzle-kit`)
* **Object Storage:** Cloudflare R2 (`env.IMAGES_BUCKET`) for product images
* **Async Processing:** Cloudflare Queues (`env.ORDER_QUEUE`) for reliable webhook & email handling
* **Frontend:** React + Vite + Tailwind CSS + Lucide Icons + Radix UI primitives
* **Payments:** Stripe Checkout API + Webhook signature verification

---

## 2. Directory Layout & Conventions
```text
cloudflare-ecom/
├── src/
│   ├── api/             # Hono backend API routes (modular by domain)
│   │   ├── index.ts     # Main Hono app mounting sub-routers
│   │   ├── products.ts  # Catalog queries, filters, categories
│   │   ├── checkout.ts  # Stripe checkout session generator
│   │   ├── webhooks.ts  # Stripe signature verification & queue dispatch
│   │   └── admin.ts     # Admin endpoints (product CRUD, orders, R2 upload)
│   ├── db/              # Database schema & migrations
│   │   ├── schema.ts    # Drizzle ORM schema definitions (Single Source of Truth)
│   │   ├── index.ts     # D1 connection helper
│   │   └── seed.ts      # Sample catalog seeder
│   ├── components/      # UI components (Atomic & modular)
│   │   ├── ui/          # Radix / shadcn style primitives (Button, Modal, Drawer, Input)
│   │   ├── Navbar.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── CartDrawer.tsx
│   │   └── Admin/
│   ├── lib/             # Helper utilities (Stripe SDK, R2 upload helpers, formatters)
│   ├── types/           # Shared TypeScript interfaces
│   ├── App.tsx          # Root React router / layout
│   └── main.tsx         # Frontend React entry point
├── public/              # Static assets (favicons, icons)
├── wrangler.jsonc       # Single Cloudflare configuration (D1, R2, Queues, Static Assets)
├── vite.config.ts       # Vite bundler configuration
├── tailwind.config.js   # Tailwind design tokens
├── tsconfig.json        # Strict TypeScript configuration
├── AGENTS.md            # THIS FILE (Agent knowledge base)
├── PROGRESS.md          # Live task tracker & progress checklist
└── ecom.txt             # Original architecture blueprint
```

---

## 3. Strict Engineering & Coding Rules

### Cloudflare Edge Rules (From `workers-best-practices`):
1. **Direct Bindings Only:** Never call Cloudflare REST APIs (`https://api.cloudflare.com/...`) for services available as bindings. Use `c.env.DB`, `c.env.IMAGES_BUCKET`, `c.env.ORDER_QUEUE`.
2. **Zero Memory Spikes / Streaming:** Never use `await response.text()` or buffer unbounded files. Cloudflare Workers have a 128MB RAM limit.
3. **No Hanging Promises:** Use `c.executionCtx.waitUntil(...)` for background work (emails, analytics, log processing) so responses return in <50ms without dropping tasks.
4. **Crypto Safety:** Never use `Math.random()` for IDs or security tokens. Use `crypto.randomUUID()` or `crypto.getRandomValues()`.
5. **No `any` Types:** Strict typing everywhere. Generate binding types with `wrangler types` and infer database types using Drizzle (`typeof products.$inferSelect`).

### E-Commerce Business Logic Rules:
1. **Never Trust Frontend Prices:** The cart sent by the client only sends `{ productId, variantId, quantity }`. The server MUST look up prices in D1 and calculate the total.
2. **Idempotent Webhooks:** Stripe webhooks can be delivered multiple times. Always check if an order is already marked `paid` before processing.
3. **Atomic Stock Decrements:** When an order is confirmed, decrement inventory inside a database transaction or atomic SQL query (`UPDATE product_variants SET inventory_quantity = inventory_quantity - ? WHERE id = ?`).

---

## 4. Key CLI Commands
* `npm run dev`: Starts local Vite + Wrangler development environment.
* `npm run build`: Builds frontend assets and compiles Worker bundle.
* `npm run db:generate`: Generates SQL migration files from `src/db/schema.ts`.
* `npm run db:migrate:local`: Applies migrations to local D1 database.
* `npm run db:seed`: Seeds local D1 database with realistic products.
* `npm run deploy`: Deploys entire full-stack app to Cloudflare edge.

---

## 5. Agent Workflow: How to Pick Up Work
1. Read `PROGRESS.md` to see what is currently in progress.
2. Check `src/db/schema.ts` for database structure before writing any database queries.
3. Implement clean, modular code following the rules above.
4. Update `PROGRESS.md` when a step is completed.
