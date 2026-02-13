// Shared cart utilities (public site variant)

export function loadCart() {
    try {
        const raw = localStorage.getItem('tacoCart');
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveCart(cart) {
    localStorage.setItem('tacoCart', JSON.stringify(cart || []));
}

export function getCartCount(cart) {
    return (cart || []).reduce((sum, item) => sum + (Number(item?.quantity) || 0), 0);
}

export function getCartTotal(cart) {
    return (cart || []).reduce(
        (sum, item) => sum + (Number(item?.price) || 0) * (Number(item?.quantity) || 0),
        0
    );
}

export function updateCartBadge(cart = null) {
    const currentCart = cart ?? loadCart();
    const count = getCartCount(currentCart);
    document.querySelectorAll('.cart-count').forEach(el => {
        // Hide the badge when cart is empty (prevents showing a red "0")
        if (count <= 0) {
            el.textContent = '';
            el.style.display = 'none';
            return;
        }

        // Explicitly show as flex because the badge is a flex circle in CSS
        el.style.display = 'flex';
        el.textContent = String(count);
    });
}

export function changeQuantity(cart, itemId, delta) {
    const id = String(itemId);
    const next = Array.isArray(cart) ? [...cart] : [];
    const idx = next.findIndex(i => String(i?.id) === id);

    if (idx === -1) return next;

    const currentQty = Number(next[idx]?.quantity) || 0;
    const updatedQty = currentQty + Number(delta || 0);

    if (updatedQty <= 0) {
        next.splice(idx, 1);
        return next;
    }

    next[idx] = { ...next[idx], quantity: updatedQty };
    return next;
}

