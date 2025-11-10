# Render PostgreSQL Database Connection String

## Your Database Details

Based on the information you provided:

- **Hostname**: `dpg-d48eunili9vc73999kg0-a`
- **Port**: `5432`
- **Database**: `ondo_soft_db`
- **Username**: `ondo_soft_db_user`
- **Password**: (You need to get this from Render)

## How to Get Your Password

1. Go to your Render Dashboard
2. Click on your PostgreSQL database (e.g., `ondo-soft-db`)
3. Go to the **"Info"** or **"Connections"** tab
4. Look for **"Internal Database URL"** or **"Connection String"**
5. Copy the full connection string, OR
6. Find the password field (it might be hidden - click "Show" or "Reveal")

## Constructing the DATABASE_URL

Once you have the password, your `DATABASE_URL` should look like:

```
postgresql://ondo_soft_db_user:YOUR_PASSWORD@dpg-d48eunili9vc73999kg0-a:5432/ondo_soft_db
```

**Important**: Replace `YOUR_PASSWORD` with the actual password from Render.

## Alternative: Use Internal Database URL

Render provides an **Internal Database URL** that you can use directly. This is the easiest option:

1. In Render Dashboard → Your PostgreSQL database → **"Info"** tab
2. Copy the **"Internal Database URL"**
3. It will look like:
   ```
   postgres://ondo_soft_db_user:PASSWORD@dpg-d48eunili9vc73999kg0-a:5432/ondo_soft_db
   ```
4. Use this entire string as your `DATABASE_URL` environment variable

## Setting DATABASE_URL in Your Backend Service

### Option 1: Using Render Dashboard

1. Go to your Web Service in Render Dashboard
2. Click on **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://ondo_soft_db_user:YOUR_PASSWORD@dpg-d48eunili9vc73999kg0-a:5432/ondo_soft_db`
   - (Replace `YOUR_PASSWORD` with actual password)
5. Click **"Save Changes"**
6. Your service will automatically redeploy

### Option 2: Using Internal Database URL (Recommended)

1. In Render Dashboard → Your PostgreSQL database → **"Info"** tab
2. Copy the **"Internal Database URL"**
3. Go to your Web Service → **"Environment"** tab
4. Add environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: (Paste the Internal Database URL you copied)
5. Click **"Save Changes"**

## Complete Environment Variables Setup

Make sure you have all these environment variables set in your Web Service:

```
NODE_ENV = production
PORT = 10000
DATABASE_URL = postgresql://ondo_soft_db_user:YOUR_PASSWORD@dpg-d48eunili9vc73999kg0-a:5432/ondo_soft_db
JWT_SECRET = <generate-a-secure-random-string>
FRONTEND_URL = https://www.ondosoft.com
```

## Testing the Connection

After setting up the environment variables, check your service logs:

1. Go to your Web Service in Render Dashboard
2. Click on **"Logs"** tab
3. Look for: `Database connected successfully`
4. If you see connection errors, verify:
   - The password is correct
   - The hostname, port, database name, and username are correct
   - The database is running (status should be "Available")

## Troubleshooting

### Connection Refused
- Verify the hostname is correct
- Check that the port is 5432
- Ensure the database is running

### Authentication Failed
- Double-check the username and password
- Make sure you're using the Internal Database URL if available
- Verify the password hasn't changed

### Database Not Found
- Verify the database name is `ondo_soft_db` (case-sensitive)
- Check that the database exists and is accessible

