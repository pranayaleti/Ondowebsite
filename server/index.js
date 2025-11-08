import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pkg from 'pg';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 5001; // Changed from 5000 to avoid AirPlay conflict on macOS
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Initialize PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_o0t1YrGAJByC@ep-restless-frost-adafv6il-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Create tables if they don't exist
const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'USER',
        phone VARCHAR(50),
        company_name VARCHAR(255),
        company_size VARCHAR(50),
        industry VARCHAR(100),
        address TEXT,
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        zip_code VARCHAR(20),
        website VARCHAR(255),
        signup_source VARCHAR(100),
        account_status VARCHAR(50) DEFAULT 'active',
        last_login TIMESTAMP,
        notes TEXT,
        tags TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        plan_name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2),
        price_display VARCHAR(50),
        status VARCHAR(50) DEFAULT 'active',
        billing_period VARCHAR(50) DEFAULT 'one-time',
        features TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS assets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        url TEXT,
        file_data BYTEA,
        file_size INTEGER,
        category VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        invoice_number VARCHAR(100) UNIQUE,
        amount DECIMAL(10, 2) NOT NULL,
        tax DECIMAL(10, 2) DEFAULT 0,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        due_date TIMESTAMP,
        description TEXT,
        items JSONB,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS api_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        endpoint VARCHAR(255) NOT NULL,
        method VARCHAR(10) NOT NULL,
        status_code INTEGER,
        response_size INTEGER,
        request_size INTEGER,
        duration_ms INTEGER,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tickets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        subject VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'support',
        priority VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(50) DEFAULT 'open',
        assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
        project_name VARCHAR(255),
        email_request VARCHAR(255),
        category VARCHAR(100),
        due_date TIMESTAMP,
        estimated_hours DECIMAL(10, 2),
        actual_hours DECIMAL(10, 2),
        budget DECIMAL(10, 2),
        tags TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ticket_messages (
        id SERIAL PRIMARY KEY,
        ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ticket_attachments (
        id SERIAL PRIMARY KEY,
        ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
        message_id INTEGER REFERENCES ticket_messages(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        file_type VARCHAR(100),
        file_size INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tables created/verified successfully');
    
    // Add new columns to existing users table if they don't exist
    await addUserColumns();
    
    // Add new columns to existing tickets table if they don't exist
    await addTicketColumns();
    
    // Add new columns to existing subscriptions table if they don't exist
    await addSubscriptionColumns();
    
    // Add new columns to existing assets table if they don't exist
    await addAssetColumns();
    
    // Add new columns to existing invoices table if they don't exist
    await addInvoiceColumns();
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

// Add new columns to users table if they don't exist
const addUserColumns = async () => {
  try {
    const columns = [
      'phone', 'company_name', 'company_size', 'industry', 'address', 
      'city', 'state', 'country', 'zip_code', 'website', 'signup_source',
      'referral_name', 'account_status', 'last_login', 'notes', 'tags'
    ];
    
    for (const column of columns) {
      let columnType = 'VARCHAR(255)';
      if (column === 'address' || column === 'notes') {
        columnType = 'TEXT';
      } else if (column === 'last_login') {
        columnType = 'TIMESTAMP';
      } else if (column === 'phone') {
        columnType = 'VARCHAR(50)';
      } else if (column === 'company_size') {
        columnType = 'VARCHAR(50)';
      } else if (column === 'industry') {
        columnType = 'VARCHAR(100)';
      } else if (column === 'zip_code') {
        columnType = 'VARCHAR(20)';
      } else if (column === 'signup_source') {
        columnType = 'VARCHAR(100)';
      } else if (column === 'referral_name') {
        columnType = 'VARCHAR(255)';
      } else if (column === 'account_status') {
        columnType = "VARCHAR(50) DEFAULT 'active'";
      } else if (column === 'tags') {
        columnType = 'TEXT';
      }
      
      // Check if column exists
      const checkColumn = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='users' AND column_name=$1
      `, [column]);
      
      if (checkColumn.rows.length === 0) {
        await pool.query(`ALTER TABLE users ADD COLUMN ${column} ${columnType}`);
        console.log(`Added column: ${column}`);
      }
    }
  } catch (error) {
    console.error('Error adding columns:', error);
  }
};

// Add new columns to tickets table if they don't exist
const addTicketColumns = async () => {
  try {
    const columns = [
      { name: 'project_name', type: 'VARCHAR(255)' },
      { name: 'email_request', type: 'VARCHAR(255)' },
      { name: 'category', type: 'VARCHAR(100)' },
      { name: 'due_date', type: 'TIMESTAMP' },
      { name: 'estimated_hours', type: 'DECIMAL(10, 2)' },
      { name: 'actual_hours', type: 'DECIMAL(10, 2)' },
      { name: 'budget', type: 'DECIMAL(10, 2)' },
      { name: 'tags', type: 'TEXT' }
    ];
    
    for (const column of columns) {
      // Check if column exists
      const checkColumn = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='tickets' AND column_name=$1
      `, [column.name]);
      
      if (checkColumn.rows.length === 0) {
        await pool.query(`ALTER TABLE tickets ADD COLUMN ${column.name} ${column.type}`);
        console.log(`Added column to tickets: ${column.name}`);
      }
    }
  } catch (error) {
    console.error('Error adding ticket columns:', error);
  }
};

// Add new columns to subscriptions table if they don't exist
const addSubscriptionColumns = async () => {
  try {
    const columns = [
      { name: 'price', type: 'DECIMAL(10, 2)' },
      { name: 'price_display', type: 'VARCHAR(50)' },
      { name: 'billing_period', type: 'VARCHAR(50)' },
      { name: 'features', type: 'TEXT' }
    ];
    
    for (const column of columns) {
      // Check if column exists
      const checkColumn = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='subscriptions' AND column_name=$1
      `, [column.name]);
      
      if (checkColumn.rows.length === 0) {
        await pool.query(`ALTER TABLE subscriptions ADD COLUMN ${column.name} ${column.type}`);
        console.log(`Added column to subscriptions: ${column.name}`);
      }
    }
  } catch (error) {
    console.error('Error adding subscription columns:', error);
  }
};

// Add new columns to assets table if they don't exist
const addAssetColumns = async () => {
  try {
    const columns = [
      { name: 'file_size', type: 'INTEGER' },
      { name: 'category', type: 'VARCHAR(100)' },
      { name: 'description', type: 'TEXT' },
      { name: 'file_data', type: 'BYTEA' }
    ];
    
    for (const column of columns) {
      // Check if column exists
      const checkColumn = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='assets' AND column_name=$1
      `, [column.name]);
      
      if (checkColumn.rows.length === 0) {
        await pool.query(`ALTER TABLE assets ADD COLUMN ${column.name} ${column.type}`);
        console.log(`Added column to assets: ${column.name}`);
      }
    }
  } catch (error) {
    console.error('Error adding asset columns:', error);
  }
};

// Add new columns to invoices table if they don't exist
const addInvoiceColumns = async () => {
  try {
    const columns = [
      { name: 'invoice_number', type: 'VARCHAR(100)' },
      { name: 'tax', type: 'DECIMAL(10, 2) DEFAULT 0' },
      { name: 'total_amount', type: 'DECIMAL(10, 2)' },
      { name: 'due_date', type: 'TIMESTAMP' },
      { name: 'description', type: 'TEXT' },
      { name: 'items', type: 'JSONB' },
      { name: 'notes', type: 'TEXT' },
      { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' }
    ];
    
    for (const column of columns) {
      // Check if column exists
      const checkColumn = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='invoices' AND column_name=$1
      `, [column.name]);
      
      if (checkColumn.rows.length === 0) {
        try {
          await pool.query(`ALTER TABLE invoices ADD COLUMN ${column.name} ${column.type}`);
          console.log(`Added column to invoices: ${column.name}`);
        } catch (alterError) {
          // If it's invoice_number, try adding UNIQUE constraint separately
          if (column.name === 'invoice_number') {
            try {
              await pool.query(`ALTER TABLE invoices ADD COLUMN ${column.name} ${column.type}`);
              await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS invoices_invoice_number_unique ON invoices(${column.name}) WHERE ${column.name} IS NOT NULL`);
              console.log(`Added column to invoices: ${column.name} with unique constraint`);
            } catch (uniqueError) {
              console.error(`Error adding unique constraint to ${column.name}:`, uniqueError);
            }
          } else {
            console.error(`Error adding column ${column.name}:`, alterError);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error adding invoice columns:', error);
  }
};

createTables();

// Middleware
// CORS configuration - must be before other middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

// Handle preflight OPTIONS requests FIRST - before any other middleware
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  
  if (origin && (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production')) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.header('Access-Control-Max-Age', '86400');
  }
  
  res.sendStatus(200);
});

