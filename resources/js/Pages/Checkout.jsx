import React, { useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import StoreLayout from '../Layouts/StoreLayout';
import { getCart, getCartTotal } from '../Utils/cart';
import { getAssetUrl, getProductImageUrl } from '../Utils/asset';
import { Truck, CreditCard, Tag, ShieldCheck, ArrowRight, Loader2, X } from 'lucide-react';
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

    // Load cart items on mount
    useEffect(() => {
        const items = getCart();
        if (items.length === 0) {
            router.get(route('cart'));
            return;
        }
        setCartItems(items);
        setSubtotal(getCartTotal());

        // Load coupon from localStorage if exists
        const savedCoupon = localStorage.getItem('bs_coupon');
        if (savedCoupon) {
            try {
                const parsed = JSON.parse(savedCoupon);
                if (parsed) {
                    setCouponApplied(parsed);
                    setCouponCodeInput(parsed.code);
                    setData('coupon_code', parsed.code);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

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
            const response = await axios.post('/api/coupon/apply', {
                code: couponCodeInput,
                subtotal: subtotal
            });

            if (response.data.success) {
                setCouponApplied(response.data);
                setData('coupon_code', response.data.code);
                localStorage.setItem('bs_coupon', JSON.stringify({
                    code: response.data.code,
                    discount: response.data.discount,
                    type: response.data.type,
                    value: response.data.value
                }));
            }
        } catch (error) {
            setCouponError(error.response?.data?.message || 'Failed to validate coupon.');
            setCouponApplied(null);
            setData('coupon_code', '');
            localStorage.removeItem('bs_coupon');
        } finally {
            setCouponLoading(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponApplied(null);
        setCouponCodeInput('');
        setData('coupon_code', '');
        setCouponError('');
        localStorage.removeItem('bs_coupon');
    };

    const handleSubmitOrder = (e) => {
        e.preventDefault();
        
        post(route('order.store'), {
            onSuccess: () => {
                // Clear the local cart and coupon on successful placement
                localStorage.removeItem('bs_cart');
                localStorage.removeItem('bs_coupon');
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-widest mb-6 sm:mb-10">
                    SECURE CHECKOUT
                </h1>

                <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
                    
                    {/* 1. Left: Billing & Shipping Forms */}
                    <div className="lg:col-span-7 space-y-8">
                        
                        {/* Section 1: Customer Contact Info */}
                        <div className="bg-white border border-stone-200/60 rounded-none p-4 sm:p-6 space-y-5">
                            <h3 className="text-xs font-black text-stone-900 uppercase tracking-[0.2em] pb-3 border-b border-stone-100 flex items-center space-x-2.5">
                                <span className="bg-black text-white w-5 h-5 flex items-center justify-center text-[10px] font-black rounded-none">1</span>
                                <span>CONTACT DETAILS</span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-black text-stone-400 uppercase tracking-wider mb-1.5">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="JANE DOE"
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-none py-2.5 px-4 text-[10px] tracking-wider uppercase focus:bg-white focus:outline-none focus:ring-0 focus:border-stone-400"
                                    />
                                    {errors.customer_name && <p className="text-[9px] text-red-600 font-bold mt-1 uppercase tracking-wider">{errors.customer_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-stone-400 uppercase tracking-wider mb-1.5">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="JANE.DOE@EXAMPLE.COM"
                                        value={data.customer_email}
                                        onChange={(e) => setData('customer_email', e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-none py-2.5 px-4 text-[10px] tracking-wider uppercase focus:bg-white focus:outline-none focus:ring-0 focus:border-stone-400"
                                    />
                                    {errors.customer_email && <p className="text-[9px] text-red-600 font-bold mt-1 uppercase tracking-wider">{errors.customer_email}</p>}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-[9px] font-black text-stone-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+92 300 1234567"
                                        value={data.customer_phone}
                                        onChange={(e) => setData('customer_phone', e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-none py-2.5 px-4 text-[10px] tracking-wider uppercase focus:bg-white focus:outline-none focus:ring-0 focus:border-stone-400"
                                    />
                                    {errors.customer_phone && <p className="text-[9px] text-red-600 font-bold mt-1 uppercase tracking-wider">{errors.customer_phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Shipping Address */}
                        <div className="bg-white border border-stone-200/60 rounded-none p-4 sm:p-6 space-y-5">
                            <h3 className="text-xs font-black text-stone-900 uppercase tracking-[0.2em] pb-3 border-b border-stone-100 flex items-center space-x-2.5">
                                <span className="bg-black text-white w-5 h-5 flex items-center justify-center text-[10px] font-black rounded-none">2</span>
                                <span>DELIVERY ADDRESS</span>
                            </h3>

                            <div>
                                <label className="block text-[9px] font-black text-stone-400 uppercase tracking-wider mb-1.5">Full Delivery Address</label>
                                <textarea
                                    required
                                    placeholder="STREET ADDRESS, APARTMENT, CITY, STATE, ZIP CODE..."
                                    value={data.shipping_address}
                                    onChange={(e) => setData('shipping_address', e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-none p-4 text-[10px] tracking-wider uppercase h-28 focus:bg-white focus:outline-none focus:ring-0 focus:border-stone-400"
                                />
                                {errors.shipping_address && <p className="text-[9px] text-red-600 font-bold mt-1 uppercase tracking-wider">{errors.shipping_address}</p>}
                            </div>

                            <div>
                                <label className="block text-[9px] font-black text-stone-400 uppercase tracking-wider mb-1.5">Order Notes (Optional)</label>
                                <textarea
                                    placeholder="DELIVERY INSTRUCTIONS..."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-none p-4 text-[10px] tracking-wider uppercase h-20 focus:bg-white focus:outline-none focus:ring-0 focus:border-stone-400"
                                />
                            </div>
                        </div>

                        {/* Section 3: Payment Method selection */}
                        <div className="bg-white border border-stone-200/60 rounded-none p-4 sm:p-6 space-y-5">
                            <h3 className="text-xs font-black text-stone-900 uppercase tracking-[0.2em] pb-3 border-b border-stone-100 flex items-center space-x-2.5">
                                <span className="bg-black text-white w-5 h-5 flex items-center justify-center text-[10px] font-black rounded-none">3</span>
                                <span>PAYMENT METHOD</span>
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setData('payment_method', 'cod')}
                                    className={`border p-4 text-left transition-all flex flex-col justify-between h-28 rounded-none focus:outline-none ${
                                        data.payment_method === 'cod'
                                            ? 'border-black bg-stone-50 text-neutral-900 ring-1 ring-black'
                                            : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                                    }`}
                                >
                                    <Truck size={18} className={data.payment_method === 'cod' ? 'text-black' : 'text-stone-400'} />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider">Cash on Delivery</p>
                                        <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Pay upon delivery</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setData('payment_method', 'stripe')}
                                    className={`border p-4 text-left transition-all flex flex-col justify-between h-28 rounded-none focus:outline-none ${
                                        data.payment_method === 'stripe'
                                            ? 'border-black bg-stone-50 text-neutral-900 ring-1 ring-black'
                                            : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                                    }`}
                                >
                                    <CreditCard size={18} className={data.payment_method === 'stripe' ? 'text-black' : 'text-stone-400'} />
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider">Stripe Card</p>
                                        <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Safe instant checkout</p>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setData('payment_method', 'paypal')}
                                    className={`border p-4 text-left transition-all flex flex-col justify-between h-28 rounded-none focus:outline-none ${
                                        data.payment_method === 'paypal'
                                            ? 'border-black bg-stone-50 text-neutral-900 ring-1 ring-black'
                                            : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                                    }`}
                                >
                                    <div className="text-[10px] font-black italic tracking-wider text-blue-700">PayPal</div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-wider">PayPal Wallet</p>
                                        <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Checkout with PayPal</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* 2. Right: Cart Review & Totals checkout */}
                    <div className="lg:col-span-5 space-y-6 sticky top-28">
                        <div className="bg-white border border-stone-200/60 rounded-none p-4 sm:p-6 space-y-6">
                            <h3 className="text-[11px] font-black text-stone-900 uppercase tracking-[0.2em] pb-4 border-b border-stone-100">
                                APPAREL IN BAG
                            </h3>

                            {/* Mini bag list */}
                            <div className="divide-y divide-stone-100 max-h-56 overflow-y-auto pr-2 space-y-3.5 pb-4">
                                {cartItems.map((item) => (
                                    <div key={`${item.id}-${item.variant_id || 'none'}`} className="flex justify-between items-center py-2.5 first:pt-0 border-b border-stone-50 last:border-0">
                                        <div className="flex items-center space-x-3.5">
                                            <div className="w-10 h-12 bg-stone-50 border border-stone-200/50 rounded-none flex items-center justify-center flex-shrink-0 text-[10px] font-black text-stone-300 overflow-hidden">
                                                {getProductImageUrl(item) ? (
                                                    <img 
                                                        src={getAssetUrl(`storage/${getProductImageUrl(item)}`)} 
                                                        alt={item.name} 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                ) : (
                                                    <span>BS</span>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-[11px] font-bold text-stone-900 uppercase tracking-wide line-clamp-1">{item.name}</h4>
                                                <p className="text-[9px] font-black uppercase text-stone-400 tracking-wider">
                                                    QTY: {item.quantity} {item.size && `• Size: ${item.size}`}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-[11px] font-black text-stone-900">
                                            {currency}{Number(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Form widget */}
                            <div className="pt-4 border-t border-stone-100 space-y-3">
                                <h4 className="text-[9px] font-black text-stone-400 uppercase tracking-widest">APPLY COUPON</h4>
                                
                                {couponApplied ? (
                                    <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 border border-emerald-200 p-3.5 rounded-none text-[10px] font-black tracking-wider uppercase">
                                        <span className="flex items-center space-x-1.5">
                                            <Tag size={12} className="text-emerald-600" />
                                            <span>PROMO: <span className="font-extrabold">{couponApplied.code}</span> Applied!</span>
                                        </span>
                                        <button 
                                            type="button" 
                                            onClick={handleRemoveCoupon}
                                            className="text-stone-500 hover:text-red-600 font-extrabold px-1.5 focus:outline-none"
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
                                            className="bg-stone-50 border border-stone-200 rounded-none py-2 px-4 text-[10px] tracking-wider uppercase w-full focus:bg-white focus:outline-none focus:ring-0 focus:border-stone-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyCoupon}
                                            disabled={couponLoading}
                                            className="bg-black hover:bg-neutral-850 text-white text-[10px] tracking-widest font-black px-5 rounded-none transition-all uppercase flex items-center justify-center min-w-[75px]"
                                        >
                                            {couponLoading ? <Loader2 size={12} className="animate-spin" /> : 'APPLY'}
                                        </button>
                                    </div>
                                )}
                                {couponError && <p className="text-[9px] text-red-600 font-bold mt-1">✗ {couponError}</p>}
                            </div>

                            {/* Billing details list */}
                            <div className="space-y-3.5 text-[10px] tracking-wider uppercase font-bold text-stone-500 border-t border-stone-100 pt-5">
                                <div className="flex justify-between">
                                    <span>Bag Subtotal</span>
                                    <span className="text-stone-900 font-black">{currency}{Number(subtotal).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-black">
                                        <span>Coupon Discount</span>
                                        <span>-{currency}{Number(discount).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span>Shipping charges</span>
                                    <span className="text-stone-900 font-black">
                                        {shipping === 0 ? (
                                            <span className="text-emerald-600 font-black uppercase">FREE</span>
                                        ) : (
                                            `${currency}${shipping.toLocaleString('en-US', { minimumFractionDigits: 0 })}`
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Estimated GST Tax (10%)</span>
                                    <span className="text-stone-900 font-black">{currency}{Number(tax).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                                </div>

                                <div className="flex justify-between text-xs font-black text-stone-950 border-t border-stone-100 pt-5 tracking-[0.15em]">
                                    <span>ORDER TOTAL</span>
                                    <span>{currency}{Number(total).toLocaleString('en-US', { minimumFractionDigits: 0 })}</span>
                                </div>
                            </div>

                            {/* Place order button triggers */}
                            <div className="pt-4 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-grow bg-black hover:bg-neutral-850 disabled:bg-stone-300 text-white text-[10px] tracking-widest font-black py-4 px-6 rounded-none transition-all flex items-center justify-center space-x-2 uppercase focus:outline-none"
                                    >
                                        {processing ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={14} />}
                                        <span>{processing ? 'CREATING ORDER...' : 'PLACE ORDER NOW'}</span>
                                    </button>
                                    <a
                                        href="https://wa.me/923356101234?text=Hello%20Brands%20Studio!%20I%20need%20help%20completing%20my%20checkout%20order."
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
                                
                                <div className="text-[9px] text-stone-400 font-bold uppercase tracking-wider text-center">
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
