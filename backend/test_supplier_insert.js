
require('dotenv').config({ path: './.env' }); // Adjust if needed, assuming running from backend root
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
    console.log('Testing connection to Supabase...');
    console.log('URL:', supabaseUrl);

    const supplier = {
        nome: "Test Supplier " + Date.now(),
        cnpj_cpf: "00000000000",
        observacao: "Test insertion script"
    };

    console.log('Attempting to insert:', supplier);

    const { data, error } = await supabase
        .from('fornecedores')
        .insert([supplier])
        .select();

    if (error) {
        console.error('❌ Insert failed!');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Full Error:', JSON.stringify(error, null, 2));
    } else {
        console.log('✅ Insert successful!');
        console.log('Inserted Data:', data);
    }
}

testInsert();
