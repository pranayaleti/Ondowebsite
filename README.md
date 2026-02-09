# OndoSoft – Business Website & Client Portal

A full-stack business website and client portal: marketing site, blog, pricing, testimonials, contact, plus authenticated **client dashboard** and **admin panel**. Frontend is a React SPA; backend is an Express API with JWT auth and Supabase (PostgreSQL).

## Features

- **Marketing site**: Hero, services, pricing, testimonials, portfolio, blog, FAQ, contact
- **Legal & info**: Privacy policy, terms of use, NDA, licensing, accessibility, capabilities deck
- **Auth**: Sign up, sign in, forgot password, reset password (JWT + cookies)
- **Client dashboard** (`/dashboard`): Subscriptions, campaigns, assets, invoices, tickets, notifications
- **Admin panel** (`/admin`): Dashboard, analytics, clients, campaigns, assets, tickets, invoices, notifications, consultation leads, AI conversations, email templates
- **SEO**: Per-page meta, canonical URLs, structured data (Schema.org), sitemap, robots.txt
- **Performance**: Lazy-loaded routes, code-split chunks (admin, portal, auth), service worker (production), critical CSS
- **AI chat & consultation**: Unified chat widget, consultation form, draft save

## Tech Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18, Vite 7, Tailwind CSS, React Router DOM, react-helmet-async, Lucide React |
| Backend  | Express, JWT, cookie-parser, bcryptjs, pg (PostgreSQL) |
| Database | Supabase (PostgreSQL) |
| Deploy   | GitHub Actions → GitHub Pages (frontend); backend separately (e.g. Render) |

**Node**: `>=20.19.0` (see `.nvmrc`).

## Project Structure

```
Ondowebsite/
├── src/
│   ├── main.jsx, App.jsx, index.css
│   ├── components/       # Navbar, Footer, SEOHead, SchemaMarkup, UnifiedChatWidget, etc.
│   ├── pages/            # Route components (lazy-loaded)
│   │   ├── portal/       # Client dashboard pages
│   │   └── admin/        # Admin panel pages
│   ├── contexts/         # AuthContext
│   ├── constants/        # companyInfo.js, faqData, pricing, etc.
│   ├── utils/           # apiConfig, auth, analytics, performance, etc.
│   ├── data/            # blogData
│   └── assets/
├── backend/
│   ├── index.js         # Express API, DB (pg), JWT auth
│   ├── supabaseClient.js
│   ├── seed.js
│   ├── .env.example
│   └── render.yaml
├── public/              # robots.txt, sitemap.xml, manifest.json, sw.js, logo.png
├── vite.config.js       # Proxy /api → backend:5001, manualChunks
├── llm.txt              # Project context for LLMs
└── .github/workflows/deploy-pages.yml
```

## Installation

1. **Clone and install frontend deps**
   ```bash
   git clone <repository-url>
   cd Ondowebsite
   npm install
   ```

2. **Backend setup**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env: set DATABASE_URL (Supabase), JWT_SECRET, PORT (default 5001), FRONTEND_URL
   npm install
   cd ..
   ```

3. **Run development**
   - **Frontend only** (API calls will fail without backend):
     ```bash
     npm run dev
     ```
     Opens at **http://localhost:3000**. `/api` is proxied to `http://localhost:5001`.
   - **Backend only** (e.g. already running frontend elsewhere):
     ```bash
     npm run dev:backend
     ```
   - **Both** (recommended):
     ```bash
     npm run dev:all
     ```
     Uses `start-dev.sh`: starts backend on 5001, then frontend on 3000.

## Scripts

| Command           | Description |
|-------------------|-------------|
| `npm run dev`     | Start Vite dev server (port 3000) |
| `npm run dev:backend` | Start backend only (port 5001) |
| `npm run dev:all` | Start backend + frontend via `start-dev.sh` |
| `npm run build`   | Production build → `dist/` |
| `npm run preview` | Serve `dist/` (port 4173) |
| `npm run lint`    | ESLint (js, jsx) |
| `npm run optimize:logo` | Run logo optimization script |

## Environment

- **Frontend**  
  - Dev: no env required; `/api` is proxied to `http://localhost:5001`.  
  - Prod: optional `VITE_API_URL` (API base, e.g. `https://your-backend.onrender.com`). If unset, relative `/api` is used.

- **Backend** (`.env` in `backend/`, see `backend/.env.example`):
  - `DATABASE_URL` – Supabase PostgreSQL connection string (required)
  - `JWT_SECRET` – Secret for JWT signing (required in production)
  - `PORT` – Default 5001
  - `FRONTEND_URL` – For CORS (e.g. `http://localhost:3000`)
  - Optional: `SUPABASE_URL`, `SUPABASE_KEY` / `SUPABASE_ANON_KEY` for Supabase JS client

## Deployment

- **Frontend**: GitHub Actions build (`npm run build`, `VITE_API_URL` from secrets), then deploy `dist/` to GitHub Pages. `dist/404.html` is copied from `index.html` for SPA routing.
- **Backend**: Deploy `backend/` to a Node host (e.g. Render via `backend/render.yaml`). Set `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` (and optionally `VITE_API_URL` to point to this backend).

## Customization

- **Branding & SEO**: Edit `src/constants/companyInfo.js` (name, contact, URLs, hours, schema helpers). Used by `SEOHead`, `SchemaMarkup`, and related components.
- **Styling**: Tailwind in components; theme in `tailwind.config.js`.
- **Routes**: Add lazy imports and `<Route>` entries in `src/App.jsx`; add page under `src/pages/` (or `portal/`, `admin/`).

## License

This project is private and proprietary to OndoSoft.

## Contributing

Internal contributions only. Follow existing patterns (see `llm.txt` for architecture and conventions).
