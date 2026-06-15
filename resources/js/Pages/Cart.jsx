import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '../Layouts/StoreLayout';
import { getCart, removeFromCart, updateQuantity, getCartTotal } from '../Utils/cart';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';

export default function Cart() {
    const { props } = usePage();
    const settings = props.settings || {};
    const currency = settings.currency || 'Rs.';

    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    const refreshCart = () => {
        setCartItems(getCart());
        setSubtotal(getCartTotal());
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

    const shippingCharges = Number(settings.shipping_charges || 250);
    const shipping = subtotal >= 5000 || subtotal === 0 ? 0.00 : shippingCharges;
    const taxRate = Number(settings.tax_rate || 10) / 100; // 10% tax
    const estimatedTax = subtotal * taxRate;
    const total = subtotal + shipping + estimatedTax;

    return (
        <StoreLayout>
            <Head title="Shopping Cart" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                <h1 className="text-3xl font-black font-serif text-slate-800 uppercase tracking-wide mb-10">
                    YOUR SHOPPING BAG
                </h1>

                {cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        
                        {/* 1. Left: Cart Items List */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm divide-y divide-slate-100">
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
                                            {/* Small visual mock placeholder */}
                                            <div className="w-20 h-24 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 border">
                                                <span className="text-[24px] font-black text-slate-300 font-serif">BS</span>
                                            </div>
                                            
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-black text-slate-800 line-clamp-1">{item.name}</h4>
                                                
                                                {/* Variant properties */}
                                                {(item.size || item.color) && (
                                                    <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase text-slate-400">
                                                        {item.color && <span>Color: {item.color}</span>}
                                                        {item.color && item.size && <span>•</span>}
                                                        {item.size && <span>Size: {item.size}</span>}
                                                    </div>
                                                )}
                                                <p className="text-xs text-slate-400 font-semibold">SKU: {item.sku}</p>
                                                
                                                {/* Price per piece */}
                                                <p className="text-xs font-bold text-slate-500 sm:hidden pt-1">
                                                    {currency}{Number(item.price).toFixed(2)} each
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Side: Quantity selectors and actions */}
                                        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto mt-4 sm:mt-0 space-x-8">
                                            
                                            {/* Quantity adjustment */}
                                            <div className="flex items-center border border-slate-200 rounded-xl px-1.5 bg-slate-50 scale-90">
                                                <button 
                                                    onClick={() => handleQtyChange(item.id, item.variant_id, item.quantity, -1)}
                                                    className="p-1.5 text-slate-500 hover:text-black focus:outline-none"
                                                >
                                                    <Minus size={12} />
                                                </button>
                                                <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleQtyChange(item.id, item.variant_id, item.quantity, 1)}
                                                    className="p-1.5 text-slate-500 hover:text-black focus:outline-none"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>

                                            {/* Total Price */}
                                            <div className="text-right hidden sm:block">
                                                <p className="text-sm font-black text-slate-900">
                                                    {currency}{Number(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-bold">
                                                    {currency}{Number(item.price).toFixed(2)} each
                                                </p>
                                            </div>

                                            {/* Remove Button */}
                                            <button 
                                                onClick={() => handleRemove(item.id, item.variant_id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-2 focus:outline-none"
                                                title="Remove Item"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Right: Order Summary Calculations */}
                        <div className="lg:col-span-4 space-y-6 sticky top-28">
                            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest pb-4 border-b border-slate-100">
                                    ORDER SUMMARY
                                </h3>

                                <div className="space-y-3.5 text-xs font-semibold text-slate-650">
                                    <div className="flex justify-between">
                                        <span>Bag Subtotal</span>
                                        <span className="text-slate-800 font-bold">{currency}{Number(subtotal).toFixed(2)}</span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Estimated Shipping</span>
                                        <span className="text-slate-800 font-bold">
                                            {shipping === 0 ? (
                                                <span className="text-emerald-600 font-bold uppercase">FREE</span>
                                            ) : (
                                                `${currency}${shipping.toFixed(2)}`
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>Estimated Tax (10%)</span>
                                        <span className="text-slate-800 font-bold">{currency}{Number(estimatedTax).toFixed(2)}</span>
                                    </div>
                                    
                                    {subtotal < 5000 && (
                                        <div className="bg-amber-50 text-[10px] text-amber-800 p-3 rounded-xl border border-amber-100 font-bold">
                                            💡 Add <span className="underline">{currency}{(5000 - subtotal).toFixed(2)}</span> more to unlock <span className="font-extrabold uppercase">Free Shipping</span>!
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-100 pt-5">
                                        <span className="font-serif">ORDER TOTAL</span>
                                        <span className="font-serif">{currency}{Number(total).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Link
                                        href={route('checkout')}
                                        className="w-full bg-slate-900 hover:bg-black text-white text-xs font-black tracking-wider py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-3 uppercase"
                                    >
                                        <span>PROCEED TO CHECKOUT</span>
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    /* Empty cart state */
                    <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm max-w-xl mx-auto space-y-6">
                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <ShoppingBag size={24} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-slate-800">Your shopping bag is empty</h3>
                            <p className="text-xs text-slate-500 font-medium">Add some majestic Brands Studio items to begin.</p>
                        </div>
                        <div className="pt-2">
                            <Link 
                                href={route('welcome')}
                                className="bg-slate-900 hover:bg-black text-white text-xs font-black px-8 py-3.5 rounded-xl shadow-md transition-all uppercase tracking-wider inline-block"
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
