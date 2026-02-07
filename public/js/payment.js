import { API_URL } from './config.js';

// Payment Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize payment page
    initPaymentPage();

    // Setup event listeners
    setupPaymentEventListeners();
});

function initPaymentPage() {
    // Load cart items from localStorage
    loadCartItems();

    // Update order summary
    updateOrderSummary();

    // Generate order ID
    generateOrderId();
}

function setupPaymentEventListeners() {
    // Confirm order button
    const confirmBtn = document.getElementById('confirm-order-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', handleOrderConfirmation);
    }

    // Modal close button
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeConfirmationModal);
    }

    // Continue shopping button
    const continueBtn = document.getElementById('continue-shopping-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', handleContinueExplore);
    }



    // Close modal when clicking outside
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeConfirmationModal();
            }
        });
    }

    // Form validation
    const customerForm = document.getElementById('customer-form');
    if (customerForm) {
        customerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            validateForm();
        });
    }
}

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('tacoCart')) || [];
    const orderItemsContainer = document.getElementById('order-items');

    if (!orderItemsContainer) return;

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }

    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="order-item-details">
                <div class="order-item-info">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                </div>
            </div>
            <div class="order-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');
}

function loadCustomerData() {
    const customerData = JSON.parse(localStorage.getItem('tacoCustomerData'));

    if (customerData) {
        // Populate form fields with saved customer data
        const nameField = document.getElementById('name');
        const phoneField = document.getElementById('phone');
        const emailField = document.getElementById('email');
        const pincodeField = document.getElementById('pincode');
        const addressField = document.getElementById('address');
        const landmarkField = document.getElementById('landmark');

        if (nameField && customerData.name) nameField.value = customerData.name;
        if (phoneField && customerData.phone) phoneField.value = customerData.phone;
        if (emailField && customerData.email) emailField.value = customerData.email;
        if (pincodeField && customerData.pincode) pincodeField.value = customerData.pincode;
        if (addressField && customerData.address) addressField.value = customerData.address;
        if (landmarkField && customerData.landmark) landmarkField.value = customerData.landmark;
    }
}

function updateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('tacoCart')) || [];

    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Delivery fee (free if subtotal >= 300)
    const deliveryFee = subtotal >= 300 ? 0 : 30;

    // Total
    const total = subtotal + deliveryFee;

    // Update DOM elements
    const subtotalEl = document.getElementById('subtotal');
    const deliveryFeeEl = document.getElementById('delivery-fee');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
    if (deliveryFeeEl) deliveryFeeEl.textContent = `₹${deliveryFee.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₹${total.toFixed(2)}`;

    // Update free delivery note
    const freeDeliveryNote = document.querySelector('.free-delivery-note');
    if (freeDeliveryNote) {
        if (subtotal >= 300) {
            freeDeliveryNote.innerHTML = '<i class="fas fa-check-circle"></i> Congratulations! You have free delivery!';
            freeDeliveryNote.style.color = '#4CAF50';
            freeDeliveryNote.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
            freeDeliveryNote.style.borderColor = 'rgba(76, 175, 80, 0.2)';
        } else {
            const remaining = (300 - subtotal).toFixed(2);
            freeDeliveryNote.innerHTML = `<i class="fas fa-info-circle"></i> Add ₹${remaining} more for free delivery!`;
        }
    }
}

function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    const orderId = `TTC${timestamp}${random}`;
    const orderIdEl = document.getElementById('order-id');

    if (orderIdEl) {
        orderIdEl.textContent = orderId;
    }

    return orderId;
}

function validateForm() {
    const form = document.getElementById('customer-form');
    if (!form) return true;

    const requiredFields = ['name', 'phone', 'email', 'pincode', 'address'];
    let isValid = true;

    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value.trim()) {
            field.style.borderColor = '#ff5252';
            isValid = false;
        } else if (field) {
            field.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    });

    // Email validation
    const email = document.getElementById('email');
    if (email && email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            email.style.borderColor = '#ff5252';
            isValid = false;
        }
    }

    // Phone validation
    const phone = document.getElementById('phone');
    if (phone && phone.value) {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone.value.replace(/\s/g, ''))) {
            phone.style.borderColor = '#ff5252';
            isValid = false;
        }
    }

    return isValid;
}

function handleOrderConfirmation() {
    // Validate form
    if (!validateForm()) {
        alert('Please fill in all required fields correctly.');
        return;
    }

    // Check if cart is empty
    const cart = JSON.parse(localStorage.getItem('tacoCart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart first.');
        return;
    }

    // Generate order ID for this order
    const currentOrderId = generateOrderId();

    // Show confirmation modal
    showConfirmationModal();

    // Don't clear cart here - let Continue Explore handle it
    // localStorage.removeItem('tacoCart');

    // Update cart UI
    updateCartUI();
}

