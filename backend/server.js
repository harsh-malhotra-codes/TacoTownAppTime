const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Load environment variables from root
const menuData = require('./menu-data'); // Import the single source of truth

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔧 Supabase Configuration:');
console.log('URL:', supabaseUrl);
console.log('Anon Key exists:', !!supabaseAnonKey);
console.log('Service Role Key exists:', !!supabaseServiceRoleKey);

// Initialize Supabase clients only if environment variables are available
let supabase = null;
let supabaseAdmin = null;

if (supabaseUrl && supabaseAnonKey) {
    // Regular client for user operations (subject to RLS)
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

if (supabaseUrl && supabaseServiceRoleKey) {
    // Admin client with service role key (bypasses RLS)
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

// Test Supabase connection on startup
if (supabase) {
    console.log('📡 Testing Supabase connection...');
    supabase.from('orders').select('count', { count: 'exact', head: true })
        .then(({ error }) => {
            if (error) console.error('❌ Supabase Connection Error:', error.message);
            else console.log('✅ Supabase Connected Successfully');
        })
        .catch(err => console.error('❌ Supabase Connection Failed (Network/URL):', err.message));
}

// Middleware
app.use(cors());
app.use(express.json()); // Use built-in express.json()
app.use(express.urlencoded({ extended: true })); // Use built-in express.urlencoded()

// Store for orders (in production, use a database)
const orders = new Map();

// Routes

// API Endpoint to get Menu Data
app.get('/api/menu', (req, res) => {
    res.json({
        success: true,
        data: menuData
    });
});

// Save order to Supabase
app.post('/api/orders', async (req, res) => {
    try {
        if (!supabase && !supabaseAdmin) {
            return res.status(500).json({
                success: false,
                message: 'Database not configured'
            });
        }

        const {
            orderId,
            customerName,
            customerEmail,
            customerPhone,
            customerPincode,
            customerAddress,
            customerLandmark,
            orderItems,
            totalAmount,
            status = 'confirmed'
        } = req.body;

        if (!orderId || !customerName || !orderItems || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Try with supabaseAdmin first (bypasses RLS)
        let { data, error } = supabaseAdmin ? await supabaseAdmin
            .from('orders')
            .insert([
                {
                    order_id: orderId,
                    customer_name: customerName,
                    customer_email: customerEmail,
                    customer_phone: customerPhone,
                    customer_address: customerAddress,
                    customer_pincode: customerPincode,
                    customer_landmark: customerLandmark,
                    order_items: orderItems,
                    total_amount: totalAmount,
                    status: status
                }
            ])
            .select() : { data: null, error: new Error('Admin client not available') };

        // If admin fails, try regular client
        if (error && supabase) {
            console.log('Admin insert failed, trying regular client:', error.message);
            ({ data, error } = await supabase
                .from('orders')
                .insert([
                    {
                        order_id: orderId,
                        customer_name: customerName,
                        customer_email: customerEmail,
                        customer_phone: customerPhone,
                        customer_address: customerAddress,
                        customer_pincode: customerPincode,
                        customer_landmark: customerLandmark,
                        order_items: orderItems,
                        total_amount: totalAmount,
                        status: status
                    }
                ])
                .select());
        }

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to save order'
            });
        }

        console.log('Order saved to Supabase:', data);
        res.json({
            success: true,
            message: 'Order saved successfully',
            data: data
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Get all orders from Supabase
app.get('/api/orders', async (req, res) => {
    try {
        // Use admin client if available to bypass RLS, otherwise regular client
        const client = supabaseAdmin || supabase;

        if (!client) {
            return res.status(500).json({
                success: false,
                message: 'Database not configured'
            });
        }

        const { data, error } = await client
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch orders'
            });
        }

        res.json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Update order status
app.put('/api/orders/:orderId', async (req, res) => {
    try {
        // Use admin client if available to bypass RLS, otherwise regular client
        const client = supabaseAdmin || supabase;

        if (!client) {
            return res.status(500).json({
                success: false,
                message: 'Database not configured'
            });
        }

        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const { data, error } = await client
            .from('orders')
            .update({ status: status })
            .eq('order_id', orderId)
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update order'
            });
        }

        res.json({
            success: true,
            message: 'Order updated successfully',
            data: data
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Delete order
app.delete('/api/orders/:orderId', async (req, res) => {
    try {
        // Use admin client if available to bypass RLS, otherwise regular client
        const client = supabaseAdmin || supabase;

        if (!client) {
            return res.status(500).json({
                success: false,
                message: 'Database not configured'
            });
        }

        const { orderId } = req.params;

        const { error } = await client
            .from('orders')
            .delete()
            .eq('order_id', orderId);

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to delete order'
            });
        }

        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Contact form submission
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }

    console.log(`Contact form message from ${name} (${email}): ${message}`);

    res.json({
        success: true,
        message: 'Message received successfully! We will get back to you soon.'
    });
});



// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Explicitly serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Serve admin.html
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'admin.html'));
});

// For Vercel deployment - export the app
module.exports = app;

// For local development
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
