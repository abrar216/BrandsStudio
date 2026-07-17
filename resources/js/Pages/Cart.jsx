import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '../Layouts/StoreLayout';
import { getCart, removeFromCart, updateQuantity, getCartTotal } from '../Utils/cart';
import { getAssetUrl, getProductImageUrl } from '../Utils/asset';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, X, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Cart() {
    const { props } = usePage();
    const settings = props.settings || {};
    const currency = settings.currency || 'Rs.';

    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    // Coupon states
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [couponApplied, setCouponApplied] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    const refreshCart = () => {
        setCartItems(getCart());
        setSubtotal(getCartTotal());
    };

    useEffect(() => {
        // Load coupon from localStorage if exists
        const savedCoupon = localStorage.getItem('bs_coupon');
        if (savedCoupon) {
            try {
                const parsed = JSON.parse(savedCoupon);
                if (parsed) {
                    setCouponApplied(parsed);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const handleApplyCoupon = async () => {
        if (!couponCodeInput.trim()) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const response = await axios.post('/api/coupon/apply', {
                code: couponCodeInput,
                subtotal: subtotal
            });
            if (response.data.success) {
                const applied = {
                    code: response.data.code,
                    discount: response.data.discount,
                    type: response.data.type,
                    value: response.data.value
                };
                setCouponApplied(applied);
                localStorage.setItem('bs_coupon', JSON.stringify(applied));
                setCouponCodeInput('');
            }
        } catch (error) {
            setCouponError(error.response?.data?.message || 'Failed to validate coupon.');
            setCouponApplied(null);
            localStorage.removeItem('bs_coupon');
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponApplied(null);
        localStorage.removeItem('bs_coupon');
        setCouponError('');
        setCouponCodeInput('');
    };

    useEffect(() => {
        refreshCart();

        const handleCartUpdate = () => {
            refreshCart();
        };

        window.addEventListener('cart-updated', handleCartUpdate);
        return () => window.removeEventListener('cart-updated', handleCartUpdate);
    }, []);

    const handleRemove = (productId, variantId) => {
        removeFromCart(productId, variantId);
    };

    const handleQtyChange = (productId, variantId, currentQty, amount) => {
        updateQuantity(productId, variantId, currentQty + amount);
    };

    const discount = couponApplied
        ? (couponApplied.type === 'percentage'
            ? Math.round(subtotal * (Number(couponApplied.value) / 100) * 100) / 100
            : Math.min(Number(couponApplied.value), subtotal))
        : 0;

    const shippingCharges = Number(settings.shipping_charges || 250);
    const taxableAmount = Math.max(0, subtotal - discount);
    const shipping = taxableAmount >= 5000 || subtotal === 0 ? 0.00 : shippingCharges;
    const taxRate = Number(settings.tax_rate || 10) / 100; // 10% tax
    const estimatedTax = taxableAmount * taxRate;
    const total = taxableAmount + shipping + estimatedTax;

    return (
        <StoreLayout>
            <Head title="Shopping Cart" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-widest mb-6 sm:mb-10">
                    YOUR SHOPPING BAG
                </h1>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
                        
                        {/* 1. Left: Cart Items List */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white border border-stone-200/60 rounded-none p-4 sm:p-6 divide-y divide-stone-100">
                                {cartItems.map((item, index) => (
                                    <div 
                                        key={`${item.id}-${item.variant_id || 'none'}`} 
                                        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 ${
                                            index === 0 ? 'pt-0' : ''
                                        } ${
                                            index === cartItems.length - 1 ? 'pb-0' : ''
                                        }`}
                                    >
                                        {/* Left Side: Product Specs */}
                                        <div className="flex space-x-5 items-center">
                                            {/* Product Image */}
                                            <div className="w-20 h-24 bg-stone-50 rounded-none flex items-center justify-center flex-shrink-0 border border-stone-200/50 overflow-hidden">
                                                {getProductImageUrl(item) ? (
                                                    <img 
                                                        src={getAssetUrl(`storage/${getProductImageUrl(item)}`)} 
                                                        alt={item.name} 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                ) : (
                                                    <span className="text-[20px] font-black text-stone-300">BS</span>
                                                )}
                                            </div>
                                            
                                            <div className="space-y-1">
                                                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide line-clamp-1">{item.name}</h4>
                                                
                                                {/* Variant properties */}
                                                {(item.size || item.color) && (
                                                    <div className="flex flex-wrap gap-2 text-[9px] font-black uppercase text-stone-400 tracking-wider">
                                                        {item.color && <span>Color: {item.color}</span>}
                                                        {item.color && item.size && <span>•</span>}
                                                        {item.size && <span>Size: {item.size}</span>}
                                                    </div>
                                                )}
                                                <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">SKU: {item.sku}</p>
                                                
                                                {/* Price per piece */}
                                                <p className="text-[10px] font-black text-stone-500 sm:hidden pt-1">
                                                    {currency}{Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 0 })} EACH
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Side: Quantity selectors and actions */}
                                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-4 sm:mt-0 space-x-4 sm:space-x-8">
                                            
                                            {/* Quantity adjustment */}
                                            <div className="flex items-center border border-stone-200 rounded-none px-1 bg-stone-50">
                                                <button 
                                                    onClick={() => handleQtyChange(item.id, item.variant_id, item.quantity, -1)}
                                                    className="p-1.5 text-stone-500 hover:text-black focus:outline-none"
                                                >
                                                    <Minus size={11} />
                                                </button>
                                                <span className="px-3 text-[11px] font-black text-stone-900">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleQtyChange(item.id, item.variant_id, item.quantity, 1)}
                                                    className="p-1.5 text-stone-500 hover:text-black focus:outline-none"
                                                >
                                                    <Plus size={11} />
                                                </button>
                                            </div>

                                            {/* Total Price (Mobile) */}
                                            <div className="text-right sm:hidden">
                                                <p className="text-[11px] font-black text-stone-900">
                                                    {currency}{Number(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                                                </p>
                                            </div>

                                            {/* Total Price (Desktop) */}
                                            <div className="text-right hidden sm:block min-w-[80px]">
                                                <p className="text-[12px] font-black text-stone-900">
                                                    {currency}{Number(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                                                </p>
                                                <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">
                                                    {currency}{Number(item.price).toLocaleString('en-US', { minimumFractionDigits: 0 })} each
                                                </p>
                                            </div>

                                            {/* Remove Button */}
                                            <button 
                                                onClick={() => handleRemove(item.id, item.variant_id)}
                                                className="text-stone-400 hover:text-red-600 transition-colors p-2 focus:outline-none"
                                                title="Remove Item"
                                            >
                                                <Trash2 size={14} />
                                            </button>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Right: Order Summary Calculations */}
                        <div className="lg:col-span-4 space-y-6 sticky top-28">
                            <div className="bg-white border border-stone-200/60 rounded-none p-4 sm:p-6 space-y-5 sm:space-y-6">
                                <h3 className="text-[11px] font-black text-stone-900 uppercase tracking-[0.2em] pb-4 border-b border-stone-100">
                                    ORDER SUMMARY
                                </h3>

                                <div className="space-y-3.5 text-[10px] tracking-wider uppercase font-bold text-stone-500">
                                    <div className="flex justify-between">
                                        <span>Bag Subtotal</span>
                                        <span className="text-stone-900 font-black">{currency}{Number(subtotal).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Estimated Shipping</span>
                                        <span className="text-stone-900 font-black">
                                            {shipping === 0 ? (
                                                <span className="text-emerald-600 font-black uppercase">FREE</span>
                                            ) : (
                                                `${currency}${shipping.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Estimated Tax (10%)</span>
                                        <span className="text-stone-900 font-black">{currency}{Number(estimatedTax).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                                    </div>
                                    
                                    {discount > 0 && (
                                        <div className="flex justify-between text-emerald-600 font-black">
                                            <span>Coupon Discount</span>
                                            <span>-{currency}{Number(discount).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-xs font-black text-stone-950 border-t border-stone-100 pt-5 tracking-[0.15em]">
                                        <span>ORDER TOTAL</span>
                                        <span>{currency}{Number(total).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                                    </div>
                                </div>

                                {/* Coupon Form Widget */}
                                <div className="border-t border-stone-100 pt-4 space-y-3">
                                    <h4 className="text-[9px] font-black text-stone-400 uppercase tracking-widest">APPLY DISCOUNT CODE</h4>
                                    {couponApplied ? (
                                        <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 text-[10px] font-black p-3 rounded-none border border-emerald-100">
                                            <span>PROMO: <span className="font-black uppercase">{couponApplied.code}</span> APPLIED!</span>
                                            <button 
                                                onClick={handleRemoveCoupon}
                                                className="text-emerald-600 hover:text-emerald-800 focus:outline-none"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <input 
                                                type="text" 
                                                placeholder="ENTER CODE..."
                                                value={couponCodeInput}
                                                onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                                                className="bg-stone-50 border border-stone-200 rounded-none py-2.5 px-3 text-[10px] tracking-wider uppercase w-full font-bold focus:bg-white focus:outline-none focus:ring-0 focus:border-stone-400"
                                            />
                                            <button 
                                                onClick={handleApplyCoupon}
                                                disabled={couponLoading}
                                                className="bg-black hover:bg-neutral-850 text-white text-[10px] tracking-widest font-black py-3 px-4 rounded-none transition-all uppercase flex items-center justify-center min-w-[75px]"
                                            >
                                                {couponLoading ? <Loader2 size={12} className="animate-spin" /> : 'APPLY'}
                                            </button>
                                        </div>
                                    )}
                                    {couponError && <p className="text-[9px] text-red-600 font-bold mt-1">✗ {couponError}</p>}
                                </div>

                                <div className="pt-4 space-y-2.5">
                                    <div className="flex items-center space-x-2">
                                        <Link
                                            href={route('checkout')}
                                            className="flex-grow bg-black hover:bg-neutral-850 text-white text-[10px] tracking-widest font-black py-4 px-6 rounded-none transition-all flex items-center justify-center space-x-2 uppercase"
                                        >
                                            <span>PROCEED TO CHECKOUT</span>
                                            <ArrowRight size={12} />
                                        </Link>
                                        <a
                                            href="https://wa.me/923356101234?text=Hello%20Brands%20Studio!%20I%20have%20some%20questions%20about%2520my%2520shopping%2520cart."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-none transition-colors flex items-center justify-center flex-shrink-0"
                                            title="Chat on WhatsApp"
                                        >
                                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                        </a>
                                    </div>
                                    <Link
                                        href={route('shop')}
                                        className="w-full bg-white hover:bg-stone-50 text-stone-700 text-[10px] tracking-widest font-black py-3.5 px-6 rounded-none border border-stone-250 transition-all flex items-center justify-center space-x-2 uppercase"
                                    >
                                        <span>Continue Shopping</span>
                                    </Link>
                                </div>

                                <div className="text-[9px] text-stone-400 leading-relaxed text-center font-bold mt-4 bg-stone-50 p-3 rounded-none border border-stone-100 uppercase">
                                    ℹ️ <span className="font-extrabold text-stone-500">Disclaimer:</span> Product color and image quality may vary slightly due to photographic lighting sources or your device screen settings.
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    /* Empty cart state */
                    <div className="bg-white border border-stone-200/50 rounded-none p-16 text-center max-w-xl mx-auto space-y-6">
                        <div className="w-14 h-14 bg-stone-50 text-stone-400 rounded-none flex items-center justify-center mx-auto border border-stone-200/40">
                            <ShoppingBag size={20} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xs font-black text-stone-850 uppercase tracking-widest">Your shopping bag is empty</h3>
                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Add some majestic Brands Studio items to begin.</p>
                        </div>
                        <div className="pt-2">
                            <Link 
                                href={route('shop')}
                                className="bg-black hover:bg-neutral-855 text-white text-[10px] tracking-widest font-black px-8 py-3.5 rounded-none transition-all uppercase inline-block"
                            >
                                CONTINUE SHOPPING
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
