# OndoSoft Backend API

Backend API server for OndoSoft application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - `DATABASE_URL`: Supabase PostgreSQL connection string (see `SUPABASE_SETUP.md`)
   - `JWT_SECRET`: Secret key for JWT token signing
   - `PORT`: Server port (default: 5001)
   - `NODE_ENV`: Environment (development/production)

   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   PORT=5001
   ```

3. Run the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## Database Setup

This application uses **Supabase** for PostgreSQL database hosting.

See `SUPABASE_SETUP.md` for detailed instructions on:
- Creating a Supabase project
- Getting your connection string
- Setting up environment variables
- Troubleshooting connection issues

## Database Seeding

To seed the database with default admin and client users:
```bash
npm run seed
```

This will create:
- **Admin user**: `admin@ondosoft.com` / `admin123` (or use `ADMIN_EMAIL` and `ADMIN_PASSWORD` env vars)
- **Client user**: `client@ondosoft.com` / `client123` (or use `CLIENT_EMAIL` and `CLIENT_PASSWORD` env vars)

## API Endpoints

The API is available at `/api` prefix. See the server code for available endpoints.

## Deployment

**Important:** Your Express.js backend should be deployed to a Node.js hosting platform (Railway, Render, Vercel, etc.), NOT to Supabase Edge Functions.

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions including:
- Recommended platforms (Railway, Render, Vercel, Fly.io)
- Step-by-step deployment guides
- Environment variable setup
- Troubleshooting tips

**Quick Summary:**
1. Use **Supabase** for the database only (see `SUPABASE_SETUP.md`)
2. Deploy your **Express app** to Railway, Render, or another Node.js platform (see `DEPLOYMENT_GUIDE.md`)
3. Set `DATABASE_URL` to your Supabase connection string
4. Set other required environment variables

## Edge Functions (Optional)

If you want to create Supabase Edge Functions (Deno-based serverless functions) in addition to your Express app, see `EDGE_FUNCTIONS_GUIDE.md` for:
- Database connection from Edge Functions
- Environment variable setup (`SUPABASE_DB_URL`)
- Example Deno code
- Best practices

**Note:** Edge Functions are separate from your Express.js backend and use Deno runtime.

