
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://atzluthrvichnysqechc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0emx1dGhydmljaG55c3FlY2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTUzNTQsImV4cCI6MjA3ODQ3MTM1NH0.rRkK7aajwch6eMwsEu-NlYZxvwb5yMO3Hx3MaMmJXAU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function signUp() {
    const { data, error } = await supabase.auth.signUp({
        email: 'dougls333@gmail.com',
        password: '123456',
    });
    if (error) {
        console.error('Error creating user:', error.message);
    } else {
        console.log('User created successfully with ID:', data.user?.id);
    }
}

signUp();
