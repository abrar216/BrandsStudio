import React, { useState } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import StoreLayout from '../Layouts/StoreLayout';
import ProductCard from '../Components/ProductCard';
import { ShoppingCart, Star, Heart, Check, Minus, Plus, MessageSquare, ArrowLeft } from 'lucide-react';
import { addToCart } from '../Utils/cart';
import { getAssetUrl, getProductImageUrl } from '../Utils/asset';

export default function ProductDetail({ product, relatedProducts = [], inWishlist }) {
    const { props } = usePage();
    const currency = props.settings?.currency || 'Rs.';
    const activePrice = product.discount_price ?? product.price;
    const isDiscounted = !!product.discount_price;

    // Collect all available sizes and colors from variants
    const allColors = product.variants 
        ? [...new Set(product.variants.map(v => v.color).filter(Boolean))]
        : [];
    const allSizes = product.variants
        ? [...new Set(product.variants.map(v => v.size).filter(Boolean))]
        : [];

    // Selected states
    const [selectedColor, setSelectedColor] = useState(allColors[0] || null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    // Image Gallery Setup
    const mainImg = getProductImageUrl(product);
    const gallery = (product.images || []).map(img => {
        const path = img.image_path;
        if (!path || path === '0' || path === 'null' || path.includes('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=')) return null;
        let cleanPath = path.startsWith('/') ? path.slice(1) : path;
        if (cleanPath.startsWith('storage/')) cleanPath = cleanPath.slice(8);
        return cleanPath;
    }).filter(Boolean);
    const allImages = mainImg ? [mainImg, ...gallery.filter(g => g !== mainImg)] : gallery;
    
    const [activeImage, setActiveImage] = useState(allImages[0] || null);
    const [activeMobileImageIdx, setActiveMobileImageIdx] = useState(0);

    React.useEffect(() => {
        setActiveImage(allImages[0] || null);
        setActiveMobileImageIdx(0);
    }, [product.id]);

    // Filter variants based on current color choice
    const getAvailableSizesForColor = (colorName) => {
        if (!product.variants) return [];
        return product.variants
            .filter(v => v.color === colorName)
            .map(v => ({ size: v.size, stock: v.stock_quantity, variant: v }));
    };

    const currentSizes = selectedColor ? getAvailableSizesForColor(selectedColor) : [];

    // Auto-select size if only one is available for this color
    React.useEffect(() => {
        if (currentSizes.length === 1 && currentSizes[0].stock > 0) {
            setSelectedSize(currentSizes[0].size);
        } else {
            setSelectedSize(null);
        }
    }, [selectedColor]);

    // Retrieve active variant
    const getActiveVariant = () => {
        if (!product.variants || product.variants.length === 0) return null;
        return product.variants.find(
            v => v.color === selectedColor && v.size === selectedSize
        ) || null;
    };

    const activeVariant = getActiveVariant();
    const availableStock = activeVariant 
        ? activeVariant.stock_quantity 
        : (product.variants?.length > 0 ? 0 : product.stock_quantity);

    // Form for rating submission
    const { data, setData, post, processing, reset, errors } = useForm({
        product_id: product.id,
        rating: 5,
        comment: '',
    });

    const handleAddToCart = () => {
        if (product.variants && product.variants.length > 0 && !selectedSize) {
            alert('Please select a size first.');
            return;
        }

        addToCart(product, activeVariant, quantity);
        
        // Trigger visual alerts
        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { product, quantity } }));
    };

    const handleWishlistToggle = () => {
        if (!props.auth?.user) {
            router.get(route('login'), { redirect: 'wishlist' });
            return;
        }
        router.post(route('wishlist.toggle'), { product_id: product.id }, {
            preserveScroll: true
        });
    };

    const submitReview = (e) => {
        e.preventDefault();
        post(route('review.store'), {
            preserveScroll: true,
            onSuccess: () => reset('comment'),
        });
    };

    const getColorClass = (colorName) => {
        if (!colorName) return 'bg-slate-200';
        const name = String(colorName).toLowerCase();
        if (name.includes('navy')) return 'bg-blue-900';
        if (name.includes('khaki')) return 'bg-amber-200 border border-slate-200';
        if (name.includes('black')) return 'bg-black';
        if (name.includes('white')) return 'bg-white border border-slate-350';
        if (name.includes('grey')) return 'bg-slate-400';
        if (name.includes('red')) return 'bg-red-600';
        if (name.includes('blue')) return 'bg-blue-600';
        if (name.includes('yellow')) return 'bg-yellow-400';
        if (name.includes('brown')) return 'bg-amber-800';
        if (name.includes('pink')) return 'bg-pink-400';
        return 'bg-slate-200';
    };

    return (
        <StoreLayout>
            <Head title={product.name} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                
                {/* Back to Shop / Continue Shopping Link */}
                <div className="mb-8">
                    <Link 
                        href={route('shop')}
                        className="inline-flex items-center space-x-2 text-slate-450 hover:text-slate-900 text-xs font-black tracking-widest uppercase transition-all duration-200"
                    >
                        <ArrowLeft size={12} />
                        <span>Continue Shopping</span>
                    </Link>
                </div>
                
                {/* Product Core Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                    
                    {/* Left: Premium Image Grid & Carousel (Diners inspired layout) */}
                    <div className="w-full">
                        {/* Desktop View: Grid Layout (Flexible grid depending on image count) */}
                        <div className="hidden md:grid grid-cols-2 gap-4">
                            {allImages.length > 0 ? (
                                allImages.map((img, idx) => {
                                    // Make single image span full grid width, or the first of 3 images
                                    const spanClass = allImages.length === 1 || (allImages.length === 3 && idx === 0)
                                        ? 'col-span-2'
                                        : 'col-span-1';
                                    return (
                                        <div 
                                            key={idx} 
                                            className={`bg-stone-50 border border-stone-200/40 rounded-none overflow-hidden aspect-[3/4] relative ${spanClass}`}
                                        >
                                            <img 
                                                src={getAssetUrl(`storage/${img}`)} 
                                                alt={`${product.name} view ${idx + 1}`} 
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-span-2 bg-stone-100 border border-stone-200/45 rounded-none overflow-hidden aspect-[3/4] flex flex-col justify-center items-center relative">
                                    <span className="text-[140px] opacity-10 select-none font-black tracking-widest text-stone-800">BS</span>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-stone-400">
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 bg-white border border-stone-200 px-5 py-2">
                                            {product.category?.name || 'Apparel Collection'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile View: Horizontal Carousel with indicator dots */}
                        <div className="block md:hidden relative overflow-hidden rounded-none bg-stone-50 border border-stone-200/40">
                            {allImages.length > 0 ? (
                                <div className="relative aspect-[3/4] w-full">
                                    <img 
                                        src={getAssetUrl(`storage/${allImages[activeMobileImageIdx]}`)} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover transition-opacity duration-300"
                                    />
                                    
                                    {/* Carousel Indicators (Dots) */}
                                    {allImages.length > 1 && (
                                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
                                            {allImages.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveMobileImageIdx(idx)}
                                                    className={`h-1.5 transition-all duration-300 ${
                                                        activeMobileImageIdx === idx ? 'w-5 bg-neutral-900' : 'w-1.5 bg-stone-400 opacity-50'
                                                    }`}
                                                    aria-label={`Go to image ${idx + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-stone-100 border border-stone-200/40 rounded-none overflow-hidden aspect-[3/4] flex flex-col justify-center items-center relative">
                                    <span className="text-[100px] opacity-10 select-none font-black tracking-widest text-stone-800">BS</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Core Purchase Form details (Sticky on scroll for desktop) */}
                    <div className="space-y-8 md:sticky md:top-28 md:self-start">
                        <div>
                            {/* Breadcrumb / Category */}
                            <p className="text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] mb-2">
                                {product.category?.name || 'Curated Apparel'} / SKU: {product.sku}
                            </p>

                            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 uppercase tracking-widest leading-none">
                                {product.name}
                            </h1>

                            {/* Ratings Summary */}
                            <div className="flex items-center space-x-2 mt-4">
                                <div className="flex items-center text-amber-400 space-x-0.5">
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                    <Star size={12} fill="currentColor" />
                                </div>
                                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                                    ({product.reviews?.length || 0} reviews)
                                </span>
                            </div>
                        </div>

                        {/* Price Details */}
                        <div className="flex items-baseline space-x-4">
                            <span className="text-2xl font-black text-neutral-950">
                                {currency}{Number(activePrice).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                            </span>
                            {isDiscounted && (
                                <span className="text-base text-stone-400 line-through">
                                    {currency}{Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                                </span>
                            )}
                        </div>

                        {/* Short Description */}
                        <div 
                            className="text-xs text-stone-500 leading-relaxed font-bold tracking-wide uppercase space-y-2"
                            dangerouslySetInnerHTML={{ __html: product.short_description || product.description || 'A timeless Brands Studio wardrobe basic, engineered using sustainably sourced fabrics and majestic tailored calibrations to secure a flattering and clean contemporary drape.' }}
                        />

                        {/* Color Selector Swatches */}
                        {allColors.length > 0 && (
                            <div className="space-y-3">
                                <span className="text-[10px] font-black tracking-[0.15em] text-neutral-800 uppercase flex items-center space-x-1.5">
                                    <span>COLOR:</span>
                                    <span className="text-stone-400 font-bold">{selectedColor}</span>
                                </span>
                                <div className="flex space-x-3.5">
                                    {allColors.map((color, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-9 h-9 rounded-full ${getColorClass(color)} ring-2 ring-offset-2 flex items-center justify-center transition-all ${
                                                selectedColor === color 
                                                    ? 'ring-neutral-950 scale-105 shadow-sm' 
                                                    : 'ring-transparent hover:ring-stone-350'
                                            }`}
                                        >
                                            {selectedColor === color && (
                                                <Check size={14} className={String(color || '').toLowerCase().includes('white') || String(color || '').toLowerCase().includes('khaki') ? 'text-black' : 'text-white'} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes Checklist (Dynamic based on selected color) */}
                        {product.variants?.length > 0 && (
                            <div className="space-y-3">
                                <span className="text-[10px] font-black tracking-[0.15em] text-neutral-800 uppercase flex items-center space-x-1.5">
                                    <span>SIZE:</span>
                                    {selectedSize && <span className="text-stone-400 font-bold">{selectedSize}</span>}
                                </span>
                                <div className="flex flex-wrap gap-2.5">
                                    {currentSizes.map((v, i) => {
                                        const isOutOfStock = v.stock <= 0;
                                        const isSelected = selectedSize === v.size;
                                        
                                        return (
                                            <button
                                                key={i}
                                                disabled={isOutOfStock}
                                                onClick={() => setSelectedSize(v.size)}
                                                className={`border rounded-none px-5 py-3 text-[10px] tracking-widest font-black transition-all relative uppercase ${
                                                    isOutOfStock
                                                        ? 'border-stone-200 text-stone-300 line-through cursor-not-allowed bg-stone-50/50'
                                                        : (isSelected
                                                            ? 'border-black bg-black text-white font-extrabold'
                                                            : 'border-stone-200 text-stone-700 hover:bg-stone-50')
                                                }`}
                                            >
                                                <span>{v.size}</span>
                                                {!isOutOfStock && v.stock < 5 && (
                                                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[8px] px-1 rounded-none scale-90 font-black">
                                                        {v.stock}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Stock alerts */}
                        <div className="text-[10px] font-black uppercase tracking-wider">
                            {availableStock > 0 ? (
                                <span className="text-emerald-600">✓ In Stock</span>
                            ) : (
                                <span className="text-red-500">✗ Out of Stock</span>
                            )}
                        </div>

                        {/* Actions block */}
                        <div className="flex items-center space-x-4 pt-4 border-t border-stone-100">
                            {/* Quantity selection */}
                            <div className="flex items-center border border-stone-200 rounded-none px-2 bg-stone-50">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2 text-stone-500 hover:text-black focus:outline-none"
                                >
                                    <Minus size={12} />
                                </button>
                                <span className="px-4 text-[11px] font-black select-none">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(Math.min(availableStock || 10, quantity + 1))}
                                    className="p-2 text-stone-500 hover:text-black focus:outline-none"
                                >
                                    <Plus size={12} />
                                </button>
                            </div>

                            {/* Add to Cart button */}
                            <button
                                disabled={availableStock <= 0}
                                onClick={handleAddToCart}
                                className={`flex-grow bg-black hover:bg-neutral-850 text-white text-[10px] tracking-widest font-black py-4 px-6 rounded-none transition-all flex items-center justify-center space-x-3 uppercase ${
                                    availableStock <= 0 ? 'bg-stone-300 text-stone-500 cursor-not-allowed hover:bg-stone-300 shadow-none' : ''
                                }`}
                            >
                                <ShoppingCart size={13} />
                                <span>ADD TO SHOPPING BAG</span>
                            </button>

                            {/* Wishlist toggle */}
                            <button
                                onClick={handleWishlistToggle}
                                className={`p-4 rounded-none border border-stone-200 hover:bg-stone-50 transition-colors focus:outline-none ${
                                    inWishlist ? 'text-red-600 bg-red-50 border-red-200' : 'text-stone-500'
                                }`}
                                title="Add to Wishlist"
                            >
                                <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                    </div>

                </div>

                {/* Tab Sections (Description / Reviews) */}
                <div className="mt-24 border-t border-stone-100 pt-16">
                    <div className="flex space-x-8 border-b border-stone-100 pb-4 mb-8 text-[11px] font-black tracking-widest uppercase">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`pb-4 transition-all uppercase ${
                                activeTab === 'description' 
                                    ? 'text-neutral-950 border-b-2 border-neutral-950 font-black' 
                                    : 'text-stone-400 hover:text-stone-850'
                            }`}
                        >
                            Garment Details
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-4 transition-all uppercase flex items-center space-x-2 ${
                                activeTab === 'reviews' 
                                    ? 'text-neutral-950 border-b-2 border-neutral-950 font-black' 
                                    : 'text-stone-400 hover:text-stone-850'
                            }`}
                        >
                            <span>Reviews</span>
                            <span className="bg-stone-100 text-stone-600 text-[9px] px-2 py-0.5 rounded-none font-bold">
                                {product.reviews?.length || 0}
                            </span>
                        </button>
                    </div>

                    {/* Tab content 1: Description */}
                    {activeTab === 'description' && (
                        <div className="max-w-4xl space-y-6 text-xs text-stone-500 leading-relaxed font-bold tracking-wide uppercase">
                            <div className="prose prose-stone max-w-none text-stone-500 text-xs font-bold tracking-wide uppercase" dangerouslySetInnerHTML={{ __html: product.description || 'No detailed description specified.' }} />
                            <div className="bg-stone-50 p-6 rounded-none border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[10px] font-black text-stone-600">
                                <div>• Fabric Blend: 100% Organically Sourced Long-staple Combed Cotton</div>
                                <div>• Cut/Sizing: Premium Italian Sartorial Slim Silhouette Fit</div>
                                <div>• Country of Origin: Handcrafted in Florence, Italy</div>
                                <div>• Wash Instruction: Dry clean or cold machine wash only</div>
                            </div>
                        </div>
                    )}

                    {/* Tab content 2: Reviews */}
                    {activeTab === 'reviews' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                            
                            {/* Submit a Review Form */}
                            <div className="lg:col-span-1 bg-white border border-stone-200 p-6 rounded-none shadow-sm space-y-4">
                                <h3 className="text-[10px] font-black text-neutral-800 uppercase tracking-widest flex items-center space-x-1.5">
                                    <MessageSquare size={12} className="text-stone-450" />
                                    <span>WRITE A REVIEW</span>
                                </h3>

                                <form onSubmit={submitReview} className="space-y-4">
                                    <div>
                                        <label className="block text-[9px] font-black text-stone-400 uppercase tracking-wider mb-1.5">
                                            RATING SCORE
                                        </label>
                                        <select
                                            value={data.rating}
                                            onChange={(e) => setData('rating', Number(e.target.value))}
                                            className="w-full bg-stone-50 border border-stone-200 rounded-none py-2 px-3 text-[10px] font-bold"
                                        >
                                            <option value="5">★★★★★ - Excellent (5/5)</option>
                                            <option value="4">★★★★☆ - Very Good (4/5)</option>
                                            <option value="3">★★★☆☆ - Average (3/5)</option>
                                            <option value="2">★★☆☆☆ - Disappointed (2/5)</option>
                                            <option value="1">★☆☆☆☆ - Very Bad (1/5)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[9px] font-black text-stone-400 uppercase tracking-wider mb-1.5">
                                            COMMENTS
                                        </label>
                                        <textarea
                                            placeholder="Write your review here..."
                                            value={data.comment}
                                            onChange={(e) => setData('comment', e.target.value)}
                                            className="w-full bg-stone-50 border border-stone-200 rounded-none p-3 text-[10px] h-28 focus:bg-white focus:outline-none"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-black hover:bg-neutral-850 text-white text-[10px] tracking-widest font-black py-3 rounded-none transition-all uppercase"
                                    >
                                        SUBMIT REVIEW
                                    </button>
                                </form>
                            </div>

                            {/* Reviews list */}
                            <div className="lg:col-span-2 space-y-6">
                                {product.reviews && product.reviews.length > 0 ? (
                                    product.reviews.map((rev) => (
                                        <div key={rev.id} className="bg-white border border-stone-200 p-6 rounded-none shadow-sm space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-[10px] font-black text-stone-800 uppercase tracking-wide">{rev.user?.name}</h4>
                                                    <p className="text-[9px] text-stone-450 font-bold">{new Date(rev.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex text-amber-400 space-x-0.5">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={10} 
                                                            fill={i < rev.rating ? 'currentColor' : 'none'} 
                                                            className={i < rev.rating ? 'text-amber-400' : 'text-stone-200'}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-stone-550 leading-relaxed font-bold uppercase tracking-wide">
                                                {rev.comment}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-stone-50 border border-stone-200 rounded-none p-12 text-center text-stone-400 text-[10px] font-black uppercase tracking-wider">
                                        No reviews have been written for this product yet. Be the first to share your thoughts!
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-32 pt-16 border-t border-stone-100">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                                    DESIGNED PAIRINGS
                                </span>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-1 uppercase tracking-widest">
                                    YOU MAY ALSO LIKE
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} currency={currency} />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </StoreLayout>
    );
}
