import 'dotenv/config';
import express from 'express';
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
const PORT = process.env.PORT || 5001; // Supabase/Deployment platform will set PORT automatically
const JWT_SECRET = process.env.JWT_SECRET || (() => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  console.warn('⚠️  WARNING: Using default JWT_SECRET. Set JWT_SECRET environment variable in production!');
  return 'your-secret-key-change-in-production';
})();

// Initialize PostgreSQL connection with Supabase
const getDatabaseUrl = () => {
  // Supabase provides DATABASE_URL in the format:
  // postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
  // Or direct connection:
  // postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
  const databaseUrl = process.env.DATABASE_URL;
  
  // Check if DATABASE_URL exists and is not empty
  if (!databaseUrl || databaseUrl.trim() === '') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('DATABASE_URL environment variable is required in production');
    }
    console.error('\n❌ ERROR: DATABASE_URL environment variable is required!');
    console.error('\n📝 To fix this:');
    console.error('   1. Create a .env file in the backend directory');
    console.error('   2. Add your Supabase connection string:');
    console.error('      DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres');
    console.error('\n📖 See SUPABASE_SETUP.md for detailed instructions on getting your connection string.\n');
    throw new Error('DATABASE_URL environment variable is required. Please create a .env file with your Supabase connection string.');
  }
  
  const trimmedUrl = databaseUrl.trim();
  
  // Validate that it looks like a valid connection string
  if (!trimmedUrl.startsWith('postgresql://') && !trimmedUrl.startsWith('postgres://')) {
    console.error('\n❌ ERROR: DATABASE_URL must start with postgresql:// or postgres://');
    console.error('   Current value:', trimmedUrl.substring(0, 80) + '...');
    throw new Error('Invalid DATABASE_URL format. Must start with postgresql:// or postgres://');
  }
  
  // Check for placeholder values that haven't been replaced
  if (trimmedUrl.includes('[REGION]') || trimmedUrl.includes('[PROJECT-REF]') || trimmedUrl.includes('[PASSWORD]') || trimmedUrl.includes('[YOUR-PASSWORD]')) {
    console.error('\n❌ ERROR: DATABASE_URL contains placeholder values that need to be replaced!');
    console.error('   Found placeholders: [REGION], [PROJECT-REF], or [PASSWORD]');
    console.error('   Current value:', trimmedUrl.substring(0, 100) + '...');
    console.error('\n📝 To fix this:');
    console.error('   1. Go to Supabase Dashboard → Settings → Database');
    console.error('   2. Copy the COMPLETE connection string (it will have real values, not placeholders)');
    console.error('   3. Replace DATABASE_URL in your .env file');
    console.error('\n📖 See FIX_CONNECTION_STRING.md for detailed instructions.\n');
    throw new Error('DATABASE_URL contains placeholder values. Please use the complete connection string from Supabase dashboard.');
  }
  
  // Try to parse the URL to catch format errors early
  try {
    const url = new URL(trimmedUrl);
    if (!url.hostname || !url.hostname.includes('supabase')) {
      console.warn('⚠️  WARNING: Connection string hostname does not appear to be a Supabase URL');
    }
  } catch (urlError) {
    console.error('\n❌ ERROR: DATABASE_URL is not a valid URL format!');
    console.error('   Error:', urlError.message);
    console.error('   Current value:', trimmedUrl.substring(0, 100) + '...');
    console.error('\n💡 Common issues:');
    console.error('   - Password contains special characters (@, #, %) that need URL encoding');
    console.error('   - Missing or incorrect format');
    console.error('\n📝 Solution: Copy the complete connection string from Supabase Dashboard');
    console.error('   (Supabase will provide it with proper encoding)\n');
    throw new Error(`Invalid DATABASE_URL format: ${urlError.message}`);
  }
  
  return trimmedUrl;
};

const pool = new Pool({
  connectionString: getDatabaseUrl(),
  ssl: {
    rejectUnauthorized: false // Supabase requires SSL but allows self-signed certificates
  },
  // Connection pool optimization for Supabase
  max: 20, // Maximum number of clients in the pool
  min: 2, // Minimum number of clients in the pool (reduced for Supabase)
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Return an error after 5 seconds if connection could not be established
  // Statement timeout (optional, can be set per query)
  statement_timeout: 30000 // 30 seconds
});

// Handle pool errors gracefully to prevent server crashes
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle database client:', err);
  // Don't crash the server - log the error and let the pool handle reconnection
  // The pool will automatically try to reconnect on the next query
});

