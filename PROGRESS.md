# PROGRESS.md — Live Project Tracker

> **Current Phase:** First-Time UI Onboarding & Admin Security Completed  
> **Last Updated:** 2026-11-21  
> **Status:** Self-hosted Onboarding Wizard (Ghost/WordPress style) live in D1

---

## Current Architecture
* **First-Time Setup Wizard (UI-Driven):**
  - Status Check: `GET /api/admin/auth/status` (checks if any admin exists in `admin_users` table in D1)
  - If NO admin exists: Automatically displays **"Create Master Admin Account"** form (Full Name, Email, Password, Confirm Password).
  - Setup Endpoint: `POST /api/admin/auth/setup` (hashes password with 100,000 PBKDF2 iterations via Web Crypto, saves to D1, sets HttpOnly session cookie, and permanently locks setup).
  - If admin already exists: Setup is locked (`403 Forbidden`); regular Login Screen is shown.
* **Authentication Engine:**
  - Login Endpoint: `POST /api/admin/auth/login` (verifies D1 hash)
  - Logout Endpoint: `POST /api/admin/auth/logout` (destroys cookie)
  - Session Verify: `GET /api/admin/auth/me`
  - Hono Auth Middleware: Protects all operational `/api/admin/*` endpoints (`401 Unauthorized` if invalid)
* **Single Storefront:** Luxury minimalist e-commerce template (`EDGE COMMERCE`)
* **Visual Wireframes:** Clean unbranded placeholder components (`PlaceholderImage.tsx`)
* **Backend:** Hono.js on Cloudflare Workers
* **Database:** Cloudflare D1 with Drizzle ORM
* **Payments:** Stripe Checkout API
