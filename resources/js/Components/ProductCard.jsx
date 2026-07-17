import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Heart, ShoppingBag } from 'lucide-react';
import { addToCart } from '../Utils/cart';
import { getAssetUrl, getProductImageUrl } from '../Utils/asset';

export default function ProductCard({ product, currency, inWishlist = false }) {
    if (!product) return null;
    
    const { props } = usePage();
    const currencySymbol = currency || props.settings?.currency || 'Rs.';
    const isDiscounted = product.discount_price && Number(product.discount_price) > 0 && Number(product.discount_price) < Number(product.price);
    
    const [wishlisted, setWishlisted] = useState(inWishlist);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        setWishlisted(inWishlist);
    }, [inWishlist]);

    // Gather unique sizes from variants
    const sizes = product.variants 
        ? [...new Set(product.variants.map(v => v.size).filter(Boolean))]
        : [];

    // Extract product images to find secondary hover image
    const mainImg = getProductImageUrl(product);
    let gallery = [];
    if (product.gallery_images) {
        try {
            const parsed = typeof product.gallery_images === 'string'
                ? JSON.parse(product.gallery_images)
                : product.gallery_images;
            if (Array.isArray(parsed)) {
                gallery = parsed.map(path => {
                    if (!path || path === '0' || path === 'null' || path.includes('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=')) return null;
                    let cleanPath = path.startsWith('/') ? path.slice(1) : path;
                    if (cleanPath.startsWith('storage/')) cleanPath = cleanPath.slice(8);
                    return cleanPath;
                }).filter(Boolean);
            }
        } catch (e) {
            console.error("Failed to parse gallery_images", e);
        }
    }
    
    // Fallback to related product.images if gallery_images is empty
    if (gallery.length === 0 && product.images && Array.isArray(product.images)) {
        gallery = product.images.map(img => {
            const path = img.image_path;
            if (!path || path === '0' || path === 'null' || path.includes('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=')) return null;
            let cleanPath = path.startsWith('/') ? path.slice(1) : path;
            if (cleanPath.startsWith('storage/')) cleanPath = cleanPath.slice(8);
            return cleanPath;
        }).filter(Boolean);
    }
    
    const secondaryImages = gallery.filter(g => g !== mainImg);
    const secondImg = secondaryImages[0] || null;

    const handleAddToCartClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // If product has sizes, trigger Quick View modal to choose a size
        if (sizes.length > 0) {
            window.dispatchEvent(new CustomEvent('trigger-quick-view', { detail: { product } }));
        } else {
            const selectedVariant = product.variants && product.variants.length > 0 
                ? product.variants[0] 
                : null;
            addToCart(product, selectedVariant, 1);
            
            // Dispatch cart update event to open slide-out drawer
            window.dispatchEvent(new CustomEvent('cart-updated', { detail: { product } }));
        }
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!props.auth?.user) {
            router.get(route('login'), { redirect: 'wishlist' });
            return;
        }
        
        const prevStatus = wishlisted;
        setWishlisted(!wishlisted);
        
        router.post(route('wishlist.toggle'), { product_id: product.id }, {
            preserveScroll: true,
            onError: () => {
                setWishlisted(prevStatus);
            }
        });
    };

    return (
        <div 
            className="group relative bg-white border border-stone-200/50 rounded-none overflow-hidden transition-all duration-300 flex flex-col h-full text-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container Section */}
            <div className="relative aspect-[3/4] bg-stone-50 overflow-hidden select-none border-b border-stone-100">
                <Link 
                    href={product.slug ? route('product.show', { slug: product.slug }) : '#'} 
                    className="block h-full font-sans"
                >
                    {mainImg ? (
                        <img 
                            src={getAssetUrl(
                                isHovered && secondImg 
                                    ? (secondImg.startsWith('data:') ? secondImg : `storage/${secondImg}`)
                                    : (mainImg.startsWith('data:') ? mainImg : `storage/${mainImg}`)
                            )} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 relative">
                            <span className="text-[60px] opacity-10 select-none font-black text-slate-800">BS</span>
                        </div>
                    )}
                </Link>

                {/* Diners Style Left Red Tag */}
                {isDiscounted && (
                    <span className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 z-10 rounded-none">
                        -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                    </span>
                )}

                {/* Diners Style Top Right Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-2.5 right-2.5 z-30 w-7.5 h-7.5 bg-white/90 border border-stone-200/60 hover:bg-white text-stone-500 hover:text-red-600 transition-all flex items-center justify-center rounded-none focus:outline-none"
                    title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    <Heart 
                        size={12} 
                        fill={wishlisted ? "currentColor" : "none"} 
                        className={`transition-colors duration-200 ${wishlisted ? "text-red-500" : "text-stone-500"}`} 
                    />
                </button>

                {/* Diners Style Floating Round Add to Cart Icon Button (Bottom Left) */}
                <button
                    onClick={handleAddToCartClick}
                    className="absolute bottom-3 left-3 z-30 w-9 h-9 rounded-full bg-white/90 border border-stone-200/60 shadow-md hover:bg-black hover:text-white text-stone-700 transition-all flex items-center justify-center focus:outline-none"
                    title="Add to Bag"
                >
                    <ShoppingBag size={14} className="stroke-[1.75]" />
                </button>
            </div>

            {/* Info Section - Diners Styled Centered Info */}
            <div className="p-3 flex-grow flex flex-col justify-between bg-white text-center">
                <div className="space-y-1 mt-1">
                    {/* Name */}
                    <Link href={product.slug ? route('product.show', { slug: product.slug }) : '#'}>
                        <h4 className="text-[11px] font-black text-stone-850 hover:text-black transition-colors uppercase tracking-wider line-clamp-2 min-h-[32px] px-1 leading-normal">
                            {product.name}
                        </h4>
                    </Link>

                    {/* Price Grid */}
                    <div className="flex items-center justify-center space-x-2 pt-1.5">
                        {isDiscounted ? (
                            <>
                                <span className="text-[11px] text-stone-400 line-through">
                                    {currencySymbol}{Number(product.price).toLocaleString('en-US')}
                                </span>
                                <span className="text-[11.5px] font-black text-red-650">
                                    {currencySymbol}{Number(product.discount_price).toLocaleString('en-US')}
                                </span>
                            </>
                        ) : (
                            <span className="text-[11.5px] font-black text-stone-850">
                                {currencySymbol}{Number(product.price).toLocaleString('en-US')}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
