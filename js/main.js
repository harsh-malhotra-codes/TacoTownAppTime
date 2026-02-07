// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelector('.nav-links');
const hamburger = document.querySelector('.hamburger');
const cartIcon = document.querySelector('.cart-icon');
const cartSidebar = document.querySelector('.cart-sidebar');
const checkoutBtn = document.querySelector('.checkout-btn');


// Import menu data
import { menuData } from './menu-data-new.js';

// Shopping cart
let cart = [];

// Initialize the app
function init() {
    // DOM elements that might not exist on all pages
    // Event listeners
    setupEventListeners();

    // Initialize animations
    initAnimations();

    // Load cart from localStorage if available
    loadCart();

    // Update cart UI
    updateCartUI();
}

// Setup event listeners
function setupEventListeners() {
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // Cart toggle
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
    }
    const closeCart = document.querySelector('.close-cart');
    if (closeCart) {
        closeCart.addEventListener('click', toggleCart);
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        if (cartSidebar && !cartSidebar.contains(e.target) && cartIcon && !cartIcon.contains(e.target)) {
            cartSidebar.classList.remove('active');
        }
    });
    
    // Close modal
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            const deliveryModal = document.getElementById('delivery-modal');
            if (deliveryModal) deliveryModal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const deliveryModal = document.getElementById('delivery-modal');
        if (e.target === deliveryModal) {
            deliveryModal.classList.remove('active');
        }
    });
    
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

    // Handle checkout if the button exists
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (cart.length > 0) {
                // Redirect to payment page
                window.location.href = 'payment.html';
            } else {
                alert('Your cart is empty. Add some tacos first!');
            }
        });
    }
    
    // Delivery form submission removed - payment functionality disabled
    
    // Navbar scroll effect
    window.addEventListener('scroll', handleScroll);
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Show menu section if it's hidden
                if (targetId === '#menu') {
                    targetElement.style.display = 'block';
                }
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Toggle cart
function toggleCart() {
    cartSidebar.classList.toggle('active');
}

// Add item to cart
function addToCart(id) {
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
                image: menuItem.image || ''
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
    const cartItems = document.querySelector('.cart-items');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const cartTotal = document.getElementById('cart-total-amount');
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        checkoutBtn.disabled = true;
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
        
        checkoutBtn.disabled = false;
    }
    
    // Update cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) {
        cartTotal.textContent = total.toFixed(2);
    }
    
    // Update cart count in header
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = cartCount);
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('tacoCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('tacoCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
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
    if (navbar && window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else if (navbar) {
        navbar.classList.remove('scrolled');
    }
}

// Initialize animations
function initAnimations() {
    // GSAP animations
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Animate hero content
        gsap.from('.hero-title', { opacity: 0, y: 30, duration: 0.8, delay: 0.2 });
        gsap.from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.8, delay: 0.4 });
        gsap.from('.hero-buttons', { opacity: 0, y: 30, duration: 0.8, delay: 0.6 });
        gsap.from('.hero-features', { opacity: 0, y: 30, duration: 0.8, delay: 0.8 });
        gsap.from('.hero-image', { opacity: 0, y: 30, duration: 0.8, delay: 0.5 });

        // Animate other sections
        gsap.utils.toArray('.menu-item-card, .review-card, .menu-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                delay: i * 0.05
            });
        });
    }
}

// Initialize the app when DOM is loaded
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
