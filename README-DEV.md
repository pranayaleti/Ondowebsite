# Development Setup Guide

## Quick Start

### Option 1: Start Both Servers Automatically (Recommended)
```bash
npm run dev:all
```

This will:
1. Start the backend server on port 5001
2. Wait for it to be ready
3. Start the frontend Vite dev server on port 3000

### Option 2: Start Servers Manually

**Terminal 1 - Backend:**
```bash
cd backend
node index.js
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Troubleshooting API Connection Errors

If you see `ECONNREFUSED` errors in Vite:

1. **Check if backend is running:**
   ```bash
   curl http://localhost:5001/api/health
   ```
   Should return: `{"status":"ok"}`

2. **Restart Vite dev server:**
   - Stop the Vite server (Ctrl+C)
   - Restart with `npm run dev`

3. **Verify backend is on correct port:**
   - Backend should be on port 5001
   - Check backend logs for: `Server running on port 5001`

4. **Clear browser cache:**
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Or disable cache in DevTools Network tab

## Port Configuration

- **Frontend (Vite):** Port 3000
- **Backend (Express):** Port 5001
- **Vite Proxy:** Forwards `/api/*` requests to `http://localhost:5001`

## Environment Variables

Create a `.env` file in the `backend` directory with:
```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5001
```

## Common Issues

### "Backend server is not available"
- Make sure backend is running: `cd backend && node index.js`
- Check if port 5001 is in use: `lsof -ti:5001`

### "API endpoint not found" (404)
- Restart the backend server to pick up new routes
- Check backend logs for errors

### Proxy errors in Vite
- Restart Vite dev server after starting backend
- Check that backend is accessible: `curl http://localhost:5001/api/health`

