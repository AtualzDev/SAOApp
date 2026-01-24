
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '../.env' }); // Adjust path if .env is in backend root or project root. Assuming backend root for now, but let's try standard first.
// Actually, I'll put .env in backend/ for the backend to use.

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase URL or Key missing in environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
