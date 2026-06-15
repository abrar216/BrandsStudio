// Cart Utility for LocalStorage persistence in SPA Inertia

export const getCart = () => {
    if (typeof window === 'undefined') return [];
    try {
        const cart = localStorage.getItem('bs_cart');
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        return [];
    }
};

export const saveCart = (cart) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('bs_cart', JSON.stringify(cart));
    // Dispatch a custom event to notify other components of cart changes
    window.dispatchEvent(new Event('cart-updated'));
};

export const addToCart = (product, variant = null, quantity = 1) => {
    const cart = getCart();
    const variantId = variant ? variant.id : null;
    
    const existingIndex = cart.findIndex(
        item => item.id === product.id && item.variant_id === variantId
    );

    const price = product.discount_price ?? product.price;

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            slug: product.slug,
            sku: variant ? variant.sku : product.sku,
            price: price,
            image: product.image ?? null,
            size: variant ? variant.size : null,
            color: variant ? variant.color : null,
            variant_id: variantId,
            quantity: quantity,
            max_stock: variant ? variant.stock_quantity : product.stock_quantity
        });
    }

    saveCart(cart);
};

export const removeFromCart = (productId, variantId = null) => {
    let cart = getCart();
    cart = cart.filter(item => !(item.id === productId && item.variant_id === variantId));
    saveCart(cart);
};

export const updateQuantity = (productId, variantId = null, quantity) => {
    const cart = getCart();
    const index = cart.findIndex(item => item.id === productId && item.variant_id === variantId);
    
    if (index > -1) {
        const item = cart[index];
        const newQty = Math.max(1, Math.min(quantity, item.max_stock));
        cart[index].quantity = newQty;
        saveCart(cart);
    }
};

export const clearCart = () => {
    saveCart([]);
};

export const getCartCount = () => {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
};

export const getCartTotal = () => {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};
