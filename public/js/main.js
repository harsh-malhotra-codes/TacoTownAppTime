import { API_URL } from './config.js';

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
const deliveryModal = document.getElementById('delivery-modal');
const closeModal = document.querySelector('.close-modal');
const deliveryForm = document.getElementById('delivery-form');


// Import menu data
let menuData = {};

import { loadCart as loadCartUtil, saveCart as saveCartUtil, updateCartBadge } from './cart-utils.js';

// Shopping cart
let cart = [];

function goToCartPage() {
    window.location.href = 'cart.html';
}

// Initialize the app
async function init() {

    // Event listeners
    setupEventListeners();

    // Initialize animations
    initAnimations();

    // Load cart from localStorage if available
    loadCart();

    // Update cart UI
    updateCartUI();

    // Load menu data from API
    await loadMenuData();
    
    // Initialize previews if they exist
    if (typeof displayCategoryPreview === 'function') {
        displayCategoryPreview();
    }
}

// Fetch menu data from backend
async function loadMenuData() {
    try {
        const response = await fetch(`${API_URL}/api/menu`);
        const result = await response.json();
        if (result.success) {
            menuData = result.data;
        }
    } catch (error) {
        console.error('Error loading menu data:', error);
    }
}

// Display menu items
function displayMenuItems() {
    menuItemsContainer.innerHTML = '';

    // Create category sections
    for (const category in menuData) {
        const categorySection = document.createElement('div');
        categorySection.className = 'menu-category';
        categorySection.id = category;

        // Add category heading
        const categoryHeading = document.createElement('h2');
        categoryHeading.className = 'category-heading';
        categoryHeading.textContent = menuData[category].name;
        categorySection.appendChild(categoryHeading);

        // Create items grid
        const itemsGrid = document.createElement('div');
        itemsGrid.className = 'menu-grid';

        // Add items to the grid
        menuData[category].items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = `menu-item ${item.popular ? 'popular' : ''}`;

            menuItem.innerHTML = `
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
            `;

            itemsGrid.appendChild(menuItem);
        });

        categorySection.appendChild(itemsGrid);
        menuItemsContainer.appendChild(categorySection);
    }

    // Add event listeners to all add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Display category preview cards
function displayCategoryPreview() {
    const previewContainer = document.getElementById('category-preview');
    if (!previewContainer) return;

    previewContainer.innerHTML = '';

    // Define the main categories to display on homepage
    const mainCategories = ['tacos', 'burgers', 'pizzas', 'fries', 'shakes', 'combos'];

    mainCategories.forEach(categoryKey => {
        const category = menuData[categoryKey];
        if (!category) return;

        // Get first 2 items for preview
        const previewItems = category.items.slice(0, 2);

        const previewCard = document.createElement('div');
        previewCard.className = 'category-preview-card';
        previewCard.dataset.category = categoryKey;

        previewCard.innerHTML = `
            <div class="category-preview-header">
                <span class="category-preview-emoji">${category.name.split(' ')[0]}</span>
                <h3 class="category-preview-title">${category.name.split(' ').slice(1).join(' ')}</h3>
            </div>
            <div class="category-preview-items">
                ${previewItems.map(item => `
                    <div class="category-preview-item">
                        <span class="category-preview-item-name">${item.name}</span>
                        <span class="category-preview-item-price">₹${item.price}</span>
                    </div>
                `).join('')}
            </div>
            <div class="category-preview-footer">
                <button class="view-all-btn" data-category="${categoryKey}">View All</button>
            </div>
        `;

        previewContainer.appendChild(previewCard);
    });

    // Add event listeners for category cards and view all buttons
    document.querySelectorAll('.category-preview-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('view-all-btn')) {
                const category = card.dataset.category;
                showCategoryMenu(category);
            }
        });
    });

    document.querySelectorAll('.view-all-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const category = btn.dataset.category;
            showCategoryMenu(category);
        });
    });
}

