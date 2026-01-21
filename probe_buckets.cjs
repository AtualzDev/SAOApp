
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://atzluthrvichnysqechc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0emx1dGhydmljaG55c3FlY2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4OTUzNTQsImV4cCI6MjA3ODQ3MTM1NH0.rRkK7aajwch6eMwsEu-NlYZxvwb5yMO3Hx3MaMmJXAU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBuckets() {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) {
        console.error('Error listing buckets:', error);
    } else {
        console.log('Buckets:', data);
        // If 'avatars' doesn't exist, try to create it (might fail with anon key but worth a try to see error)
        const avatars = data.find(b => b.name === 'avatars');
        if (!avatars) {
            console.log("Bucket 'avatars' not found. Attempting creation...");
            const { data: newData, error: newError } = await supabase.storage.createBucket('avatars', { public: true });
            if (newError) console.error("Creation failed:", newError);
            else console.log("Created 'avatars' bucket:", newData);
        }
    }
}

checkBuckets();
