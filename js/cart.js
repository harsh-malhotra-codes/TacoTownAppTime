// Cart Page JavaScript (reuses tacoCart localStorage structure)

import { loadCart, saveCart, updateCartBadge, getCartTotal, changeQuantity } from './cart-utils.js';

function formatINR(amount) {
    return `₹${Number(amount || 0).toFixed(2)}`;
}

function updateCartCount(cart) {
    updateCartBadge(cart);
}

function renderCart() {
    const cart = loadCart();
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const proceedBtn = document.getElementById('proceed-to-payment');

    if (!itemsEl) return;

    if (cart.length === 0) {
        itemsEl.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (totalEl) totalEl.textContent = formatINR(0);
        if (proceedBtn) proceedBtn.disabled = true;
        return;
    }

    itemsEl.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-details">
                <h4>${item.name ?? ''}</h4>
                <div class="cart-item-price">${formatINR((Number(item.price) || 0) * (Number(item.quantity) || 0))}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" type="button">-</button>
                    <span class="quantity">${item.quantity ?? 0}</span>
                    <button class="quantity-btn increase" type="button">+</button>
                </div>
            </div>
            <i class="fas fa-times remove-item" role="button" aria-label="Remove"></i>
        </div>
    `).join('');

    const total = getCartTotal(cart);
    if (totalEl) totalEl.textContent = formatINR(total);
    if (proceedBtn) proceedBtn.disabled = false;

    updateCartCount(cart);
}

function attachCartItemHandlers() {
    const itemsEl = document.getElementById('cart-items');
    if (!itemsEl) return;

    itemsEl.addEventListener('click', (e) => {
        const target = e.target;
        const row = target.closest('.cart-item');
        if (!row) return;

        const id = row.dataset.id;
        let cart = loadCart();

        if (target.classList.contains('decrease')) {
            cart = changeQuantity(cart, id, -1);
        } else if (target.classList.contains('increase')) {
            cart = changeQuantity(cart, id, 1);
        } else if (target.classList.contains('remove-item')) {
            cart = cart.filter(i => String(i?.id) !== String(id));
        } else {
            return;
        }

        saveCart(cart);
        updateCartBadge(cart);
        renderCart();
    });
}

function setupProceedButton() {
    const proceedBtn = document.getElementById('proceed-to-payment');
    if (!proceedBtn) return;

    proceedBtn.addEventListener('click', () => {
        const cart = loadCart();
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items to your cart first.');
            return;
        }
        window.location.href = 'payment.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount(loadCart());
    renderCart();
    attachCartItemHandlers();
    setupProceedButton();
});