// Show full menu for a specific category
function showCategoryMenu(categoryKey) {
    const category = menuData[categoryKey];
    if (!category) return;

    // Hide preview and show full menu
    document.getElementById('category-preview').style.display = 'none';
    document.getElementById('menu-items').style.display = 'block';

    // Update section title
    document.querySelector('.section-title').textContent = category.name;
    document.querySelector('.section-subtitle').textContent = `Explore our delicious ${category.name.toLowerCase()}`;

    // Display only the selected category
    const menuItemsContainer = document.getElementById('menu-items');
    menuItemsContainer.innerHTML = '';

    const categorySection = document.createElement('div');
    categorySection.className = 'menu-category';
    categorySection.id = categoryKey;

    // Create items grid
    const itemsGrid = document.createElement('div');
    itemsGrid.className = 'menu-grid';

    // Add items to the grid
    category.items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = `menu-item ${item.popular ? 'popular' : ''}`;

        menuItem.innerHTML = `
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
        `;

        itemsGrid.appendChild(menuItem);
    });

    categorySection.appendChild(itemsGrid);
    menuItemsContainer.appendChild(categorySection);

    // Add event listeners to all add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // Add back button
    const backButton = document.createElement('button');
    backButton.className = 'back-to-preview-btn';
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Categories';
    backButton.style.cssText = `
        position: absolute;
        top: 2rem;
        left: 2rem;
        background: #FFD700;
        color: #000;
        border: none;
        padding: 0.8rem 1.5rem;
        border-radius: 50px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
    `;
    backButton.addEventListener('click', () => {
        document.getElementById('category-preview').style.display = 'grid';
        document.getElementById('menu-items').style.display = 'none';
        document.querySelector('.section-title').textContent = 'Our Delicious Menu';
        document.querySelector('.section-subtitle').textContent = 'Explore our wide variety of delicious dishes';
    });

    const menuSection = document.querySelector('.menu-section .container');
    menuSection.insertBefore(backButton, menuSection.firstChild);
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
    
    // Close modal
    closeModal.addEventListener('click', () => {
        deliveryModal.classList.remove('active');
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === deliveryModal) {
            deliveryModal.classList.remove('active');
        }
    });
    
    // Handle cart item quantity changes
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
    
    // Handle checkout
    checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (cart.length > 0) {
            // Save default customer data to localStorage for payment page
            const customerData = {
                name: 'HARSH MALHOTRA',
                phone: '7889848844',
                email: '',
                address: 'new plot state motor garage, jammu',
                landmark: 'baddvvvvvds',
                pincode: '144411'
            };
            localStorage.setItem('tacoCustomerData', JSON.stringify(customerData));
            window.location.href = 'payment.html';
        } else {
            alert('Your cart is empty. Add some tacos first!');
        }
    });
    
    // Handle delivery form submission
    deliveryForm.addEventListener('submit', handleDeliverySubmit);
    
    // Navbar scroll effect removed - navbar is now static
    
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

// Toggle cart (disabled) -> redirect to cart.html
function toggleCart() {
    goToCartPage();
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
                quantity: 1
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
    cartTotal.textContent = total.toFixed(2);
    
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

// Handle delivery form submission
function handleDeliverySubmit(e) {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('delivery-name').value;
    const phone = document.getElementById('delivery-phone').value;
    const email = document.getElementById('delivery-email').value;
    const address = document.getElementById('delivery-address').value;
    const landmark = document.getElementById('delivery-landmark').value;
    const pincode = document.getElementById('delivery-pincode').value;

    // Validate form
    if (!name || !phone || !email || !address || !pincode) {
        showNotification('Please fill in all required fields.');
        return;
    }

    // Store customer data in localStorage to use on payment page
    const customerData = { name, phone, email, address, landmark, pincode };
    localStorage.setItem('tacoCustomerData', JSON.stringify(customerData));

    // Close modal and redirect to payment page
    deliveryModal.classList.remove('active');
    window.location.href = 'payment.html';
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
    
    // Parallax effect for taco animation
    const tacoLayers = document.querySelectorAll('.taco-layer');
    const scrollPosition = window.scrollY;
    
    tacoLayers.forEach(layer => {
        const speed = parseFloat(layer.dataset.speed);
        const yPos = -(scrollPosition * speed);
        layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
        
        // Fade in layers as user scrolls
        if (scrollPosition > 100) {
            layer.style.opacity = '1';
        } else {
            layer.style.opacity = '0';
        }
    });
}

// Initialize animations
function initAnimations() {
    // GSAP animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate menu items
    gsap.utils.toArray('.menu-item').forEach((item, i) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            delay: i * 0.1
        });
    });
    

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
