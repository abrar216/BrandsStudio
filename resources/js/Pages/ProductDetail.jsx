import React, { useState } from 'react';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import StoreLayout from '../Layouts/StoreLayout';
import ProductCard from '../Components/ProductCard';
import { ShoppingCart, Star, Heart, Check, Minus, Plus, MessageSquare } from 'lucide-react';
import { addToCart } from '../Utils/cart';
import { getAssetUrl } from '../Utils/asset';

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
        window.dispatchEvent(new CustomEvent('cart-updated'));
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                {/* Product Core Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    
                    {/* Left: Premium Image visual mockup */}
                    {product.image || product.main_image ? (
                        <div className="bg-slate-100/60 border border-slate-100 rounded-3xl overflow-hidden aspect-[3/4] relative">
                            <img 
                                src={getAssetUrl(`storage/${product.image || product.main_image}`)} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="bg-slate-100/60 border border-slate-100 rounded-3xl overflow-hidden aspect-[3/4] flex flex-col justify-center items-center relative">
                            <span className="text-[140px] opacity-10 select-none font-black tracking-widest text-slate-800 font-serif">BS</span>
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                                <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500 bg-white shadow-md px-6 py-2.5 rounded-full">
                                    {product.category?.name || 'Apparel Collection'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Right: Core Purchase Form details */}
                    <div className="space-y-8">
                        <div>
                            {/* Breadcrumb / Category */}
                            <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-2">
                                {product.category?.name || 'Curated Apparel'} / SKU: {product.sku}
                            </p>

                            <h1 className="text-3xl sm:text-4xl font-black font-serif text-slate-800 uppercase tracking-wide leading-none">
                                {product.name}
                            </h1>

                            {/* Ratings Summary */}
                            <div className="flex items-center space-x-2 mt-4">
                                <div className="flex items-center text-amber-400 space-x-0.5">
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                </div>
                                <span className="text-xs font-bold text-slate-500">
                                    ({product.reviews?.length || 0} reviews)
                                </span>
                            </div>
                        </div>

                        {/* Price Details */}
                        <div className="flex items-baseline space-x-4">
                            <span className="text-3xl font-black text-slate-900 font-serif">
                                {currency}{Number(activePrice).toFixed(2)}
                            </span>
                            {isDiscounted && (
                                <span className="text-lg text-slate-450 line-through">
                                    {currency}{Number(product.price).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Short Description */}
                        <p className="text-sm text-slate-500 leading-relaxed font-medium">
                            {product.short_description || 'A timeless Brands Studio wardrobe basic, engineered using sustainably sourced fabrics and majestic tailored calibrations to secure a flattering and clean contemporary drape.'}
                        </p>

                        {/* Color Selector Swatches */}
                        {allColors.length > 0 && (
                            <div className="space-y-3">
                                <span className="text-xs font-black tracking-wider text-slate-800 uppercase flex items-center space-x-1.5">
                                    <span>COLOR:</span>
                                    <span className="text-slate-400 font-bold">{selectedColor}</span>
                                </span>
                                <div className="flex space-x-3.5">
                                    {allColors.map((color, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-9 h-9 rounded-full ${getColorClass(color)} ring-2 ring-offset-2 flex items-center justify-center transition-all ${
                                                selectedColor === color 
                                                    ? 'ring-amber-500 scale-105 shadow-md' 
                                                    : 'ring-transparent hover:ring-slate-350'
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
                                <span className="text-xs font-black tracking-wider text-slate-800 uppercase flex items-center space-x-1.5">
                                    <span>SIZE:</span>
                                    {selectedSize && <span className="text-slate-400 font-bold">{selectedSize}</span>}
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
                                                className={`border rounded-xl px-5 py-3 text-xs font-bold transition-all relative ${
                                                    isOutOfStock
                                                        ? 'border-slate-200 text-slate-300 line-through cursor-not-allowed bg-slate-50/50'
                                                        : (isSelected
                                                            ? 'border-amber-500 bg-amber-50 text-amber-600 font-extrabold shadow-sm'
                                                            : 'border-slate-200 text-slate-700 hover:bg-slate-50')
                                                }`}
                                            >
                                                <span>{v.size}</span>
                                                {!isOutOfStock && v.stock < 5 && (
                                                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] px-1 rounded-full scale-90">
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
                        <div className="text-xs font-bold">
                            {availableStock > 0 ? (
                                <span className="text-emerald-600">✓ In Stock ({availableStock} units available)</span>
                            ) : (
                                <span className="text-red-500">✗ Out of Stock</span>
                            )}
                        </div>

                        {/* Actions block */}
                        <div className="flex items-center space-x-4 pt-4 border-t border-slate-100">
                            {/* Quantity selection */}
                            <div className="flex items-center border border-slate-200 rounded-xl px-2 bg-slate-50">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-2 text-slate-500 hover:text-black focus:outline-none"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className="px-4 text-xs font-bold select-none">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(Math.min(availableStock || 10, quantity + 1))}
                                    className="p-2 text-slate-500 hover:text-black focus:outline-none"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>

                            {/* Add to Cart button */}
                            <button
                                disabled={availableStock <= 0}
                                onClick={handleAddToCart}
                                className={`flex-grow bg-slate-900 hover:bg-black text-white text-xs font-black tracking-wider py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-3 uppercase ${
                                    availableStock <= 0 ? 'bg-slate-300 cursor-not-allowed hover:bg-slate-300 shadow-none' : ''
                                }`}
                            >
                                <ShoppingCart size={15} />
                                <span>ADD TO SHOPPING BAG</span>
                            </button>

                            {/* Wishlist toggle */}
                            <button
                                onClick={handleWishlistToggle}
                                className={`p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors focus:outline-none ${
                                    inWishlist ? 'text-red-500 bg-red-50 border-red-200' : 'text-slate-500'
                                }`}
                                title="Add to Wishlist"
                            >
                                <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                    </div>

                </div>

                {/* Tab Sections (Description / Reviews) */}
                <div className="mt-24 border-t border-slate-100 pt-16">
                    <div className="flex space-x-8 border-b border-slate-100 pb-4 mb-8 text-sm font-black tracking-wider">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`pb-4 transition-all uppercase ${
                                activeTab === 'description' 
                                    ? 'text-amber-500 border-b-2 border-amber-500 font-extrabold' 
                                    : 'text-slate-400 hover:text-slate-800'
                            }`}
                        >
                            Garment Details
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`pb-4 transition-all uppercase flex items-center space-x-2 ${
                                activeTab === 'reviews' 
                                    ? 'text-amber-500 border-b-2 border-amber-500 font-extrabold' 
                                    : 'text-slate-400 hover:text-slate-800'
                            }`}
                        >
                            <span>Reviews</span>
                            <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">
                                {product.reviews?.length || 0}
                            </span>
                        </button>
                    </div>

                    {/* Tab content 1: Description */}
                    {activeTab === 'description' && (
                        <div className="max-w-4xl space-y-6 text-sm text-slate-500 leading-relaxed font-medium">
                            <p>{product.description || 'No detailed description specified.'}</p>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4 text-xs font-bold text-slate-700">
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
                            <div className="lg:col-span-1 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                                    <MessageSquare size={14} className="text-amber-500" />
                                    <span>WRITE A REVIEW</span>
                                </h3>

                                <form onSubmit={submitReview} className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                                            RATING SCORE
                                        </label>
                                        <select
                                            value={data.rating}
                                            onChange={(e) => setData('rating', Number(e.target.value))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold"
                                        >
                                            <option value="5">★★★★★ - Excellent (5/5)</option>
                                            <option value="4">★★★★☆ - Very Good (4/5)</option>
                                            <option value="3">★★★☆☆ - Average (3/5)</option>
                                            <option value="2">★★☆☆☆ - Disappointed (2/5)</option>
                                            <option value="1">★☆☆☆☆ - Very Bad (1/5)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
                                            COMMENTS
                                        </label>
                                        <textarea
                                            placeholder="Write your review here..."
                                            value={data.comment}
                                            onChange={(e) => setData('comment', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs h-28 focus:bg-white"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-slate-900 hover:bg-black text-white text-xs font-black py-3 rounded-xl transition-all uppercase"
                                    >
                                        SUBMIT REVIEW
                                    </button>
                                </form>
                            </div>

                            {/* Reviews list */}
                            <div className="lg:col-span-2 space-y-6">
                                {product.reviews && product.reviews.length > 0 ? (
                                    product.reviews.map((rev) => (
                                        <div key={rev.id} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">{rev.user?.name}</h4>
                                                    <p className="text-[10px] text-slate-400 font-bold">{new Date(rev.created_at).toLocaleDateString()}</p>
                                                </div>
                                                <div className="flex text-amber-400 space-x-0.5">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={11} 
                                                            fill={i < rev.rating ? 'currentColor' : 'none'} 
                                                            className={i < rev.rating ? 'text-amber-400' : 'text-slate-200'}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                                                {rev.comment}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-12 text-center text-slate-400 text-xs font-semibold">
                                        No reviews have been written for this product yet. Be the first to share your thoughts!
                                    </div>
                                )}
                            </div>

                        </div>
                    )}
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="mt-32 pt-16 border-t border-slate-100">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                                    DESIGNED PAIRINGS
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-800 mt-1 uppercase tracking-wide">
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
