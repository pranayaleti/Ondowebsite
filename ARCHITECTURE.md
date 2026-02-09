# Ondowebsite — Architecture Design

OndoSoft is a business website and client portal: marketing site, blog, pricing, testimonials, contact, plus authenticated client dashboard and admin panel. The backend API persists data in Supabase (PostgreSQL).

---

## 1. High-Level Overview

| Layer      | Technology              | Location / Port      |
|-----------|--------------------------|-----------------------|
| Frontend  | React 18, Vite 7, Tailwind, PWA, analytics | `src/`, port 3000   |
| Backend   | Express, JWT, pg        | `backend/`, port 5001 |
| Database  | Supabase (PostgreSQL)   | `DATABASE_URL`        |
| AI / Chat | Session-based AI chat, conversation persistence | `UnifiedChatWidget`, `/api/ai-chat/*` |
| Deploy    | GitHub Pages (frontend), Render (backend) | `.github/workflows/`, `backend/render.yaml` |

- **Dev:** Frontend on 3000; Vite proxies `/api` → `http://localhost:5001`.
- **Prod:** Frontend uses relative `/api` or `VITE_API_URL`; backend deployed separately (e.g. Render).

---

## 2. Repo Layout

```
/
├── index.html, vite.config.js, tailwind.config.js, postcss.config.js
├── src/                    # React app
│   ├── main.jsx, App.jsx, index.css
│   ├── components/         # Shared UI (Navbar, Footer, SEOHead, etc.)
│   ├── pages/              # Route components (public, auth, portal, admin)
│   ├── contexts/           # AuthContext
│   ├── constants/          # companyInfo.js, data, faqData, pricing
│   ├── utils/              # apiConfig, auth, analytics, security, etc.
│   ├── data/               # blogData
│   └── styles/
├── public/                 # Static: robots.txt, sitemap.xml, manifest.json, sw.js, logo
├── backend/                # Express API
│   ├── index.js            # Server, routes, createTables, auth
│   ├── constants/          # companyContext.js (AI system prompt)
│   ├── services/           # aiService.js (OpenAI/Anthropic)
│   ├── supabaseClient.js   # Optional Supabase JS client
│   ├── seed.js
│   ├── .env.example, render.yaml
│   └── package.json
├── .github/workflows/deploy-pages.yml
└── ARCHITECTURE.md         # This file
```

---

## 3. Frontend Architecture

### 3.1 Entry and Shell

- **Entry:** `index.html` → `src/main.jsx` → `App.jsx`.
- **App shell:** `HelmetProvider` → `AuthProvider` → `Router` (basename from `import.meta.env.BASE_URL`). Inside: `ErrorBoundary`, `PerformanceMonitor`, `ScriptOptimizer`, `SchemaMarkup`, `Navbar`, `NavigationLoader`, `ScrollToTop`, `Suspense` (fallback `PageLoader`) wrapping `Routes`, then `UnifiedChatWidget`.

### 3.2 Routing (App.jsx)

All page components are lazy-loaded. Route groups:

| Group    | Paths | Layout / Guard |
|----------|-------|-----------------|
| Public   | `/`, `/services`, `/pricing`, `/testimonials`, `/portfolio`, `/blogs`, `/blogs/:slug`, `/contact`, `/about`, `/faq`, `/legal`, `/privacy-policy`, `/terms-of-use`, `/nda`, `/licensing`, `/accessibility`, `/capabilities-deck`, `/sitemap`, `/sitemap.xml`, `/robots.txt` | None |
| Auth     | `/auth/signup`, `/auth/signin`, `/auth/forgot-password`, `/reset-password` | None |
| Dashboard| `/dashboard` (+ index, subscriptions, campaigns, assets, invoices, tickets, notifications) | `ProtectedRoute` → `PortalLayout` |
| Admin    | `/admin` (+ index, analytics, clients, campaigns, assets, tickets, invoices, notifications, consultation-leads, ai-conversations, email-templates) | `ProtectedRoute` with `requireAdmin` → `AdminLayout` |
| Catch-all| `*` | `NotFoundPage` |

### 3.3 Build and Chunks (vite.config.js)

- **manualChunks:** Admin → `admin`; Portal → `portal`; Sign-in/up/forgot/reset → `auth`; React and React-dependent libs (react-dom, react-router-dom, react-helmet-async, lucide-react, etc.) → `vendor-react`; other `node_modules` → `vendor-other`.
- **Rationale:** Keeps a single React runtime (vendor-react) to avoid duplicate context; admin/portal/auth load only when their routes are hit.

### 3.4 Key Frontend Modules

