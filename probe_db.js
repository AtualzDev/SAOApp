
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://atzluthrvichnysqechc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0emx1dGhydmljaG55c3FlY2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTUzNTQsImV4cCI6MjA3ODQ3MTM1NH0.rRkK7aajwch6eMwsEu-NlYZxvwb5yMO3Hx3MaMmJXAU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function probe() {
    console.log("Probing 'profiles' table...");
    const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*').limit(5);
    console.log("Profiles Data:", profiles);
    console.log("Profiles Error:", profilesError);

    console.log("\nProbing 'users' table (sometimes exposed directly)...");
    const { data: users, error: usersError } = await supabase.from('users').select('*').limit(5);
    console.log("Users Data:", users);
    console.log("Users Error:", usersError);
}

probe();
