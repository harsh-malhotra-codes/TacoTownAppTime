const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseKey);
console.log('Key value:', supabaseKey ? '***' + supabaseKey.slice(-10) : 'undefined');

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection by trying to get orders
async function testConnection() {
    try {
        console.log('Testing orders table...');
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .limit(1);

        if (error) {
            console.log('Error:', error.message);
            console.log('This might mean the orders table doesn\'t exist yet.');
            console.log('You need to create the orders table in your Supabase dashboard.');
        } else {
            console.log('✅ Supabase connection successful!');
            console.log('Orders found:', data.length);
        }
    } catch (err) {
        console.error('Connection failed:', err.message);
    }
}

testConnection();
