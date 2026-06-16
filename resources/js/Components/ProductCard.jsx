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

    // Sync with inWishlist prop changes (e.g. if the item is removed from Wishlist page)
    useEffect(() => {
        setWishlisted(inWishlist);
    }, [inWishlist]);

    // Get unique colors available in variants
    const colors = product.variants 
        ? [...new Set(product.variants.map(v => v.color).filter(Boolean))]
        : [];

    const handleQuickAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Add default variant or the product itself
        const defaultVariant = product.variants && product.variants.length > 0 
            ? product.variants[0] 
            : null;
            
        addToCart(product, defaultVariant, 1);
        
        // Dispatch alert event (custom)
        window.dispatchEvent(new CustomEvent('cart-updated'));
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
        <div className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
            
            {/* Image Section */}
            <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
                <Link href={product.slug ? route('product.show', { slug: product.slug }) : '#'} className="block h-full font-sans">
                    {getProductImageUrl(product) ? (
                        <img 
                            src={getAssetUrl(`storage/${getProductImageUrl(product)}`)} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        /* Visual mockup of the fashion clothing item using simple SVG/icon and gradient */
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-slate-200 to-slate-50 relative">
                            <span className="text-[100px] opacity-10 select-none font-black text-slate-800">BS</span>
                            <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-slate-400">
                                <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                                    {product.category?.name || 'Apparel'}
                                </span>
                            </div>
                        </div>
                    )}
                </Link>

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-1.5 z-10">
                    {product.is_new_arrival && (
                        <span className="bg-neutral-900 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                            NEW
                        </span>
                    )}
                    {isDiscounted && (
                        <span className="bg-red-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">
                            SALE
                        </span>
                    )}
                    {product.is_best_seller && (
                        <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm flex items-center space-x-1">
                            <span>BEST</span>
                        </span>
                    )}
                </div>

                {/* Floating Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm shadow-md hover:shadow-lg text-slate-500 hover:text-red-500 hover:scale-105 transition-all flex items-center justify-center focus:outline-none"
                    title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    <Heart 
                        size={14} 
                        fill={wishlisted ? "currentColor" : "none"} 
                        className={`transition-colors duration-200 ${wishlisted ? "text-red-500" : "text-slate-500 hover:text-red-500"}`} 
                    />
                </button>
            </div>

            {/* Info Section */}
            <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                    {/* Category */}
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">
                        {product.category?.name || 'Collections'}
                    </p>

                    {/* Name */}
                    <Link href={product.slug ? route('product.show', { slug: product.slug }) : '#'}>
                        <h4 className="text-sm font-bold text-slate-800 hover:text-slate-950 transition-colors line-clamp-1">
                            {product.name}
                        </h4>
                    </Link>

                    {/* Color Swatches */}
                    {colors.length > 0 && (
                        <div className="flex space-x-1.5 mt-2.5">
                            {colors.slice(0, 4).map((color, i) => (
                                <span 
                                    key={i} 
                                    title={color}
                                    className={`w-3.5 h-3.5 rounded-full ${getColorClass(color)} ring-1 ring-offset-1 ring-transparent hover:ring-slate-400 cursor-pointer transition-all`}
                                />
                            ))}
                            {colors.length > 4 && (
                                <span className="text-[9px] font-bold text-slate-400 pl-0.5">+{colors.length - 4}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Price and Ratings */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-50">
                    <div className="flex items-baseline space-x-2">
                        <span className="text-base font-black text-slate-900">
                            {currencySymbol}{Number(activePrice).toFixed(2)}
                        </span>
                        {isDiscounted && (
                            <span className="text-xs text-slate-400 line-through">
                                {currencySymbol}{Number(product.price).toFixed(2)}
                            </span>
                        )}
                    </div>
                    
                    {/* Rating display */}
                    <div className="flex items-center space-x-0.5 text-amber-400">
                        <Star size={11} fill="currentColor" />
                        <span className="text-[10px] font-bold text-slate-500">4.8</span>
                    </div>
                </div>

                {/* Action Buttons Grid */}
                <div className="flex gap-2 mt-4 pt-3 border-t border-slate-50">
                    <button
                        onClick={handleQuickAdd}
                        className="flex-1 bg-slate-900 hover:bg-black text-white text-[10px] font-black tracking-wider py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center space-x-1.5 uppercase"
                    >
                        <ShoppingCart size={11} />
                        <span>ADD TO CART</span>
                    </button>
                    <Link
                        href={product.slug ? route('product.show', { slug: product.slug }) : '#'}
                        className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-700 text-[10px] font-black tracking-wider py-2.5 rounded-xl transition-all duration-200 text-center flex items-center justify-center uppercase"
                    >
                        VIEW DETAILS
                    </Link>
                </div>
            </div>

        </div>
    );
}