// Handle connection errors
pool.on('connect', (client) => {
  client.on('error', (err) => {
    console.error('Database client error:', err.message);
    // Log but don't crash - the pool will handle reconnection
  });
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.message);
    console.error('⚠️  Server will continue, but database operations may fail until connection is restored');
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

      CREATE TABLE IF NOT EXISTS analytics_events (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        event_type VARCHAR(50) NOT NULL,
        pathname VARCHAR(500),
        referrer TEXT,
        user_agent TEXT,
        screen_width INTEGER,
        screen_height INTEGER,
        viewport_width INTEGER,
        viewport_height INTEGER,
        language VARCHAR(10),
        timezone VARCHAR(100),
        event_data JSONB,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS analytics_clicks (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        pathname VARCHAR(500),
        element_type VARCHAR(50),
        element_id VARCHAR(255),
        element_class TEXT,
        element_text TEXT,
        href TEXT,
        click_x INTEGER,
        click_y INTEGER,
        button INTEGER,
        ctrl_key BOOLEAN,
        shift_key BOOLEAN,
        alt_key BOOLEAN,
        meta_key BOOLEAN,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS analytics_navigation (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        from_path VARCHAR(500),
        to_path VARCHAR(500),
        navigation_method VARCHAR(50),
        time_on_page INTEGER,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS analytics_page_views (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        pathname VARCHAR(500),
        referrer TEXT,
        user_agent TEXT,
        screen_width INTEGER,
        screen_height INTEGER,
        viewport_width INTEGER,
        viewport_height INTEGER,
        language VARCHAR(10),
        timezone VARCHAR(100),
        page_load_time INTEGER,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS analytics_scrolls (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        pathname VARCHAR(500),
        scroll_depth INTEGER,
        time_on_page INTEGER,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS analytics_form_interactions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        pathname VARCHAR(500),
        form_id VARCHAR(255),
        action VARCHAR(50),
        field_name VARCHAR(255),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS analytics_user_interactions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        pathname VARCHAR(500),
        interaction_type VARCHAR(100),
        interaction_details JSONB,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS consultation_leads (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        company VARCHAR(255),
        selected_plan VARCHAR(255),
        selected_plan_price VARCHAR(50),
        timeline VARCHAR(100),
        budget VARCHAR(100),
        message TEXT,
        timezone VARCHAR(100),
        page_url TEXT,
        user_agent TEXT,
        utm_medium VARCHAR(100),
        utm_source VARCHAR(100),
        utm_campaign VARCHAR(100),
        utm_content VARCHAR(255),
        referrer TEXT,
        ip_address VARCHAR(45),
        status VARCHAR(50) DEFAULT 'new',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS consultation_drafts (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255),
        email VARCHAR(255),
        form_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_consultation_drafts_session_id ON consultation_drafts(session_id);
      CREATE INDEX IF NOT EXISTS idx_consultation_drafts_email ON consultation_drafts(email);

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

      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        link VARCHAR(500),
        is_read BOOLEAN DEFAULT FALSE,
        is_dismissed BOOLEAN DEFAULT FALSE,
        remind_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ai_conversations (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        email VARCHAR(255),
        name VARCHAR(255),
        phone VARCHAR(50),
        company VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active',
        page_url TEXT,
        referrer TEXT,
        user_agent TEXT,
        ip_address VARCHAR(45),
        timezone VARCHAR(100),
        language VARCHAR(10),
        screen_width INTEGER,
        screen_height INTEGER,
        viewport_width INTEGER,
        viewport_height INTEGER,
        utm_source VARCHAR(100),
        utm_medium VARCHAR(100),
        utm_campaign VARCHAR(100),
        utm_content VARCHAR(255),
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_message_at TIMESTAMP,
        ended_at TIMESTAMP,
        total_messages INTEGER DEFAULT 0,
        total_user_messages INTEGER DEFAULT 0,
        total_ai_messages INTEGER DEFAULT 0,
        conversation_duration_seconds INTEGER,
        sentiment_score DECIMAL(5, 2),
        satisfaction_rating INTEGER,
        satisfaction_feedback TEXT,
        tags TEXT,
        notes TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ai_messages (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
        role VARCHAR(20) NOT NULL,
        content TEXT NOT NULL,
        message_type VARCHAR(50) DEFAULT 'text',
        button_clicks JSONB,
        quick_replies JSONB,
        attachments JSONB,
        metadata JSONB,
        response_time_ms INTEGER,
        message_index INTEGER,
        is_edited BOOLEAN DEFAULT FALSE,
        edited_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ai_conversation_analytics (
        id SERIAL PRIMARY KEY,
        conversation_id INTEGER NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
        event_type VARCHAR(100) NOT NULL,
        event_data JSONB,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        type VARCHAR(50) NOT NULL,
        rating VARCHAR(20) NOT NULL,
        description TEXT,
        page_url TEXT,
        user_agent TEXT,
        ip_address VARCHAR(45),
        status VARCHAR(50) DEFAULT 'new',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pricing_page_interactions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        interaction_type VARCHAR(100) NOT NULL,
        interaction_details JSONB NOT NULL,
        element_type VARCHAR(50),
        element_id VARCHAR(255),
        element_class TEXT,
        element_text TEXT,
        click_x INTEGER,
        click_y INTEGER,
        selected_plan VARCHAR(255),
        selected_plan_price VARCHAR(50),
        selected_plan_index INTEGER,
        time_on_page_seconds INTEGER,
        scroll_depth INTEGER,
        page_url TEXT,
        referrer TEXT,
        user_agent TEXT,
        ip_address VARCHAR(45),
        screen_width INTEGER,
        screen_height INTEGER,
        viewport_width INTEGER,
        viewport_height INTEGER,
        language VARCHAR(10),
        timezone VARCHAR(100),
        utm_source VARCHAR(100),
        utm_medium VARCHAR(100),
        utm_campaign VARCHAR(100),
        utm_content VARCHAR(255),
        interaction_sequence INTEGER DEFAULT 0,
        metadata JSONB,
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
    
    // Add new columns to existing consultation_leads table if they don't exist
    await addConsultationLeadsColumns();
    
    // Create indexes for better query performance
    await createIndexes();
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

// Create database indexes for optimal query performance
const createIndexes = async () => {
  try {
    // Indexes for users table
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);
      CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
      CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login);
    `);

    // Indexes for subscriptions table
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at ON subscriptions(created_at);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON subscriptions(user_id, status);
    `);

    // Indexes for campaigns table
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
      CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
      CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON campaigns(created_at);
      CREATE INDEX IF NOT EXISTS idx_campaigns_user_status ON campaigns(user_id, status);
    `);

    // Indexes for assets table
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets(user_id);
      CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
      CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
      CREATE INDEX IF NOT EXISTS idx_assets_created_at ON assets(created_at);
      CREATE INDEX IF NOT EXISTS idx_assets_user_type ON assets(user_id, type);
    `);

    // Indexes for invoices table
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
      CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
      CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at);
      CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
      CREATE INDEX IF NOT EXISTS idx_invoices_user_status ON invoices(user_id, status);
      CREATE INDEX IF NOT EXISTS idx_invoices_status_created ON invoices(status, created_at);
    `);

    // Indexes for api_requests table (for analytics)
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_api_requests_user_id ON api_requests(user_id);
      CREATE INDEX IF NOT EXISTS idx_api_requests_endpoint ON api_requests(endpoint);
      CREATE INDEX IF NOT EXISTS idx_api_requests_status_code ON api_requests(status_code);
      CREATE INDEX IF NOT EXISTS idx_api_requests_created_at ON api_requests(created_at);
      CREATE INDEX IF NOT EXISTS idx_api_requests_user_created ON api_requests(user_id, created_at);
    `);

    // Indexes for tickets table
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
      CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
      CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
      CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON tickets(assigned_to);
      CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
      CREATE INDEX IF NOT EXISTS idx_tickets_user_status ON tickets(user_id, status);
      CREATE INDEX IF NOT EXISTS idx_tickets_status_created ON tickets(status, created_at);
    `);

    // Indexes for ticket_messages table
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
      CREATE INDEX IF NOT EXISTS idx_ticket_messages_user_id ON ticket_messages(user_id);
      CREATE INDEX IF NOT EXISTS idx_ticket_messages_created_at ON ticket_messages(created_at);
      CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket_created ON ticket_messages(ticket_id, created_at);
    `);

    // Indexes for ticket_attachments table
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_ticket_attachments_ticket_id ON ticket_attachments(ticket_id);
      CREATE INDEX IF NOT EXISTS idx_ticket_attachments_message_id ON ticket_attachments(message_id);
    `);

    // Indexes for notifications table
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
      CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
      CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
    `);

    // Indexes for analytics tables
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_pathname ON analytics_events(pathname);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
      CREATE INDEX IF NOT EXISTS idx_analytics_events_session_timestamp ON analytics_events(session_id, timestamp);
      
      CREATE INDEX IF NOT EXISTS idx_analytics_clicks_session_id ON analytics_clicks(session_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_clicks_pathname ON analytics_clicks(pathname);
      CREATE INDEX IF NOT EXISTS idx_analytics_clicks_element_type ON analytics_clicks(element_type);
      CREATE INDEX IF NOT EXISTS idx_analytics_clicks_timestamp ON analytics_clicks(timestamp);
      
      CREATE INDEX IF NOT EXISTS idx_analytics_navigation_session_id ON analytics_navigation(session_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_navigation_to_path ON analytics_navigation(to_path);
      CREATE INDEX IF NOT EXISTS idx_analytics_navigation_timestamp ON analytics_navigation(timestamp);
      
      CREATE INDEX IF NOT EXISTS idx_analytics_page_views_session_id ON analytics_page_views(session_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_page_views_pathname ON analytics_page_views(pathname);
      CREATE INDEX IF NOT EXISTS idx_analytics_page_views_timestamp ON analytics_page_views(timestamp);
      
      CREATE INDEX IF NOT EXISTS idx_analytics_scrolls_session_id ON analytics_scrolls(session_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_scrolls_pathname ON analytics_scrolls(pathname);
      CREATE INDEX IF NOT EXISTS idx_analytics_scrolls_timestamp ON analytics_scrolls(timestamp);
      
      CREATE INDEX IF NOT EXISTS idx_analytics_form_interactions_session_id ON analytics_form_interactions(session_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_form_interactions_pathname ON analytics_form_interactions(pathname);
      CREATE INDEX IF NOT EXISTS idx_analytics_form_interactions_timestamp ON analytics_form_interactions(timestamp);
      
      CREATE INDEX IF NOT EXISTS idx_consultation_leads_session_id ON consultation_leads(session_id);
      CREATE INDEX IF NOT EXISTS idx_consultation_leads_email ON consultation_leads(email);
      CREATE INDEX IF NOT EXISTS idx_consultation_leads_status ON consultation_leads(status);
      CREATE INDEX IF NOT EXISTS idx_consultation_leads_created_at ON consultation_leads(created_at);
      CREATE INDEX IF NOT EXISTS idx_consultation_leads_utm_medium ON consultation_leads(utm_medium);

      CREATE INDEX IF NOT EXISTS idx_ai_conversations_session_id ON ai_conversations(session_id);
      CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);
      CREATE INDEX IF NOT EXISTS idx_ai_conversations_email ON ai_conversations(email);
      CREATE INDEX IF NOT EXISTS idx_ai_conversations_status ON ai_conversations(status);
      CREATE INDEX IF NOT EXISTS idx_ai_conversations_started_at ON ai_conversations(started_at);
      CREATE INDEX IF NOT EXISTS idx_ai_conversations_last_message_at ON ai_conversations(last_message_at);
      CREATE INDEX IF NOT EXISTS idx_ai_conversations_session_status ON ai_conversations(session_id, status);

      CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON ai_messages(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_ai_messages_role ON ai_messages(role);
      CREATE INDEX IF NOT EXISTS idx_ai_messages_created_at ON ai_messages(created_at);
      CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_created ON ai_messages(conversation_id, created_at);
      CREATE INDEX IF NOT EXISTS idx_ai_messages_message_index ON ai_messages(conversation_id, message_index);

      CREATE INDEX IF NOT EXISTS idx_ai_conversation_analytics_conversation_id ON ai_conversation_analytics(conversation_id);
      CREATE INDEX IF NOT EXISTS idx_ai_conversation_analytics_event_type ON ai_conversation_analytics(event_type);
      CREATE INDEX IF NOT EXISTS idx_ai_conversation_analytics_timestamp ON ai_conversation_analytics(timestamp);
      
      CREATE INDEX IF NOT EXISTS idx_feedback_user_id ON feedback(user_id);
      CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
      CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);
      CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
      CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at);
      CREATE INDEX IF NOT EXISTS idx_feedback_type_rating ON feedback(type, rating);
      
      CREATE INDEX IF NOT EXISTS idx_pricing_page_interactions_session_id ON pricing_page_interactions(session_id);
      CREATE INDEX IF NOT EXISTS idx_pricing_page_interactions_user_id ON pricing_page_interactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_pricing_page_interactions_interaction_type ON pricing_page_interactions(interaction_type);
      CREATE INDEX IF NOT EXISTS idx_pricing_page_interactions_selected_plan ON pricing_page_interactions(selected_plan);
      CREATE INDEX IF NOT EXISTS idx_pricing_page_interactions_created_at ON pricing_page_interactions(created_at);
      CREATE INDEX IF NOT EXISTS idx_pricing_page_interactions_session_type ON pricing_page_interactions(session_id, interaction_type);
      
      CREATE INDEX IF NOT EXISTS idx_analytics_user_interactions_session_id ON analytics_user_interactions(session_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_user_interactions_pathname ON analytics_user_interactions(pathname);
      CREATE INDEX IF NOT EXISTS idx_analytics_user_interactions_interaction_type ON analytics_user_interactions(interaction_type);
      CREATE INDEX IF NOT EXISTS idx_analytics_user_interactions_timestamp ON analytics_user_interactions(timestamp);
    `);

    console.log('Database indexes created/verified successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
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

// Add new columns to consultation_leads table if they don't exist
const addConsultationLeadsColumns = async () => {
  try {
    const columns = [
      { name: 'qa_responses', type: 'JSONB' }
    ];
    
    for (const column of columns) {
      // Check if column exists
      const checkColumn = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='consultation_leads' AND column_name=$1
      `, [column.name]);
      
      if (checkColumn.rows.length === 0) {
        try {
          await pool.query(`ALTER TABLE consultation_leads ADD COLUMN ${column.name} ${column.type}`);
          console.log(`Added column to consultation_leads: ${column.name}`);
        } catch (alterError) {
          console.error(`Error adding column ${column.name}:`, alterError);
        }
      }
    }
  } catch (error) {
    console.error('Error adding consultation_leads columns:', error);
  }
};

// Initialize tables on startup
createTables().catch(err => {
  console.error('Error creating tables on startup:', err);
});

// Middleware
// CORS configuration - must be before other middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://ondosoft.com',
  'https://www.ondosoft.com',
  'https://ondowebsite.onrender.com',
  'http://ondowebsite.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

// Handle preflight OPTIONS requests FIRST - before any other middleware
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  
  // In production, only allow specific origins
  if (process.env.NODE_ENV === 'production') {
    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      res.header('Access-Control-Max-Age', '86400');
    }
  } else {
    // In development, allow all origins
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      res.header('Access-Control-Max-Age', '86400');
    }
  }
  
  res.sendStatus(200);
});

// Enable CORS for all other routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // In production, only allow specific origins
  if (process.env.NODE_ENV === 'production') {
    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    }
  } else {
    // In development, allow all origins
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
      res.header('Access-Control-Expose-Headers', 'Set-Cookie');
    }
  }
  
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Comprehensive Caching Headers Middleware
const setCacheHeaders = (req, res, next) => {
  const url = req.path;
  
  // Static assets - long cache
  if (url.match(/\.(jpg|jpeg|png|gif|ico|svg|webp|woff|woff2|ttf|eot|otf)$/i)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString());
    res.setHeader('ETag', `"${Date.now()}"`);
  }
  // CSS and JS files - medium cache
  else if (url.match(/\.(css|js)$/i)) {
    res.setHeader('Cache-Control', 'public, max-age=86400, must-revalidate');
    res.setHeader('Expires', new Date(Date.now() + 86400000).toUTCString());
    res.setHeader('ETag', `"${Date.now()}"`);
  }
  // HTML files - short cache with revalidation
  else if (url.match(/\.(html|htm)$/i) || url === '/' || !url.includes('.')) {
    res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString());
    res.setHeader('ETag', `"${Date.now()}"`);
    res.setHeader('Last-Modified', new Date().toUTCString());
  }
  // API responses - no cache or short cache
  else if (url.startsWith('/api/')) {
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'private, max-age=300, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
  // Default - short cache
  else {
    res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString());
  }
  
  // Additional caching headers
  res.setHeader('Vary', 'Accept-Encoding');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  next();
};

// Apply caching headers to all routes
app.use(setCacheHeaders);

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
    // Prevent caching of 401 responses
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Prevent caching of 403 responses
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Apply request tracking middleware to all routes (before route definitions)
app.use(trackRequest);

