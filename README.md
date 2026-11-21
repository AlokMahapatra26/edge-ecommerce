# Edge Commerce — 100% Cloudflare Native Turnkey E-Commerce

A production-ready, ultra-fast, serverless e-commerce template running completely on Cloudflare Edge.  
**Zero external server fees. $0/month hosting baseline on Cloudflare's generous free tier.**

---

## ⚡ Tech Stack Architecture

* **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons (Compiled to `dist/client`)
* **Edge Backend API:** Hono.js on Cloudflare Workers
* **Primary SQL Database:** Cloudflare D1 (SQLite at the edge) with Drizzle ORM
* **Object / Image Storage:** Cloudflare R2 (Zero egress / bandwidth transfer fees)
* **Hosting & CDN:** Cloudflare Workers with Static Assets
* **Payments:** Stripe Checkout API + Webhook signature verification

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Database Migrations
```bash
npm run db:generate
```

### 3. Start Local Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛒 Features Out-of-the-Box

### 1. Curated Storefront
* Hero banner with smooth navigation and speed badges
* Real-time search by keywords
* Category filtering (Footwear, Apparel, Accessories, Audio & Tech)
* Product cards with Sale badges, hover effects, and 1-click Quick Add
* Full product preview modal with variant selectors

### 2. Slide-Out Cart Drawer
* Interactive quantity adjustments (+ / -)
* Real-time subtotal and free shipping threshold calculation
* One-click checkout flow with Stripe

### 3. Admin Backoffice (`/admin`)
* Click **"Admin"** in the top navigation bar.
* Secure authentication:
  * Default Email: `admin@edgecommerce.com`
  * Default Password: `admin` (Configure via `ADMIN_PASSWORD` in `.env` / `wrangler.jsonc`)
* Features:
  * View real-time gross sales, total orders, and active products
  * Click **"Seed Catalog to D1"** to populate the Cloudflare D1 database with sample products in 1 click
  * View and manage real-time customer orders saved in D1 SQLite
  * Secure session with HttpOnly cookies & Web Crypto tokens

---

## 🌐 Deploy to Cloudflare in 1 Click

1. Authenticate with Cloudflare:
```bash
npx wrangler login
```

2. Create your remote D1 database:
```bash
npx wrangler d1 create ecom_db
```
*(Copy the generated `database_id` into `wrangler.jsonc`)*

3. Apply migrations to remote D1:
```bash
npx wrangler d1 migrations apply ecom_db --remote
```

4. Deploy the full-stack store:
```bash
npm run deploy
```

---

## 📄 License
MIT License. Free to use, customize, and commercialize.
