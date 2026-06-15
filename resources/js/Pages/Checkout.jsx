import React, { useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import StoreLayout from '../Layouts/StoreLayout';
import { getCart, getCartTotal } from '../Utils/cart';
import { Truck, CreditCard, Tag, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Checkout({ settings: propSettings, currency: propCurrency }) {
    const { props } = usePage();
    const settings = propSettings || props.settings || {};
    const currency = propCurrency || settings.currency || 'Rs.';

    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    // Coupon states
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [couponApplied, setCouponApplied] = useState(null); // { code, discount, type, value }
    const [couponError, setCouponError] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    // Load cart items on mount
    useEffect(() => {
        const items = getCart();
        if (items.length === 0) {
            router.get(route('cart'));
            return;
        }
        setCartItems(items);
        setSubtotal(getCartTotal());
    }, []);

    // Setup Laravel Inertia form
    const { data, setData, post, processing, errors } = useForm({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: '',
        payment_method: 'cod',
        notes: '',
        cart_items: [],
        coupon_code: '',
    });

    // Sync cart items to form data once loaded
    useEffect(() => {
        if (cartItems.length > 0) {
            setData('cart_items', cartItems.map(item => ({
                id: item.id,
                quantity: item.quantity,
                variant_id: item.variant_id
            })));
        }
    }, [cartItems]);

    // Apply coupon via AJAX endpoint
    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        if (!couponCodeInput.trim()) return;

        setCouponLoading(true);
        setCouponError('');
        try {
            const response = await axios.post(route('coupon.apply'), {
                code: couponCodeInput,
                subtotal: subtotal
            });

            if (response.data.success) {
                setCouponApplied(response.data);
                setData('coupon_code', response.data.code);
            }
        } catch (error) {
            setCouponError(error.response?.data?.message || 'Failed to validate coupon.');
            setCouponApplied(null);
            setData('coupon_code', '');
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponApplied(null);
        setCouponCodeInput('');
        setData('coupon_code', '');
        setCouponError('');
    };

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        
        post(route('order.store'), {
            onSuccess: () => {
                // Clear the local cart on successful placement
                localStorage.removeItem('bs_cart');
                window.dispatchEvent(new Event('cart-updated'));
            }
        });
    };

    // Calculate billing aggregates
    const discount = couponApplied ? Number(couponApplied.discount) : 0;
    const shippingCharges = Number(settings.shipping_charges || 250);
    const shipping = subtotal >= 5000 ? 0.00 : shippingCharges;
    const taxRate = Number(settings.tax_rate || 10) / 100;
    
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * taxRate;
    const total = taxableAmount + shipping + tax;

    return (
        <StoreLayout>
            <Head title="Secure Checkout" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                
                <h1 className="text-3xl font-black font-serif text-slate-800 uppercase tracking-wide mb-10">
                    SECURE CHECKOUT
                </h1>

                <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* 1. Left: Billing & Shipping Forms */}
                    <div className="lg:col-span-7 space-y-8">
                        
                        {/* Section 1: Customer Contact Info */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center space-x-2">
                                <span className="bg-slate-100 text-slate-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                                <span>CONTACT DETAILS</span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Jane Doe"
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:bg-white focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
                                    />
                                    {errors.customer_name && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.customer_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="jane.doe@example.com"
                                        value={data.customer_email}
                                        onChange={(e) => setData('customer_email', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:bg-white focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
                                    />
                                    {errors.customer_email && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.customer_email}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+1 (555) 000-0000"
                                        value={data.customer_phone}
                                        onChange={(e) => setData('customer_phone', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-xs focus:bg-white focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
                                    />
                                    {errors.customer_phone && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.customer_phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Shipping Address */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center space-x-2">
                                <span className="bg-slate-100 text-slate-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                                <span>SHIPPING ADDRESS</span>
                            </h3>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Full Delivery Address</label>
                                <textarea
                                    required
                                    placeholder="Street Address, Apartment, City, State, ZIP Code"
                                    value={data.shipping_address}
                                    onChange={(e) => setData('shipping_address', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs h-28 focus:bg-white focus:ring-1 focus:ring-slate-400"
                                />
                                {errors.shipping_address && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.shipping_address}</p>}
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Order Notes (Optional)</label>
                                <textarea
                                    placeholder="Instructions for delivery driver..."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs h-20 focus:bg-white focus:ring-1 focus:ring-slate-400"
                                />
                            </div>
                        </div>

                        {/* Section 3: Payment Method selection */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest pb-3 border-b border-slate-100 flex items-center space-x-2">
                                <span className="bg-slate-100 text-slate-700 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
                                <span>PAYMENT METHOD</span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setData('payment_method', 'cod')}
                                    className={`border rounded-2xl p-4 text-left transition-all flex flex-col justify-between h-28 focus:outline-none ${
                                        data.payment_method === 'cod'
                                            ? 'border-amber-500 bg-amber-50/50 text-slate-900 shadow-sm ring-1 ring-amber-500'
                                            : 'border-slate-150 hover:bg-slate-50 text-slate-600'
                                    }`}
                                >
                                    <Truck size={20} className={data.payment_method === 'cod' ? 'text-amber-600' : 'text-slate-400'} />
                                    <div>
                                        <p className="text-xs font-black uppercase">Cash on Delivery</p>
                                        <p className="text-[10px] text-slate-400 font-bold">Pay upon delivery</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setData('payment_method', 'stripe')}
                                    className={`border rounded-2xl p-4 text-left transition-all flex flex-col justify-between h-28 focus:outline-none ${
                                        data.payment_method === 'stripe'
                                            ? 'border-amber-500 bg-amber-50/50 text-slate-900 shadow-sm ring-1 ring-amber-500'
                                            : 'border-slate-150 hover:bg-slate-50 text-slate-600'
                                    }`}
                                >
                                    <CreditCard size={20} className={data.payment_method === 'stripe' ? 'text-amber-600' : 'text-slate-400'} />
                                    <div>
                                        <p className="text-xs font-black uppercase">Stripe Card</p>
                                        <p className="text-[10px] text-slate-400 font-bold">Safe instant checkout</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setData('payment_method', 'paypal')}
                                    className={`border rounded-2xl p-4 text-left transition-all flex flex-col justify-between h-28 focus:outline-none ${
                                        data.payment_method === 'paypal'
                                            ? 'border-amber-500 bg-amber-50/50 text-slate-900 shadow-sm ring-1 ring-amber-500'
                                            : 'border-slate-150 hover:bg-slate-50 text-slate-600'
                                    }`}
                                >
                                    <div className="text-xs font-black italic tracking-wider text-blue-600">PayPal</div>
                                    <div>
                                        <p className="text-xs font-black uppercase">PayPal Wallet</p>
                                        <p className="text-[10px] text-slate-400 font-bold">Checkout with PayPal</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* 2. Right: Cart Review & Totals checkout */}
                    <div className="lg:col-span-5 space-y-6 sticky top-28">
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest pb-4 border-b border-slate-100">
                                APPAREL IN BAG
                            </h3>

                            {/* Mini bag list */}
                            <div className="divide-y divide-slate-50 max-h-56 overflow-y-auto pr-2 space-y-3.5 pb-4">
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.variant_id || 'none'}`} className="flex justify-between items-center py-2.5 first:pt-0 border-b border-slate-50 last:border-0">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="w-10 h-12 bg-slate-50 border rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-serif font-black text-slate-300">BS</div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</h4>
                                                <p className="text-[9px] font-black uppercase text-slate-400">
                                                    QTY: {item.quantity} {item.size && `• Size: ${item.size}`}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-black text-slate-900">
                                            {currency}{Number(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Form widget */}
                            <div className="pt-4 border-t border-slate-100 space-y-3">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">APPLY COUPON</h4>
                                
                                {couponApplied ? (
                                    <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 border border-emerald-250 p-3.5 rounded-xl text-xs font-bold">
                                        <span className="flex items-center space-x-1.5">
                                            <Tag size={13} className="text-emerald-600" />
                                            <span>PROMO: <span className="font-extrabold">{couponApplied.code}</span> Applied!</span>
                                        </span>
                                        <button 
                                            type="button" 
                                            onClick={handleRemoveCoupon}
                                            className="text-slate-400 hover:text-red-500 font-extrabold px-1.5 focus:outline-none"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            placeholder="WELCOME10..."
                                            value={couponCodeInput}
                                            onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                                            className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-xs w-full focus:bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={couponLoading}
                                            className="bg-slate-900 hover:bg-black text-white text-xs font-black px-5 rounded-xl transition-all uppercase flex items-center justify-center min-w-[70px]"
                                        >
                                            {couponLoading ? <Loader2 size={12} className="animate-spin" /> : 'APPLY'}
                                        </button>
                                    </div>
                                )}
                                {couponError && <p className="text-[9px] text-red-500 font-bold mt-1">✗ {couponError}</p>}
                            </div>

                            {/* Billing details list */}
                            <div className="space-y-3.5 text-xs font-semibold text-slate-650 border-t border-slate-100 pt-5">
                                <div className="flex justify-between">
                                    <span>Bag Subtotal</span>
                                    <span className="text-slate-800 font-bold">{currency}{Number(subtotal).toFixed(2)}</span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span>Coupon Discount</span>
                                        <span>-{currency}{Number(discount).toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span>Shipping charges</span>
                                    <span className="text-slate-800 font-bold">
                                        {shipping === 0 ? (
                                            <span className="text-emerald-600 font-bold uppercase">FREE</span>
                                        ) : (
                                            `${currency}${shipping.toFixed(2)}`
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Estimated GST Tax (10%)</span>
                                    <span className="text-slate-800 font-bold">{currency}{Number(tax).toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-sm font-black text-slate-950 border-t border-slate-100 pt-5">
                                    <span className="font-serif">ORDER TOTAL</span>
                                    <span className="font-serif">{currency}{Number(total).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Place order button triggers */}
                            <div className="pt-4 space-y-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-350 text-white text-xs font-black tracking-wider py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-3 uppercase focus:outline-none"
                                >
                                    {processing ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={15} />}
                                    <span>{processing ? 'CREATING ORDER...' : 'PLACE ORDER NOW'}</span>
                                </button>
                                
                                <div className="text-[10px] text-slate-400 font-bold leading-normal text-center">
                                    🔒 Fully SSL Encrypted and Secure. By clicking, you agree to Brands Studio Terms & Conditions.
                                </div>
                            </div>

                        </div>
                    </div>

                </form>

            </div>
        </StoreLayout>
    );
}
