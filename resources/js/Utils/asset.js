/**
 * Robust helper to resolve media and static asset paths under Laravel subdirectory deployments.
 * Auto-prepends the appropriate XAMPP base URL context from Laravel's config or global window scope.
 */
export const getAssetUrl = (path) => {
    if (!path || typeof path !== 'string') return '';
    
    // Return immediately if it is already a full URL or data URI
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
    }

    // Extract raw base64 or external URLs if they got prepended (e.g. storage/data:image...)
    if (path.includes('data:') || path.includes('http://') || path.includes('https://')) {
        const dataIndex = path.indexOf('data:');
        if (dataIndex !== -1) return path.slice(dataIndex);
        
        const httpIndex = path.indexOf('http://');
        if (httpIndex !== -1) return path.slice(httpIndex);
        
        const httpsIndex = path.indexOf('https://');
        if (httpsIndex !== -1) return path.slice(httpsIndex);
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
            if (typeof img === 'string') {
                let cleanImg = img.startsWith('/') ? img.slice(1) : img;
                if (cleanImg.startsWith('storage/')) {
                    cleanImg = cleanImg.slice(8);
                }
                return cleanImg;
            }
            return String(img);
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
        if (typeof img === 'string') {
            let cleanImg = img.startsWith('/') ? img.slice(1) : img;
            if (cleanImg.startsWith('storage/')) {
                cleanImg = cleanImg.slice(8);
            }
            return cleanImg;
        }
        return String(img);
    }
    
    return '';
};
