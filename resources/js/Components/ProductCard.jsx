import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Heart } from 'lucide-react';
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
    const [selectedSize, setSelectedSize] = useState(null);

    useEffect(() => {
        setWishlisted(inWishlist);
    }, [inWishlist]);

    // Gather unique sizes from variants
    const sizes = product.variants 
        ? [...new Set(product.variants.map(v => v.size).filter(Boolean))]
        : [];

    const isSizeInStock = (sizeName) => {
        if (!product.variants) return true;
        return product.variants.some(v => v.size === sizeName && v.stock_quantity > 0);
    };

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

    const handleAddToCartClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const selectedVariant = product.variants && selectedSize
            ? product.variants.find(v => v.size === selectedSize)
            : (product.variants && product.variants.length > 0 ? product.variants[0] : null);
            
        addToCart(product, selectedVariant, 1);
        
        // Dispatch alert event
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { product } }));
    };

    const handleQuickViewClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('trigger-quick-view', { detail: { product } }));
    };

    const handleSizeClick = (e, sizeName) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isSizeInStock(sizeName)) {
            setSelectedSize(sizeName === selectedSize ? null : sizeName);
        } else {
            // Out of stock -> Notify me back-in-stock modal
            window.dispatchEvent(new CustomEvent('trigger-back-in-stock', { detail: { product, size: sizeName } }));
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

    const getColorClass = (colorName) => {
        if (!colorName) return 'bg-stone-200';
        const name = String(colorName).toLowerCase();
        if (name.includes('navy')) return 'bg-blue-900';
        if (name.includes('khaki')) return 'bg-amber-200';
        if (name.includes('black')) return 'bg-black';
        if (name.includes('white')) return 'bg-white border border-stone-300';
        if (name.includes('grey')) return 'bg-slate-400';
        if (name.includes('red')) return 'bg-red-650';
        if (name.includes('blue')) return 'bg-blue-600';
        return 'bg-stone-250';
    };

    return (
        <div 
            className="group relative bg-white border border-stone-200/60 rounded-none overflow-hidden transition-all duration-300 flex flex-col h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            
            {/* Image Section */}
            <div className="relative aspect-[3/4] bg-stone-50 overflow-hidden select-none">
                <Link 
                    href={product.slug ? route('product.show', { slug: product.slug }) : '#'} 
                    className="block h-full font-sans"
                >
                    {mainImg ? (
                        <img 
                            src={getAssetUrl(isHovered && secondImg ? `storage/${secondImg}` : `storage/${mainImg}`)} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 relative">
                            <span className="text-[60px] opacity-10 select-none font-black text-slate-800">BS</span>
                        </div>
                    )}
                </Link>

                {/* Diners Style Status Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col space-y-1 z-10">
                    {product.is_new_arrival && (
                        <span className="bg-neutral-900 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-none">
                            NEW
                        </span>
                    )}
                    {isDiscounted && (
                        <span className="bg-red-650 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-none">
                            -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                        </span>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlistToggle}
                    className="absolute top-2.5 right-2.5 z-30 w-7 h-7 bg-white/95 border border-stone-200/60 hover:bg-white text-stone-500 hover:text-red-600 transition-all flex items-center justify-center focus:outline-none"
                    title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    <Heart 
                        size={12} 
                        fill={wishlisted ? "currentColor" : "none"} 
                        className={`transition-colors duration-200 ${wishlisted ? "text-red-500" : "text-stone-500"}`} 
                    />
                </button>

                {/* Quick View Hover Button */}
                {isHovered && (
                    <button
                        onClick={handleQuickViewClick}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-white/95 text-black border border-stone-200 text-[9px] font-black tracking-widest px-5 py-2.5 rounded-none transition-all uppercase hover:bg-black hover:text-white"
                    >
                        Quick View
                    </button>
                )}
            </div>

            {/* Info Section - Diners Styled */}
            <div className="p-3.5 flex-grow flex flex-col justify-between bg-white text-center">
                <div className="space-y-1">
                    
                    {/* Brand Name Header */}
                    <p className="text-[8px] uppercase font-black text-stone-400 tracking-[0.25em]">
                        BRANDS STUDIO
                    </p>

                    {/* Name */}
                    <Link href={product.slug ? route('product.show', { slug: product.slug }) : '#'}>
                        <h4 className="text-[10px] font-black text-stone-850 hover:text-black transition-colors uppercase tracking-wider line-clamp-2 min-h-[30px]">
                            {product.name}
                        </h4>
                    </Link>

                    {/* Category details */}
                    <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider line-clamp-1 pb-1">
                        {product.short_description || product.category?.name || 'Exclusive Apparel'}
                    </p>

                    {/* Color Swatches */}
                    {colors.length > 0 && (
                        <div className="flex justify-center space-x-1.5 py-0.5">
                            {colors.slice(0, 4).map((color, i) => (
                                <span 
                                    key={i} 
                                    title={color}
                                    className={`w-2 h-2 rounded-full border border-stone-300 ${getColorClass(color)} cursor-pointer`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Size Selector Chips */}
                    {sizes.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1.5 py-1.5 border-t border-stone-100 mt-2">
                            {sizes.map((sz) => {
                                const inStock = isSizeInStock(sz);
                                const isSelected = selectedSize === sz;
                                return (
                                    <button
                                        key={sz}
                                        onClick={(e) => handleSizeClick(e, sz)}
                                        className={`px-2 py-1 text-[8px] font-black tracking-wider uppercase border ${
                                            isSelected 
                                                ? 'bg-black text-white border-black'
                                                : inStock
                                                    ? 'bg-white text-stone-750 border-stone-200/80 hover:border-black'
                                                    : 'bg-stone-50 text-stone-300 border-stone-200 line-through cursor-pointer'
                                        }`}
                                        title={inStock ? `Select size ${sz}` : `Size ${sz} sold out - click to subscribe notification`}
                                    >
                                        {sz}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Price and Add to Bag */}
                <div className="mt-2 pt-2 border-t border-stone-100 flex flex-col items-center space-y-2">
                    <div className="flex items-baseline justify-center space-x-2">
                        <span className="text-[12px] font-black text-red-650">
                            {currencySymbol}{Number(activePrice).toLocaleString('en-US')}
                        </span>
                        {isDiscounted && (
                            <span className="text-[10px] text-stone-400 line-through">
                                {currencySymbol}{Number(product.price).toLocaleString('en-US')}
                            </span>
                        )}
                    </div>
                    
                    <p className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">
                        Unit price / per
                    </p>

                    {/* Quick Add CTA */}
                    <button
                        onClick={handleAddToCartClick}
                        className="w-full bg-black hover:bg-neutral-800 text-white text-[9px] font-black tracking-widest py-3 rounded-none uppercase transition-colors"
                    >
                        {selectedSize ? `Add Size ${selectedSize} to bag` : 'Add to bag'}
                    </button>
                </div>
            </div>
        </div>
    );
}
