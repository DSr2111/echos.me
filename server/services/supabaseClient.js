const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Load environment variables

// Access the environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and ANON KEY must be set in the .env file');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