| Path | Role |
|------|------|
| `src/constants/companyInfo.js` | Company name, contact, address, hours, URLs; schema helpers for SEO and structured data. |
| `src/contexts/AuthContext.jsx` | Auth state; consumed by `ProtectedRoute` and auth pages. |
| `src/utils/auth.js` | Sign-in, sign-up, sign-out, session checks; calls backend with cookies/credentials. |
| `src/utils/apiConfig.js` | `getAPIUrl()`, `API_URL`, `API_BASE` for backend base URL. |
| `src/components/SEOHead.jsx` | Per-page meta tags and canonical URLs. |
| `src/components/SchemaMarkup.jsx` | Global structured data (e.g. organization). |
| `src/components/HiddenSEOSection.jsx` | Hidden content for SEO (e.g. service areas, locations). |
| `src/components/ProtectedRoute.jsx` | Renders children if authenticated; supports `requireAdmin`; else redirects. |

---

## 4. Backend Architecture

### 4.1 Server and Middleware

- **Runtime:** Node ≥20, ESM.
- **Stack:** Express, `dotenv`, `pg` (Pool), `bcryptjs`, `jsonwebtoken`, `cookie-parser`.
- **Port:** `process.env.PORT` or 5001.
- **Database:** Single `pg.Pool` from `DATABASE_URL` (Supabase). Tables created in `createTables()` if not exist; order: `users` → `password_reset_tokens` → … → `email_templates` → `campaigns` → … (respects foreign keys).

### 4.2 Auth

- **JWT:** Issued on sign-in; stored in HTTP-only cookie and/or returned in body. Validated with `authenticateToken` on protected routes.
- **Admin:** Routes that need admin use `requireAdmin` (checks user role after `authenticateToken`).

### 4.3 API Surface (base path `/api`)

| Area | Examples |
|------|----------|
| Health | `GET /api/health` |
| Auth | `POST /api/auth/signup`, `POST /api/auth/signin`, `POST /api/auth/signout`, `GET /api/auth/session` |
| Dashboard (authenticated) | `/api/dashboard/dashboard`, `/api/dashboard/subscriptions`, `/api/dashboard/campaigns`, `/api/dashboard/assets`, `/api/dashboard/invoices`, `/api/dashboard/invoices/:id/pdf`, `/api/dashboard/tickets`, `/api/dashboard/notifications` |
| Admin | `/api/admin/dashboard`, `/api/admin/users`, `/api/admin/consultation-leads`, `/api/admin/feedback`, `/api/admin/ai-conversations`, `/api/admin/email-templates`, `/api/admin/analytics`, `/api/admin/tickets`, `/api/admin/invoices`, `/api/admin/assets`, `/api/admin/notifications`, etc. |
| Shared (authenticated) | `GET/POST /api/email-templates` |
| Public | `POST /api/analytics/track`, `POST /api/consultation/submit`, `POST /api/pricing/interaction`, `POST /api/feedback`, `GET/POST /api/ai-chat/conversations`, etc. |

---

## 5. Database (Supabase / PostgreSQL)

- **Connection:** Backend uses `DATABASE_URL` with `pg` (Pool). Optional Supabase JS client in `backend/supabaseClient.js` for realtime/storage.
- **Tables (conceptual):** users, password_reset_tokens, subscriptions, campaigns, email_templates, assets, invoices, api_requests, analytics_events, analytics_clicks, analytics_navigation, analytics_page_views, analytics_scrolls, analytics_form_interactions, analytics_user_interactions, consultation_leads, feedback, ai_chat_conversations, tickets, notifications, etc. Exact DDL in `backend/index.js` → `createTables`.

---

## 6. Deployment

- **Frontend:** GitHub Actions (`.github/workflows/deploy-pages.yml`) on push to `main`: build with Vite (optional `VITE_API_URL` secret), output `dist`; deploy to GitHub Pages. `dist/index.html` copied to `dist/404.html` for SPA fallback.
- **Backend:** Deployed separately (e.g. Render via `backend/render.yaml`). Requires `DATABASE_URL`, `JWT_SECRET`; optional `FRONTEND_URL`. Frontend in production points to this API via `/api` or `VITE_API_URL`.

---

## 7. Environment

- **Frontend:** Optional `VITE_API_URL` (production API base). Dev uses Vite proxy to `http://localhost:5001`.
- **Backend:** In `backend/`: `DATABASE_URL` (required in prod), `JWT_SECRET` (required in prod), `PORT` (default 5001), `FRONTEND_URL`; optional `SUPABASE_URL`, `SUPABASE_KEY` / `SUPABASE_ANON_KEY`; optional AI: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `AI_MODEL_OPENAI`, `AI_MODEL_ANTHROPIC`, `COMPANY_*` for AI context. See `backend/.env.example`.

