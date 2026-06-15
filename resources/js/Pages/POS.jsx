import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { Search, ShoppingCart, User, Plus, Minus, Trash2, CreditCard, Wallet, Barcode, Printer, X, Wifi, AlertTriangle, CheckCircle } from 'lucide-react';
import axios from 'axios';

export default function POS({ products, categories }) {
    const { auth, settings } = usePage().props;
    const [cart, setCart] = useState([]);
    
    // Search / Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    
    // POS Form metadata
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash'); // cash, card

    // Barcode query state
    const [barcodeInput, setBarcodeInput] = useState('');
    const barcodeRef = useRef(null);

    // Transaction outcome receipt modal
    const [receiptModalOpen, setReceiptModalOpen] = useState(false);
    const [printedReceipt, setPrintedReceipt] = useState(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null); // { type, message }

    // Offline mode indicator mock
    const [onlineStatus, setOnlineStatus] = useState(true);

    useEffect(() => {
        // Monitor online/offline triggers
        const handleOnline = () => setOnlineStatus(true);
        const handleOffline = () => setOnlineStatus(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Auto-focus barcode scanner input
        if (barcodeRef.current) barcodeRef.current.focus();

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Helper to add product to POS basket
    const addProductToPOS = (product, variant = null) => {
        // Automatically resolve first available variant if not specified
        if (!variant && product.variants && product.variants.length > 0) {
            const availableVariant = product.variants.find(v => v.stock_quantity > 0);
            variant = availableVariant || product.variants[0];
        }

        const itemKey = `${product.id}-${variant ? variant.id : 'none'}`;
        const existing = cart.find(item => item.key === itemKey);

        const price = (variant && variant.price) ? variant.price : product.price;
        const maxStock = variant ? variant.stock_quantity : product.stock_quantity;

        if (maxStock <= 0) {
            triggerAlert('error', `Insufficient stock for '${product.name}'`);
            return;
        }

        if (existing) {
            if (existing.quantity >= maxStock) {
                triggerAlert('error', `Cannot add more. Max stock is ${maxStock}`);
                return;
            }
            setCart(cart.map(item => 
                item.key === itemKey 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
            ));
        } else {
            setCart([...cart, {
                key: itemKey,
                id: product.id,
                variant_id: variant ? variant.id : null,
                name: product.name,
                sku: variant ? variant.sku : product.sku,
                size: variant ? variant.size : null,
                color: variant ? variant.color : null,
                price: price,
                quantity: 1,
                max_stock: maxStock
            }]);
        }

        // Refocus barcode scanner
        if (barcodeRef.current) barcodeRef.current.focus();
    };

    // AJAX Barcode / SKU query trigger
    const handleBarcodeSubmit = async (e) => {
        e.preventDefault();
        if (!barcodeInput.trim()) return;

        try {
            const response = await axios.get(route('pos.search'), {
                params: { query: barcodeInput }
            });

            if (response.data && response.data.id) {
                // If it returned a structured product
                const res = response.data;
                
                // Find full product from list
                const fullProd = products.find(p => p.id === res.id);
                const fullVariant = res.variant_id && fullProd.variants 
                    ? fullProd.variants.find(v => v.id === res.variant_id)
                    : null;

                if (fullProd) {
                    addProductToPOS(fullProd, fullVariant);
                    triggerAlert('success', `Scanned and added '${fullProd.name}'!`);
                }
            } else {
                triggerAlert('error', 'Barcode/SKU not matched.');
            }
        } catch (error) {
            triggerAlert('error', 'Failed barcode scanning check.');
        } finally {
            setBarcodeInput('');
        }
    };

    const triggerAlert = (type, message) => {
        setAlertMessage({ type, message });
        setTimeout(() => setAlertMessage(null), 3000);
    };

    const handleQtyChange = (key, amount) => {
        const item = cart.find(i => i.key === key);
        if (!item) return;

        const newQty = item.quantity + amount;
        if (newQty <= 0) {
            setCart(cart.filter(i => i.key !== key));
        } else {
            if (newQty > item.max_stock) {
                triggerAlert('error', `Max stock reached (${item.max_stock})`);
                return;
            }
            setCart(cart.map(i => i.key === key ? { ...i, quantity: newQty } : i));
        }
    };

    const handleRemoveItem = (key) => {
        setCart(cart.filter(i => i.key !== key));
    };

    // Calculations
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxRate = Number(settings.tax_rate || 0);
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = taxableAmount * (taxRate / 100);
    const grandTotal = taxableAmount + tax;

    // Perform POS Checkout submission
    const handlePOSCheckout = async () => {
        if (cart.length === 0) {
            triggerAlert('error', 'Cart is empty.');
            return;
        }

        setCheckoutLoading(true);
        try {
            const payload = {
                customer_name: customerName || undefined,
                customer_phone: customerPhone || undefined,
                payment_method: paymentMethod,
                items: cart.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    variant_id: item.variant_id,
                    price: item.price
                })),
                discount: discount
            };

            const response = await axios.post(route('pos.checkout'), payload);

            if (response.data.success) {
                setPrintedReceipt(response.data.receipt);
                setReceiptModalOpen(true);
                // Reset checkout form
                setCart([]);
                setCustomerName('');
                setCustomerPhone('');
                setDiscount(0);
                setPaymentMethod('cash');
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Transaction failed.';
            triggerAlert('error', msg);
        } finally {
            setCheckoutLoading(false);
        }
    };

    // Filter product grid
    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory ? p.category_id === Number(selectedCategory) : true;
        const matchesSearch = searchQuery 
            ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        return matchesCategory && matchesSearch;
    });

    const handlePrintReceipt = () => {
        const printContent = document.getElementById('thermal-receipt').innerHTML;
        const originalContent = document.body.innerHTML;
        
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload(); // Reload to restore React hooks bindings safely
    };

    return (
        <div className="pos-system h-screen bg-slate-100 flex flex-col overflow-hidden text-slate-800 font-sans">
            <Head title="POS Cashier Terminal" />

            {/* 1. POS Header Bar */}
            <header className="bg-slate-900 text-white px-6 py-4 flex-shrink-0 flex items-center justify-between shadow-md">
                <div className="flex items-center space-x-6">
                    <span className="text-lg font-black tracking-widest font-serif text-white">
                        BRANDS STUDIO POS
                    </span>
                    
                    {/* Offline mode label */}
                    <div className="flex items-center space-x-1.5 bg-slate-850 px-3 py-1 rounded-full text-[10px] font-bold">
                        <Wifi size={11} className={onlineStatus ? 'text-emerald-400' : 'text-red-500'} />
                        <span className={onlineStatus ? 'text-emerald-400' : 'text-red-500'}>
                            {onlineStatus ? 'Connected (Live)' : 'Offline (Syncing)'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center font-bold text-xs uppercase border border-slate-700">
                            C
                        </div>
                        <div className="text-left text-xs font-semibold">
                            <p className="text-slate-350 text-[9px] uppercase tracking-wider">Logged Cashier</p>
                            <p className="text-white">{auth.user?.name}</p>
                        </div>
                    </div>

                    <Link 
                        href={route('welcome')}
                        className="bg-transparent hover:bg-white/10 text-white border border-white/20 hover:border-white text-[10px] font-black px-4 py-2 rounded-xl transition-all uppercase"
                    >
                        Back to Shop
                    </Link>
                </div>
            </header>

            {/* 2. Core POS Terminal Split */}
            <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
                
                {/* LEFT SIDE: Products Catalog Grid */}
                <div className="w-full lg:w-3/5 p-4 lg:p-6 flex flex-col space-y-4 overflow-hidden h-1/2 lg:h-full">
                    
                    {/* Filter and Search widgets */}
                    <div className="flex items-center space-x-4 bg-white p-3 border rounded-2xl shadow-sm flex-shrink-0">
                        
                        {/* Categories selection */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold py-2.5 pl-3 pr-8 w-44 cursor-pointer focus:ring-0 focus:border-slate-300"
                        >
                            <option value="">ALL CATEGORIES</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                            ))}
                        </select>

                        {/* Search keyword input */}
                        <div className="relative flex-grow flex items-center">
                            <Search size={14} className="absolute left-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search apparel grid by name, SKU..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-xs w-full focus:bg-white focus:ring-0 focus:border-slate-300"
                            />
                        </div>

                    </div>

                    {/* Catalog products scroll container */}
                    <div className="flex-grow overflow-y-auto pr-1">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                                {filteredProducts.map((prod) => {
                                    const hasVariants = prod.variants && prod.variants.length > 0;
                                    
                                    return (
                                        <div 
                                            key={prod.id}
                                            onClick={() => prod.stock_quantity > 0 && addProductToPOS(prod)}
                                            className={`pos-product-card bg-white border border-slate-200 p-5 rounded-2xl shadow-sm transition-all duration-200 flex flex-col justify-between h-44 cursor-pointer select-none ${
                                                prod.stock_quantity <= 0
                                                    ? 'opacity-60 cursor-not-allowed'
                                                    : 'hover:border-amber-400 hover:shadow-md hover:scale-[1.01]'
                                            }`}
                                        >
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                                        {prod.category_name}
                                                    </span>
                                                    {prod.stock_quantity <= 0 && (
                                                        <span className="text-[9px] font-black text-red-650 bg-red-50 px-2 py-0.5 rounded border border-red-200/20">OUT OF STOCK</span>
                                                    )}
                                                </div>
                                                <h4 className="product-name text-base font-black text-slate-805 text-slate-800 line-clamp-2 leading-snug">
                                                    {prod.name}
                                                </h4>
                                            </div>

                                            <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                                                <div>
                                                    <p className="text-[11px] text-slate-400 font-bold font-mono">SKU: {prod.sku}</p>
                                                    <span className="product-price text-base font-black text-slate-905 text-slate-900 font-serif">
                                                        {settings.currency}{Number(prod.price).toFixed(2)}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    disabled={prod.stock_quantity <= 0}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (prod.stock_quantity > 0) addProductToPOS(prod);
                                                    }}
                                                    className={`pos-btn-small p-2.5 rounded-xl transition-all shadow-sm ${
                                                        prod.stock_quantity <= 0
                                                            ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                                            : 'bg-slate-900 hover:bg-amber-500 text-white'
                                                    }`}
                                                >
                                                    <Plus size={14} className="stroke-[3]" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white border rounded-2xl p-12 text-center text-xs font-semibold text-slate-400">
                                No clothing matches search keyword filters.
                            </div>
                        )}
                    </div>

                </div>

                {/* RIGHT SIDE: Cashier Checkout panel */}
                <div className="w-full lg:w-2/5 bg-white lg:border-l border-t lg:border-t-0 shadow-xl flex flex-col justify-between h-1/2 lg:h-full flex-shrink-0 z-10">
                    
                    {/* Upper Cart and Inputs Section */}
                    <div className="flex-grow flex flex-col overflow-hidden p-6 space-y-4">
                        
                        {/* Barcode scanner mockup input */}
                        <form onSubmit={handleBarcodeSubmit} className="relative flex items-center flex-shrink-0 border-b pb-4">
                            <Barcode size={18} className="absolute left-4 text-slate-400" />
                            <input
                                ref={barcodeRef}
                                type="text"
                                placeholder="Scan Barcode / Enter SKU exactly..."
                                value={barcodeInput}
                                onChange={(e) => setBarcodeInput(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-xs w-full focus:bg-white focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                            />
                            <button type="submit" className="hidden">Scan</button>
                        </form>

                        {/* Customer details input widgets */}
                        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Customer Name</label>
                                <input
                                    type="text"
                                    placeholder="Walk-in Guest"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="Phone Details"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs w-full"
                                />
                            </div>
                        </div>

                        {/* Order items cashier list scroll */}
                        <div className="flex-grow overflow-y-auto border border-slate-100 rounded-2xl bg-slate-50/50 p-4 space-y-3">
                            {cart.length > 0 ? (
                                cart.map((item) => (
                                    <div key={item.key} className="flex justify-between items-center bg-white border border-slate-100 p-3 rounded-xl shadow-inner-sm">
                                        <div className="space-y-0.5 max-w-[170px]">
                                            <h5 className="text-[11px] font-extrabold text-slate-800 truncate leading-snug">{item.name}</h5>
                                            <p className="text-[8px] font-black uppercase text-slate-400">
                                                {item.size ? `Size: ${item.size} • ` : ''} {item.color ? `Color: ${item.color} • ` : ''} SKU: {item.sku}
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            {/* Quantity controls */}
                                            <div className="flex items-center border border-slate-200 rounded-lg px-1 bg-slate-50 scale-75 flex-shrink-0">
                                                <button 
                                                    onClick={() => handleQtyChange(item.key, -1)}
                                                    className="pos-btn-small p-1 text-slate-500 hover:text-black focus:outline-none"
                                                >
                                                    <Minus size={11} />
                                                </button>
                                                <span className="px-2 text-[10px] font-bold text-slate-800 select-none">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleQtyChange(item.key, 1)}
                                                    className="pos-btn-small p-1 text-slate-500 hover:text-black focus:outline-none"
                                                >
                                                    <Plus size={11} />
                                                </button>
                                            </div>
 
                                            {/* Item cost */}
                                            <span className="text-xs font-black text-slate-900 flex-shrink-0 w-14 text-right">
                                                {settings.currency}{Number(item.price * item.quantity).toFixed(2)}
                                            </span>
 
                                            {/* Remove icon */}
                                            <button 
                                                onClick={() => handleRemoveItem(item.key)}
                                                className="pos-btn-small text-slate-400 hover:text-red-500 transition-all focus:outline-none"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col justify-center items-center text-center p-8 text-slate-400 space-y-2">
                                    <ShoppingCart size={24} className="opacity-40 animate-pulse" />
                                    <p className="text-[10px] font-black uppercase tracking-wider">POS BASKET VACANT</p>
                                    <p className="text-[9px] text-slate-400">Scan SKU or click catalog cells.</p>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Lower Checkout Action calculations */}
                    <div className="bg-slate-50 border-t p-6 space-y-4 flex-shrink-0">
                        
                        {/* Form controls for discount & payment */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">POS Flat Discount ({settings.currency})</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={discount}
                                    onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                                    className="bg-white border border-slate-200 rounded-xl py-1.5 px-3 text-xs w-full text-center font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Payment Selection</label>
                                <div className="flex border rounded-xl overflow-hidden text-xs font-bold text-center">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('cash')}
                                        className={`w-1/2 py-2 flex items-center justify-center space-x-1 transition-all ${
                                            paymentMethod === 'cash' 
                                                ? 'bg-slate-900 text-white font-extrabold' 
                                                : 'bg-white hover:bg-slate-50 text-slate-500'
                                        }`}
                                    >
                                        <Wallet size={11} />
                                        <span>CASH</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('card')}
                                        className={`w-1/2 py-2 flex items-center justify-center space-x-1 transition-all ${
                                            paymentMethod === 'card' 
                                                ? 'bg-slate-900 text-white font-extrabold' 
                                                : 'bg-white hover:bg-slate-50 text-slate-500'
                                        }`}
                                    >
                                        <CreditCard size={11} />
                                        <span>CARD</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Summary totals */}
                        <div className="space-y-2 text-xs font-semibold text-slate-650 border-b pb-3">
                            <div className="flex justify-between">
                                <span>Basket Subtotal</span>
                                <span className="text-slate-800 font-bold">{settings.currency}{Number(subtotal).toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-red-500">
                                    <span>POS Discount Deduction</span>
                                    <span>-{settings.currency}{Number(discount).toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>GST Tax Addition ({taxRate}%)</span>
                                <span className="text-slate-800 font-bold">{settings.currency}{Number(tax).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200/50">
                                <span className="font-serif">INVOICE PAYABLE</span>
                                <span className="font-serif">{settings.currency}{Number(grandTotal).toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Pay action */}
                        <button
                            onClick={handlePOSCheckout}
                            disabled={checkoutLoading || cart.length === 0}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-350 text-white text-xs font-black py-4 rounded-xl shadow-lg hover:shadow-emerald-500/10 transition-all uppercase flex items-center justify-center space-x-2 focus:outline-none"
                        >
                            <CheckCircle size={15} />
                            <span>{checkoutLoading ? 'Processing Checkout...' : 'SUBMIT TRANSACTION & RECEIPT'}</span>
                        </button>

                    </div>

                </div>

            </div>

            {/* Notification alert floating toasts */}
            {alertMessage && (
                <div className="fixed bottom-5 right-5 z-55 animate-in slide-in-from-bottom duration-250">
                    <div className={`px-5 py-3 rounded-xl shadow-2xl border font-bold text-xs flex items-center space-x-2.5 ${
                        alertMessage.type === 'success' 
                            ? 'bg-emerald-950 text-emerald-250 border-emerald-800' 
                            : 'bg-red-950 text-red-250 border-red-800'
                    }`}>
                        <span>{alertMessage.type === 'success' ? '✓' : '✗'}</span>
                        <span>{alertMessage.message}</span>
                    </div>
                </div>
            )}

            {/* RECEIPT THERMAL PRINT MODAL WINDOW */}
            {receiptModalOpen && printedReceipt && (
                <div className="fixed inset-0 z-55 overflow-y-auto flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setReceiptModalOpen(false)}></div>
                    
                    {/* Modal body */}
                    <div className="relative bg-white max-w-sm w-full rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6 animate-in zoom-in-95 duration-200">
                        
                        <div className="flex justify-between items-center pb-3 border-b">
                            <span className="text-xs font-black tracking-wider uppercase text-slate-400">Sale Receipt</span>
                            <button onClick={() => setReceiptModalOpen(false)}>
                                <X size={18} className="text-slate-500" />
                            </button>
                        </div>

                        {/* Print target div styled as high-end thermal paper receipt */}
                        <div id="thermal-receipt" className="bg-slate-50 p-4 border border-dashed border-slate-300 rounded-2xl max-h-[400px] overflow-y-auto text-xs font-mono space-y-6 text-slate-900 leading-snug">
                            
                            {/* Header store credentials */}
                            <div className="text-center space-y-0.5 border-b border-dashed pb-3.5">
                                <h3 className="text-sm font-black font-serif tracking-widest text-black uppercase">BRANDS STUDIO</h3>
                                <p className="text-[9px] text-slate-500 font-sans font-semibold">PREMIUM DESIGNER CLOTHING</p>
                                <p className="text-[9px] text-slate-500 font-sans font-semibold">{settings.contact_address || '789 Fashion Avenue, NYC'}</p>
                                <p className="text-[9px] text-slate-500 font-sans font-semibold">{settings.contact_phone || '+1 (555) 019-2834'}</p>
                            </div>

                            {/* Transaction details */}
                            <div className="space-y-0.5 text-[10px] text-slate-600">
                                <p>INVOICE: <span className="text-black font-bold">{printedReceipt.order_number}</span></p>
                                <p>CASHIER: <span className="text-black">{printedReceipt.cashier?.name}</span></p>
                                <p>DATE: <span className="text-black">{new Date(printedReceipt.created_at).toLocaleString()}</span></p>
                                <p>CUSTOMER: <span className="text-black font-bold uppercase">{printedReceipt.customer_name}</span></p>
                                {printedReceipt.customer_phone && <p>PHONE: <span className="text-black">{printedReceipt.customer_phone}</span></p>}
                            </div>

                            {/* Items table */}
                            <div className="border-t border-b border-dashed py-3.5 space-y-2">
                                <div className="flex justify-between font-black text-black text-[10px] pb-1">
                                    <span>ITEM DESCRIP.</span>
                                    <span>QTY x PRICE</span>
                                    <span>TOTAL</span>
                                </div>
                                {printedReceipt.items?.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-[10px] leading-tight">
                                        <div className="max-w-[120px]">
                                            <p className="font-extrabold uppercase truncate">{item.product?.name}</p>
                                            {item.variant && (
                                                <p className="text-[8px] text-slate-500 font-sans">
                                                    ({item.variant.color} / {item.variant.size})
                                                </p>
                                            )}
                                        </div>
                                        <span>{item.quantity} x {settings.currency}{Number(item.price).toFixed(2)}</span>
                                        <span className="font-black text-black">
                                            {settings.currency}{Number(item.total).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Aggregates checkout block */}
                            <div className="space-y-2 text-[10px] font-bold text-slate-700">
                                <div className="flex justify-between">
                                    <span>SUBTOTAL</span>
                                    <span>{settings.currency}{Number(printedReceipt.subtotal).toFixed(2)}</span>
                                </div>
                                {Number(printedReceipt.discount) > 0 && (
                                    <div className="flex justify-between text-red-500">
                                        <span>DISCOUNT DEDUCT.</span>
                                        <span>-{settings.currency}{Number(printedReceipt.discount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span>GST TAX ({taxRate}%)</span>
                                    <span>{settings.currency}{Number(printedReceipt.tax).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-black text-black border-t border-dashed pt-2.5">
                                    <span>TOTAL DUE</span>
                                    <span>{settings.currency}{Number(printedReceipt.total).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Footer greeting card */}
                            <div className="text-center text-[9px] text-slate-500 pt-3 border-t border-dashed leading-snug">
                                <p className="font-sans font-bold">♥ WEAR YOUR SIGNATURE. THANK YOU! ♥</p>
                                <p className="font-sans">Exchange claims valid within 30 days with receipt.</p>
                            </div>

                        </div>

                        {/* Modal Action Controls */}
                        <div className="flex space-x-3 pt-2">
                            <button
                                onClick={handlePrintReceipt}
                                className="flex-1 bg-slate-900 hover:bg-black text-white text-xs font-black py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 focus:outline-none uppercase"
                            >
                                <Printer size={13} />
                                <span>Thermal Print</span>
                            </button>
                            <button
                                onClick={() => setReceiptModalOpen(false)}
                                className="w-24 bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-black py-3 rounded-xl transition-all uppercase focus:outline-none"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}
