# Deploying Backend to Render - Step by Step Guide

This guide will walk you through deploying your Express backend server to Render.

## Prerequisites

- A Render account (sign up at https://render.com)
- Your GitHub repository connected to Render
- A PostgreSQL database (you can use Render's managed PostgreSQL or your existing Neon database)

## Step 1: Create a Render Account

1. Go to https://render.com
2. Sign up for a free account (or log in if you already have one)
3. Connect your GitHub account when prompted

## Step 2: Create a PostgreSQL Database (if needed)

If you don't already have a PostgreSQL database:

1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `ondo-soft-db` (or any name you prefer)
   - **Database**: `ondosoft` (or any name)
   - **User**: `ondosoft` (or any name)
   - **Region**: Choose closest to your users
   - **Plan**: Start with **Free** (can upgrade later)
3. Click **"Create Database"**
4. Wait for the database to be created
5. Copy the **Internal Database URL** (you'll need this later)

**Note**: If you're using Neon or another external database, skip this step and use your existing `DATABASE_URL`.

## Step 3: Deploy the Backend Service

### Option A: Deploy from GitHub (Recommended)

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository:
   - Select **"Public Git repository"** or connect your GitHub account
   - Choose the repository: `Ondowebsite` (or your repo name)
   - Click **"Connect"**
3. Configure the service:
   - **Name**: `ondo-soft-backend` (or any name)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your main branch)
   - **Root Directory**: Leave empty (or set to root)
   - **Build Command**: `npm install`
   - **Start Command**: `npm run server`
   - **Plan**: Start with **Free** (can upgrade later)

4. **Environment Variables** - Click **"Advanced"** → **"Add Environment Variable"** and add:

   ```
   NODE_ENV = production
   PORT = 10000
   DATABASE_URL = <your-postgresql-connection-string>
   JWT_SECRET = <generate-a-secure-random-string>
   FRONTEND_URL = https://www.ondosoft.com
   ```

   **How to get values:**
   - `DATABASE_URL`: 
     - **Easiest**: In Render Dashboard → Your PostgreSQL database → **"Info"** tab → Copy **"Internal Database URL"**
     - **Manual**: Format: `postgresql://username:password@hostname:port/database`
     - See [RENDER_DATABASE_SETUP.md](./RENDER_DATABASE_SETUP.md) for detailed instructions
   - `JWT_SECRET`: Generate a secure random string (you can use: `openssl rand -base64 32` or an online generator)
   - `FRONTEND_URL`: Your frontend domain (e.g., `https://www.ondosoft.com`)

5. Click **"Create Web Service"**
6. Render will start building and deploying your service
7. Wait for the deployment to complete (usually 2-5 minutes)

### Option B: Deploy using render.yaml (Alternative)

If you prefer using the `render.yaml` file:

1. Make sure `render.yaml` is committed to your repository
2. In Render Dashboard, click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will detect the `render.yaml` file and use it for configuration
5. You'll still need to set the environment variables in the Render dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`

## Step 4: Get Your Backend URL

1. Once deployment is complete, Render will provide a URL like:
   - `https://ondo-soft-backend.onrender.com` (or your custom name)
2. **Copy this URL** - you'll need it for the next step

## Step 5: Update Frontend Configuration

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Add a new secret:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
   - (Replace with your actual Render backend URL + `/api`)

3. **Trigger a new deployment**:
   - Either push a new commit to `main` branch
   - Or manually trigger the GitHub Actions workflow

## Step 6: Verify Deployment

1. Test your backend health endpoint:
   ```
   curl https://your-backend-url.onrender.com/api/health
   ```
   Should return: `{"status":"ok"}`

2. Test signin endpoint (should return authentication error, not 405):
   ```
   curl -X POST https://your-backend-url.onrender.com/api/auth/signin \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.com","password":"test"}'
   ```
   Should return: `{"error":"Invalid credentials"}` (not 405)

3. Test your frontend:
   - Go to https://www.ondosoft.com
   - Try to sign in
   - Should no longer see 405 errors

## Step 7: Set Up Custom Domain (Optional)

If you want to use a custom domain for your backend:

1. In Render Dashboard → Your Web Service → **Settings** → **Custom Domain**
2. Add your domain (e.g., `api.ondosoft.com`)
3. Follow Render's DNS configuration instructions
4. Update `VITE_API_URL` in GitHub secrets to use the custom domain

## Troubleshooting

### Service won't start
- Check **Logs** tab in Render dashboard
- Verify all environment variables are set correctly
- Ensure `DATABASE_URL` is correct and database is accessible

### Database connection errors
- Verify `DATABASE_URL` is correct
- Check if database is running (Render PostgreSQL should be running)
- Ensure database allows connections from Render's IPs

### 405 errors still happening
- Verify `VITE_API_URL` is set correctly in GitHub secrets
- Check that the frontend was rebuilt after setting `VITE_API_URL`
- Clear browser cache and try again

### CORS errors
- Verify `FRONTEND_URL` environment variable is set correctly
- Check CORS configuration in `server/index.js`

## Render Free Tier Limitations

- Services spin down after 15 minutes of inactivity (first request after spin-down takes ~30 seconds)
- 750 hours/month free (enough for always-on if you have one service)
- Database has 1GB storage limit on free tier

## Upgrading (Optional)

If you need:
- **Always-on service** (no spin-down): Upgrade to **Starter** plan ($7/month)
- **More database storage**: Upgrade database plan
- **Better performance**: Upgrade to higher plans

## Next Steps

After successful deployment:
1. Test all API endpoints
2. Monitor logs in Render dashboard
3. Set up alerts for errors
4. Consider setting up a staging environment