// Serve static files from the dist directory (frontend build)
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath, {
  maxAge: '1y', // Cache static assets for 1 year
  etag: true,
  lastModified: true
}));

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
    
    const user = result.rows[0];
    
    // Log role mismatch between token and database for debugging
    if (req.user.role !== user.role) {
      console.warn(`Role mismatch for user ${user.email}: Token has ${req.user.role}, Database has ${user.role}. Using database role.`);
    }
    
    // Log current role for debugging
    console.log(`Session check for ${user.email}: Role = ${user.role}`);
    
    res.json({ user });
  } catch (error) {
    console.error('Session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Portal routes

// Get dashboard data
app.get('/api/dashboard/dashboard', authenticateToken, async (req, res) => {
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
app.get('/api/dashboard/subscriptions', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    
    // Log subscription statuses for debugging
    console.log(`Fetched ${result.rows.length} subscriptions for user ${req.user.id}:`, 
      result.rows.map(s => ({ id: s.id, plan: s.plan_name, status: s.status }))
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
          '3 Months Technical Support'
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
          '6 Months Comprehensive Support'
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
app.post('/api/dashboard/subscriptions', authenticateToken, async (req, res) => {
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
app.patch('/api/dashboard/subscriptions/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const subscriptionId = req.params.id;

    // Normalize status to lowercase for consistency
    const normalizedStatus = status?.toLowerCase();

    // Verify subscription belongs to user
    const verifyResult = await pool.query(
      'SELECT * FROM subscriptions WHERE id = $1 AND user_id = $2',
      [subscriptionId, req.user.id]
    );

    if (verifyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    console.log(`Updating subscription ${subscriptionId} status from "${verifyResult.rows[0].status}" to "${normalizedStatus}"`);

    const result = await pool.query(
      `UPDATE subscriptions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [normalizedStatus, subscriptionId]
    );

    console.log(`Subscription ${subscriptionId} updated successfully. New status: "${result.rows[0].status}"`);

    res.json({ subscription: result.rows[0], message: 'Subscription updated successfully' });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get campaigns
app.get('/api/dashboard/campaigns', authenticateToken, async (req, res) => {
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
app.get('/api/dashboard/assets', authenticateToken, async (req, res) => {
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
app.get('/api/dashboard/assets/:id/file', authenticateToken, async (req, res) => {
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
app.post('/api/dashboard/assets', authenticateToken, async (req, res) => {
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
app.delete('/api/dashboard/assets/:id', authenticateToken, async (req, res) => {
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
app.get('/api/dashboard/invoices', authenticateToken, async (req, res) => {
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
app.get('/api/dashboard/invoices/:id', authenticateToken, async (req, res) => {
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
app.post('/api/dashboard/invoices', authenticateToken, async (req, res) => {
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
app.get('/api/dashboard/invoices/:id/pdf', authenticateToken, async (req, res) => {
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
    // Prevent caching of 403 responses
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
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
    
    // Consultation leads counts
    let totalConsultationLeadsResult, newConsultationLeadsResult, recentConsultationLeadsResult;
    try {
      totalConsultationLeadsResult = await pool.query('SELECT COUNT(*) as count FROM consultation_leads');
      newConsultationLeadsResult = await pool.query(
        "SELECT COUNT(*) as count FROM consultation_leads WHERE created_at >= NOW() - INTERVAL '7 days'"
      );
      recentConsultationLeadsResult = await pool.query(
        'SELECT * FROM consultation_leads ORDER BY created_at DESC LIMIT 5'
      );
    } catch (err) {
      console.error('Error querying consultation_leads:', err);
      totalConsultationLeadsResult = { rows: [{ count: 0 }] };
      newConsultationLeadsResult = { rows: [{ count: 0 }] };
      recentConsultationLeadsResult = { rows: [] };
    }

    // AI conversations counts
    let totalAIConversationsResult, newAIConversationsResult, activeAIConversationsResult, recentAIConversationsResult;
    try {
      totalAIConversationsResult = await pool.query('SELECT COUNT(*) as count FROM ai_conversations');
      newAIConversationsResult = await pool.query(
        "SELECT COUNT(*) as count FROM ai_conversations WHERE started_at >= NOW() - INTERVAL '7 days'"
      );
      activeAIConversationsResult = await pool.query(
        "SELECT COUNT(*) as count FROM ai_conversations WHERE status = 'active'"
      );
      recentAIConversationsResult = await pool.query(
        `SELECT c.*, u.name as user_name, u.email as user_email
         FROM ai_conversations c
         LEFT JOIN users u ON c.user_id = u.id
         ORDER BY c.started_at DESC LIMIT 5`
      );
    } catch (err) {
      console.error('Error querying ai_conversations:', err);
      totalAIConversationsResult = { rows: [{ count: 0 }] };
      newAIConversationsResult = { rows: [{ count: 0 }] };
      activeAIConversationsResult = { rows: [{ count: 0 }] };
      recentAIConversationsResult = { rows: [] };
    }
    
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

    // Feedback counts
    let totalFeedbackResult, newFeedbackResult, recentFeedbackResult;
    try {
      totalFeedbackResult = await pool.query('SELECT COUNT(*) as count FROM feedback');
      newFeedbackResult = await pool.query(
        "SELECT COUNT(*) as count FROM feedback WHERE created_at >= NOW() - INTERVAL '7 days'"
      );
      recentFeedbackResult = await pool.query(
        `SELECT f.*, u.name as user_name, u.email as user_email
         FROM feedback f
         LEFT JOIN users u ON f.user_id = u.id
         ORDER BY f.created_at DESC LIMIT 5`
      );
    } catch (err) {
      console.error('Error querying feedback:', err);
      totalFeedbackResult = { rows: [{ count: 0 }] };
      newFeedbackResult = { rows: [{ count: 0 }] };
      recentFeedbackResult = { rows: [] };
    }

    res.json({
      stats: {
        totalUsers: parseInt(totalUsersResult.rows[0].count),
        totalCampaigns: parseInt(totalCampaignsResult.rows[0].count),
        totalSubscriptions: parseInt(totalSubscriptionsResult.rows[0].count),
        totalAssets: parseInt(totalAssetsResult.rows[0].count),
        totalInvoices: parseInt(totalInvoicesResult.rows[0].count),
        totalConsultationLeads: parseInt(totalConsultationLeadsResult.rows[0].count),
        newConsultationLeadsLast7Days: parseInt(newConsultationLeadsResult.rows[0].count),
        totalAIConversations: parseInt(totalAIConversationsResult.rows[0].count),
        newAIConversationsLast7Days: parseInt(newAIConversationsResult.rows[0].count),
        activeAIConversations: parseInt(activeAIConversationsResult.rows[0].count),
        activeSubscriptions: parseInt(activeSubscriptionsResult.rows[0].count),
        activeCampaigns: parseInt(activeCampaignsResult.rows[0].count),
        totalRevenue: parseFloat(revenueResult.rows[0].total || 0),
        pendingRevenue: parseFloat(pendingRevenueResult.rows[0].total || 0),
        newUsersLast7Days: parseInt(newUsersResult.rows[0].count),
        totalFeedback: parseInt(totalFeedbackResult.rows[0].count),
        newFeedbackLast7Days: parseInt(newFeedbackResult.rows[0].count)
      },
      recentUsers: recentUsersResult.rows,
      recentCampaigns: recentCampaignsResult.rows,
      recentSubscriptions: recentSubscriptionsResult.rows,
      recentConsultationLeads: recentConsultationLeadsResult.rows,
      recentAIConversations: recentAIConversationsResult.rows,
      recentFeedback: recentFeedbackResult.rows,
      userGrowth: userGrowthResult.rows
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all consultation leads (admin)
app.get('/api/admin/consultation-leads', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, limit = 100, offset = 0 } = req.query;
    
    let query = 'SELECT * FROM consultation_leads';
    const params = [];
    
    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM consultation_leads';
    const countParams = [];
    if (status) {
      countQuery += ' WHERE status = $1';
      countParams.push(status);
    }
    const countResult = await pool.query(countQuery, countParams);
    
    res.json({ 
      leads: result.rows,
      total: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    console.error('Admin consultation leads error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all feedback (admin)
app.get('/api/admin/feedback', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, limit = 100, offset = 0 } = req.query;
    
    let query = `
      SELECT f.*, u.name as user_name, u.email as user_email
      FROM feedback f
      LEFT JOIN users u ON f.user_id = u.id
    `;
    const params = [];
    
    if (status) {
      query += ' WHERE f.status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY f.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM feedback';
    const countParams = [];
    if (status) {
      countQuery += ' WHERE status = $1';
      countParams.push(status);
    }
    const countResult = await pool.query(countQuery, countParams);
    
    res.json({ 
      feedback: result.rows,
      total: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update feedback (admin)
app.patch('/api/admin/feedback/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const updates = [];
    const params = [];
    let paramIndex = 1;
    
    if (status !== undefined) {
      updates.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }
    
    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex}`);
      params.push(notes);
      paramIndex++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);
    
    const query = `
      UPDATE feedback 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const result = await pool.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    
    res.json({ feedback: result.rows[0] });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update consultation lead status (admin)
app.patch('/api/admin/consultation-leads/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const updates = [];
    const params = [];
    let paramIndex = 1;
    
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      params.push(status);
    }
    
    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`);
      params.push(notes);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);
    
    const result = await pool.query(
      `UPDATE consultation_leads SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Consultation lead not found' });
    }
    
    res.json({ lead: result.rows[0] });
  } catch (error) {
    console.error('Update consultation lead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== AI Chat Admin Endpoints ====================

// Get all AI conversations (admin)
app.get('/api/admin/ai-conversations', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, limit = 100, offset = 0, search } = req.query;
    
    let query = `
      SELECT c.*, 
        u.name as user_name, u.email as user_email
      FROM ai_conversations c
      LEFT JOIN users u ON c.user_id = u.id
    `;
    const params = [];
    const conditions = [];
    
    if (status) {
      conditions.push(`c.status = $${params.length + 1}`);
      params.push(status);
    }
    
    if (search) {
      conditions.push(`(
        c.email ILIKE $${params.length + 1} OR
        c.name ILIKE $${params.length + 1} OR
        c.session_id ILIKE $${params.length + 1} OR
        u.email ILIKE $${params.length + 1} OR
        u.name ILIKE $${params.length + 1}
      )`);
      params.push(`%${search}%`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY c.started_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(parseInt(limit), parseInt(offset));
    
    const result = await pool.query(query, params);
    
    // Get total count
    let countQuery = 'SELECT COUNT(*) as count FROM ai_conversations c';
    const countParams = [];
    const countConditions = [];
    
    if (status) {
      countConditions.push(`c.status = $${countParams.length + 1}`);
      countParams.push(status);
    }
    
    if (search) {
      countQuery += ' LEFT JOIN users u ON c.user_id = u.id';
      countConditions.push(`(
        c.email ILIKE $${countParams.length + 1} OR
        c.name ILIKE $${countParams.length + 1} OR
        c.session_id ILIKE $${countParams.length + 1} OR
        u.email ILIKE $${countParams.length + 1} OR
        u.name ILIKE $${countParams.length + 1}
      )`);
      countParams.push(`%${search}%`);
    }
    
    if (countConditions.length > 0) {
      countQuery += ' WHERE ' + countConditions.join(' AND ');
    }
    const countResult = await pool.query(countQuery, countParams);
    
    res.json({ 
      conversations: result.rows,
      total: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    console.error('Admin AI conversations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single AI conversation with messages (admin)
app.get('/api/admin/ai-conversations/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get conversation
    const convResult = await pool.query(
      `SELECT c.*, u.name as user_name, u.email as user_email
       FROM ai_conversations c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [id]
    );
    
    if (convResult.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Get messages
    const messagesResult = await pool.query(
      `SELECT * FROM ai_messages 
       WHERE conversation_id = $1 
       ORDER BY message_index ASC, created_at ASC`,
      [id]
    );
    
    // Get analytics events
    const analyticsResult = await pool.query(
      `SELECT * FROM ai_conversation_analytics 
       WHERE conversation_id = $1 
       ORDER BY timestamp ASC`,
      [id]
    );
    
    res.json({
      conversation: convResult.rows[0],
      messages: messagesResult.rows,
      analytics: analyticsResult.rows
    });
  } catch (error) {
    console.error('Get AI conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update AI conversation (admin)
app.patch('/api/admin/ai-conversations/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, tags, sentimentScore, satisfactionRating, satisfactionFeedback } = req.body;
    
    const updates = [];
    const params = [];
    let paramIndex = 1;
    
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      params.push(status);
    }
    
    if (notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`);
      params.push(notes);
    }
    
    if (tags !== undefined) {
      updates.push(`tags = $${paramIndex++}`);
      params.push(tags);
    }
    
    if (sentimentScore !== undefined) {
      updates.push(`sentiment_score = $${paramIndex++}`);
      params.push(sentimentScore);
    }
    
    if (satisfactionRating !== undefined) {
      updates.push(`satisfaction_rating = $${paramIndex++}`);
      params.push(satisfactionRating);
    }
    
    if (satisfactionFeedback !== undefined) {
      updates.push(`satisfaction_feedback = $${paramIndex++}`);
      params.push(satisfactionFeedback);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);
    
    const result = await pool.query(
      `UPDATE ai_conversations SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    res.json({ conversation: result.rows[0] });
  } catch (error) {
    console.error('Update AI conversation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get AI conversations analytics (admin)
app.get('/api/admin/ai-conversations-analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Total conversations
    const totalResult = await pool.query('SELECT COUNT(*) as count FROM ai_conversations');
    const totalConversations = parseInt(totalResult.rows[0].count);
    
    // Active conversations
    const activeResult = await pool.query(
      "SELECT COUNT(*) as count FROM ai_conversations WHERE status = 'active'"
    );
    const activeConversations = parseInt(activeResult.rows[0].count);
    
    // Total messages
    const messagesResult = await pool.query('SELECT COUNT(*) as count FROM ai_messages');
    const totalMessages = parseInt(messagesResult.rows[0].count);
    
    // Average messages per conversation
    const avgMessagesResult = await pool.query(
      'SELECT AVG(total_messages) as avg FROM ai_conversations WHERE total_messages > 0'
    );
    const avgMessages = parseFloat(avgMessagesResult.rows[0].avg || 0);
    
    // Average conversation duration
    const avgDurationResult = await pool.query(
      'SELECT AVG(conversation_duration_seconds) as avg FROM ai_conversations WHERE conversation_duration_seconds IS NOT NULL'
    );
    const avgDuration = parseFloat(avgDurationResult.rows[0].avg || 0);
    
    // Conversations by status
    const statusResult = await pool.query(
      'SELECT status, COUNT(*) as count FROM ai_conversations GROUP BY status'
    );
    
    // Conversations by day (last 30 days)
    const dailyResult = await pool.query(
      `SELECT DATE(started_at) as date, COUNT(*) as count 
       FROM ai_conversations 
       WHERE started_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(started_at)
       ORDER BY date DESC`
    );
    
    // Top quick replies used
    const quickRepliesResult = await pool.query(
      `SELECT 
        jsonb_array_elements(quick_replies)->>'value' as reply_value,
        jsonb_array_elements(quick_replies)->>'label' as reply_label,
        COUNT(*) as count
       FROM ai_messages 
       WHERE quick_replies IS NOT NULL
       GROUP BY reply_value, reply_label
       ORDER BY count DESC
       LIMIT 10`
    );
    
    // Feedback analytics
    const feedbackResult = await pool.query(
      `SELECT 
        event_data->>'feedback' as feedback,
        COUNT(*) as count
       FROM ai_conversation_analytics 
       WHERE event_type = 'feedback' AND event_data->>'feedback' IS NOT NULL
       GROUP BY event_data->>'feedback'`
    );
    
    const positiveFeedback = feedbackResult.rows.find(r => r.feedback === 'positive')?.count || 0;
    const negativeFeedback = feedbackResult.rows.find(r => r.feedback === 'negative')?.count || 0;
    const totalFeedback = positiveFeedback + negativeFeedback;
    const feedbackScore = totalFeedback > 0 
      ? Math.round((positiveFeedback / totalFeedback) * 100) 
      : 0;
    
    // Link click analytics
    const linkClicksResult = await pool.query(
      `SELECT COUNT(*) as count 
       FROM ai_conversation_analytics 
       WHERE event_type = 'link_click'`
    );
    const totalLinkClicks = parseInt(linkClicksResult.rows[0].count || 0);
    
    res.json({
      totalConversations,
      activeConversations,
      totalMessages,
      avgMessages: Math.round(avgMessages * 100) / 100,
      avgDuration: Math.round(avgDuration),
      byStatus: statusResult.rows,
      daily: dailyResult.rows,
      topQuickReplies: quickRepliesResult.rows,
      feedback: {
        positive: positiveFeedback,
        negative: negativeFeedback,
        total: totalFeedback,
        score: feedbackScore
      },
      linkClicks: totalLinkClicks
    });
  } catch (error) {
    console.error('AI conversations analytics error:', error);
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

// Helper function to validate and clamp integer values to PostgreSQL INTEGER range
const clampInteger = (value) => {
  if (value === null || value === undefined) return null;
  const num = Number(value);
  if (isNaN(num)) return null;
  // PostgreSQL INTEGER range: -2,147,483,648 to 2,147,483,647
  const MIN_INT = -2147483648;
  const MAX_INT = 2147483647;
  if (num < MIN_INT) return null; // Return null for values that are too small
  if (num > MAX_INT) return null; // Return null for values that are too large
  return Math.round(num);
};

// Track analytics event (public endpoint)
app.post('/api/analytics/track', async (req, res) => {
  try {
    const { type, data } = req.body;
    
    if (!type || !data) {
      return res.status(400).json({ error: 'Type and data are required' });
    }

    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // Store in appropriate table based on event type
    switch (type) {
      case 'page_view':
        await pool.query(
          `INSERT INTO analytics_page_views 
           (session_id, pathname, referrer, user_agent, screen_width, screen_height, 
            viewport_width, viewport_height, language, timezone, page_load_time)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            data.sessionId || null, data.pathname || null, data.referrer || null, userAgent || null,
            clampInteger(data.screenWidth), clampInteger(data.screenHeight), 
            clampInteger(data.viewportWidth), clampInteger(data.viewportHeight),
            data.language || null, data.timezone || null, clampInteger(data.pageLoadTime)
          ]
        );
        break;

      case 'click':
        await pool.query(
          `INSERT INTO analytics_clicks 
           (session_id, pathname, element_type, element_id, element_class, element_text, 
            href, click_x, click_y, button, ctrl_key, shift_key, alt_key, meta_key)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [
            data.sessionId || null, data.pathname || null, data.elementType || null, data.elementId || null,
            data.elementClass || null, data.elementText || null, data.href || null, 
            clampInteger(data.x), clampInteger(data.y), clampInteger(data.button),
            data.ctrlKey || false, data.shiftKey || false, data.altKey || false, data.metaKey || false
          ]
        );
        break;

      case 'navigation':
        await pool.query(
          `INSERT INTO analytics_navigation 
           (session_id, from_path, to_path, navigation_method, time_on_page)
           VALUES ($1, $2, $3, $4, $5)`,
          [data.sessionId || null, data.from || null, data.to || null, data.method || null, clampInteger(data.timeOnPage)]
        );
        break;

      case 'scroll':
        await pool.query(
          `INSERT INTO analytics_scrolls 
           (session_id, pathname, scroll_depth, time_on_page)
           VALUES ($1, $2, $3, $4)`,
          [data.sessionId || null, data.pathname || null, clampInteger(data.scrollDepth), clampInteger(data.timeOnPage)]
        );
        break;

      case 'form_interaction':
        await pool.query(
          `INSERT INTO analytics_form_interactions 
           (session_id, pathname, form_id, action, field_name)
           VALUES ($1, $2, $3, $4, $5)`,
          [data.sessionId || null, data.pathname || null, data.formId || null, data.action || null, data.fieldName || null]
        );
        break;

      case 'user_interaction':
        await pool.query(
          `INSERT INTO analytics_user_interactions 
           (session_id, pathname, interaction_type, interaction_details)
           VALUES ($1, $2, $3, $4)`,
          [data.sessionId || null, data.pathname || null, data.interactionType || null, data.details ? JSON.stringify(data.details) : null]
        );
        break;

      case 'page_exit':
        // Store as navigation event
        await pool.query(
          `INSERT INTO analytics_navigation 
           (session_id, from_path, to_path, navigation_method, time_on_page)
           VALUES ($1, $2, $3, $4, $5)`,
          [data.sessionId || null, data.pathname || null, 'exit', 'exit', data.timeOnPage || null]
        );
        break;

      default:
        // Store generic event
        await pool.query(
          `INSERT INTO analytics_events 
           (session_id, event_type, pathname, referrer, user_agent, screen_width, 
            screen_height, viewport_width, viewport_height, language, timezone, event_data)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            data.sessionId || null, type || null, data.pathname || null, data.referrer || null, userAgent || null,
            data.screenWidth || null, data.screenHeight || null, data.viewportWidth || null, data.viewportHeight || null,
            data.language || null, data.timezone || null, JSON.stringify(data || {})
          ]
        );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      type: error.type,
      code: error.code
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Track analytics events in batch (public endpoint)
app.post('/api/analytics/track-batch', async (req, res) => {
  try {
    const { events } = req.body;
    
    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ error: 'Events array is required' });
    }

    const userAgent = req.get('user-agent');

    // Process each event in the batch
    for (const event of events) {
      const { type, data } = event;
      
      try {
        switch (type) {
          case 'click':
            await pool.query(
              `INSERT INTO analytics_clicks 
               (session_id, pathname, element_type, element_id, element_class, element_text, 
                href, click_x, click_y, button, ctrl_key, shift_key, alt_key, meta_key)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
              [
                data.sessionId, data.pathname, data.elementType, data.elementId,
                data.elementClass, data.elementText, data.href, data.x, data.y,
                data.button, data.ctrlKey, data.shiftKey, data.altKey, data.metaKey
              ]
            );
            break;

          case 'scroll':
            await pool.query(
              `INSERT INTO analytics_scrolls 
               (session_id, pathname, scroll_depth, time_on_page)
               VALUES ($1, $2, $3, $4)`,
              [data.sessionId, data.pathname, data.scrollDepth, data.timeOnPage]
            );
            break;

          case 'form_interaction':
            await pool.query(
              `INSERT INTO analytics_form_interactions 
               (session_id, pathname, form_id, action, field_name)
               VALUES ($1, $2, $3, $4, $5)`,
              [data.sessionId, data.pathname, data.formId, data.action, data.fieldName]
            );
            break;

          case 'user_interaction':
            await pool.query(
              `INSERT INTO analytics_user_interactions 
               (session_id, pathname, interaction_type, interaction_details)
               VALUES ($1, $2, $3, $4)`,
              [data.sessionId, data.pathname, data.interactionType, JSON.stringify(data.details)]
            );
            break;
        }
      } catch (err) {
        console.error(`Error processing event ${type}:`, err);
        // Continue processing other events
      }
    }

    res.json({ success: true, processed: events.length });
  } catch (error) {
    console.error('Analytics batch tracking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit consultation form (public endpoint)
app.post('/api/consultation/submit', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      selectedPlan,
      selectedPlanPrice,
      timeline,
      budget,
      message,
      qaResponses,
      timezone,
      pageUrl,
      userAgent,
      utmMedium,
      utmSource,
      utmCampaign,
      utmContent
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'Name, email, and phone are required' });
    }

    // Get session ID from analytics tracker if available
    const sessionId = req.body.sessionId || null;
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0] || null;
    const referrer = req.get('referer') || req.body.referrer || null;

    // Parse Q&A responses if provided as JSON string
    let qaResponsesParsed = null;
    if (qaResponses) {
      try {
        qaResponsesParsed = typeof qaResponses === 'string' ? JSON.parse(qaResponses) : qaResponses;
      } catch (parseError) {
        console.warn('Failed to parse qaResponses:', parseError);
        qaResponsesParsed = null;
      }
    }

    // Insert consultation lead into database
    const result = await pool.query(
      `INSERT INTO consultation_leads 
       (session_id, name, email, phone, company, selected_plan, selected_plan_price, 
        timeline, budget, message, qa_responses, timezone, page_url, user_agent, utm_medium, 
        utm_source, utm_campaign, utm_content, referrer, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
       RETURNING id, created_at`,
      [
        sessionId, name, email, phone, company || null, selectedPlan || null, selectedPlanPrice || null,
        timeline || null, budget || null, message || null, qaResponsesParsed ? JSON.stringify(qaResponsesParsed) : null,
        timezone || null, pageUrl || null, userAgent || null, utmMedium || null, utmSource || null, 
        utmCampaign || null, utmContent || null, referrer, ipAddress
      ]
    );

    res.json({ 
      success: true, 
      id: result.rows[0].id,
      createdAt: result.rows[0].created_at
    });
  } catch (error) {
    console.error('Consultation submission error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Save consultation draft (public endpoint)
app.post('/api/consultation/draft', async (req, res) => {
  try {
    const { sessionId, email, formData } = req.body;

    if (!formData) {
      return res.status(400).json({ error: 'Form data is required' });
    }

    // Use sessionId or email as identifier
    const identifier = sessionId || email;
    if (!identifier) {
      return res.status(400).json({ error: 'Session ID or email is required' });
    }

    // Check if draft exists
    let checkResult;
    if (sessionId && email) {
      checkResult = await pool.query(
        'SELECT id FROM consultation_drafts WHERE (session_id = $1 OR email = $2) ORDER BY updated_at DESC LIMIT 1',
        [sessionId, email]
      );
    } else if (sessionId) {
      checkResult = await pool.query(
        'SELECT id FROM consultation_drafts WHERE session_id = $1 ORDER BY updated_at DESC LIMIT 1',
        [sessionId]
      );
    } else {
      checkResult = await pool.query(
        'SELECT id FROM consultation_drafts WHERE email = $1 ORDER BY updated_at DESC LIMIT 1',
        [email]
      );
    }

    let result;
    if (checkResult.rows.length > 0) {
      // Update existing draft
      result = await pool.query(
        `UPDATE consultation_drafts 
         SET form_data = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2
         RETURNING id, created_at, updated_at`,
        [JSON.stringify(formData), checkResult.rows[0].id]
      );
    } else {
      // Insert new draft
      result = await pool.query(
        `INSERT INTO consultation_drafts (session_id, email, form_data, updated_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         RETURNING id, created_at, updated_at`,
        [sessionId || null, email || null, JSON.stringify(formData)]
      );
    }

    res.json({
      success: true,
      id: result.rows[0].id,
      updatedAt: result.rows[0].updated_at
    });
  } catch (error) {
    console.error('Consultation draft save error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get consultation draft (public endpoint)
app.get('/api/consultation/draft', async (req, res) => {
  try {
    const { sessionId, email } = req.query;

    if (!sessionId && !email) {
      return res.status(400).json({ error: 'Session ID or email is required' });
    }

    let result;
    if (sessionId && email) {
      result = await pool.query(
        'SELECT form_data, updated_at FROM consultation_drafts WHERE (session_id = $1 OR email = $2) ORDER BY updated_at DESC LIMIT 1',
        [sessionId, email]
      );
    } else if (sessionId) {
      result = await pool.query(
        'SELECT form_data, updated_at FROM consultation_drafts WHERE session_id = $1 ORDER BY updated_at DESC LIMIT 1',
        [sessionId]
      );
    } else {
      result = await pool.query(
        'SELECT form_data, updated_at FROM consultation_drafts WHERE email = $1 ORDER BY updated_at DESC LIMIT 1',
        [email]
      );
    }

    if (result.rows.length === 0) {
      return res.json({ success: true, formData: null });
    }

    res.json({
      success: true,
      formData: result.rows[0].form_data,
      updatedAt: result.rows[0].updated_at
    });
  } catch (error) {
    console.error('Consultation draft load error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ==================== Pricing Page Interactions Endpoints ====================

// Save pricing page interaction (public endpoint)
app.post('/api/pricing/interaction', async (req, res) => {
  try {
    const {
      sessionId,
      interactionType,
      interactionDetails,
      elementType,
      elementId,
      elementClass,
      elementText,
      clickX,
      clickY,
      selectedPlan,
      selectedPlanPrice,
      selectedPlanIndex,
      timeOnPageSeconds,
      scrollDepth,
      interactionSequence
    } = req.body;

    // Validate required fields
    if (!sessionId || !interactionType || !interactionDetails) {
      return res.status(400).json({ error: 'Session ID, interaction type, and interaction details are required' });
    }

    // Get user ID if authenticated (optional)
    let userId = null;
    try {
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      }
    } catch (err) {
      // User not authenticated, continue without user_id
    }

    // Get additional context from request
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0] || null;
    const userAgent = req.get('user-agent') || null;
    const referrer = req.get('referer') || null;
    const pageUrl = req.body.pageUrl || null;

    // Extract UTM parameters from query or body
    const utmSource = req.query.utm_source || req.body.utmSource || null;
    const utmMedium = req.query.utm_medium || req.body.utmMedium || null;
    const utmCampaign = req.query.utm_campaign || req.body.utmCampaign || null;
    const utmContent = req.query.utm_content || req.body.utmContent || null;

    // Get screen/viewport info from body
    const screenWidth = req.body.screenWidth || null;
    const screenHeight = req.body.screenHeight || null;
    const viewportWidth = req.body.viewportWidth || null;
    const viewportHeight = req.body.viewportHeight || null;
    const language = req.body.language || null;
    const timezone = req.body.timezone || null;

    // Get interaction sequence (count existing interactions for this session)
    let sequence = interactionSequence || 0;
    if (!interactionSequence) {
      const countResult = await pool.query(
        'SELECT COUNT(*) as count FROM pricing_page_interactions WHERE session_id = $1',
        [sessionId]
      );
      sequence = parseInt(countResult.rows[0].count) + 1;
    }

    // Insert interaction
    const result = await pool.query(
      `INSERT INTO pricing_page_interactions 
       (session_id, user_id, interaction_type, interaction_details, element_type, element_id, element_class,
        element_text, click_x, click_y, selected_plan, selected_plan_price, selected_plan_index,
        time_on_page_seconds, scroll_depth, page_url, referrer, user_agent, ip_address,
        screen_width, screen_height, viewport_width, viewport_height, language, timezone,
        utm_source, utm_medium, utm_campaign, utm_content, interaction_sequence, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)
       RETURNING id, created_at`,
      [
        sessionId,
        userId,
        interactionType,
        JSON.stringify(interactionDetails),
        elementType || null,
        elementId || null,
        elementClass || null,
        elementText || null,
        clickX || null,
        clickY || null,
        selectedPlan || null,
        selectedPlanPrice || null,
        selectedPlanIndex || null,
        timeOnPageSeconds || null,
        scrollDepth || null,
        pageUrl,
        referrer,
        userAgent,
        ipAddress,
        screenWidth,
        screenHeight,
        viewportWidth,
        viewportHeight,
        language,
        timezone,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        sequence,
        req.body.metadata ? JSON.stringify(req.body.metadata) : null
      ]
    );

    res.json({
      success: true,
      id: result.rows[0].id,
      createdAt: result.rows[0].created_at,
      sequence
    });
  } catch (error) {
    console.error('Pricing page interaction save error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get pricing page interactions by session (public endpoint)
app.get('/api/pricing/interactions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { interactionType } = req.query;

    let query = `SELECT * FROM pricing_page_interactions WHERE session_id = $1`;
    const params = [sessionId];

    if (interactionType) {
      query += ` AND interaction_type = $2`;
      params.push(interactionType);
    }

    query += ` ORDER BY created_at ASC`;

    const result = await pool.query(query, params);

    res.json({
      success: true,
      interactions: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Get pricing page interactions error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Submit feedback (public endpoint)
app.post('/api/feedback', async (req, res) => {
  try {
    const { type, rating, description, page_url, user_agent } = req.body;

    // Validate required fields
    if (!type || !rating) {
      return res.status(400).json({ error: 'Type and rating are required' });
    }

    // Validate type
    if (!['compliment', 'comment', 'complaint'].includes(type)) {
      return res.status(400).json({ error: 'Invalid feedback type' });
    }

    // Validate rating
    if (!['up', 'down', 'neutral'].includes(rating)) {
      return res.status(400).json({ error: 'Invalid rating' });
    }

    // Get user ID if authenticated (optional)
    let userId = null;
    try {
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      }
    } catch (err) {
      // User not authenticated, continue without user_id
    }

    // Get IP address
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for']?.split(',')[0] || null;

    // Insert feedback into database
    const result = await pool.query(
      `INSERT INTO feedback 
       (user_id, type, rating, description, page_url, user_agent, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [
        userId,
        type,
        rating,
        description && description.trim() ? description.trim() : null,
        page_url || null,
        user_agent || null,
        ipAddress
      ]
    );

    res.json({ 
      success: true, 
      id: result.rows[0].id,
      createdAt: result.rows[0].created_at
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user's own feedback (authenticated endpoint)
app.get('/api/feedback', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const result = await pool.query(
      `SELECT * FROM feedback 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT $2 OFFSET $3`,
      [userId, parseInt(limit), parseInt(offset)]
    );

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) as count FROM feedback WHERE user_id = $1',
      [userId]
    );

    res.json({ 
      feedback: result.rows,
      total: parseInt(countResult.rows[0].count)
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete consultation draft (public endpoint)
app.delete('/api/consultation/draft', async (req, res) => {
  try {
    const { sessionId, email } = req.body;

    if (!sessionId && !email) {
      return res.status(400).json({ error: 'Session ID or email is required' });
    }

    let result;
    if (sessionId && email) {
      result = await pool.query(
        'DELETE FROM consultation_drafts WHERE (session_id = $1 OR email = $2) RETURNING id',
        [sessionId, email]
      );
    } else if (sessionId) {
      result = await pool.query(
        'DELETE FROM consultation_drafts WHERE session_id = $1 RETURNING id',
        [sessionId]
      );
    } else {
      result = await pool.query(
        'DELETE FROM consultation_drafts WHERE email = $1 RETURNING id',
        [email]
      );
    }

    res.json({ success: true, deleted: result.rowCount > 0 });
  } catch (error) {
    console.error('Consultation draft delete error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ==================== AI Chat Endpoints ====================

// Get conversation by session ID (public endpoint) - for loading chat history
app.get('/api/ai-chat/conversations/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Get the most recent active conversation for this session
    const convResult = await pool.query(
      `SELECT c.*, u.name as user_name, u.email as user_email
       FROM ai_conversations c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.session_id = $1 AND c.status = 'active'
       ORDER BY c.started_at DESC
       LIMIT 1`,
      [sessionId]
    );

    if (convResult.rows.length === 0) {
      return res.json({ conversation: null, messages: [] });
    }

    const conversation = convResult.rows[0];

    // Get messages for this conversation
    const messagesResult = await pool.query(
      `SELECT * FROM ai_messages 
       WHERE conversation_id = $1 
       ORDER BY message_index ASC, created_at ASC`,
      [conversation.id]
    );

    res.json({
      conversation: conversation,
      messages: messagesResult.rows,
    });
  } catch (error) {
    console.error('Get conversation by session error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Create AI conversation (public endpoint)
app.post('/api/ai-chat/conversations', async (req, res) => {
  try {
    const {
      sessionId,
      pageUrl,
      referrer,
      userAgent,
      timezone,
      language,
      screenWidth,
      screenHeight,
      viewportWidth,
      viewportHeight,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
    } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    // Get IP address
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Create conversation - convert to MT timezone
    const result = await pool.query(
      `INSERT INTO ai_conversations 
       (session_id, page_url, referrer, user_agent, ip_address, timezone, language,
        screen_width, screen_height, viewport_width, viewport_height,
        utm_source, utm_medium, utm_campaign, utm_content, started_at, last_message_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, 
               (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'America/Denver'), 
               (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'America/Denver'))
       RETURNING id, started_at`,
      [
        sessionId,
        pageUrl || null,
        referrer || null,
        userAgent || null,
        ipAddress || null,
        timezone || null,
        language || null,
        screenWidth || null,
        screenHeight || null,
        viewportWidth || null,
        viewportHeight || null,
        utmSource || null,
        utmMedium || null,
        utmCampaign || null,
        utmContent || null,
      ]
    );

    res.json({
      success: true,
      conversationId: result.rows[0].id,
      startedAt: result.rows[0].started_at,
    });
  } catch (error) {
    console.error('AI conversation creation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Add message to conversation (public endpoint)
app.post('/api/ai-chat/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { role, content, messageType, quickReplies, buttonClicks, metadata } = req.body;

    if (!role || !content) {
      return res.status(400).json({ error: 'Role and content are required' });
    }

    // Get current message count for this conversation
    const countResult = await pool.query(
      'SELECT COUNT(*) as count FROM ai_messages WHERE conversation_id = $1',
      [conversationId]
    );
    const messageIndex = parseInt(countResult.rows[0].count) + 1;

    // Insert message - convert to MT timezone
    const result = await pool.query(
      `INSERT INTO ai_messages 
       (conversation_id, role, content, message_type, quick_replies, button_clicks, metadata, message_index, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'America/Denver'))
       RETURNING id, created_at`,
      [
        conversationId,
        role,
        content,
        messageType || 'text',
        quickReplies ? JSON.stringify(quickReplies) : null,
        buttonClicks ? JSON.stringify(buttonClicks) : null,
        metadata ? JSON.stringify(metadata) : null,
        messageIndex,
      ]
    );

    // Update conversation stats - convert to MT timezone
    const updateField = role === 'user' ? 'total_user_messages' : 'total_ai_messages';
    await pool.query(
      `UPDATE ai_conversations 
       SET total_messages = total_messages + 1,
           ${updateField} = ${updateField} + 1,
           last_message_at = (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'America/Denver'),
           updated_at = (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'America/Denver')
       WHERE id = $1`,
      [conversationId]
    );

    // Track analytics event - convert to MT timezone
    await pool.query(
      `INSERT INTO ai_conversation_analytics (conversation_id, event_type, event_data, timestamp)
       VALUES ($1, 'message_sent', $2, (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'America/Denver'))`,
      [
        conversationId,
        JSON.stringify({
          role,
          messageType: messageType || 'text',
          messageIndex,
          hasQuickReplies: !!quickReplies,
          hasButtonClicks: !!buttonClicks,
        }),
      ]
    );

    res.json({
      success: true,
      messageId: result.rows[0].id,
      createdAt: result.rows[0].created_at,
    });
  } catch (error) {
    console.error('AI message save error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Save feedback for message (public endpoint)
app.post('/api/ai-chat/conversations/:conversationId/feedback', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { messageId, feedback, messageContent, eventType, linkUrl, timestamp } = req.body;

    // Determine event type - either feedback (thumbs up/down) or link_click
    const analyticsEventType = eventType || 'feedback';
    
    // Build event data
    const eventData = {
      messageId,
      ...(feedback && { feedback }), // positive or negative
      ...(messageContent && { messageContent }),
      ...(linkUrl && { linkUrl }),
      timestamp: timestamp || new Date().toISOString(),
    };

    // Track feedback as analytics event - convert to MT timezone
    await pool.query(
      `INSERT INTO ai_conversation_analytics (conversation_id, event_type, event_data, timestamp)
       VALUES ($1, $2, $3, (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'America/Denver'))`,
      [
        conversationId,
        analyticsEventType,
        JSON.stringify(eventData),
      ]
    );

    // If it's feedback (thumbs up/down), also update the conversation's sentiment
    if (feedback && (feedback === 'positive' || feedback === 'negative')) {
      const sentimentScore = feedback === 'positive' ? 1.0 : -1.0;
      
      // Get current sentiment and update
      const convResult = await pool.query(
        `SELECT sentiment_score FROM ai_conversations WHERE id = $1`,
        [conversationId]
      );
      
      if (convResult.rows.length > 0) {
        const currentSentiment = convResult.rows[0].sentiment_score || 0;
        // Average with existing sentiment (simple approach)
        const newSentiment = (currentSentiment + sentimentScore) / 2;
        
        await pool.query(
          `UPDATE ai_conversations 
           SET sentiment_score = $1, 
               updated_at = (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'America/Denver')
           WHERE id = $2`,
          [newSentiment, conversationId]
        );
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('AI feedback save error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Update conversation with user info (public endpoint)
app.patch('/api/ai-chat/conversations/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { email, name, phone, company } = req.body;

    const updates = [];
    const values = [];
    let paramCount = 1;

    if (email) {
      updates.push(`email = $${paramCount++}`);
      values.push(email);
    }
    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (phone) {
      updates.push(`phone = $${paramCount++}`);
      values.push(phone);
    }
    if (company) {
      updates.push(`company = $${paramCount++}`);
      values.push(company);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'At least one field is required' });
    }

    updates.push(`updated_at = (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'America/Denver')`);
    values.push(conversationId);

    await pool.query(
      `UPDATE ai_conversations SET ${updates.join(', ')} WHERE id = $${paramCount}`,
      values
    );

    res.json({ success: true });
  } catch (error) {
    console.error('AI conversation update error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// End conversation (public endpoint)
app.post('/api/ai-chat/conversations/:conversationId/end', async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Get conversation start time
    const convResult = await pool.query(
      'SELECT started_at FROM ai_conversations WHERE id = $1',
      [conversationId]
    );

    if (convResult.rows.length === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const startedAt = new Date(convResult.rows[0].started_at);
    const endedAt = new Date();
    const durationSeconds = Math.floor((endedAt - startedAt) / 1000);

    // Update conversation - convert to MT timezone
    await pool.query(
      `UPDATE ai_conversations 
       SET status = 'ended',
           ended_at = (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'America/Denver'),
           conversation_duration_seconds = $1,
           updated_at = (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'America/Denver')
       WHERE id = $2`,
      [durationSeconds, conversationId]
    );

    // Track analytics event - convert to MT timezone
    await pool.query(
      `INSERT INTO ai_conversation_analytics (conversation_id, event_type, event_data, timestamp)
       VALUES ($1, 'conversation_ended', $2, (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'America/Denver'))`,
      [
        conversationId,
        JSON.stringify({
          durationSeconds,
          endedAt: endedAt.toISOString(),
        }),
      ]
    );

    res.json({ success: true, durationSeconds });
  } catch (error) {
    console.error('AI conversation end error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Get user analytics (admin)
app.get('/api/admin/user-analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Total clicks - handle case where table might not exist
    let totalClicksResult;
    try {
      totalClicksResult = await pool.query(
        'SELECT COUNT(*)::int as total FROM analytics_clicks'
      );
    } catch (err) {
      console.error('Error querying analytics_clicks:', err);
      totalClicksResult = { rows: [{ total: 0 }] };
    }

    // Clicks over time (last 30 days)
    let clicksOverTimeResult;
    try {
      clicksOverTimeResult = await pool.query(
        `SELECT DATE(timestamp)::text as date, COUNT(*)::int as count 
         FROM analytics_clicks 
         WHERE timestamp >= NOW() - INTERVAL '30 days'
         GROUP BY DATE(timestamp) 
         ORDER BY date ASC`
      );
    } catch (err) {
      console.error('Error querying clicks over time:', err);
      clicksOverTimeResult = { rows: [] };
    }

    // Clicks by element type
    let clicksByElementTypeResult;
    try {
      clicksByElementTypeResult = await pool.query(
        `SELECT element_type, COUNT(*)::int as count 
         FROM analytics_clicks 
         GROUP BY element_type 
         ORDER BY count DESC 
         LIMIT 20`
      );
    } catch (err) {
      console.error('Error querying clicks by element type:', err);
      clicksByElementTypeResult = { rows: [] };
    }

    // Top clicked links
    let topClickedLinksResult;
    try {
      topClickedLinksResult = await pool.query(
        `SELECT href, COUNT(*)::int as count, 
                COUNT(DISTINCT session_id)::int as unique_sessions
         FROM analytics_clicks 
         WHERE href IS NOT NULL 
         GROUP BY href 
         ORDER BY count DESC 
         LIMIT 20`
      );
    } catch (err) {
      console.error('Error querying top clicked links:', err);
      topClickedLinksResult = { rows: [] };
    }

    // Total page views
    let totalPageViewsResult;
    try {
      totalPageViewsResult = await pool.query(
        'SELECT COUNT(*)::int as total FROM analytics_page_views'
      );
    } catch (err) {
      console.error('Error querying total page views:', err);
      totalPageViewsResult = { rows: [{ total: 0 }] };
    }

    // Page views over time (last 30 days)
    let pageViewsOverTimeResult;
    try {
      pageViewsOverTimeResult = await pool.query(
        `SELECT DATE(timestamp)::text as date, COUNT(*)::int as count 
         FROM analytics_page_views 
         WHERE timestamp >= NOW() - INTERVAL '30 days'
         GROUP BY DATE(timestamp) 
         ORDER BY date ASC`
      );
    } catch (err) {
      console.error('Error querying page views over time:', err);
      pageViewsOverTimeResult = { rows: [] };
    }

    // Most viewed pages
    let mostViewedPagesResult;
    try {
      mostViewedPagesResult = await pool.query(
        `SELECT pathname, COUNT(*)::int as views, 
                COUNT(DISTINCT session_id)::int as unique_sessions,
                AVG(page_load_time)::numeric as avg_load_time
         FROM analytics_page_views 
         GROUP BY pathname 
         ORDER BY views DESC 
         LIMIT 20`
      );
    } catch (err) {
      console.error('Error querying most viewed pages:', err);
      mostViewedPagesResult = { rows: [] };
    }

    // Navigation flow
    let navigationFlowResult;
    try {
      navigationFlowResult = await pool.query(
        `SELECT from_path, to_path, COUNT(*)::int as count 
         FROM analytics_navigation 
         WHERE from_path IS NOT NULL AND to_path IS NOT NULL
         GROUP BY from_path, to_path 
         ORDER BY count DESC 
         LIMIT 50`
      );
    } catch (err) {
      console.error('Error querying navigation flow:', err);
      navigationFlowResult = { rows: [] };
    }

    // Average time on page
    let avgTimeOnPageResult;
    try {
      avgTimeOnPageResult = await pool.query(
        `SELECT 
            COALESCE(from_path, to_path) AS pathname,
            AVG(time_on_page)::numeric AS avg_time,
            COUNT(*)::int AS count
         FROM analytics_navigation 
         WHERE time_on_page IS NOT NULL 
           AND time_on_page > 0
           AND (from_path IS NOT NULL OR to_path IS NOT NULL)
         GROUP BY COALESCE(from_path, to_path)
         ORDER BY avg_time DESC 
         LIMIT 20`
      );
    } catch (err) {
      console.error('Error querying average time on page:', err);
      avgTimeOnPageResult = { rows: [] };
    }

    // Scroll depth statistics
    let scrollDepthStatsResult;
    try {
      scrollDepthStatsResult = await pool.query(
        `SELECT 
           COUNT(*) FILTER (WHERE scroll_depth >= 25)::int as reached_25,
           COUNT(*) FILTER (WHERE scroll_depth >= 50)::int as reached_50,
           COUNT(*) FILTER (WHERE scroll_depth >= 75)::int as reached_75,
           COUNT(*) FILTER (WHERE scroll_depth >= 100)::int as reached_100,
           AVG(scroll_depth)::numeric as avg_depth
         FROM analytics_scrolls`
      );
    } catch (err) {
      console.error('Error querying scroll depth stats:', err);
      scrollDepthStatsResult = { rows: [{}] };
    }

    // Form interactions
    let formInteractionsResult;
    try {
      formInteractionsResult = await pool.query(
        `SELECT form_id, action, COUNT(*)::int as count 
         FROM analytics_form_interactions 
         GROUP BY form_id, action 
         ORDER BY count DESC 
         LIMIT 30`
      );
    } catch (err) {
      console.error('Error querying form interactions:', err);
      formInteractionsResult = { rows: [] };
    }

    // User interaction types
    let userInteractionTypesResult;
    try {
      userInteractionTypesResult = await pool.query(
        `SELECT interaction_type, COUNT(*)::int as count 
         FROM analytics_user_interactions 
         GROUP BY interaction_type 
         ORDER BY count DESC`
      );
    } catch (err) {
      console.error('Error querying user interaction types:', err);
      userInteractionTypesResult = { rows: [] };
    }

    // Unique sessions
    let uniqueSessionsResult;
    try {
      uniqueSessionsResult = await pool.query(
        `SELECT COUNT(DISTINCT session_id)::int as total 
         FROM analytics_page_views 
         WHERE timestamp >= NOW() - INTERVAL '30 days'`
      );
    } catch (err) {
      console.error('Error querying unique sessions:', err);
      uniqueSessionsResult = { rows: [{ total: 0 }] };
    }

    // Sessions by hour
    let sessionsByHourResult;
    try {
      sessionsByHourResult = await pool.query(
        `SELECT EXTRACT(HOUR FROM timestamp)::int as hour, 
                COUNT(DISTINCT session_id)::int as sessions
         FROM analytics_page_views 
         WHERE timestamp >= NOW() - INTERVAL '7 days'
         GROUP BY EXTRACT(HOUR FROM timestamp)
         ORDER BY hour`
      );
    } catch (err) {
      console.error('Error querying sessions by hour:', err);
      sessionsByHourResult = { rows: [] };
    }

    res.json({
      totalClicks: totalClicksResult.rows[0]?.total || 0,
      clicksOverTime: clicksOverTimeResult.rows,
      clicksByElementType: clicksByElementTypeResult.rows,
      topClickedLinks: topClickedLinksResult.rows,
      totalPageViews: totalPageViewsResult.rows[0]?.total || 0,
      pageViewsOverTime: pageViewsOverTimeResult.rows,
      mostViewedPages: mostViewedPagesResult.rows,
      navigationFlow: navigationFlowResult.rows,
      avgTimeOnPage: avgTimeOnPageResult.rows,
      scrollDepthStats: scrollDepthStatsResult.rows[0] || {},
      formInteractions: formInteractionsResult.rows,
      userInteractionTypes: userInteractionTypesResult.rows,
      uniqueSessions: uniqueSessionsResult.rows[0]?.total || 0,
      sessionsByHour: sessionsByHourResult.rows
    });
  } catch (error) {
    console.error('User analytics error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      type: error.type,
      code: error.code
    });
    res.status(500).json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Ticket system endpoints

// Create ticket (portal)
app.post('/api/dashboard/tickets', authenticateToken, async (req, res) => {
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
      tags,
      assigned_to
    } = req.body;

    if (!subject || !description) {
      return res.status(400).json({ error: 'Subject and description are required' });
    }

    let assignedToId = null;
    if (assigned_to !== undefined && assigned_to !== null && assigned_to !== '') {
      assignedToId = parseInt(assigned_to, 10);
      if (Number.isNaN(assignedToId)) {
        return res.status(400).json({ error: 'Invalid assignee' });
      }

      // Clients can only assign tickets to admins
      const assigneeCheck = await pool.query(
        `SELECT id FROM users WHERE id = $1 AND role = 'ADMIN'`,
        [assignedToId]
      );

      if (assigneeCheck.rows.length === 0) {
        return res.status(400).json({ error: 'Assignee must be an administrator' });
      }
    }

    const result = await pool.query(
      `INSERT INTO tickets (
        user_id, subject, description, type, priority, status,
        assigned_to, project_name, email_request, category, due_date, estimated_hours, budget, tags
      )
       VALUES ($1, $2, $3, $4, $5, 'open', $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        req.user.id, 
        subject, 
        description, 
        type || 'support', 
        priority || 'medium',
        assignedToId,
        project_name || null,
        email_request || null,
        category || null,
        due_date || null,
        estimated_hours || null,
        budget || null,
        tags || null
      ]
    );

    const ticket = result.rows[0];

    if (assignedToId) {
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, message, link)
         VALUES ($1, 'ticket_assigned', 'New Ticket Assigned', $2, $3)`,
        [
          assignedToId,
          `A new ticket "${subject}" has been assigned to you`,
          `/admin/tickets/${ticket.id}`
        ]
      );
    }

    res.status(201).json({ ticket });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available assignees for client tickets (admins)
app.get('/api/dashboard/tickets/assignees', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email FROM users WHERE role = 'ADMIN' ORDER BY name ASC`
    );
    res.json({ assignees: result.rows });
  } catch (error) {
    console.error('Get ticket assignees error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user tickets (portal)
app.get('/api/dashboard/tickets', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        t.*, 
        au.name AS assigned_name,
        au.email AS assigned_email,
        au.role AS assigned_role
       FROM tickets t
       LEFT JOIN users au ON t.assigned_to = au.id
       WHERE t.user_id = $1
       ORDER BY t.created_at DESC`,
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
app.get('/api/dashboard/tickets/:id', authenticateToken, async (req, res) => {
  try {
    const ticketResult = await pool.query(
      `SELECT 
        t.*, 
        au.name AS assigned_name,
        au.email AS assigned_email,
        au.role AS assigned_role
       FROM tickets t
       LEFT JOIN users au ON t.assigned_to = au.id
       WHERE t.id = $1 AND t.user_id = $2`,
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
app.post('/api/dashboard/tickets/:id/messages', authenticateToken, async (req, res) => {
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

    // Get ticket info to create notification for admins
    const ticket = ticketResult.rows[0];
    // Create notification for assigned admin when client responds
    if (ticket.assigned_to) {
      const assigneeResult = await pool.query(
        `SELECT id, role FROM users WHERE id = $1`,
        [ticket.assigned_to]
      );

      if (assigneeResult.rows.length > 0) {
        const assignee = assigneeResult.rows[0];
        const link = assignee.role === 'ADMIN'
          ? `/admin/tickets/${req.params.id}`
          : `/portal/tickets/${req.params.id}`;

        await pool.query(
          `INSERT INTO notifications (user_id, type, title, message, link)
           VALUES ($1, 'ticket_message', 'New Message on Ticket', $2, $3)`,
          [
            assignee.id,
            `Client responded to ticket: "${ticket.subject}"`,
            link
          ]
        );
      }
    } else {
      const adminUsers = await pool.query("SELECT id FROM users WHERE role = 'ADMIN'");
      for (const admin of adminUsers.rows) {
        await pool.query(
          `INSERT INTO notifications (user_id, type, title, message, link)
           VALUES ($1, 'ticket_message', 'New Message on Ticket', $2, $3)`,
          [
            admin.id,
            `Client responded to ticket: "${ticket.subject}"`,
            `/admin/tickets/${req.params.id}`
          ]
        );
      }
    }

    res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload attachment (portal)
app.post('/api/dashboard/tickets/:id/attachments', authenticateToken, async (req, res) => {
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

// Create ticket (admin)
app.post('/api/admin/tickets', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Debug logging
    console.log('Admin ticket creation request:', {
      body: req.body,
      user: req.user
    });

    const {
      subject,
      description,
      type,
      priority,
      status,
      user_id,
      assigned_to,
      project_name,
      email_request,
      category,
      due_date,
      estimated_hours,
      actual_hours,
      budget,
      tags
    } = req.body;

    // Validate required fields
    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return res.status(400).json({ error: 'Subject is required and must be a non-empty string' });
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      return res.status(400).json({ error: 'Description is required and must be a non-empty string' });
    }

    if (user_id === undefined || user_id === null || user_id === '') {
      return res.status(400).json({ error: 'Ticket owner is required' });
    }

    const ownerId = parseInt(user_id, 10);
    if (Number.isNaN(ownerId) || ownerId <= 0) {
      return res.status(400).json({ error: 'Invalid ticket owner ID' });
    }

    const ownerResult = await pool.query(
      `SELECT id, role FROM users WHERE id = $1`,
      [ownerId]
    );

    if (ownerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket owner not found' });
    }

    let assignedToId = null;
    let assignedUserResult = null;
    if (assigned_to !== undefined && assigned_to !== null && assigned_to !== '') {
      assignedToId = parseInt(assigned_to, 10);
      if (Number.isNaN(assignedToId) || assignedToId <= 0) {
        return res.status(400).json({ error: 'Invalid assignee ID' });
      }

      assignedUserResult = await pool.query(
        `SELECT id, role FROM users WHERE id = $1`,
        [assignedToId]
      );

      if (assignedUserResult.rows.length === 0) {
        return res.status(404).json({ error: 'Assignee not found' });
      }
    }

    const statusValue = status || 'open';

    const result = await pool.query(
      `INSERT INTO tickets (
        user_id, subject, description, type, priority, status,
        assigned_to, project_name, email_request, category, due_date,
        estimated_hours, actual_hours, budget, tags
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
       RETURNING *`,
      [
        ownerId,
        subject,
        description,
        type || 'support',
        priority || 'medium',
        statusValue,
        assignedToId,
        project_name || null,
        email_request || null,
        category || null,
        due_date || null,
        estimated_hours || null,
        actual_hours || null,
        budget || null,
        tags || null
      ]
    );

    const ticket = result.rows[0];

    const ownerLink = ownerResult.rows[0].role === 'ADMIN'
      ? `/admin/tickets/${ticket.id}`
      : `/portal/tickets/${ticket.id}`;

    await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, link)
       VALUES ($1, 'ticket_created', 'New Ticket Created', $2, $3)`,
      [
        ownerId,
        `A new ticket "${subject}" has been created for you`,
        ownerLink
      ]
    );

    if (assignedToId && assignedToId !== ownerId) {
      const assignedUser = assignedUserResult ? assignedUserResult.rows[0] : null;
      const assignedLink = assignedUser && assignedUser.role === 'ADMIN'
        ? `/admin/tickets/${ticket.id}`
        : `/portal/tickets/${ticket.id}`;

      await pool.query(
        `INSERT INTO notifications (user_id, type, title, message, link)
         VALUES ($1, 'ticket_assigned', 'New Ticket Assigned', $2, $3)`,
        [
          assignedToId,
          `Ticket "${subject}" has been assigned to you`,
          assignedLink
        ]
      );
    }

    res.status(201).json({ ticket });
  } catch (error) {
    console.error('Admin create ticket error:', error);
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Internal server error';
    res.status(500).json({ 
      error: 'Internal server error',
      message: errorMessage
    });
  }
});

// Get all tickets (admin)
app.get('/api/admin/tickets', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        t.*, 
        u.name as user_name, 
        u.email as user_email, 
        u.phone as user_phone, 
        u.company_name as user_company,
        au.id as assigned_user_id,
        au.name as assigned_user_name,
        au.email as assigned_user_email,
        au.role as assigned_user_role
       FROM tickets t
       JOIN users u ON t.user_id = u.id
       LEFT JOIN users au ON t.assigned_to = au.id
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
      `SELECT 
        t.*, 
        u.name as user_name, 
        u.email as user_email,
        u.role as user_role,
        au.id as assigned_user_id,
        au.name as assigned_user_name,
        au.email as assigned_user_email,
        au.role as assigned_user_role
       FROM tickets t
       JOIN users u ON t.user_id = u.id
       LEFT JOIN users au ON t.assigned_to = au.id
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
    const {
      status,
      priority,
      assigned_to,
      project_name,
      email_request,
      category,
      due_date,
      estimated_hours,
      actual_hours,
      budget,
      tags
    } = req.body;

    const existingTicketResult = await pool.query(
      `SELECT * FROM tickets WHERE id = $1`,
      [req.params.id]
    );

    if (existingTicketResult.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const existingTicket = existingTicketResult.rows[0];

    let assignedToId = existingTicket.assigned_to;
    let newAssignedUser = null;
    let assignmentChanged = false;

    if (assigned_to !== undefined) {
      if (assigned_to === null || assigned_to === '' || assigned_to === 'null') {
        assignedToId = null;
      } else {
        const parsed = parseInt(assigned_to, 10);
        if (Number.isNaN(parsed)) {
          return res.status(400).json({ error: 'Invalid assignee' });
        }

        const assigneeResult = await pool.query(
          `SELECT id, role FROM users WHERE id = $1`,
          [parsed]
        );

        if (assigneeResult.rows.length === 0) {
          return res.status(404).json({ error: 'Assignee not found' });
        }

        assignedToId = parsed;
        newAssignedUser = assigneeResult.rows[0];
      }

      assignmentChanged = assignedToId !== existingTicket.assigned_to;
    }

    const updates = [];
    const values = [];
    let paramCount = 1;

    const addUpdate = (column, value) => {
      updates.push(`${column} = $${paramCount++}`);
      values.push(value);
    };

    if (status !== undefined) {
      addUpdate('status', status);
    }
    if (priority !== undefined) {
      addUpdate('priority', priority);
    }
    if (assigned_to !== undefined) {
      addUpdate('assigned_to', assignedToId);
    }
    if (project_name !== undefined) {
      addUpdate('project_name', project_name || null);
    }
    if (email_request !== undefined) {
      addUpdate('email_request', email_request || null);
    }
    if (category !== undefined) {
      addUpdate('category', category || null);
    }
    if (due_date !== undefined) {
      addUpdate('due_date', due_date || null);
    }
    if (estimated_hours !== undefined) {
      addUpdate('estimated_hours', estimated_hours === '' ? null : estimated_hours);
    }
    if (actual_hours !== undefined) {
      addUpdate('actual_hours', actual_hours === '' ? null : actual_hours);
    }
    if (budget !== undefined) {
      addUpdate('budget', budget === '' ? null : budget);
    }
    if (tags !== undefined) {
      addUpdate('tags', tags || null);
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

    const ticket = result.rows[0];

    // Notify ticket owner
    if (ticket.user_id) {
      let notificationMessage = `Your ticket "${ticket.subject}" has been updated`;

      if (status) {
        notificationMessage = `Your ticket "${ticket.subject}" status changed to ${ticket.status}`;
      } else if (assignmentChanged && assignedToId) {
        notificationMessage = `Your ticket "${ticket.subject}" has been reassigned`;
      }

      await pool.query(
        `INSERT INTO notifications (user_id, type, title, message, link)
         VALUES ($1, 'ticket_update', 'Ticket Updated', $2, $3)`,
        [
          ticket.user_id,
          notificationMessage,
          `/portal/tickets/${req.params.id}`
        ]
      );
    }

    // Notify new assignee if applicable
    if (assignmentChanged && assignedToId) {
      if (!newAssignedUser) {
        const assigneeLookup = await pool.query(
          `SELECT id, role FROM users WHERE id = $1`,
          [assignedToId]
        );
        newAssignedUser = assigneeLookup.rows[0] || null;
      }

      if (newAssignedUser) {
        const link = newAssignedUser.role === 'ADMIN'
          ? `/admin/tickets/${ticket.id}`
          : `/portal/tickets/${ticket.id}`;

        await pool.query(
          `INSERT INTO notifications (user_id, type, title, message, link)
           VALUES ($1, 'ticket_assigned', 'Ticket Assigned', $2, $3)`,
          [
            assignedToId,
            `Ticket "${ticket.subject}" has been assigned to you`,
            link
          ]
        );
      }
    } else if (ticket.assigned_to) {
      const assigneeLookup = await pool.query(
        `SELECT id, role FROM users WHERE id = $1`,
        [ticket.assigned_to]
      );

      if (assigneeLookup.rows.length > 0) {
        const assignee = assigneeLookup.rows[0];
        const link = assignee.role === 'ADMIN'
          ? `/admin/tickets/${ticket.id}`
          : `/portal/tickets/${ticket.id}`;

        let assignedMessage = `Ticket "${ticket.subject}" has been updated`;
        if (status) {
          assignedMessage = `Ticket "${ticket.subject}" status changed to ${ticket.status}`;
        }

        await pool.query(
          `INSERT INTO notifications (user_id, type, title, message, link)
           VALUES ($1, 'ticket_update', 'Ticket Updated', $2, $3)`,
          [
            ticket.assigned_to,
            assignedMessage,
            link
          ]
        );
      }
    }

    // Notify previous assignee if ticket was unassigned or reassigned
    if (assignmentChanged && existingTicket.assigned_to && existingTicket.assigned_to !== assignedToId) {
      const previousAssigneeLookup = await pool.query(
        `SELECT id, role FROM users WHERE id = $1`,
        [existingTicket.assigned_to]
      );

      const previousAssignee = previousAssigneeLookup.rows[0];
      if (previousAssignee) {
        const previousLink = previousAssignee.role === 'ADMIN'
          ? `/admin/tickets/${ticket.id}`
          : `/portal/tickets/${ticket.id}`;

        await pool.query(
          `INSERT INTO notifications (user_id, type, title, message, link)
           VALUES ($1, 'ticket_update', 'Ticket Unassigned', $2, $3)`,
          [
            previousAssignee.id,
            `Ticket "${ticket.subject}" is no longer assigned to you`,
            previousLink
          ]
        );
      }
    }

    res.json({ ticket });
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

    // Get ticket info to create notification for client
    const ticketResult = await pool.query('SELECT * FROM tickets WHERE id = $1', [req.params.id]);
    if (ticketResult.rows.length > 0) {
      const ticket = ticketResult.rows[0];
      // Create notification for ticket owner (client) when admin responds
      if (ticket.user_id) {
        await pool.query(
          `INSERT INTO notifications (user_id, type, title, message, link)
           VALUES ($1, 'ticket_message', 'New Message on Ticket', $2, $3)`,
          [
            ticket.user_id,
            `Admin responded to your ticket: "${ticket.subject}"`,
            `/portal/tickets/${req.params.id}`
          ]
        );
      }
    }

    res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Notification Endpoints

// Get notifications (portal)
app.get('/api/dashboard/notifications', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       AND (is_dismissed = false OR is_dismissed IS NULL)
       AND (remind_at IS NULL OR remind_at <= CURRENT_TIMESTAMP)
       ORDER BY created_at DESC 
       LIMIT 50`,
      [req.user.id]
    );
    
    res.json({ notifications: result.rows });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark notification as read (portal)
app.patch('/api/dashboard/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ notification: result.rows[0] });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark all notifications as read (portal)
app.patch('/api/dashboard/notifications/read-all', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE user_id = $1 AND is_read = false`,
      [req.user.id]
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remind me later (portal)
app.patch('/api/dashboard/notifications/:id/remind', authenticateToken, async (req, res) => {
  try {
    const { remind_at } = req.body;
    
    if (!remind_at) {
      return res.status(400).json({ error: 'remind_at is required' });
    }
    
    const result = await pool.query(
      `UPDATE notifications 
       SET remind_at = $1 
       WHERE id = $2 AND user_id = $3 
       RETURNING *`,
      [remind_at, req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ notification: result.rows[0] });
  } catch (error) {
    console.error('Remind me later error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dismiss notification (portal)
app.patch('/api/dashboard/notifications/:id/dismiss', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE notifications 
       SET is_dismissed = true 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ notification: result.rows[0] });
  } catch (error) {
    console.error('Dismiss notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get notifications (admin)
app.get('/api/admin/notifications', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       AND (is_dismissed = false OR is_dismissed IS NULL)
       AND (remind_at IS NULL OR remind_at <= CURRENT_TIMESTAMP)
       ORDER BY created_at DESC 
       LIMIT 50`,
      [req.user.id]
    );
    
    res.json({ notifications: result.rows });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark notification as read (admin)
app.patch('/api/admin/notifications/:id/read', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ notification: result.rows[0] });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark all notifications as read (admin)
app.patch('/api/admin/notifications/read-all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await pool.query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE user_id = $1 AND is_read = false`,
      [req.user.id]
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remind me later (admin)
app.patch('/api/admin/notifications/:id/remind', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { remind_at } = req.body;
    
    if (!remind_at) {
      return res.status(400).json({ error: 'remind_at is required' });
    }
    
    const result = await pool.query(
      `UPDATE notifications 
       SET remind_at = $1 
       WHERE id = $2 AND user_id = $3 
       RETURNING *`,
      [remind_at, req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ notification: result.rows[0] });
  } catch (error) {
    console.error('Remind me later error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dismiss notification (admin)
app.patch('/api/admin/notifications/:id/dismiss', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE notifications 
       SET is_dismissed = true 
       WHERE id = $1 AND user_id = $2 
       RETURNING *`,
      [req.params.id, req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    
    res.json({ notification: result.rows[0] });
  } catch (error) {
    console.error('Dismiss notification error:', error);
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

// Catch-all handler: serve index.html for client-side routing
// This must be after all API routes
app.get('*', (req, res, next) => {
  // Skip API routes - they should have been handled above
  if (req.path.startsWith('/api/')) {
    return next();
  }
  
  // Serve index.html for all non-API routes to enable client-side routing
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading application');
    }
  });
});

// Handle unhandled errors to prevent server crashes
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Log but don't exit - let the server continue running
  // Database connection errors are common and should be handled gracefully
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // For database connection errors, log and continue
  // For other critical errors, we might want to exit
  if (error.code === 'EADDRNOTAVAIL' || error.message?.includes('database') || error.message?.includes('pool')) {
    console.error('Database connection error detected. Server will continue but database operations may fail.');
    return; // Don't exit for database errors
  }
  // For other uncaught exceptions, exit after logging
  console.error('Critical error detected. Exiting...');
  process.exit(1);
});

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 5001;
const MAX_PORT_ATTEMPTS = 5;

const startServer = (port = DEFAULT_PORT, attemptsRemaining = MAX_PORT_ATTEMPTS) => {
  const server = app
    .listen(port, () => {
      if (port !== DEFAULT_PORT) {
        console.warn(
          `⚠️  Default port ${DEFAULT_PORT} was unavailable. Server is now running on port ${port}.`
        );
      } else {
        console.log(`Server running on port ${port}`);
      }
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE' && attemptsRemaining > 0) {
        const nextPort = port + 1;
        console.warn(
          `⚠️  Port ${port} is already in use. Trying port ${nextPort}... (${attemptsRemaining} attempts left)`
        );
        startServer(nextPort, attemptsRemaining - 1);
      } else {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
      }
    });

  return server;
};

startServer();
