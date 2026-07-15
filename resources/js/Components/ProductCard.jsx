import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { addToCart } from '../Utils/cart';
import { getAssetUrl, getProductImageUrl } from '../Utils/asset';

export default function ProductCard({ product, currency, inWishlist = false }) {
    if (!product) return null;
    
    const { props } = usePage();
    const currencySymbol = currency || props.settings?.currency || 'Rs.';
    const activePrice = product.discount_price ?? product.price;
    const isDiscounted = !!product.discount_price;
    
    const [wishlisted, setWishlisted] = useState(inWishlist);
    const [isHovered, setIsHovered] = useState(false);

    // Sync with inWishlist prop changes (e.g. if the item is removed from Wishlist page)
    useEffect(() => {
        setWishlisted(inWishlist);
    }, [inWishlist]);

    // Get unique colors available in variants
    const colors = product.variants 
        ? [...new Set(product.variants.map(v => v.color).filter(Boolean))]
        : [];

    // Extract product images to find secondary hover image
    const mainImg = getProductImageUrl(product);
    const gallery = (product.images || []).map(img => {
        const path = img.image_path;
        if (!path || path === '0' || path === 'null' || path.includes('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=')) return null;
        let cleanPath = path.startsWith('/') ? path.slice(1) : path;
        if (cleanPath.startsWith('storage/')) cleanPath = cleanPath.slice(8);
        return cleanPath;
    }).filter(Boolean);
    
    const secondaryImages = gallery.filter(g => g !== mainImg);
    const secondImg = secondaryImages[0] || null;

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Add default variant or the product itself
        const defaultVariant = product.variants && product.variants.length > 0 
            ? product.variants[0] 
            : null;
            
        addToCart(product, defaultVariant, 1);
        
        // Dispatch alert event (custom)
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { product } }));
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!props.auth?.user) {
            router.get(route('login'), { redirect: 'wishlist' });
            return;
        }
        
        // Optimistic update
        const prevStatus = wishlisted;
        setWishlisted(!wishlisted);
        
        router.post(route('wishlist.toggle'), { product_id: product.id }, {
            preserveScroll: true,
            onError: () => {
                setWishlisted(prevStatus);
            }
        });
    };

    // Color swatch color mapper helper
    const getColorClass = (colorName) => {
        if (!colorName) return 'bg-slate-200'; // fallback
        const name = String(colorName).toLowerCase();
        if (name.includes('navy')) return 'bg-blue-900';
        if (name.includes('khaki')) return 'bg-amber-200';
        if (name.includes('black')) return 'bg-black';
        if (name.includes('white')) return 'bg-white border border-slate-300';
        if (name.includes('grey')) return 'bg-slate-400';
        if (name.includes('red')) return 'bg-red-600';
        if (name.includes('blue')) return 'bg-blue-600';
        if (name.includes('yellow')) return 'bg-yellow-400';
        if (name.includes('brown')) return 'bg-amber-800';
        if (name.includes('pink')) return 'bg-pink-400';
        return 'bg-slate-200'; // fallback
    };

    return (
        <div className="group relative bg-white border border-stone-200/60 rounded-none overflow-hidden transition-all duration-300 flex flex-col h-full">
            
            {/* Image Section */}
            <div className="relative aspect-[3/4] bg-stone-50 overflow-hidden">
                <Link 
                    href={product.slug ? route('product.show', { slug: product.slug }) : '#'} 
                    className="block h-full font-sans"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {getProductImageUrl(product) ? (
                        <img 
                            src={getAssetUrl(isHovered && secondImg ? `storage/${secondImg}` : `storage/${mainImg}`)} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 relative">
                            <span className="text-[80px] opacity-10 select-none font-black text-slate-800">BS</span>
                            <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-slate-400">
                                <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 bg-white border border-stone-200 px-3 py-1">
                                    {product.category?.name || 'Apparel'}
                                </span>
                            </div>
                        </div>
                    )}
                </Link>

                {/* Diners Style Status Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col space-y-1 z-10">
                    {product.is_new_arrival && (
                        <span className="bg-neutral-900 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none">
                            NEW
                        </span>
                    )}
                    {isDiscounted && (
                        <span className="bg-red-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none">
                            {Math.round(((product.price - product.discount_price) / product.price) * 100)}% OFF
                        </span>
                    )}
                </div>

                {/* Floating Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-2.5 right-2.5 z-30 w-7 h-7 bg-white/90 border border-stone-200/50 hover:bg-white text-stone-500 hover:text-red-500 transition-all flex items-center justify-center focus:outline-none"
                    title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    <Heart 
                        size={12} 
                        fill={wishlisted ? "currentColor" : "none"} 
                        className={`transition-colors duration-200 ${wishlisted ? "text-red-500" : "text-stone-500 hover:text-red-500"}`} 
                    />
                </button>
            </div>

            {/* Info Section - Diners Styled */}
            <div className="p-3 flex-grow flex flex-col justify-between bg-white text-center">
                <div className="space-y-1">
                    {/* Category */}
                    <p className="text-[9px] uppercase font-bold text-stone-400 tracking-[0.15em]">
                        {product.category?.name || 'Collections'}
                    </p>

                    {/* Name */}
                    <Link href={product.slug ? route('product.show', { slug: product.slug }) : '#'}>
                        <h4 className="text-[11px] font-bold text-stone-800 hover:text-black transition-colors uppercase tracking-wider line-clamp-2 min-h-[32px]">
                            {product.name}
                        </h4>
                    </Link>

                    {/* Color Swatches */}
                    {colors.length > 0 && (
                        <div className="flex justify-center space-x-1.5 py-1">
                            {colors.slice(0, 4).map((color, i) => (
                                <span 
                                    key={i} 
                                    title={color}
                                    className={`w-2.5 h-2.5 rounded-full border border-stone-300 ${getColorClass(color)} cursor-pointer transition-all`}
                                />
                            ))}
                            {colors.length > 4 && (
                                <span className="text-[8px] font-bold text-stone-450 pl-0.5">+{colors.length - 4}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Price and Ratings */}
                <div className="mt-2 pt-2 border-t border-stone-100 flex flex-col items-center space-y-1">
                    <div className="flex items-baseline justify-center space-x-2">
                        <span className="text-[12px] font-black text-stone-900">
                            {currencySymbol}{Number(activePrice).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                        </span>
                        {isDiscounted && (
                            <span className="text-[10px] text-stone-400 line-through">
                                {currencySymbol}{Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
