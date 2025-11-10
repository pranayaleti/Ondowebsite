# Production Deployment Guide

## Backend Deployment

The backend server (`server/index.js`) needs to be deployed separately from the frontend. The frontend is deployed to GitHub Pages (static hosting), which cannot run Node.js/Express servers.

### Option 1: Deploy Backend to a Separate Service (Recommended)

Deploy the backend to one of these services:
- **Render**: https://render.com - **[📖 Detailed Render Deployment Guide](./RENDER_DEPLOYMENT.md)**
- **Railway**: https://railway.app
- **Heroku**: https://heroku.com
- **Fly.io**: https://fly.io
- **DigitalOcean App Platform**: https://www.digitalocean.com/products/app-platform

#### Quick Steps:
1. Deploy `server/index.js` to your chosen service
2. Set environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: `production`
   - `PORT`: (usually auto-set by the service)
   - `FRONTEND_URL`: `https://www.ondosoft.com`

3. Get your backend URL (e.g., `https://api.ondosoft.com` or `https://ondosoft-backend.onrender.com`)

4. Set `VITE_API_URL` in GitHub Actions secrets:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add secret: `VITE_API_URL` = `https://your-backend-url.com/api`
   - This will be used during the build process

**For detailed Render deployment instructions, see [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)**

### Option 2: Configure Cloudflare to Proxy `/api/*` to Backend

If you want to use the same domain (`www.ondosoft.com`), configure Cloudflare:

1. Deploy backend to a service (see Option 1)
2. In Cloudflare Dashboard:
   - Go to Workers & Pages → Create a Worker
   - Or use Cloudflare Workers to proxy `/api/*` requests to your backend
   - Or configure Page Rules to proxy `/api/*` to your backend URL

### Option 3: Deploy Backend on Same Server

If you have a VPS/server:
1. Deploy the backend server on your server
2. Configure nginx/reverse proxy to:
   - Serve static files from GitHub Pages for frontend routes
   - Proxy `/api/*` requests to your Node.js backend (usually on port 5001)

## Frontend Deployment

The frontend is automatically deployed to GitHub Pages via GitHub Actions.

### Setting VITE_API_URL

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Add a new secret: `VITE_API_URL`
3. Set the value to your backend API URL (e.g., `https://api.ondosoft.com/api`)

The GitHub Actions workflow will use this during the build process.

## Verification

After deployment:
1. Check that backend is accessible: `curl https://your-backend-url.com/api/health`
2. Check that frontend can reach backend: Open browser console and verify API calls work
3. Test login functionality

## Troubleshooting

### 405 Method Not Allowed
- Backend server is not deployed or not accessible
- Cloudflare is blocking/proxying incorrectly
- Backend routes are not registered correctly

### CORS Errors
- Ensure `FRONTEND_URL` environment variable is set on backend
- Check CORS configuration in `server/index.js`

### Authentication Issues
- Verify `JWT_SECRET` is set on backend
- Check that cookies are being set correctly (check browser DevTools → Application → Cookies)

