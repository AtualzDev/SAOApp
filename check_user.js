
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://atzluthrvichnysqechc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0emx1dGhydmljaG55c3FlY2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTUzNTQsImV4cCI6MjA3ODQ3MTM1NH0.rRkK7aajwch6eMwsEu-NlYZxvwb5yMO3Hx3MaMmJXAU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUser() {
    const emailToCheck = 'douglas-oliveira12@hotmail.com';
    console.log(`Checking for user: ${emailToCheck}`);

    // Check if profile exists
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', emailToCheck);

    if (error) {
        console.log('Error searching profiles:', error);
    } else {
        console.log('Found in profiles table:', profiles);
        if (profiles.length === 0) {
            console.log("User is NOT in profiles table.");
        } else {
            console.log("User IS in profiles table.");
        }
    }
}

checkUser();
