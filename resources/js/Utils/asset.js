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
