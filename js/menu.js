// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');
const hamburger = document.querySelector('.hamburger');
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCart = document.querySelector('.close-cart');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.getElementById('cart-total-amount');
const checkoutBtn = document.querySelector('.checkout-btn');
const categoryAccordion = document.getElementById('category-accordion');
const deliveryModal = document.getElementById('delivery-modal');
const closeModal = document.querySelector('.close-modal');
const deliveryForm = document.getElementById('delivery-form');

// Import menu data
import { menuData } from './menu-data-new.js';

import { loadCart as loadCartUtil, saveCart as saveCartUtil, updateCartBadge } from './cart-utils.js';

// Shopping cart
let cart = [];

function goToCartPage() {
    window.location.href = 'cart.html';
}

// Handle delivery form submission
function handleDeliverySubmit(e) {
    e.preventDefault();

    // Check if delivery form elements exist
    const nameField = document.getElementById('delivery-name');
    const phoneField = document.getElementById('delivery-phone');
    const addressField = document.getElementById('delivery-address');
    const landmarkField = document.getElementById('delivery-landmark');
    const pincodeField = document.getElementById('delivery-pincode');

    if (!nameField || !phoneField || !addressField || !pincodeField) {
        console.warn('Delivery form elements not found, proceeding to payment page');
        window.location.href = 'payment.html';
        return;
    }

    // Get form data
    const name = nameField.value;
    const phone = phoneField.value;
    const address = addressField.value;
    const landmark = landmarkField ? landmarkField.value : '';
    const pincode = pincodeField.value;

    // Save customer data to localStorage for payment page
    const customerData = {
        name: name,
        phone: phone,
        email: '', // Email not collected in delivery form
        address: address,
        landmark: landmark,
        pincode: pincode
    };
    localStorage.setItem('tacoCustomerData', JSON.stringify(customerData));

    // Close modal if it exists
    if (deliveryModal) {
        deliveryModal.classList.remove('active');
    }

    // Redirect to payment page
    window.location.href = 'payment.html';
}

// Initialize the menu page
function init() {
    // Display full menu accordion
    displayFullMenu();

    // Event listeners
    setupEventListeners();

    // Load cart from localStorage if available
    loadCart();

    // Update cart UI
    updateCartUI();
}

// Display full menu with accordion
function displayFullMenu() {
    if (!categoryAccordion) {
        console.warn('Category accordion element not found');
        return;
    }

    categoryAccordion.innerHTML = '';

    // Define the order of categories
    const categoryOrder = ['tacos', 'burgers', 'pizzas', 'fries', 'sandwiches', 'wraps', 'momos', 'pasta', 'breads', 'maggi', 'shakes', 'smoothies', 'coffee', 'mocktails', 'combos'];

    categoryOrder.forEach(categoryKey => {
        const category = menuData[categoryKey];
        if (!category) return;

        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item';
        accordionItem.dataset.category = categoryKey;

        accordionItem.innerHTML = `
            <div class="accordion-header">
                <div class="accordion-title">
                    <span class="accordion-emoji">${category.name.split(' ')[0]}</span>
                    <h3>${category.name}</h3>
                    <span class="item-count">${category.items.length} items</span>
                </div>
                <button class="accordion-toggle">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            <div class="accordion-content">
                <div class="menu-grid">
                    ${category.items.map(item => `
                        <div class="menu-item ${item.popular ? 'popular' : ''}">
                            <div class="item-content">
                                <h3>${item.name}</h3>
                                ${item.description ? `<p class="item-desc">${item.description}</p>` : ''}
                                <div class="item-footer">
                                    <span class="price">₹${item.price}</span>
                                    <button class="add-to-cart" data-id="${item.id}">
                                        Add to Cart <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                            ${item.popular ? '<span class="popular-badge">Popular</span>' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        categoryAccordion.appendChild(accordionItem);
    });

    // Add event listeners for accordion
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', toggleAccordion);
    });

    // Add event listeners for add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Toggle accordion
