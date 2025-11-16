// Supabase JS Client (optional - for using Supabase features)
// Your Express app uses pg library for direct PostgreSQL connections
// This file is for reference if you want to use Supabase JS client for additional features

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL || 'https://gmzepabvzmdeprtoqxis.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.warn('⚠️  SUPABASE_KEY or SUPABASE_ANON_KEY not set. Supabase JS client will not work.');
}

// Create Supabase client
// Note: This is separate from your PostgreSQL connection (pg library)
// Use this if you want to use Supabase features like:
// - Real-time subscriptions
// - Storage
// - Auth helpers
// - Row Level Security policies
export const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Example usage:
// import { supabase } from './supabaseClient.js';
// 
// const { data, error } = await supabase
//   .from('users')
//   .select('*')
//   .limit(10);

export const supabaseMcp = supabaseKey ? createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
}) : null; 