// Enable CORS for all other routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // In development, allow all origins; in production, check allowed list
  const isAllowed = !origin || 
                   allowedOrigins.includes(origin) || 
                   process.env.NODE_ENV !== 'production';
  
  if (isAllowed && origin) {
    // When using credentials, must specify exact origin, not '*'
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');
  }
  
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Request tracking middleware (after auth middleware sets req.user)
const trackRequest = async (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;
  
  res.send = function(data) {
    const duration = Date.now() - startTime;
    const responseSize = Buffer.byteLength(JSON.stringify(data || ''));
    const requestSize = Buffer.byteLength(JSON.stringify(req.body || ''));
    
    // Track API requests asynchronously (don't block response)
    // Only track API routes
    if (req.path.startsWith('/api/')) {
      pool.query(
        `INSERT INTO api_requests (user_id, endpoint, method, status_code, response_size, request_size, duration_ms, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          req.user?.id || null,
          req.path,
          req.method,
          res.statusCode,
          responseSize,
          requestSize,
          duration,
          req.ip || req.connection.remoteAddress || 'unknown',
          req.get('user-agent') || 'unknown'
        ]
      ).catch(err => console.error('Request tracking error:', err));
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Auth middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Apply request tracking middleware to all routes (before route definitions)
app.use(trackRequest);

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Sign up
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { 
      email, 
      password, 
      name, 
      phone,
      company_name,
      company_size,
      industry,
      address,
      city,
      state,
      country,
      zip_code,
      website,
      signup_source,
      referral_name
    } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with additional fields
    const result = await pool.query(
      `INSERT INTO users (
        email, password, name, phone, company_name, company_size, industry,
        address, city, state, country, zip_code, website, signup_source, referral_name, role
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 'USER')
      RETURNING id, email, name, role, phone, company_name, company_size, industry,
        address, city, state, country, zip_code, website, signup_source, referral_name, created_at`,
      [
        email, hashedPassword, name, phone || null, company_name || null, 
        company_size || null, industry || null, address || null, city || null,
        state || null, country || null, zip_code || null, website || null,
        signup_source || 'direct', referral_name || null
      ]
    );

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign in
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Sign out
app.post('/api/auth/signout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Signed out successfully' });
});

// Get current session
app.get('/api/auth/session', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, name, role FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Portal routes

// Get dashboard data
app.get('/api/portal/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user info
    const userResult = await pool.query('SELECT id, email, name, role FROM users WHERE id = $1', [userId]);
    const user = userResult.rows[0];

    // Get subscription
    const subscriptionResult = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2',
      [userId, 'active']
    );
    const subscription = subscriptionResult.rows[0] || null;

    // Get campaign count
    const campaignCountResult = await pool.query('SELECT COUNT(*) as count FROM campaigns WHERE user_id = $1', [userId]);
    const campaignCount = parseInt(campaignCountResult.rows[0].count);

    // Get asset count
    const assetCountResult = await pool.query('SELECT COUNT(*) as count FROM assets WHERE user_id = $1', [userId]);
    const assetCount = parseInt(assetCountResult.rows[0].count);

    // Get recent campaigns
    const campaignsResult = await pool.query(
      `SELECT * FROM campaigns 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [userId]
    );
    const recentCampaigns = campaignsResult.rows;
    
    // Get recent assets
    const recentAssetsResult = await pool.query(
      `SELECT * FROM assets 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [userId]
    );
    const recentAssets = recentAssetsResult.rows;
    
    // Get recent invoices
    const recentInvoicesResult = await pool.query(
      `SELECT * FROM invoices 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [userId]
    );
    const recentInvoices = recentInvoicesResult.rows;
    
    // Get total revenue
    const totalRevenueResult = await pool.query(
      "SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE user_id = $1 AND status = 'paid'",
      [userId]
    );
    const totalRevenue = parseFloat(totalRevenueResult.rows[0].total || 0);
    
    // Get pending invoices count
    const pendingInvoicesResult = await pool.query(
      "SELECT COUNT(*) as count FROM invoices WHERE user_id = $1 AND status = 'pending'",
      [userId]
    );
    const pendingInvoices = parseInt(pendingInvoicesResult.rows[0].count);

    res.json({
      user,
      subscription,
      campaignCount,
      assetCount,
      recentCampaigns,
      recentAssets,
      recentInvoices,
      totalRevenue,
      pendingInvoices
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get subscriptions
app.get('/api/portal/subscriptions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    
    // Always return available plans from pricing
    const availablePlans = [
      {
        id: 'ui-ux-master-suite',
        plan_name: 'UI/UX Master Suite',
        price: 1200,
        price_display: '$1,200',
        status: 'available',
        billing_period: 'one-time',
        features: JSON.stringify([
          'Professional Website Design (5-8 Pages)',
          'Mobile-First Responsive Design',
          'Advanced UI/UX Design System',
          'Custom Brand Identity Integration',
          'SEO-Optimized Content Structure',
          'Interactive Contact Forms',
          'Social Media Integration',
          'Google Analytics & Search Console Setup',
          'Basic Security Implementation',
          '1 Month Post-Launch Support'
        ])
      },
      {
        id: 'full-stack-development',
        plan_name: 'Full Stack Development',
        price: 3000,
        price_display: '$3,000',
        status: 'available',
        billing_period: 'one-time',
        features: JSON.stringify([
          'Comprehensive Website (12-20 Pages)',
          'Custom Web Application Development',
          'User Authentication & Authorization',
          'Advanced SEO & Performance Optimization',
          'Admin Dashboard & Management Panel',
          'Database Design & Integration',
          'Content Management System (CMS)',
          'API Development & Integration',
          'Security & Data Protection',
          '6 Months Technical Support'
        ])
      },
      {
        id: 'complete-saas-ecosystem',
        plan_name: 'Complete SaaS Ecosystem',
        price: 8500,
        price_display: '$8,500',
        status: 'available',
        billing_period: 'one-time',
        features: JSON.stringify([
          'Enterprise-Grade SaaS Platform',
          'Multi-Tenant Architecture',
          'Payment Processing & Billing System',
          'User Management & Role-Based Access',
          'Cloud Infrastructure & Scalability',
          'RESTful API Development',
          'Advanced Security & Compliance',
          'Analytics & Business Intelligence',
          'Third-Party Integrations',
          '12 Months Comprehensive Support'
        ])
      },
      {
        id: 'upfront-subscription',
        plan_name: 'Upfront & Subscription',
        price: null,
        price_display: 'Custom',
        status: 'available',
        billing_period: 'custom',
        features: JSON.stringify([
          'Constant Contact Updates & Upgrades',
          'Subscription Model Implementation',
          'Continuous Maintenance & Support',
          'Regular Feature Enhancements & Upgrades',
          'Constant Security Updates & Patches',
          'Ongoing Performance Optimization',
          'Regular Content Updates & Upgrades',
          'Dedicated Account Manager',
          'Custom Integrations',
          'Flexible Billing Options'
        ])
      }
    ];
    
    res.json({ 
      subscriptions: result.rows,
      availablePlans: availablePlans 
    });
  } catch (error) {
    console.error('Subscriptions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update subscription
app.post('/api/portal/subscriptions', authenticateToken, async (req, res) => {
  try {
    const { plan_name, price, price_display, billing_period, features } = req.body;
    
    if (!plan_name) {
      return res.status(400).json({ error: 'Plan name is required' });
    }

    // Check if user already has an active subscription for this plan
    const existingResult = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 AND plan_name = $2 AND status = $3',
      [req.user.id, plan_name, 'active']
    );

    if (existingResult.rows.length > 0) {
      // Update existing subscription
      const updateResult = await pool.query(
        `UPDATE subscriptions 
         SET price = $1, price_display = $2, billing_period = $3, features = $4, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $5 AND plan_name = $6 AND status = $7
         RETURNING *`,
        [price, price_display, billing_period, features, req.user.id, plan_name, 'active']
      );
      return res.json({ subscription: updateResult.rows[0], message: 'Subscription updated successfully' });
    }

    // Deactivate any existing active subscriptions (only one active at a time)
    await pool.query(
      'UPDATE subscriptions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND status = $3',
      ['inactive', req.user.id, 'active']
    );

    // Create new subscription
    const result = await pool.query(
      `INSERT INTO subscriptions (user_id, plan_name, price, price_display, billing_period, features, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'active')
       RETURNING *`,
      [req.user.id, plan_name, price, price_display, billing_period, features]
    );

    res.status(201).json({ subscription: result.rows[0], message: 'Subscription created successfully' });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update subscription status (cancel or change)
app.patch('/api/portal/subscriptions/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const subscriptionId = req.params.id;

    // Verify subscription belongs to user
    const verifyResult = await pool.query(
      'SELECT * FROM subscriptions WHERE id = $1 AND user_id = $2',
      [subscriptionId, req.user.id]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const result = await pool.query(
      `UPDATE subscriptions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, subscriptionId]
    );

    res.json({ subscription: result.rows[0], message: 'Subscription updated successfully' });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get campaigns
app.get('/api/portal/campaigns', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM campaigns WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ campaigns: result.rows });
  } catch (error) {
    console.error('Campaigns error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get assets
app.get('/api/portal/assets', authenticateToken, async (req, res) => {
  try {
    // Exclude file_data from SELECT to avoid sending large binary data
    // We'll use the url field (base64) for display, or create an endpoint for binary data if needed
    const result = await pool.query(
      `SELECT id, user_id, name, type, url, file_size, category, description, created_at 
       FROM assets 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json({ assets: result.rows });
  } catch (error) {
    console.error('Assets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get asset file data (binary) - optional endpoint if you want to serve binary directly
app.get('/api/portal/assets/:id/file', authenticateToken, async (req, res) => {
  try {
    const assetId = req.params.id;
    
    const result = await pool.query(
      `SELECT file_data, type, name 
       FROM assets 
       WHERE id = $1 AND user_id = $2`,
      [assetId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const asset = result.rows[0];
    
    if (!asset.file_data) {
      return res.status(404).json({ error: 'File data not found' });
    }

    // Set appropriate content type
    const contentType = asset.type === 'image' ? 'image/png' : 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${asset.name}"`);
    
    // Send binary data
    res.send(asset.file_data);
  } catch (error) {
    console.error('Get asset file error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload asset (portal)
app.post('/api/portal/assets', authenticateToken, async (req, res) => {
  try {
    const { name, type, url, file_size, category, description } = req.body;
    
    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    // Convert base64 data URL to binary if provided
    let fileData = null;
    let finalUrl = url;
    
    if (url && url.startsWith('data:')) {
      // Extract base64 data from data URL
      const base64Data = url.split(',')[1];
      if (base64Data) {
        // Convert base64 to binary buffer
        fileData = Buffer.from(base64Data, 'base64');
        // Keep the data URL for easy display in frontend
        finalUrl = url;
      }
    }

    const result = await pool.query(
      `INSERT INTO assets (user_id, name, type, url, file_data, file_size, category, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, user_id, name, type, url, file_size, category, description, created_at`,
      [req.user.id, name, type, finalUrl || null, fileData, file_size || null, category || null, description || null]
    );

    res.status(201).json({ asset: result.rows[0], message: 'Asset uploaded successfully' });
  } catch (error) {
    console.error('Upload asset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete asset (portal)
app.delete('/api/portal/assets/:id', authenticateToken, async (req, res) => {
  try {
    const assetId = req.params.id;

    // Verify asset belongs to user
    const verifyResult = await pool.query(
      'SELECT * FROM assets WHERE id = $1 AND user_id = $2',
      [assetId, req.user.id]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    await pool.query('DELETE FROM assets WHERE id = $1', [assetId]);

    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Delete asset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get invoices (portal)
app.get('/api/portal/invoices', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*, u.name as user_name, u.email as user_email, u.company_name
       FROM invoices i
       JOIN users u ON i.user_id = u.id
       WHERE i.user_id = $1 
       ORDER BY i.created_at DESC`,
      [req.user.id]
    );
    res.json({ invoices: result.rows });
  } catch (error) {
    console.error('Invoices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single invoice (portal)
app.get('/api/portal/invoices/:id', authenticateToken, async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const result = await pool.query(
      `SELECT i.*, u.name as user_name, u.email as user_email, u.company_name, 
              u.address, u.city, u.state, u.country, u.zip_code, u.phone, u.website
       FROM invoices i
       JOIN users u ON i.user_id = u.id
       WHERE i.id = $1 AND i.user_id = $2`,
      [invoiceId, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.json({ invoice: result.rows[0] });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate invoice number helper
const generateInvoiceNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `INV-${timestamp}-${random}`;
};

// Get logo as base64
const getLogoBase64 = () => {
  try {
    const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      return `data:image/png;base64,${logoBuffer.toString('base64')}`;
    }
  } catch (error) {
    console.error('Error reading logo:', error);
  }
  return null;
};

// Generate invoice PDF HTML
const generateInvoicePDF = (invoice) => {
  // Parse items if it's a string
  const items = invoice.items ? (typeof invoice.items === 'string' ? JSON.parse(invoice.items) : invoice.items) : [];
  const subtotal = parseFloat(invoice.amount || 0);
  const tax = parseFloat(invoice.tax || 0);
  const total = parseFloat(invoice.total_amount || subtotal + tax);
  const dueDate = invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
  const invoiceDate = invoice.created_at ? new Date(invoice.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  // Format address
  const addressParts = [
    invoice.address,
    invoice.city,
    invoice.state,
    invoice.zip_code,
    invoice.country
  ].filter(Boolean);
  const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : 'N/A';
  
  // Get logo
  const logoBase64 = getLogoBase64();

  const invoiceNumber = invoice.invoice_number || `INV-${invoice.id}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
      padding: 40px;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      padding: 40px;
      box-shadow: 0 0 20px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
    }
    .company-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .logo-container {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-container img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    .company-details h1 {
      font-size: 28px;
      color: #f97316;
      margin-bottom: 10px;
    }
    .company-details p {
      color: #6b7280;
      font-size: 14px;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-info h2 {
      font-size: 24px;
      color: #111827;
      margin-bottom: 10px;
    }
    .invoice-info p {
      color: #6b7280;
      font-size: 14px;
      margin: 5px 0;
    }
    .billing-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .billing-box {
      flex: 1;
      margin-right: 20px;
    }
    .billing-box:last-child {
      margin-right: 0;
    }
    .billing-box h3 {
      font-size: 14px;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 10px;
      letter-spacing: 0.5px;
    }
    .billing-box p {
      color: #111827;
      font-size: 14px;
      margin: 5px 0;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .items-table thead {
      background: #f9fafb;
    }
    .items-table th {
      padding: 12px;
      text-align: left;
      font-size: 12px;
      color: #6b7280;
      text-transform: uppercase;
      font-weight: 600;
      border-bottom: 2px solid #e5e7eb;
    }
    .items-table td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
      color: #111827;
      font-size: 14px;
    }
    .items-table tbody tr:hover {
      background: #f9fafb;
    }
    .text-right {
      text-align: right;
    }
    .totals-section {
      margin-top: 20px;
      margin-left: auto;
      width: 300px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 14px;
    }
    .total-row.total {
      border-top: 2px solid #e5e7eb;
      margin-top: 10px;
      padding-top: 15px;
      font-size: 18px;
      font-weight: 700;
      color: #111827;
    }
    .total-label {
      color: #6b7280;
    }
    .total-value {
      color: #111827;
      font-weight: 600;
    }
    .notes-section {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    .notes-section h3 {
      font-size: 14px;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 10px;
      letter-spacing: 0.5px;
    }
    .notes-section p {
      color: #111827;
      font-size: 14px;
      line-height: 1.8;
      white-space: pre-wrap;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 10px;
    }
    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }
    .status-paid {
      background: #d1fae5;
      color: #065f46;
    }
    .status-overdue {
      background: #fee2e2;
      color: #991b1b;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    .download-section {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      display: flex;
      gap: 12px;
      justify-content: center;
    }
    .action-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: #f97316;
      color: white;
      text-decoration: none;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .action-btn:hover {
      background: #ea580c;
    }
    .action-btn.print-btn {
      background: #6b7280;
    }
    .action-btn.print-btn:hover {
      background: #4b5563;
    }
    .action-btn svg {
      width: 18px;
      height: 18px;
    }
    .invoice-number-print {
      /* This will be hidden when printing */
    }
    @media print {
      body {
        padding: 0;
      }
      .invoice-container {
        box-shadow: none;
        padding: 20px;
      }
      .download-section {
        display: none;
      }
      .invoice-number-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div class="company-info">
        ${logoBase64 ? `
        <div class="logo-container">
          <img src="${logoBase64}" alt="OndoSoft Logo" />
        </div>
        ` : ''}
        <div class="company-details">
          <h1>OndoSoft</h1>
          <p>${invoice.company_name || 'Professional Services'}</p>
          ${invoice.phone ? `<p>${invoice.phone}</p>` : ''}
        </div>
      </div>
      <div class="invoice-info">
        <h2>INVOICE</h2>
        <p class="invoice-number-print"><strong>Invoice #:</strong> ${invoice.invoice_number || `INV-${invoice.id}`}</p>
        <p><strong>Date:</strong> ${invoiceDate}</p>
        <p><strong>Due Date:</strong> ${dueDate}</p>
        <span class="status-badge status-${invoice.status || 'pending'}">${(invoice.status || 'pending').toUpperCase()}</span>
      </div>
    </div>

    <div class="billing-section">
      <div class="billing-box">
        <h3>Bill To</h3>
        <p><strong>${invoice.user_name || 'Client'}</strong></p>
        <p>${invoice.user_email || ''}</p>
        ${fullAddress !== 'N/A' ? `<p>${fullAddress}</p>` : ''}
      </div>
      <div class="billing-box">
        <h3>From</h3>
        <p><strong>OndoSoft</strong></p>
        <p>Professional Services</p>
      </div>
    </div>

    ${invoice.description ? `
    <div style="margin-bottom: 30px;">
      <h3 style="font-size: 14px; color: #6b7280; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.5px;">Description</h3>
      <p style="color: #111827; font-size: 14px; line-height: 1.8;">${invoice.description}</p>
    </div>
    ` : ''}

    ${items.length > 0 ? `
    <table class="items-table">
      <thead>
        <tr>
          <th>Item</th>
          <th class="text-right">Quantity</th>
          <th class="text-right">Price</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${items.map(item => `
          <tr>
            <td>${item.description || 'Item'}</td>
            <td class="text-right">${item.quantity || 1}</td>
            <td class="text-right">$${(parseFloat(item.price || 0)).toFixed(2)}</td>
            <td class="text-right">$${((parseFloat(item.quantity || 1)) * (parseFloat(item.price || 0))).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    ` : ''}

    <div class="totals-section">
      <div class="total-row">
        <span class="total-label">Subtotal:</span>
        <span class="total-value">$${subtotal.toFixed(2)}</span>
      </div>
      ${tax > 0 ? `
      <div class="total-row">
        <span class="total-label">Tax:</span>
        <span class="total-value">$${tax.toFixed(2)}</span>
      </div>
      ` : ''}
      <div class="total-row total">
        <span>Total:</span>
        <span>$${total.toFixed(2)}</span>
      </div>
    </div>

    ${invoice.notes ? `
    <div class="notes-section">
      <h3>Notes</h3>
      <p>${invoice.notes}</p>
    </div>
    ` : ''}

    <div class="download-section">
      <button class="action-btn" onclick="downloadInvoice()">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Invoice
      </button>
      <button class="action-btn print-btn" onclick="window.print()">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print Invoice
      </button>
    </div>
    <script>
      function downloadInvoice() {
        const invoiceNumber = '${(invoice.invoice_number ? invoice.invoice_number.replace(/'/g, "\\'") : "INV-" + invoice.id)}';
        const htmlContent = document.documentElement.outerHTML;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'invoice-' + invoiceNumber + '.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    </script>

    <div class="footer">
      <p>Thank you for your business!</p>
      <p style="margin-top: 10px;">This is an automated invoice generated by OndoSoft</p>
    </div>
  </div>
</body>
</html>`;
};

// Create invoice (portal - clients create invoices for themselves)
app.post('/api/portal/invoices', authenticateToken, async (req, res) => {
  try {
    const { amount, tax, total_amount, status, due_date, description, items, notes } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }
    
    const invoiceNumber = generateInvoiceNumber();
    const finalTotal = total_amount || (parseFloat(amount) + (parseFloat(tax) || 0));
    
    const result = await pool.query(
      `INSERT INTO invoices (user_id, invoice_number, amount, tax, total_amount, status, due_date, description, items, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        req.user.id, // Client creates invoice for themselves
        invoiceNumber,
        amount,
        tax || 0,
        finalTotal,
        status || 'pending',
        due_date || null,
        description || null,
        items ? JSON.stringify(items) : null,
        notes || null
      ]
    );
    
    res.status(201).json({ invoice: result.rows[0] });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate invoice PDF (portal)
app.get('/api/portal/invoices/:id/pdf', authenticateToken, async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const result = await pool.query(
      `SELECT i.*, u.name as user_name, u.email as user_email, u.company_name, 
              u.address, u.city, u.state, u.country, u.zip_code, u.phone, u.website
       FROM invoices i
       JOIN users u ON i.user_id = u.id
       WHERE i.id = $1 AND i.user_id = $2`,
      [invoiceId, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    const invoice = result.rows[0];
    
    // Generate PDF HTML
    const pdfHtml = generateInvoicePDF(invoice);
    
    const invoiceNumber = invoice.invoice_number || `INV-${invoice.id}`;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `inline; filename="invoice-${invoiceNumber}.html"`);
    res.send(pdfHtml);
  } catch (error) {
    console.error('Generate PDF error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin routes
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Get admin dashboard
app.get('/api/admin/dashboard', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Basic counts
    const totalUsersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalCampaignsResult = await pool.query('SELECT COUNT(*) as count FROM campaigns');
    const totalSubscriptionsResult = await pool.query('SELECT COUNT(*) as count FROM subscriptions');
    const totalAssetsResult = await pool.query('SELECT COUNT(*) as count FROM assets');
    const totalInvoicesResult = await pool.query('SELECT COUNT(*) as count FROM invoices');
    
    // Active counts
    const activeSubscriptionsResult = await pool.query("SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active'");
    const activeCampaignsResult = await pool.query("SELECT COUNT(*) as count FROM campaigns WHERE status = 'active'");
    
    // Revenue stats
    const revenueResult = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE status = 'paid'");
    const pendingRevenueResult = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM invoices WHERE status = 'pending'");
    
    // User growth (last 7 days)
    const newUsersResult = await pool.query(
      "SELECT COUNT(*) as count FROM users WHERE created_at >= NOW() - INTERVAL '7 days'"
    );
    
    // Recent users
    const recentUsersResult = await pool.query(
      'SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC LIMIT 10'
    );
    
    // Recent campaigns
    const recentCampaignsResult = await pool.query(
      `SELECT c.*, u.email, u.name as user_name 
       FROM campaigns c 
       JOIN users u ON c.user_id = u.id 
       ORDER BY c.created_at DESC 
       LIMIT 5`
    );
    
    // Recent subscriptions
    const recentSubscriptionsResult = await pool.query(
      `SELECT s.*, u.email, u.name as user_name, u.company_name as user_company
       FROM subscriptions s 
       JOIN users u ON s.user_id = u.id 
       ORDER BY s.created_at DESC 
       LIMIT 5`
    );
    
    // User growth over time (last 30 days)
    const userGrowthResult = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM users 
       WHERE created_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(created_at) 
       ORDER BY date ASC`
    );

    res.json({
      stats: {
        totalUsers: parseInt(totalUsersResult.rows[0].count),
        totalCampaigns: parseInt(totalCampaignsResult.rows[0].count),
        totalSubscriptions: parseInt(totalSubscriptionsResult.rows[0].count),
        totalAssets: parseInt(totalAssetsResult.rows[0].count),
        totalInvoices: parseInt(totalInvoicesResult.rows[0].count),
        activeSubscriptions: parseInt(activeSubscriptionsResult.rows[0].count),
        activeCampaigns: parseInt(activeCampaignsResult.rows[0].count),
        totalRevenue: parseFloat(revenueResult.rows[0].total || 0),
        pendingRevenue: parseFloat(pendingRevenueResult.rows[0].total || 0),
        newUsersLast7Days: parseInt(newUsersResult.rows[0].count)
      },
      recentUsers: recentUsersResult.rows,
      recentCampaigns: recentCampaignsResult.rows,
      recentSubscriptions: recentSubscriptionsResult.rows,
      userGrowth: userGrowthResult.rows
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (admin)
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, email, name, role, phone, company_name, company_size, industry,
        address, city, state, country, zip_code, website, signup_source,
        account_status, last_login, notes, tags, created_at, updated_at
      FROM users 
      ORDER BY created_at DESC
    `);
    res.json({ users: result.rows });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user (admin)
app.patch('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      name, phone, company_name, company_size, industry, address, city, 
      state, country, zip_code, website, account_status, notes, tags 
    } = req.body;
    
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (phone !== undefined) {
      updates.push(`phone = $${paramCount++}`);
      values.push(phone);
    }
    if (company_name !== undefined) {
      updates.push(`company_name = $${paramCount++}`);
      values.push(company_name);
    }
    if (company_size !== undefined) {
      updates.push(`company_size = $${paramCount++}`);
      values.push(company_size);
    }
    if (industry !== undefined) {
      updates.push(`industry = $${paramCount++}`);
      values.push(industry);
    }
    if (address !== undefined) {
      updates.push(`address = $${paramCount++}`);
      values.push(address);
    }
    if (city !== undefined) {
      updates.push(`city = $${paramCount++}`);
      values.push(city);
    }
    if (state !== undefined) {
      updates.push(`state = $${paramCount++}`);
      values.push(state);
    }
    if (country !== undefined) {
      updates.push(`country = $${paramCount++}`);
      values.push(country);
    }
    if (zip_code !== undefined) {
      updates.push(`zip_code = $${paramCount++}`);
      values.push(zip_code);
    }
    if (website !== undefined) {
      updates.push(`website = $${paramCount++}`);
      values.push(website);
    }
    if (account_status) {
      updates.push(`account_status = $${paramCount++}`);
      values.push(account_status);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount++}`);
      values.push(notes);
    }
    if (tags !== undefined) {
      updates.push(`tags = $${paramCount++}`);
      values.push(tags);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.params.id);

    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount}
       RETURNING id, email, name, role, phone, company_name, company_size, industry,
         address, city, state, country, zip_code, website, signup_source,
         account_status, last_login, notes, tags, created_at, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all campaigns (admin)
app.get('/api/admin/campaigns', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, u.email, u.name as user_name 
      FROM campaigns c 
      JOIN users u ON c.user_id = u.id 
      ORDER BY c.created_at DESC
    `);
    res.json({ campaigns: result.rows });
  } catch (error) {
    console.error('Admin campaigns error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get analytics data (admin)
app.get('/api/admin/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // User growth over time
    const userGrowthResult = await pool.query(
      `SELECT DATE(created_at)::text as date, COUNT(*)::int as count 
       FROM users 
       WHERE created_at >= NOW() - INTERVAL '90 days'
       GROUP BY DATE(created_at) 
       ORDER BY date ASC`
    );

    // Campaign growth over time
    const campaignGrowthResult = await pool.query(
      `SELECT DATE(created_at)::text as date, COUNT(*)::int as count 
       FROM campaigns 
       WHERE created_at >= NOW() - INTERVAL '90 days'
       GROUP BY DATE(created_at) 
       ORDER BY date ASC`
    );

    // Revenue over time
    const revenueGrowthResult = await pool.query(
      `SELECT DATE(created_at)::text as date, COALESCE(SUM(amount), 0)::numeric as total 
       FROM invoices 
       WHERE created_at >= NOW() - INTERVAL '90 days' AND status = 'paid'
       GROUP BY DATE(created_at) 
       ORDER BY date ASC`
    );

    // Users by role
    const usersByRoleResult = await pool.query(
      'SELECT role, COUNT(*)::int as count FROM users GROUP BY role'
    );

    // Campaigns by status
    const campaignsByStatusResult = await pool.query(
      'SELECT status, COUNT(*)::int as count FROM campaigns GROUP BY status'
    );

    // Subscriptions by status
    const subscriptionsByStatusResult = await pool.query(
      'SELECT status, COUNT(*)::int as count FROM subscriptions GROUP BY status'
    );

    // Top users by campaigns
    const topUsersByCampaignsResult = await pool.query(
      `SELECT u.id, u.name, u.email, COUNT(c.id)::int as campaign_count
       FROM users u
       LEFT JOIN campaigns c ON u.id = c.user_id
       GROUP BY u.id, u.name, u.email
       ORDER BY campaign_count DESC
       LIMIT 10`
    );

    // Monthly revenue
    const monthlyRevenueResult = await pool.query(
      `SELECT 
         TO_CHAR(created_at, 'YYYY-MM') as month,
         COALESCE(SUM(amount), 0)::numeric as total
       FROM invoices 
       WHERE status = 'paid' AND created_at >= NOW() - INTERVAL '12 months'
       GROUP BY TO_CHAR(created_at, 'YYYY-MM')
       ORDER BY month ASC`
    );

    res.json({
      userGrowth: userGrowthResult.rows,
      campaignGrowth: campaignGrowthResult.rows,
      revenueGrowth: revenueGrowthResult.rows,
      usersByRole: usersByRoleResult.rows,
      campaignsByStatus: campaignsByStatusResult.rows,
      subscriptionsByStatus: subscriptionsByStatusResult.rows,
      topUsersByCampaigns: topUsersByCampaignsResult.rows,
      monthlyRevenue: monthlyRevenueResult.rows
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get request analytics (admin)
app.get('/api/admin/request-analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Total data usage
    const totalDataResult = await pool.query(
      `SELECT 
         COALESCE(SUM(request_size + response_size), 0)::bigint as total_bytes,
         COALESCE(SUM(request_size), 0)::bigint as total_request_bytes,
         COALESCE(SUM(response_size), 0)::bigint as total_response_bytes,
         COUNT(*)::int as total_requests
       FROM api_requests`
    );

    // Requests by endpoint
    const requestsByEndpointResult = await pool.query(
      `SELECT endpoint, method, COUNT(*)::int as count,
         COALESCE(SUM(request_size + response_size), 0)::bigint as total_bytes,
         COALESCE(AVG(duration_ms), 0)::numeric as avg_duration
       FROM api_requests
       GROUP BY endpoint, method
       ORDER BY count DESC
       LIMIT 20`
    );

    // Requests by status code
    const requestsByStatusResult = await pool.query(
      `SELECT status_code, COUNT(*)::int as count
       FROM api_requests
       GROUP BY status_code
       ORDER BY status_code`
    );

    // Requests over time (last 30 days)
    const requestsOverTimeResult = await pool.query(
      `SELECT DATE(created_at)::text as date, COUNT(*)::int as count,
         COALESCE(SUM(request_size + response_size), 0)::bigint as total_bytes
       FROM api_requests
       WHERE created_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );

    // Requests by hour of day
    const requestsByHourResult = await pool.query(
      `SELECT EXTRACT(HOUR FROM created_at)::int as hour, COUNT(*)::int as count
       FROM api_requests
       WHERE created_at >= NOW() - INTERVAL '7 days'
       GROUP BY EXTRACT(HOUR FROM created_at)
       ORDER BY hour`
    );

    // Top users by requests
    const topUsersByRequestsResult = await pool.query(
      `SELECT u.id, u.name, u.email, COUNT(ar.id)::int as request_count,
         COALESCE(SUM(ar.request_size + ar.response_size), 0)::bigint as total_bytes
       FROM users u
       LEFT JOIN api_requests ar ON u.id = ar.user_id
       GROUP BY u.id, u.name, u.email
       ORDER BY request_count DESC
       LIMIT 10`
    );

    // Average response time by endpoint
    const avgResponseTimeResult = await pool.query(
      `SELECT endpoint, method,
         COALESCE(AVG(duration_ms), 0)::numeric as avg_duration,
         COALESCE(MAX(duration_ms), 0)::int as max_duration,
         COALESCE(MIN(duration_ms), 0)::int as min_duration
       FROM api_requests
       GROUP BY endpoint, method
       ORDER BY avg_duration DESC
       LIMIT 15`
    );

    res.json({
      totalData: totalDataResult.rows[0],
      requestsByEndpoint: requestsByEndpointResult.rows,
      requestsByStatus: requestsByStatusResult.rows,
      requestsOverTime: requestsOverTimeResult.rows,
      requestsByHour: requestsByHourResult.rows,
      topUsersByRequests: topUsersByRequestsResult.rows,
      avgResponseTime: avgResponseTimeResult.rows
    });
  } catch (error) {
    console.error('Request analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ticket system endpoints

// Create ticket (portal)
app.post('/api/portal/tickets', authenticateToken, async (req, res) => {
  try {
    const { 
      subject, 
      description, 
      type, 
      priority, 
      project_name, 
      email_request, 
      category,
      due_date,
      estimated_hours,
      budget,
      tags
    } = req.body;
    
    if (!subject || !description) {
      return res.status(400).json({ error: 'Subject and description are required' });
    }

    const result = await pool.query(
      `INSERT INTO tickets (
        user_id, subject, description, type, priority, status,
        project_name, email_request, category, due_date, estimated_hours, budget, tags
      )
       VALUES ($1, $2, $3, $4, $5, 'open', $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        req.user.id, 
        subject, 
        description, 
        type || 'support', 
        priority || 'medium',
        project_name || null,
        email_request || null,
        category || null,
        due_date || null,
        estimated_hours || null,
        budget || null,
        tags || null
      ]
    );

    res.status(201).json({ ticket: result.rows[0] });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user tickets (portal)
app.get('/api/portal/tickets', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tickets WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    // Return empty array if no tickets found
    res.json({ tickets: result.rows || [] });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get ticket details (portal)
app.get('/api/portal/tickets/:id', authenticateToken, async (req, res) => {
  try {
    const ticketResult = await pool.query(
      `SELECT * FROM tickets WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const messagesResult = await pool.query(
      `SELECT tm.*, u.name, u.email, u.role
       FROM ticket_messages tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.ticket_id = $1
       ORDER BY tm.created_at ASC`,
      [req.params.id]
    );

    const attachmentsResult = await pool.query(
      `SELECT * FROM ticket_attachments WHERE ticket_id = $1 ORDER BY created_at ASC`,
      [req.params.id]
    );

    res.json({
      ticket: ticketResult.rows[0],
      messages: messagesResult.rows,
      attachments: attachmentsResult.rows
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add message to ticket (portal)
app.post('/api/portal/tickets/:id/messages', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Verify ticket belongs to user
    const ticketResult = await pool.query(
      `SELECT * FROM tickets WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const result = await pool.query(
      `INSERT INTO ticket_messages (ticket_id, user_id, message, is_admin)
       VALUES ($1, $2, $3, false)
       RETURNING *`,
      [req.params.id, req.user.id, message]
    );

    // Update ticket updated_at
    await pool.query(
      `UPDATE tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [req.params.id]
    );

    res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload attachment (portal)
app.post('/api/portal/tickets/:id/attachments', authenticateToken, async (req, res) => {
  try {
    const { file_name, file_url, file_type, file_size, message_id } = req.body;
    
    if (!file_name || !file_url) {
      return res.status(400).json({ error: 'File name and URL are required' });
    }

    // Verify ticket belongs to user
    const ticketResult = await pool.query(
      `SELECT * FROM tickets WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user.id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const result = await pool.query(
      `INSERT INTO ticket_attachments (ticket_id, message_id, file_name, file_url, file_type, file_size)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [req.params.id, message_id || null, file_name, file_url, file_type || null, file_size || null]
    );

    res.status(201).json({ attachment: result.rows[0] });
  } catch (error) {
    console.error('Upload attachment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin ticket endpoints

// Get all tickets (admin)
app.get('/api/admin/tickets', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.name as user_name, u.email as user_email, u.phone as user_phone, u.company_name as user_company
       FROM tickets t
       JOIN users u ON t.user_id = u.id
       ORDER BY t.created_at DESC`
    );
    res.json({ tickets: result.rows });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get ticket details (admin)
app.get('/api/admin/tickets/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const ticketResult = await pool.query(
      `SELECT t.*, u.name as user_name, u.email as user_email
       FROM tickets t
       JOIN users u ON t.user_id = u.id
       WHERE t.id = $1`,
      [req.params.id]
    );

    if (ticketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const messagesResult = await pool.query(
      `SELECT tm.*, u.name, u.email, u.role
       FROM ticket_messages tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.ticket_id = $1
       ORDER BY tm.created_at ASC`,
      [req.params.id]
    );

    const attachmentsResult = await pool.query(
      `SELECT * FROM ticket_attachments WHERE ticket_id = $1 ORDER BY created_at ASC`,
      [req.params.id]
    );

    res.json({
      ticket: ticketResult.rows[0],
      messages: messagesResult.rows,
      attachments: attachmentsResult.rows
    });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update ticket (admin)
app.patch('/api/admin/tickets/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, priority, assigned_to } = req.body;
    
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (status) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }
    if (priority) {
      updates.push(`priority = $${paramCount++}`);
      values.push(priority);
    }
    if (assigned_to !== undefined) {
      updates.push(`assigned_to = $${paramCount++}`);
      values.push(assigned_to);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.params.id);

    const result = await pool.query(
      `UPDATE tickets SET ${updates.join(', ')} WHERE id = $${paramCount}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json({ ticket: result.rows[0] });
  } catch (error) {
    console.error('Update ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add admin message to ticket
app.post('/api/admin/tickets/:id/messages', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await pool.query(
      `INSERT INTO ticket_messages (ticket_id, user_id, message, is_admin)
       VALUES ($1, $2, $3, true)
       RETURNING *`,
      [req.params.id, req.user.id, message]
    );

    // Update ticket updated_at
    await pool.query(
      `UPDATE tickets SET updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [req.params.id]
    );

    res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin Invoice Endpoints

// Get all invoices (admin)
app.get('/api/admin/invoices', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT i.*, u.name as user_name, u.email as user_email, u.company_name
       FROM invoices i
       JOIN users u ON i.user_id = u.id
       ORDER BY i.created_at DESC`
    );
    res.json({ invoices: result.rows });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all assets (admin - grouped by user/project)
app.get('/api/admin/assets', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, u.name as user_name, u.email as user_email, u.company_name
       FROM assets a
       JOIN users u ON a.user_id = u.id
       ORDER BY a.created_at DESC`
    );
    res.json({ assets: result.rows });
  } catch (error) {
    console.error('Get assets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single invoice (admin)
app.get('/api/admin/invoices/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const result = await pool.query(
      `SELECT i.*, u.name as user_name, u.email as user_email, u.company_name, 
              u.address, u.city, u.state, u.country, u.zip_code, u.phone, u.website
       FROM invoices i
       JOIN users u ON i.user_id = u.id
       WHERE i.id = $1`,
      [invoiceId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.json({ invoice: result.rows[0] });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create invoice (admin)
app.post('/api/admin/invoices', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { user_id, amount, tax, total_amount, status, due_date, description, items, notes } = req.body;
    
    if (!user_id || !amount) {
      return res.status(400).json({ error: 'User ID and amount are required' });
    }
    
    const invoiceNumber = generateInvoiceNumber(); // Use the helper function defined above
    const finalTotal = total_amount || (parseFloat(amount) + (parseFloat(tax) || 0));
    
    const result = await pool.query(
      `INSERT INTO invoices (user_id, invoice_number, amount, tax, total_amount, status, due_date, description, items, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        user_id,
        invoiceNumber,
        amount,
        tax || 0,
        finalTotal,
        status || 'pending',
        due_date || null,
        description || null,
        items ? JSON.stringify(items) : null,
        notes || null
      ]
    );
    
    res.status(201).json({ invoice: result.rows[0] });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update invoice (admin)
app.patch('/api/admin/invoices/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { amount, tax, total_amount, status, due_date, description, items, notes } = req.body;
    
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (amount !== undefined) {
      updates.push(`amount = $${paramCount++}`);
      values.push(amount);
    }
    if (tax !== undefined) {
      updates.push(`tax = $${paramCount++}`);
      values.push(tax);
    }
    if (total_amount !== undefined) {
      updates.push(`total_amount = $${paramCount++}`);
      values.push(total_amount);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(status);
    }
    if (due_date !== undefined) {
      updates.push(`due_date = $${paramCount++}`);
      values.push(due_date);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }
    if (items !== undefined) {
      updates.push(`items = $${paramCount++}`);
      values.push(JSON.stringify(items));
    }
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount++}`);
      values.push(notes);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(req.params.id);
    
    const result = await pool.query(
      `UPDATE invoices SET ${updates.join(', ')} WHERE id = $${paramCount}
       RETURNING *`,
      values
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.json({ invoice: result.rows[0] });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate invoice PDF (admin)
app.get('/api/admin/invoices/:id/pdf', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const result = await pool.query(
      `SELECT i.*, u.name as user_name, u.email as user_email, u.company_name, 
              u.address, u.city, u.state, u.country, u.zip_code, u.phone, u.website
       FROM invoices i
       JOIN users u ON i.user_id = u.id
       WHERE i.id = $1`,
      [invoiceId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    const invoice = result.rows[0];
    
    // Generate PDF HTML
    const pdfHtml = generateInvoicePDF(invoice);
    
    const invoiceNumber = invoice.invoice_number || `INV-${invoice.id}`;
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `inline; filename="invoice-${invoiceNumber}.html"`);
    res.send(pdfHtml);
  } catch (error) {
    console.error('Generate PDF error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