function toggleAccordion(e) {
    const header = e.currentTarget;
    const item = header.parentElement;
    const content = item.querySelector('.accordion-content');
    const toggleIcon = header.querySelector('.accordion-toggle i');

    // Close other accordions
    document.querySelectorAll('.accordion-item.active').forEach(activeItem => {
        if (activeItem !== item) {
            activeItem.classList.remove('active');
            const activeContent = activeItem.querySelector('.accordion-content');
            const activeIcon = activeItem.querySelector('.accordion-toggle i');
            activeContent.style.maxHeight = null;
            activeIcon.style.transform = 'rotate(0deg)';
        }
    });

    // Toggle current accordion
    item.classList.toggle('active');

    if (item.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
        toggleIcon.style.transform = 'rotate(180deg)';
    } else {
        content.style.maxHeight = null;
        toggleIcon.style.transform = 'rotate(0deg)';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking on a nav link
    if (navLinks) {
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                }
            });
        });
    }

    // Cart button/icon -> cart.html
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            goToCartPage();
        });
    }

    const cartToggleBtn = document.getElementById('cart-toggle');
    if (cartToggleBtn) {
        cartToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goToCartPage();
        });
    }
    if (closeCart) {
        closeCart.addEventListener('click', (e) => {
            e.preventDefault();
            goToCartPage();
        });
    }

    // Sidebar cart UI disabled (no drawer open/close behavior)

    // Handle cart item quantity changes
    if (cartSidebar) {
        cartSidebar.addEventListener('click', (e) => {
            const target = e.target;
            const cartItem = target.closest('.cart-item');

            if (!cartItem) return;

            const id = cartItem.dataset.id;

            if (target.classList.contains('decrease')) {
                updateCartItemQuantity(id, -1);
            } else if (target.classList.contains('increase')) {
                updateCartItemQuantity(id, 1);
            } else if (target.classList.contains('remove-item')) {
                removeFromCart(id);
            }
        });
    }

    // Handle checkout
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (cart.length > 0) {
                window.location.href = 'payment.html'; // Proceed to payment without setting default data
            } else {
                alert('Your cart is empty. Add some tacos first!');
            }
        });
    }

    // Close modal
    if (closeModal && deliveryModal) {
        closeModal.addEventListener('click', () => {
            deliveryModal.classList.remove('active');
        });
    }

    // Close modal when clicking outside
    if (deliveryModal) {
        window.addEventListener('click', (e) => {
            if (e.target === deliveryModal) {
                deliveryModal.classList.remove('active');
            }
        });
    }

    // Handle delivery form submission
    if (deliveryForm) {
        deliveryForm.addEventListener('submit', handleDeliverySubmit);
    }

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', handleScroll);
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
    if (hamburger) {
        hamburger.classList.toggle('active');
    }
}

// Toggle cart (disabled) -> redirect to cart.html
function toggleCart() {
    goToCartPage();
}

// Add item to cart
function addToCart(e) {
    e.stopPropagation();
    const id = e.currentTarget.dataset.id;

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        // Find the item in menuData
        let menuItem = null;
        for (const category in menuData) {
            menuItem = menuData[category].items.find(item => item.id === id);
            if (menuItem) break;
        }

        if (menuItem) {
            cart.push({
                id: menuItem.id,
                name: menuItem.name,
                price: menuItem.price,
                quantity: 1,
                image: menuItem.image || '' // Ensure image is saved
            });
        }
    }

    updateCartUI();
    saveCart();

    // Show added to cart feedback
    showNotification('Added to cart!');
}

// Update cart item quantity
function updateCartItemQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(id);
    } else {
        updateCartUI();
        saveCart();
    }
}

// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
    saveCart();
}

// Update cart UI
function updateCartUI() {
    // Update cart items
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn increase">+</button>
                        </div>
                    </div>
                    <i class="fas fa-times remove-item"></i>
                </div>
            `).join('');
        }
    }

    // Update cart total
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toFixed(2);
    }

    // Update checkout button
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }

    // Update cart badge count
    updateCartBadge(cart);
}

// Save cart to localStorage
function saveCart() {
    saveCartUtil(cart);
    updateCartBadge(cart);
}

// Load cart from localStorage
function loadCart() {
    cart = loadCartUtil();
    updateCartBadge(cart);
}

// Show notification
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');

    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.classList.add('show');

    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Handle scroll events
function handleScroll() {
    // Navbar scroll effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Initialize the menu page when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background-color: #4CAF50;
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transition: transform 0.3s ease-in-out;
    }

    .notification.show {
        transform: translateX(-50%) translateY(0);
    }
`;
document.head.appendChild(notificationStyles);