async function handleContinueExplore() {
    // Get current order information
    const cart = JSON.parse(localStorage.getItem('tacoCart')) || [];

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal >= 300 ? 0 : 30;
    const total = subtotal + deliveryFee;

    // Get customer data from form
    const customerName = document.getElementById('name').value;
    const customerPhone = document.getElementById('phone').value;
    const customerEmail = document.getElementById('email').value;
    const customerPincode = document.getElementById('pincode').value;
    const customerAddress = document.getElementById('address').value;
    const customerLandmark = document.getElementById('landmark').value;

    // Get order ID from modal
    const orderIdEl = document.getElementById('order-id');
    const orderId = orderIdEl ? orderIdEl.textContent : generateOrderId();

    // Create order object
    const orderData = {
        order_id: orderId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_pincode: customerPincode,
        customer_address: customerAddress,
        customer_landmark: customerLandmark,
        order_items: cart,
        total_amount: total,
        status: 'confirmed',
        created_at: new Date().toISOString()
    };

    // FIRST: Try to save to Supabase (backend) - PRIMARY METHOD
    console.log('Attempting to save order to Supabase...');
    const backendSuccess = await saveOrderToBackend(orderId, orderData);

    if (backendSuccess) {
        console.log('✅ Order saved to Supabase successfully');
        showNotification('Order placed successfully!', 'success');
    } else {
        console.log('❌ Backend failed, saving to localStorage as backup');
        // FALLBACK: Save to localStorage only if backend fails
        const existingOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
        existingOrders.push(orderData);
        localStorage.setItem('adminOrders', JSON.stringify(existingOrders));
        showNotification('Order saved locally (backend unavailable)', 'warning');
    }

    // Clear cart after saving order
    localStorage.removeItem('tacoCart');

    // Update cart UI
    updateCartUI();

    // Close modal
    closeConfirmationModal();

    // Redirect to homepage
    window.location.href = 'index.html';
}

function showConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeConfirmationModal() {
    const modal = document.getElementById('confirmation-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function updateCartUI() {
    // Update cart count in navigation
    const cart = JSON.parse(localStorage.getItem('tacoCart')) || [];
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartCountEls = document.querySelectorAll('.cart-count');
    cartCountEls.forEach(el => {
        el.textContent = cartCount;
    });

    // Update cart sidebar if it exists
    const cartItemsEl = document.querySelector('.cart-items');
    const cartTotalEl = document.getElementById('cart-total-amount');

    if (cartItemsEl && cart.length === 0) {
        cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartTotalEl) cartTotalEl.textContent = '₹0.00';
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        ${message}
    `;

    // Style based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#f44336';
    } else {
        notification.style.backgroundColor = '#2196F3';
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add notification styles if not already present
if (!document.querySelector('#notification-styles')) {
    const notificationStyles = document.createElement('style');
    notificationStyles.id = 'notification-styles';
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateX(400px);
            transition: transform 0.3s ease-in-out;
            max-width: 400px;
            font-weight: 500;
        }

        .notification.show {
            transform: translateX(0);
        }

        .notification i {
            font-size: 1.2rem;
        }

        .empty-cart {
            text-align: center;
            color: #ccc;
            font-style: italic;
            padding: 2rem;
        }

        /* Form validation styles */
        .form-group input:invalid,
        .form-group textarea:invalid {
            border-color: #ff5252;
        }

        .form-group input:valid,
        .form-group textarea:valid {
            border-color: #4CAF50;
        }
    `;
    document.head.appendChild(notificationStyles);
}

// Handle page navigation from cart
function handleCartNavigation() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from') === 'cart') {
        // Came from cart, ensure cart data is loaded
        loadCartItems();
        updateOrderSummary();
    }
}

// Save order to backend
async function saveOrderToBackend(orderId, orderData) {
    try {
        // Use the orderData passed from handleContinueExplore
        const backendOrderData = {
            orderId: orderId,
            customerName: orderData.customer_name,
            customerEmail: orderData.customer_email,
            customerPhone: orderData.customer_phone,
            customerPincode: orderData.customer_pincode,
            customerAddress: orderData.customer_address,
            customerLandmark: orderData.customer_landmark,
            orderItems: orderData.order_items,
            totalAmount: orderData.total_amount,
            status: 'confirmed'
        };

        console.log('Sending order to backend:', backendOrderData);

        // Use the centralized API_URL from config.js
        const endpoint = `${API_URL}/api/orders`;
        console.log('Using endpoint:', endpoint);

        // Send to backend
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(backendOrderData)
        });

        const result = await response.json();

        if (result.success) {
            console.log('✅ Order saved to backend successfully:', result.data);
            return true;
        } else {
            console.error('❌ Failed to save order to backend:', result.message);
            return false;
        }
    } catch (error) {
        console.error('❌ Error saving order to backend:', error);
        return false;
    }
}

// Call on page load
handleCartNavigation();
