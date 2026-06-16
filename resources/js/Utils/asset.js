/**
 * Robust helper to resolve media and static asset paths under Laravel subdirectory deployments.
 * Auto-prepends the appropriate XAMPP base URL context from Laravel's config or global window scope.
 */
export const getAssetUrl = (path) => {
    if (!path) return '';
    
    // Return immediately if it's already a full URL or data URI
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
    }
    
    // Retrieve base asset URL from global window object or fallback to root domain slash
    const base = window.assetUrl || '/';
    
    // Ensure the path doesn't start with a slash to avoid double-slashes during concatenation
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    return `${base}${cleanPath}`;
};

/**
 * Robust helper to retrieve a valid image path from a product object.
 * Filters out invalid/placeholder values like null, "0", "null", "undefined".
 */
export const getProductImageUrl = (product) => {
    if (!product) return '';
    
    const candidates = [product.image, product.main_image];
    for (const img of candidates) {
        if (img && img !== '0' && img !== 0 && img !== 'null' && img !== 'undefined') {
            // Remove leading slash if any
            return img.startsWith('/') ? img.slice(1) : img;
        }
    }
    
    return '';
};

/**
 * Robust helper to retrieve a valid image path from a category object.
 * Filters out invalid/placeholder values like null, "0", "null", "undefined".
 */
export const getCategoryImageUrl = (category) => {
    if (!category) return '';
    
    const img = category.image;
    if (img && img !== '0' && img !== 0 && img !== 'null' && img !== 'undefined') {
        // Remove leading slash if any
        return img.startsWith('/') ? img.slice(1) : img;
    }
    
    return '';
};