---

## 8. Conventions

- **Brand:** OndoSoft; content and schema use `src/constants/companyInfo.js`.
- **SEO:** `SEOHead`, `HiddenSEOSection`, `SchemaMarkup`; canonical and structured data from companyInfo.
- **Chunks:** All React-related libs in `vendor-react`; admin/portal/auth in separate chunks.
- **Backend:** No hardcoded secrets; production requires `DATABASE_URL` and `JWT_SECRET`.

---

## 9. AI & Advanced Tech Stack

### 9.1 AI / Chat

| Area | Technology / Location |
|------|------------------------|
| **Widget** | `UnifiedChatWidget` – floating chat + consultation; `AIChatPrompt` (start chat / schedule meeting); `AIChatModal` (conversation UI). Lazy-loaded. |
| **UX** | Auto-prompt after 120s (unless dismissed); localStorage for prompt dismissed / interacted; option to open consultation form or Calendly. |
| **API** | `/api/ai-chat/conversations` (GET by session, POST create), `/api/ai-chat/conversations/:id/messages` (POST – returns `assistantReply` when AI is configured), `/api/ai-chat/conversations/:id/feedback` (POST), PATCH conversation, POST end. Session-based; UTM and context stored. |
| **Backend AI** | `backend/services/aiService.js` – optional OpenAI (OPENAI_API_KEY) or Anthropic (ANTHROPIC_API_KEY). When set, POST messages returns an assistant reply; otherwise frontend falls back to rule-based responses. `backend/constants/companyContext.js` – company context for AI system prompt (env overrides: COMPANY_NAME, COMPANY_WEBSITE, etc.). |
| **Data** | `ai_conversations` (session_id, page_url, referrer, user_agent, ip_address, timezone, language, viewport, utm_*, status, started_at, ended_at); `ai_messages` (conversation_id, role, content, message_index). |
| **Admin** | `AIConversationsPage` – list/view AI conversations; backend `/api/admin/ai-conversations`. |

AI chat is session-persisted and admin-viewable. When `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` is set, the backend uses that provider for real LLM replies; otherwise the frontend uses rule-based responses and the backend only stores messages.

### 9.2 Advanced Frontend

| Area | Technology / Location |
|------|------------------------|
| **Build** | Vite 7, ESM, manual chunks (admin, portal, auth, vendor-react, vendor-other), tree-shaking, esbuild minify, CSS code-split, asset hashing. |
| **Performance** | `PerformanceMonitor`, `ScriptOptimizer`; `initPerformanceOptimizations()` (preload, lazy scripts); requestIdleCallback for analytics init and route prefetch; `OptimizedImage` for images. |
| **Analytics** | `src/utils/analytics.js` – session ID, page views, clicks, navigation, scroll depth, form interactions, visibility, error tracking; batch flush to `POST /api/analytics/track`; pagehide + flush. |
| **Caching** | `src/utils/apiCache.js` – in-memory cache with TTL (short/default/long/static), request deduplication for identical in-flight requests. |
| **Security** | `src/utils/security.js` – CSP config, input sanitization, form validation, rate limiting, CSRF token generation; used by Contact and auth flows. |
| **PWA** | `public/sw.js` – service worker; cache strategies, notification click (openWindow); `manifest.json` in `public/`. |
| **SEO** | `react-helmet-async`, `SEOHead` per page, `SchemaMarkup` (JSON-LD), `HiddenSEOSection`, `ServiceSchema`; companyInfo for canonical and structured data. |

### 9.3 Advanced Backend

| Area | Technology / Location |
|------|------------------------|
| **Runtime** | Node ≥20, ESM; Express, dotenv, pg Pool (connection pool, timeouts, error handlers). |
| **Auth** | JWT (cookie + optional header), bcrypt for passwords, `authenticateToken`, `requireAdmin`; password reset tokens with expiry. |
| **Database** | Supabase (PostgreSQL); `createTables()` creates all tables in dependency order; optional `backend/supabaseClient.js` for Realtime/Storage. |
| **Analytics** | Tables: analytics_events, analytics_clicks, analytics_navigation, analytics_page_views, analytics_scrolls, analytics_form_interactions, analytics_user_interactions; bulk insert support for batch tracking. |
| **AI Chat** | Persist conversations and messages; session-scoped; admin endpoints to list/export. Optional LLM: `backend/services/aiService.js` (OpenAI or Anthropic via env); `backend/constants/companyContext.js` for system prompt. |
| **Deploy** | Render (`backend/render.yaml`); env: DATABASE_URL, JWT_SECRET, FRONTEND_URL, PORT. |
