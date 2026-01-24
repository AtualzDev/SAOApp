
const supabase = require('../config/supabaseClient');

exports.createUser = async (req, res) => {
    const { email, password, fullName, role, organizationId } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Note: Ideally, use supabase.auth.admin.createUser for admin actions 
        // to avoid logging in the new user context.
        // This requires the SERVICE_ROLE_KEY.
        const { data, error } = await supabase.auth.admin.createUser({
            email,
            password,
            user_metadata: { full_name: fullName, role },
            email_confirm: true // Auto confirm if created by admin
        });

        if (error) throw error;

        // If 'profiles' table insertion is not handled by a Trigger, do it here manually
        // Check if we need to insert into profiles
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .upsert({
                    id: data.user.id,
                    email: email,
                    full_name: fullName,
                    role: role,
                    organization_id: organizationId || null,
                    updated_at: new Date()
                });

            if (profileError) {
                console.error('Error creating profile:', profileError);
                // We might warn but return success for the user creation
            }
        }

        res.status(201).json({ message: 'User created successfully', user: data.user });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.listUsers = async (req, res) => {
    try {
        const { data: users, error } = await supabase.auth.admin.listUsers();
        if (error) throw error;
        res.json(users);
    } catch (error) {
        // Fallback if Service Key not valid for admin list, try querying profiles public table
        try {
            const { data: profiles, error: profileError } = await supabase.from('profiles').select('*');
            if (profileError) throw profileError;
            res.json({ users: profiles, note: 'Fetched from profiles table' });
        } catch (e) {
            res.status(500).json({ error: error.message });
        }
    }
};
