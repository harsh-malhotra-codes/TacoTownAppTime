const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
let supabaseAdmin = null;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

if (supabaseUrl && supabaseServiceRoleKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        if (!supabase && !supabaseAdmin) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Database not configured'
                })
            };
        }

        if (event.httpMethod === 'POST') {
            // Save order
            const body = JSON.parse(event.body);
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
            } = body;

            if (!orderId || !customerName || !orderItems || !totalAmount) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        message: 'Missing required fields'
                    })
                };
            }

            let { data, error } = supabaseAdmin ? await supabaseAdmin
                .from('orders')
                .insert([
                    {
                        order_id: orderId,
                        customer_name: customerName,
                        customer_email: customerEmail,
                        customer_phone: customerPhone,
                        order_items: orderItems,
                        total_amount: totalAmount,
                        status: status
                    }
                ])
                .select() : { data: null, error: new Error('Admin client not available') };

            if (error && supabase) {
                ({ data, error } = await supabase
                    .from('orders')
                    .insert([
                        {
                            order_id: orderId,
                            customer_name: customerName,
                            customer_email: customerEmail,
                            customer_phone: customerPhone,
                            order_items: orderItems,
                            total_amount: totalAmount,
                            status: status
                        }
                    ])
                    .select());
            }

            if (error) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        message: 'Failed to save order'
                    })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Order saved successfully',
                    data: data
                })
            };
        }

        if (event.httpMethod === 'GET') {
            // Get all orders
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        message: 'Failed to fetch orders'
                    })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    data: data
                })
            };
        }

        if (event.httpMethod === 'PUT') {
            // Update order status
            const body = JSON.parse(event.body);
            const { status } = body;
            const orderId = event.path.split('/').pop(); // Assuming path is /orders/:orderId

            if (!status) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        message: 'Status is required'
                    })
                };
            }

            const { data, error } = await supabase
                .from('orders')
                .update({ status: status })
                .eq('order_id', orderId)
                .select();

            if (error) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        message: 'Failed to update order'
                    })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Order updated successfully',
                    data: data
                })
            };
        }

        if (event.httpMethod === 'DELETE') {
            // Delete order
            const orderId = event.path.split('/').pop();

            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('order_id', orderId);

            if (error) {
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        message: 'Failed to delete order'
                    })
                };
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Order deleted successfully'
                })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Method not allowed'
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Internal server error'
            })
        };
    }
};
