import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { 
    Search, ShoppingCart, User, Plus, Minus, Trash2, 
    CreditCard, Wallet, Barcode, Printer, X, Wifi, 
    AlertTriangle, CheckCircle, RefreshCcw, TrendingUp, 
    Users, FileText, ArrowDownLeft, ShieldAlert, BadgePercent, Check,
    Shirt
} from 'lucide-react';
import axios from 'axios';
import { getAssetUrl, getProductImageUrl } from '../../Utils/asset';

export default function POS({ products, categories, customers, recentOrders, reports }) {
    const { auth, settings } = usePage().props;
    const currency = settings.currency_symbol || 'Rs.';

    const [activeTab, setActiveTab] = useState('terminal'); // terminal, ledger, reports
    const [cart, setCart] = useState(() => {
        try {
            const stored = localStorage.getItem('pos_cart');
            const parsed = stored ? JSON.parse(stored) : [];
            if (Array.isArray(parsed)) {
                return parsed.filter(item => item && typeof item === 'object' && item.key);
            }
            return [];
        } catch (e) {
            return [];
        }
    });
    
    // Search / Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    
    // POS Form metadata
    const [selectedCustomerId, setSelectedCustomerId] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pos_customer_id') || '';
        }
        return '';
    });
    const [customerName, setCustomerName] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pos_customer_name') || '';
        }
        return '';
    });
    const [customerPhone, setCustomerPhone] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pos_customer_phone') || '';
        }
        return '';
    });
    const [customerEmail, setCustomerEmail] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pos_customer_email') || '';
        }
        return '';
    });
    const [discount, setDiscount] = useState(() => {
        if (typeof window !== 'undefined') {
            const val = localStorage.getItem('pos_discount');
            return val ? Number(val) : 0;
        }
        return 0;
    });
    const [discountType, setDiscountType] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pos_discount_type') || 'flat';
        }
        return 'flat';
    });
    const [paymentMethod, setPaymentMethod] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pos_payment_method') || 'cash';
        }
        return 'cash';
    });

    useEffect(() => {
        localStorage.setItem('pos_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('pos_customer_id', selectedCustomerId);
    }, [selectedCustomerId]);

    useEffect(() => {
        localStorage.setItem('pos_customer_name', customerName);
    }, [customerName]);

    useEffect(() => {
        localStorage.setItem('pos_customer_phone', customerPhone);
    }, [customerPhone]);

    useEffect(() => {
        localStorage.setItem('pos_customer_email', customerEmail);
    }, [customerEmail]);

    useEffect(() => {
        localStorage.setItem('pos_discount', discount.toString());
    }, [discount]);

    useEffect(() => {
        localStorage.setItem('pos_discount_type', discountType);
    }, [discountType]);

    useEffect(() => {
        localStorage.setItem('pos_payment_method', paymentMethod);
    }, [paymentMethod]);

    // Payment details
    const [cashReceived, setCashReceived] = useState('');
    const [amountPaid, setAmountPaid] = useState('');
    const [onlineRef, setOnlineRef] = useState('');
    const [partialDetails, setPartialDetails] = useState({ cash: '', card: '', online: '' });

    // Barcode query state
    const [barcodeInput, setBarcodeInput] = useState('');
    const barcodeRef = useRef(null);
    const cartItemsRef = useRef(null);

    // Customer search / add modal
    const [addCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
    const [newCustName, setNewCustName] = useState('');
    const [newCustPhone, setNewCustPhone] = useState('');
    const [newCustEmail, setNewCustEmail] = useState('');

    // Transaction outcome receipt modal
    const [receiptModalOpen, setReceiptModalOpen] = useState(false);
    const [printedReceipt, setPrintedReceipt] = useState(null);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null); // { type, message }

    // Ledger variables
    const [ledgerSearch, setLedgerSearch] = useState('');
    const [selectedLedgerOrder, setSelectedLedgerOrder] = useState(null);
    const [refundConfirmOrder, setRefundConfirmOrder] = useState(null);
    const [refundingLoading, setRefundingLoading] = useState(false);

    // Reports filter
    const [stockReportLowOnly, setStockReportLowOnly] = useState(false);

    useEffect(() => {
        // Auto-focus barcode scanner input
        if (barcodeRef.current && activeTab === 'terminal') {
            barcodeRef.current.focus();
        }
    }, [activeTab]);

    const triggerAlert = (type, message) => {
        setAlertMessage({ type, message });
        setTimeout(() => setAlertMessage(null), 4000);
    };

    // Helper to add product to POS basket
    const addProductToPOS = (product, variant = null) => {
        if (!product) return;

        // Automatically resolve first available variant if not specified
        if (!variant && product.variants && product.variants.length > 0) {
            const availableVariant = product.variants.find(v => v.stock_quantity > 0);
            variant = availableVariant || product.variants[0];
        }

        const itemKey = `${product.id}-${variant ? variant.id : 'none'}`;
        const price = variant ? variant.price : product.price;
        const maxStock = variant ? variant.stock_quantity : product.stock_quantity;

        setCart(prevCart => {
            const safeCart = Array.isArray(prevCart) ? prevCart.filter(Boolean) : [];
            const existing = safeCart.find(item => item && item.key === itemKey);
            const remaining = safeCart.filter(item => item && item.key !== itemKey);

            const newItem = {
                key: itemKey,
                id: product.id,
                variant_id: variant ? variant.id : null,
                name: product.name,
                sku: variant ? variant.sku : product.sku,
                size: variant ? variant.size : null,
                color: variant ? variant.color : null,
                price: Number(price) || 0,
                quantity: existing ? existing.quantity + 1 : 1,
                max_stock: Number(maxStock) || 0
            };

            return [newItem, ...remaining];
        });

        triggerAlert('success', `Added ${product.name} to cart.`);

        // Scroll cart list to top so newly added products are visible immediately
        setTimeout(() => {
            if (cartItemsRef.current) {
                cartItemsRef.current.scrollTop = 0;
            }
        }, 50);

        // Refocus barcode scanner
        if (barcodeRef.current) barcodeRef.current.focus();
    };

    // AJAX Barcode / SKU query trigger
    const handleBarcodeSubmit = async (e) => {
        e.preventDefault();
        if (!barcodeInput.trim()) return;

        try {
            const response = await axios.get(route('admin.pos.search'), {
                params: { query: barcodeInput }
            });

            if (response.data && response.data.id) {
                const res = response.data;
                
                // Find full product from list
                const fullProd = products.find(p => p.id === res.id);
                const fullVariant = res.variant_id && fullProd.variants 
                    ? fullProd.variants.find(v => v.id === res.variant_id)
                    : null;

                if (fullProd) {
                    addProductToPOS(fullProd, fullVariant);
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

    const handleQtyChange = (key, amount) => {
        setCart(prevCart => {
            const safeCart = Array.isArray(prevCart) ? prevCart.filter(Boolean) : [];
            const item = safeCart.find(i => i && i.key === key);
            if (!item) return safeCart;

            const newQty = item.quantity + amount;
            if (newQty <= 0) {
                return safeCart.filter(i => i && i.key !== key);
            } else {
                return safeCart.map(i => i && i.key === key ? { ...i, quantity: newQty } : i);
            }
        });
    };

    const handleRemoveItem = (key) => {
        setCart(prevCart => {
            const safeCart = Array.isArray(prevCart) ? prevCart.filter(Boolean) : [];
            return safeCart.filter(i => i && i.key !== key);
        });
    };

    // Customer Selection
    const handleCustomerChange = (customerId) => {
        setSelectedCustomerId(customerId);
        if (customerId === '') {
            setCustomerName('');
            setCustomerPhone('');
            setCustomerEmail('');
        } else {
            const selected = customers.find(c => c.id === Number(customerId));
            if (selected) {
                setCustomerName(selected.name);
                setCustomerPhone(selected.phone || '');
                setCustomerEmail(selected.email || '');
            }
        }
    };

    // Add customer form submission
    const handleAddCustomer = async (e) => {
        e.preventDefault();
        if (!newCustName.trim()) return;

        try {
            const response = await axios.post(route('admin.pos.customer.store'), {
                name: newCustName,
                phone: newCustPhone,
                email: newCustEmail || undefined
            });

            if (response.data.success) {
                const newCust = response.data.customer;
                // Add to customer list state in memory
                customers.push(newCust);
                handleCustomerChange(newCust.id);
                setAddCustomerModalOpen(false);
                setNewCustName('');
                setNewCustPhone('');
                setNewCustEmail('');
                triggerAlert('success', 'New Customer registered successfully!');
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to add customer.';
            triggerAlert('error', msg);
        }
    };

    // Calculations
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxRate = Number(settings.tax_rate || 13);
    
    // Discount logic (flat vs percentage)
    const discountDeduction = discountType === 'flat' 
        ? Number(discount) 
        : (subtotal * (Number(discount) / 100));

    const taxableAmount = Math.max(0, subtotal - discountDeduction);
    const tax = taxableAmount * (taxRate / 100);
    const grandTotal = taxableAmount + tax;

    // Change calculator for cash
    const changeReturn = Math.max(0, Number(cashReceived) - grandTotal);

    // Perform POS Checkout submission
    const handlePOSCheckout = async () => {
        if (cart.length === 0) {
            triggerAlert('error', 'POS cart is currently empty.');
            return;
        }

        // Validate Cash payment
        if (paymentMethod === 'cash' && Number(cashReceived) < grandTotal) {
            triggerAlert('error', `Insufficient Cash Received. Total is ${currency} ${grandTotal.toFixed(2)}`);
            return;
        }

        // Validate Partial payment
        if (paymentMethod === 'partial' && !amountPaid) {
            triggerAlert('error', `Please specify the partial amount paid.`);
            return;
        }

        setCheckoutLoading(true);
        try {
            const payload = {
                customer_id: selectedCustomerId || undefined,
                customer_name: customerName || undefined,
                customer_phone: customerPhone || undefined,
                customer_email: customerEmail || undefined,
                payment_method: paymentMethod,
                items: cart.map(item => ({
                    id: item.id,
                    quantity: item.quantity,
                    variant_id: item.variant_id,
                    price: item.price
                })),
                discount: discountDeduction,
                cash_received: paymentMethod === 'cash' ? Number(cashReceived) : undefined,
                amount_paid: paymentMethod === 'partial' ? Number(amountPaid) : (paymentMethod === 'cash' ? grandTotal : undefined),
                payment_details: paymentMethod === 'partial' ? partialDetails : (paymentMethod === 'online' ? { reference: onlineRef } : undefined)
            };

            const response = await axios.post(route('admin.pos.checkout'), payload);

            if (response.data.success) {
                setPrintedReceipt(response.data.receipt);
                setReceiptModalOpen(true);
                // Reset checkout form
                setCart([]);
                setSelectedCustomerId('');
                setCustomerName('');
                setCustomerPhone('');
                setCustomerEmail('');
                setDiscount(0);
                setCashReceived('');
                setAmountPaid('');
                setOnlineRef('');
                setPartialDetails({ cash: '', card: '', online: '' });
                setPaymentMethod('cash');
                triggerAlert('success', 'Sales transaction recorded successfully!');
                
                // Refresh list of recent orders
                router.reload({ only: ['recentOrders', 'reports'] });
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Transaction checkout failed.';
            triggerAlert('error', msg);
        } finally {
            setCheckoutLoading(false);
        }
    };

    // Refund Submission
    const handleRefundSubmit = async () => {
        if (!refundConfirmOrder) return;
        
        setRefundingLoading(true);
        try {
            const response = await axios.post(route('admin.pos.refund', refundConfirmOrder.id));
            if (response.data.success) {
                triggerAlert('success', 'Order returned and refunded. Stock restored!');
                setRefundConfirmOrder(null);
                setSelectedLedgerOrder(null);
                // Reload data
                router.reload({ only: ['recentOrders', 'reports'] });
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to refund order.';
            triggerAlert('error', msg);
        } finally {
            setRefundingLoading(false);
        }
    };

    // Filter catalog products
    const filteredProducts = products.filter(p => {
        const matchesCategory = selectedCategory ? p.category_id === Number(selectedCategory) : true;
        const matchesSearch = searchQuery 
            ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase())
            : true;
        return matchesCategory && matchesSearch;
    });

    // Ledger filtering
    const filteredLedger = recentOrders.filter(o => {
        if (!ledgerSearch.trim()) return true;
        const search = ledgerSearch.toLowerCase();
        return o.order_number.toLowerCase().includes(search) || 
               (o.customer_name && o.customer_name.toLowerCase().includes(search)) ||
               (o.customer_phone && o.customer_phone.includes(search));
    });

    const handlePrintReceipt = () => {
        const printContent = document.getElementById('thermal-receipt').innerHTML;
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(`
            <html>
                <head>
                    <title>Thermal Receipt</title>
                    <style>
                        body { font-family: monospace; padding: 10px; font-size: 11px; width: 80mm; color: #000; margin: 0; }
                        .text-center { text-align: center; }
                        .text-right { text-align: right; }
                        .border-b { border-bottom: 1px dashed #000; }
                        .py-2 { padding-top: 5px; padding-bottom: 5px; }
                        .my-2 { margin-top: 5px; margin-bottom: 5px; }
                        .font-bold { font-weight: bold; }
                        .flex { display: flex; justify-content: space-between; }
                        .items-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                        .items-table th, .items-table td { font-size: 10px; text-align: left; }
                        .items-table td.total { text-align: right; }
                        .items-table th.total { text-align: right; }
                        .brand-title { font-size: 16px; font-weight: 900; letter-spacing: 2px; }
                    </style>
                </head>
                <body>
                    ${printContent}
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(function() { window.frameElement.remove(); }, 100);
                        }
                    </script>
                </body>
            </html>
        `);
        doc.close();
    };

    return (
        <AdminLayout title="POS System Terminal" noSidebar={true}>
            <Head title="POS Cashier Terminal" />

            {/* TAB CONTAINER */}
            <div className="pos-system flex-grow flex flex-col min-h-0 h-full space-y-3 p-3 overflow-hidden bg-[#F8FAFC] dark:bg-slate-900/40">
                
                {/* 1. Header Control Deck & Tab Selection */}
                <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
                    
                    <div className="flex items-center space-x-2.5">
                        <span className="p-1.5 bg-blue-50 dark:bg-slate-900 text-[#2563EB] rounded-lg">
                            <User size={14} />
                        </span>
                        <div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block leading-none">Logged Cashier</span>
                            <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider block mt-0.5">{auth.user.name} ({auth.user.role.toUpperCase()})</span>
                        </div>
                    </div>

                    {/* Navigation tabs */}
                    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold w-full sm:w-auto">
                        <button
                            onClick={() => setActiveTab('terminal')}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md flex-1 md:flex-none transition-all ${
                                activeTab === 'terminal' 
                                    ? 'bg-[#2563EB] text-white font-bold shadow-sm' 
                                    : 'text-slate-655 dark:text-slate-400 hover:text-[#2563EB]'
                            }`}
                        >
                            <ShoppingCart size={13} />
                            <span>Cashier Terminal</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('ledger')}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md flex-1 md:flex-none transition-all ${
                                activeTab === 'ledger' 
                                    ? 'bg-[#2563EB] text-white font-bold shadow-sm' 
                                    : 'text-slate-655 dark:text-slate-400 hover:text-[#2563EB]'
                            }`}
                        >
                            <FileText size={13} />
                            <span>Ledger & Returns</span>
                        </button>
                        
                        {/* Reports Tab only for Admin */}
                        {auth.user.role === 'super_admin' || auth.user.role === 'admin' ? (
                            <button
                                onClick={() => setActiveTab('reports')}
                                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md flex-1 md:flex-none transition-all ${
                                    activeTab === 'reports' 
                                        ? 'bg-[#2563EB] text-white font-bold shadow-sm' 
                                        : 'text-slate-655 dark:text-slate-400 hover:text-[#2563EB]'
                                }`}
                            >
                                <TrendingUp size={13} />
                               <span>POS Reports</span>
                            </button>
                        ) : null}
                    </div>

                </div>

                {/* 2. TAB CONTENT: TERMINAL */}
                {activeTab === 'terminal' && (
                    <div className="flex-grow flex flex-col lg:flex-row gap-3 min-h-0 h-full overflow-hidden">
                        
                        {/* LEFT: Products Grid (65% width) */}
                        <div className="w-full lg:w-[65%] flex flex-col min-h-0 h-full space-y-3">
                            
                            {/* Search and Category Filter */}
                            <div className="grid grid-cols-12 gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0">
                                <div className="col-span-4">
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg !text-xs font-bold !py-1.5 !px-2.5 w-full text-slate-700 dark:text-slate-350 cursor-pointer focus:ring-1 focus:ring-[#2563EB]/25 focus:border-[#2563EB] shadow-sm"
                                    >
                                        <option value="">ALL CATEGORIES</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-8 relative flex items-center">
                                    <Search size={13} className="absolute left-3 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search catalog by product name, SKU..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg catalog-search-input !py-1.5 !pl-9 !pr-3.5 !text-xs w-full text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-1 focus:ring-[#2563EB]/25 focus:border-[#2563EB] focus:bg-white shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Catalog Products list */}
                            <div className="flex-grow overflow-y-auto pr-1 min-h-0">
                                {filteredProducts.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 pb-4">
                                        {filteredProducts.map((prod) => (
                                            <div 
                                                key={prod.id}
                                                onClick={() => addProductToPOS(prod)}
                                                className="group relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-sm hover:shadow-md hover:border-[#2563EB]/40 dark:hover:border-[#2563EB]/40 transition-all duration-205 flex flex-col cursor-pointer overflow-hidden select-none"
                                            >
                                                {/* Product Image Area */}
                                                <div className="relative aspect-[4/3] bg-slate-50 dark:bg-slate-900/60 overflow-hidden">
                                                    {getProductImageUrl(prod) ? (
                                                        <img 
                                                            src={getAssetUrl(`storage/${getProductImageUrl(prod)}`)} 
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                                            alt={prod.name} 
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-350 dark:text-slate-600 bg-slate-100/50 dark:bg-slate-900/50">
                                                            <Shirt size={22} />
                                                        </div>
                                                    )}
                                                    
                                                    {/* Floating Add Button */}
                                                    <div className="absolute bottom-2 right-2 shadow-sm transition-all">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                addProductToPOS(prod);
                                                            }}
                                                            className="p-1.5 bg-[#2563EB] hover:bg-[#3B82F6] text-white rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                                                        >
                                                            <Plus size={12} className="stroke-[3]" />
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Stock status badge */}
                                                    {prod.stock_quantity <= 0 && (
                                                        <span className="absolute top-2 left-2 text-[7px] font-bold text-red-655 bg-red-50 dark:bg-red-950/80 px-1.5 py-0.5 rounded border border-red-200/40">OUT OF STOCK</span>
                                                    )}
                                                </div>

                                                {/* Content details */}
                                                <div className="p-2.5 flex-grow flex flex-col justify-between space-y-1">
                                                    <div>
                                                        <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block truncate">
                                                            {prod.category_name || 'General'}
                                                        </span>
                                                        <h4 className="text-[11px] font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-tight group-hover:text-[#2563EB] transition-colors" title={prod.name}>
                                                            {prod.name}
                                                        </h4>
                                                    </div>
                                                    
                                                    <div className="flex justify-between items-baseline pt-1 border-t border-slate-100/60 dark:border-slate-700/40">
                                                        <span className="text-[8px] font-mono text-slate-400 truncate max-w-[50%]">
                                                            {prod.sku}
                                                        </span>
                                                        <span className="text-[11px] font-bold text-slate-900 dark:text-slate-100 font-sans">
                                                            {currency} {Number(prod.price).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-12 text-center text-xs font-bold text-slate-400 shadow-sm">
                                        No active catalog products match the query filters.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Cart and Payment Panels (35% width) */}
                        <div className="w-full lg:w-[35%] flex flex-col min-h-0 h-full space-y-3">
                            
                            {/* Card 1: Cart Summary */}
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center space-x-2">
                                    <ShoppingCart size={14} className="text-[#2563EB]" />
                                    <span className="text-xs font-bold text-slate-850 dark:text-slate-200">Cart Summary</span>
                                </div>
                                <div className="flex items-center space-x-1.5">
                                    <span className="bg-blue-50 dark:bg-slate-900 text-[#2563EB] text-[10px] font-bold px-2 py-0.5 rounded-md border border-blue-100/50 dark:border-slate-800">
                                        {cart.reduce((sum, item) => sum + (item.quantity || 0), 0)} Units
                                    </span>
                                    <span className="text-xs font-black text-slate-905 dark:text-white">
                                        {currency} {subtotal.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Card 2: Cart Items */}
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm flex-grow flex flex-col min-h-0 overflow-hidden space-y-2">
                                <div className="flex justify-between items-center pb-1.5 border-b border-slate-100 dark:border-slate-705 flex-shrink-0">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cart Items</span>
                                    {cart.length > 0 && (
                                        <button 
                                            type="button" 
                                            onClick={() => setCart([])} 
                                            className="text-[10px] text-red-500 hover:text-red-600 font-bold transition-all"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                </div>
                                
                                {/* Compact Scan input */}
                                <form onSubmit={handleBarcodeSubmit} className="relative flex items-center w-full flex-shrink-0">
                                    <Barcode size={13} className="absolute left-2.5 text-slate-400 z-10" />
                                    <input
                                        ref={barcodeRef}
                                        type="text"
                                        placeholder="Scan barcode/SKU to add..."
                                        value={barcodeInput}
                                        onChange={(e) => setBarcodeInput(e.target.value)}
                                        className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg !py-1 !pl-8 !pr-2.5 !text-xs w-full text-slate-800 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-[#2563EB]"
                                    />
                                    <button type="submit" className="hidden">Scan</button>
                                </form>

                                {/* Cart items list */}
                                <div ref={cartItemsRef} className="flex-grow overflow-y-auto space-y-2 pr-1 min-h-[80px]">
                                    {cart.length > 0 ? (
                                        cart.filter(Boolean).map((item) => {
                                            const productObj = products.find(p => p.id === item.id);
                                            return (
                                                <div key={item.key} className="flex items-center justify-between p-2 bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-700/50 rounded-lg gap-2 transition-all">
                                                    {/* Thumbnail */}
                                                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                                        {productObj && getProductImageUrl(productObj) ? (
                                                            <img 
                                                                src={getAssetUrl(`storage/${getProductImageUrl(productObj)}`)} 
                                                                className="w-full h-full object-cover" 
                                                                alt={item.name} 
                                                            />
                                                        ) : (
                                                            <Shirt size={12} className="text-slate-400" />
                                                        )}
                                                    </div>

                                                    {/* Details */}
                                                    <div className="flex-grow min-w-0">
                                                        <h5 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate leading-tight" title={item.name}>
                                                            {item.name}
                                                        </h5>
                                                        <div className="flex items-center space-x-1.5 mt-0.5">
                                                            {item.size && (
                                                                <span className="bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[7px] font-bold uppercase px-1 rounded">
                                                                    {item.size}
                                                                </span>
                                                            )}
                                                            {item.color && (
                                                                <span className="bg-slate-200/60 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-[7px] font-bold uppercase px-1 rounded">
                                                                    {item.color}
                                                                </span>
                                                            )}
                                                            <span className="text-[8px] font-mono text-slate-400">
                                                                {item.sku}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Controls & Price */}
                                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                                        {/* Qty Controls */}
                                                        <div className="flex items-center border border-slate-205 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md p-0.5 shadow-sm scale-90">
                                                            <button 
                                                                type="button"
                                                                onClick={() => handleQtyChange(item.key, -1)}
                                                                className="p-0.5 hover:text-blue-600 text-slate-400 hover:scale-105 transition-all"
                                                            >
                                                                <Minus size={8} className="stroke-[2.5]" />
                                                            </button>
                                                            <span className="px-1 text-[10px] font-bold text-slate-800 dark:text-slate-100 font-mono select-none">
                                                                {item.quantity}
                                                            </span>
                                                            <button 
                                                                type="button"
                                                                onClick={() => handleQtyChange(item.key, 1)}
                                                                className="p-0.5 hover:text-blue-600 text-slate-400 hover:scale-105 transition-all"
                                                                disabled={item.quantity >= item.max_stock}
                                                            >
                                                                <Plus size={8} className="stroke-[2.5]" />
                                                            </button>
                                                        </div>

                                                        {/* Price */}
                                                        <span className="text-[10px] font-bold text-slate-900 dark:text-slate-100 font-mono w-14 text-right">
                                                            {currency}{(item.price * item.quantity).toLocaleString()}
                                                        </span>

                                                        {/* Delete */}
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleRemoveItem(item.key)}
                                                            className="p-1 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 rounded transition-all"
                                                            title="Delete"
                                                        >
                                                            <Trash2 size={11} className="stroke-[2.5]" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="flex flex-col justify-center items-center text-center p-4 text-slate-400 space-y-1.5 my-auto h-full">
                                            <ShoppingCart size={20} className="opacity-25 text-[#2563EB] animate-pulse" />
                                            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Cart is empty</p>
                                            <p className="text-[8px] text-slate-400">Scan SKU or click products to add</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card 3: Customer Info */}
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm space-y-2 flex-shrink-0">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Customer Info</label>
                                    <button
                                        type="button"
                                        onClick={() => setAddCustomerModalOpen(true)}
                                        className="text-[10px] text-[#2563EB] hover:text-[#3B82F6] font-bold flex items-center space-x-0.5 transition-all"
                                    >
                                        <Plus size={9} className="stroke-[3]" />
                                        <span>New Customer</span>
                                    </button>
                                </div>
                                
                                <select
                                    value={selectedCustomerId}
                                    onChange={(e) => handleCustomerChange(e.target.value)}
                                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg !text-xs font-bold !py-1 !px-2 w-full text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-[#2563EB] shadow-sm cursor-pointer"
                                >
                                    <option value="">WALK-IN (GUEST)</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.name.toUpperCase()} {c.phone ? `(${c.phone})` : ''}
                                        </option>
                                    ))}
                                </select>

                                {!selectedCustomerId && (
                                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                                        <input
                                            type="text"
                                            placeholder="Guest Name"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg !py-1 !px-2 !text-[11px] text-slate-800 dark:text-slate-200 w-full placeholder-slate-400 focus:border-[#2563EB]"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Guest Phone"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg !py-1 !px-2 !text-[11px] text-slate-800 dark:text-slate-200 w-full placeholder-slate-400 focus:border-[#2563EB]"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Card 4: Order Summary */}
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm space-y-2 flex-shrink-0">
                                <div className="flex justify-between items-center border-b border-slate-105 dark:border-slate-700/60 pb-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order Summary</label>
                                    
                                    {/* Discount controls */}
                                    <div className="flex items-center space-x-1.5">
                                        <span className="text-[9px] text-slate-400 font-bold">Discount:</span>
                                        <div className="flex border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden bg-slate-50 dark:bg-slate-905">
                                            <button
                                                type="button"
                                                onClick={() => setDiscountType('flat')}
                                                className={`px-1 py-0.5 text-[9px] font-bold transition-all ${discountType === 'flat' ? 'bg-[#2563EB] text-white' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                {currency}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDiscountType('percent')}
                                                className={`px-1 py-0.5 text-[9px] font-bold transition-all ${discountType === 'percent' ? 'bg-[#2563EB] text-white' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                %
                                            </button>
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            value={discount || ''}
                                            onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md !py-0.5 !px-1.5 !text-[10px] text-center text-slate-800 dark:text-slate-200 font-mono font-bold w-10 focus:ring-1 focus:ring-[#2563EB]"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-1 text-xs font-semibold text-slate-500 dark:text-slate-400 font-sans">
                                    <div className="flex justify-between items-center">
                                        <span>Subtotal</span>
                                        <span className="text-slate-800 dark:text-slate-200 font-bold font-mono">{currency} {subtotal.toLocaleString()}</span>
                                    </div>
                                    {discountDeduction > 0 && (
                                        <div className="flex justify-between items-center text-rose-600 dark:text-rose-400 font-bold">
                                            <span>Discount</span>
                                            <span className="font-mono">-{currency} {discountDeduction.toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span>GST ({taxRate}%)</span>
                                        <span className="text-slate-800 dark:text-slate-200 font-bold font-mono">{currency} {tax.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-900 dark:text-white pt-1 border-t border-slate-100 dark:border-slate-700/60 font-bold">
                                        <span className="uppercase text-[9px] tracking-wider font-extrabold">Grand Total</span>
                                        <span className="text-sm font-black font-mono text-[#2563EB]">{currency} {grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 5: Payment Section */}
                            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-sm space-y-2 flex-shrink-0">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Payment Method</label>
                                    <div className="grid grid-cols-4 gap-1">
                                        {[
                                            { id: 'cash', label: 'Cash' },
                                            { id: 'card', label: 'Card' },
                                            { id: 'online', label: 'Online' },
                                            { id: 'partial', label: 'Split' }
                                        ].map(method => (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`py-1 rounded-md text-[10px] font-bold text-center border transition-all ${
                                                    paymentMethod === method.id 
                                                        ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm' 
                                                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                                                }`}
                                            >
                                                {method.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {paymentMethod === 'cash' && (
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 grid grid-cols-2 gap-2 items-center">
                                        <div>
                                            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Cash Received</span>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={cashReceived}
                                                onChange={(e) => setCashReceived(e.target.value)}
                                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md !py-0.5 !px-1.5 !text-xs text-slate-800 dark:text-white font-mono font-bold w-full text-center focus:ring-1 focus:ring-[#2563EB]"
                                            />
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Change Return</span>
                                            <span className={`block text-xs font-bold font-mono ${changeReturn > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                                {currency}{changeReturn.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === 'online' && (
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                                        <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Transaction Ref ID</span>
                                        <input
                                            type="text"
                                            placeholder="Enter Reference Slip #"
                                            value={onlineRef}
                                            onChange={(e) => setOnlineRef(e.target.value)}
                                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md !py-0.5 !px-1.5 !text-xs text-slate-800 dark:text-white font-mono w-full focus:ring-1 focus:ring-[#2563EB]"
                                        />
                                    </div>
                                )}

                                {paymentMethod === 'partial' && (
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                                        <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Split Payment (Cash / Card / Online)</span>
                                        <div className="grid grid-cols-3 gap-1">
                                            <input
                                                type="number"
                                                placeholder="Cash"
                                                value={partialDetails.cash}
                                                onChange={(e) => setPartialDetails({ ...partialDetails, cash: e.target.value })}
                                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md !py-0.5 !px-1 text-[10px] font-bold text-center focus:ring-1 focus:ring-[#2563EB]"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Card"
                                                value={partialDetails.card}
                                                onChange={(e) => setPartialDetails({ ...partialDetails, card: e.target.value })}
                                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md !py-0.5 !px-1 text-[10px] font-bold text-center focus:ring-1 focus:ring-[#2563EB]"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Online"
                                                value={partialDetails.online}
                                                onChange={(e) => setPartialDetails({ ...partialDetails, online: e.target.value })}
                                                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md !py-0.5 !px-1 text-[10px] font-bold text-center focus:ring-1 focus:ring-[#2563EB]"
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handlePOSCheckout}
                                    disabled={checkoutLoading || cart.length === 0}
                                    className="w-full bg-[#2563EB] hover:bg-[#3B82F6] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white text-xs font-black py-3 rounded-xl transition-all shadow-md uppercase flex items-center justify-center space-x-1.5 select-none"
                                >
                                    <CheckCircle size={13} className="stroke-[3]" />
                                    <span>{checkoutLoading ? 'Processing...' : 'Complete Sale'}</span>
                                </button>
                            </div>
                        </div>

                    </div>
                )}

                {/* 3. TAB CONTENT: LEDGER & RETURNS */}
                {activeTab === 'ledger' && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        
                        {/* LEFT: Ledger list (3/5 columns) */}
                        <div className="lg:col-span-3 bg-slate-50 p-6 rounded-2xl border border-slate-250 shadow-sm flex flex-col lg:h-[calc(100vh-230px)] min-h-[620px]">
                            
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4 flex-shrink-0">
                                <div>
                                    <h3 className="text-base font-black text-slate-800 tracking-wide uppercase font-serif">POS Order Ledger</h3>
                                    <p className="text-sm text-slate-500 font-bold mt-0.5">Filter sales logs and manage customer returns</p>
                                </div>
                                <div className="relative flex items-center w-full sm:w-64">
                                    <Search size={14} className="absolute left-3 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search invoice, phone, customer..."
                                        value={ledgerSearch}
                                        onChange={(e) => setLedgerSearch(e.target.value)}
                                        className="bg-white border border-slate-200 rounded-xl !py-2 !pl-9 !pr-3 !text-sm text-slate-800 placeholder-slate-400 w-full"
                                    />
                                </div>
                            </div>

                            <div className="flex-grow overflow-y-auto pr-1">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-200 text-sm uppercase text-slate-500 font-black tracking-wider">
                                            <th className="py-3 px-4">Invoice #</th>
                                            <th className="py-3 px-3">Date</th>
                                            <th className="py-3 px-3">Customer</th>
                                            <th className="py-3 px-3 text-center">Status</th>
                                            <th className="py-3 px-3 text-right">Total</th>
                                            <th className="py-3 px-4 text-center">Receipt</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredLedger.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="py-12 text-center text-sm text-slate-400 font-bold uppercase tracking-wider">
                                                    No matching transactions found in POS history
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredLedger.map((order) => (
                                                <tr 
                                                    key={order.id} 
                                                    onClick={() => setSelectedLedgerOrder(order)}
                                                    className={`text-base hover:bg-slate-100 transition-colors cursor-pointer ${
                                                        selectedLedgerOrder?.id === order.id ? 'bg-slate-100 font-bold' : ''
                                                    }`}
                                                >
                                                    <td className="py-3.5 px-4 font-mono font-bold text-slate-650">
                                                        {order.order_number}
                                                    </td>
                                                    <td className="py-3.5 px-3 text-sm text-slate-500 font-bold">
                                                        {new Date(order.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                                    </td>
                                                    <td className="py-3.5 px-3 font-semibold text-slate-800">
                                                        {order.customer_name}
                                                    </td>
                                                    <td className="py-3.5 px-3 text-center">
                                                        <span className={`inline-block text-xs font-black uppercase px-2.5 py-1 rounded border ${
                                                            order.payment_status === 'refunded'
                                                                ? 'bg-red-50 text-red-700 border-red-200/40'
                                                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200/40'
                                                        }`}>
                                                            {order.payment_status === 'refunded' ? 'REFUNDED' : 'PAID'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-3 text-right font-black text-slate-800 font-mono text-base whitespace-nowrap">
                                                        {currency} {Number(order.total).toLocaleString()}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            onClick={() => {
                                                                setPrintedReceipt(order);
                                                                setReceiptModalOpen(true);
                                                            }}
                                                            className="p-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-500 text-slate-500 hover:text-blue-600 rounded"
                                                        >
                                                            <Printer size={12} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        {/* RIGHT: Selected Order Detail & Refund controls (2/5 columns) */}
                        <div className="lg:col-span-2 bg-slate-50 p-6 rounded-2xl border border-slate-250 shadow-md flex flex-col justify-between lg:h-[calc(100vh-230px)] min-h-[620px] overflow-hidden">
                            {selectedLedgerOrder ? (
                                <div className="h-full flex flex-col justify-between overflow-hidden">
                                    
                                    {/* Order items listing */}
                                    <div className="flex-grow overflow-y-auto space-y-5 pb-5">
                                        <div className="border-b border-slate-150 pb-3 flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider font-mono">{selectedLedgerOrder.order_number}</h4>
                                                <p className="text-sm text-slate-500 font-bold mt-0.5">
                                                    Processed by: {selectedLedgerOrder.cashier?.name || 'Admin'}
                                                </p>
                                            </div>
                                            <span className={`inline-block text-sm font-black px-2.5 py-1 rounded ${
                                                selectedLedgerOrder.payment_status === 'refunded' ? 'bg-red-55 bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                                            }`}>
                                                {selectedLedgerOrder.payment_status.toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Customer Box */}
                                        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-150 text-sm space-y-1.5">
                                            <p className="font-black text-slate-800">Guest details:</p>
                                            <p className="text-slate-650">Name: <span className="font-black text-slate-800">{selectedLedgerOrder.customer_name}</span></p>
                                            {selectedLedgerOrder.customer_phone && <p className="text-slate-650">Phone: <span className="font-mono font-bold text-slate-800">{selectedLedgerOrder.customer_phone}</span></p>}
                                            {selectedLedgerOrder.customer_email && <p className="text-slate-650">Email: <span className="text-slate-800 font-bold">{selectedLedgerOrder.customer_email}</span></p>}
                                            <p className="text-slate-655">Payment: <span className="font-black text-blue-600 uppercase">{selectedLedgerOrder.payment_method}</span></p>
                                        </div>

                                        {/* Items */}
                                        <div className="space-y-2.5">
                                            <p className="text-sm font-black text-slate-500 uppercase tracking-wider">Purchase items</p>
                                            {selectedLedgerOrder.items?.map((item) => (
                                                <div key={item.id} className="flex justify-between items-center text-sm font-bold bg-slate-50/50 p-2.5 rounded-lg border border-slate-150">
                                                    <div>
                                                        <p className="font-bold text-slate-800">{item.product?.name}</p>
                                                        {item.variant && (
                                                            <p className="text-xs text-slate-400 font-black uppercase mt-0.5 font-mono">
                                                                Color: {item.variant.color} / Size: {item.variant.size}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="font-black text-slate-900 font-mono text-sm">
                                                        {item.quantity} x {currency}{Number(item.price).toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Order financial breakdowns */}
                                        <div className="border-t border-slate-100 pt-3 space-y-1.5 text-sm font-bold text-slate-500">
                                            <div className="flex justify-between">
                                                <span>Subtotal</span>
                                                <span className="font-black text-slate-800 font-mono">{currency} {Number(selectedLedgerOrder.subtotal).toLocaleString()}</span>
                                            </div>
                                            {Number(selectedLedgerOrder.discount) > 0 && (
                                                <div className="flex justify-between text-red-600">
                                                    <span>Deducted Discount</span>
                                                    <span className="font-black font-mono">-{currency} {Number(selectedLedgerOrder.discount).toLocaleString()}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span>GST Tax Amount</span>
                                                <span className="font-black text-slate-800 font-mono">{currency} {Number(selectedLedgerOrder.tax).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-lg font-black text-slate-900 border-t border-slate-100 pt-2">
                                                <span>Grand Invoice Total</span>
                                                <span className="font-mono text-blue-600 text-lg">{currency} {Number(selectedLedgerOrder.total).toLocaleString()}</span>
                                            </div>
                                            {Number(selectedLedgerOrder.cash_received) > 0 && (
                                                <div className="bg-slate-50/55 p-2.5 rounded border border-slate-205 border-slate-200 text-sm font-bold space-y-1.5 mt-2">
                                                    <div className="flex justify-between">
                                                        <span>Cash Handed:</span>
                                                        <span className="text-slate-800 font-mono font-black">{currency} {Number(selectedLedgerOrder.cash_received).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Change Dispensed:</span>
                                                        <span className="text-emerald-700 font-mono font-black">{currency} {Number(selectedLedgerOrder.change_returned).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                    {/* Action Deck */}
                                    <div className="border-t border-slate-100 pt-4 flex gap-3">
                                        <button
                                            onClick={() => {
                                                setPrintedReceipt(selectedLedgerOrder);
                                                setReceiptModalOpen(true);
                                            }}
                                            className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-base font-black py-3.5 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-1.5"
                                        >
                                            <Printer size={15} />
                                            <span>Reprint Receipt</span>
                                        </button>

                                        {/* Refund action ONLY accessible to Admins */}
                                        {(auth.user.role === 'super_admin' || auth.user.role === 'admin') && selectedLedgerOrder.payment_status !== 'refunded' ? (
                                            <button
                                                onClick={() => setRefundConfirmOrder(selectedLedgerOrder)}
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-base font-black py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5"
                                            >
                                                <RefreshCcw size={15} />
                                                <span>Process Refund</span>
                                            </button>
                                        ) : null}
                                    </div>

                                </div>
                            ) : (
                                <div className="h-full flex flex-col justify-center items-center text-center p-8 text-slate-400 space-y-2">
                                    <FileText size={32} className="opacity-30 text-blue-600 animate-bounce" />
                                    <p className="text-sm font-black uppercase tracking-wider text-slate-500">Order Context Vacant</p>
                                    <p className="text-sm text-slate-400 font-semibold">Select any transaction row in the ledger grid to view receipts, logs, or process stock returns.</p>
                                </div>
                            )}
                        </div>

                    </div>
                )}

                {/* 4. TAB CONTENT: REPORTS (Strictly restricted to Admin in React views too) */}
                {activeTab === 'reports' && reports && (
                    <div className="space-y-6">
                        
                        {/* Financial Aggregate Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            
                            {/* Agg Sales */}
                            <div className="pos-card relative overflow-hidden bg-slate-50 p-6 rounded-2xl border border-slate-250 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-black text-slate-500 uppercase tracking-wider">POS Gross Revenue</span>
                                    <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 font-bold">
                                        <Wallet size={18} />
                                    </div>
                                </div>
                                <div className="mt-4 z-10 relative">
                                    <h3 className="amount text-3xl font-black text-slate-900 tracking-tight font-mono">{currency} {reports.total_revenue.toLocaleString()}</h3>
                                    <p className="text-sm text-slate-400 font-bold uppercase mt-1">Paid POS Transactions Settled</p>
                                </div>
                                <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-50/50 rounded-full blur-2xl"></div>
                            </div>

                            {/* Agg Refunds */}
                            <div className="pos-card relative overflow-hidden bg-slate-50 p-6 rounded-2xl border border-slate-250 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-black text-slate-500 uppercase tracking-wider">Total POS Refunds</span>
                                    <div className="p-2.5 bg-red-50 rounded-xl text-red-500 font-bold">
                                        <RefreshCcw size={16} />
                                    </div>
                                </div>
                                <div className="mt-4 z-10 relative">
                                    <h3 className="amount text-3xl font-black text-slate-900 tracking-tight font-mono">{currency} {reports.total_refunded.toLocaleString()}</h3>
                                    <p className="text-sm text-red-500 font-bold uppercase mt-1">Returned Cash/Credit Logged</p>
                                </div>
                                <div className="absolute right-0 bottom-0 w-24 h-24 bg-red-55 bg-red-50/40 rounded-full blur-2xl"></div>
                            </div>

                            {/* Agg Net Revenue */}
                            <div className="pos-card relative overflow-hidden bg-slate-50 p-6 rounded-2xl border border-slate-250 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-black text-slate-500 uppercase tracking-wider">Net POS Revenue</span>
                                    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 font-bold">
                                        <TrendingUp size={18} />
                                    </div>
                                </div>
                                <div className="mt-4 z-10 relative">
                                    <h3 className="amount text-3xl font-black text-slate-900 tracking-tight font-mono">
                                        {currency} {(reports.total_revenue - reports.total_refunded).toLocaleString()}
                                    </h3>
                                    <p className="text-sm text-slate-400 font-bold uppercase mt-1">Actual revenue minus returns</p>
                                </div>
                                <div className="absolute right-0 bottom-0 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl"></div>
                            </div>

                            {/* Inventory Warnings */}
                            <div className="pos-card relative overflow-hidden bg-slate-50 p-6 rounded-2xl border border-slate-250 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-black text-slate-500 uppercase tracking-wider">Stock Alerts</span>
                                    <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 font-bold">
                                        <AlertTriangle size={18} />
                                    </div>
                                </div>
                                <div className="mt-4 z-10 relative">
                                    <h3 className="count text-3xl font-black text-slate-900 tracking-tight">
                                        {reports.low_stock_products.length + reports.low_stock_variants.length} Alerts
                                    </h3>
                                    <p className="text-sm text-amber-600 font-bold uppercase mt-1">Items running low on stock</p>
                                </div>
                                <div className="absolute right-0 bottom-0 w-24 h-24 bg-amber-50/40 rounded-full blur-2xl"></div>
                            </div>

                        </div>

                        {/* Daily/Monthly and Product Sales Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            
                            {/* Product-wise Sales (2/3 columns) */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col h-[400px]">
                                <h4 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-4 font-sans">Top Performing Products</h4>
                                <div className="flex-grow overflow-y-auto pr-1">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-xs uppercase text-slate-500 font-black tracking-wider">
                                                <th className="py-2.5">Product Name</th>
                                                <th className="py-2.5 text-center">Units Sold</th>
                                                <th className="py-2.5 text-right font-mono">Gross Revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {reports.product_sales.length === 0 ? (
                                                <tr>
                                                    <td colSpan="3" className="py-8 text-center text-sm text-slate-400 font-bold uppercase">No product logs registered</td>
                                                </tr>
                                            ) : (
                                                reports.product_sales.map((item, idx) => (
                                                    <tr key={idx} className="text-sm hover:bg-slate-50">
                                                        <td className="py-2.5 font-semibold text-slate-800 truncate max-w-[200px]">{item.product?.name || 'Unknown Item'}</td>
                                                        <td className="py-2.5 text-center font-bold text-blue-600">{item.quantity_sold} Units</td>
                                                        <td className="py-2.5 text-right font-bold text-slate-900 font-mono">{currency} {Number(item.revenue).toLocaleString()}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Cashier performance & Monthly list (1/3 columns) */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col h-[400px]">
                                <h4 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-4 font-sans">Cashier Sales performance</h4>
                                <div className="flex-grow overflow-y-auto space-y-3.5">
                                    {reports.cashier_sales.length === 0 ? (
                                        <p className="text-sm text-slate-400 font-bold text-center uppercase py-8">No cashier logs registered</p>
                                    ) : (
                                        reports.cashier_sales.map((cash, idx) => (
                                            <div key={idx} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0">
                                                <div>
                                                    <p className="text-sm font-black text-slate-800">{cash.cashier?.name || 'Admin / Direct'}</p>
                                                    <p className="text-xs text-slate-400 font-bold mt-0.5">{cash.count} Checkouts settled</p>
                                                </div>
                                                <span className="bg-blue-50 text-blue-600 text-xs font-black px-2.5 py-1 rounded-md font-mono shadow-sm border border-blue-100">
                                                    {currency} {Number(cash.revenue).toLocaleString()}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Stock Inventory Alert Reports */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-500">Inventory Stock Level warnings</h4>
                                    <p className="text-xs text-slate-400 font-bold mt-0.5">Real-time alerts highlighting low stocked apparel variants</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <label className="text-xs font-black text-slate-500 uppercase cursor-pointer select-none" htmlFor="alertToggle">Show alerts only</label>
                                    <input
                                        id="alertToggle"
                                        type="checkbox"
                                        checked={stockReportLowOnly}
                                        onChange={(e) => setStockReportLowOnly(e.target.checked)}
                                        className="rounded border-slate-350 text-blue-600 focus:ring-blue-500 bg-white cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                {/* Product stock alerts */}
                                <div className="space-y-3.5 border-r border-slate-100 pr-4">
                                    <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">Master Products</h5>
                                    {reports.low_stock_products.length === 0 ? (
                                        <p className="text-sm text-slate-400 py-4 font-bold text-center uppercase">All master product levels are fully stocked</p>
                                    ) : (
                                        reports.low_stock_products.map((p) => (
                                            <div key={p.id} className="flex justify-between items-center bg-red-50 border border-red-200/40 p-3 rounded-xl shadow-sm">
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 truncate max-w-[200px]">{p.name}</p>
                                                    <p className="text-xs text-red-655 font-bold mt-0.5 font-mono">SKU: {p.sku}</p>
                                                </div>
                                                <span className="bg-red-100 text-red-750 text-xs font-black px-2.5 py-1 rounded-md flex items-center font-mono">
                                                    <AlertTriangle size={12} className="mr-1 text-red-500" />
                                                    <span className="text-red-705 text-red-700">{p.stock_quantity} left</span>
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Variant stock alerts */}
                                <div className="space-y-3.5 pl-0 md:pl-2">
                                    <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">Sized/Colored Variants</h5>
                                    {reports.low_stock_variants.length === 0 ? (
                                        <p className="text-sm text-slate-400 py-4 font-bold text-center uppercase">All sized variant levels are fully stocked</p>
                                    ) : (
                                        reports.low_stock_variants.map((v) => (
                                            <div key={v.id} className="flex justify-between items-center bg-amber-50 border border-amber-200/40 p-3 rounded-xl shadow-sm">
                                                <div>
                                                    <p className="text-sm font-black text-slate-800 truncate max-w-[200px]">{v.product?.name || 'Unknown product'}</p>
                                                    <p className="text-xs text-amber-705 text-amber-700 font-bold mt-0.5 font-mono">
                                                        Variant: <span className="uppercase">{v.color || 'N/A'} / {v.size}</span>
                                                    </p>
                                                </div>
                                                <span className="bg-amber-100 text-amber-750 text-xs font-black px-2.5 py-1 rounded-md flex items-center font-mono">
                                                    <AlertTriangle size={12} className="mr-1 text-amber-600" />
                                                    <span className="text-amber-705 text-amber-700">{v.stock_quantity} left</span>
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>

                            </div>
                        </div>

                        {/* Refunds History List */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
                            <h4 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-4 font-sans">Refunded Sales Logs</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-xs uppercase text-slate-500 font-black tracking-wider">
                                            <th className="py-2.5">Invoice #</th>
                                            <th className="py-2.5">Refund Date</th>
                                            <th className="py-2.5">Customer</th>
                                            <th className="py-2.5">Cashier</th>
                                            <th className="py-2.5 text-right font-mono">Refunded Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {reports.refund_report.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-8 text-center text-sm text-slate-400 font-bold uppercase">No returns processed in system history</td>
                                            </tr>
                                        ) : (
                                            reports.refund_report.map((ref) => (
                                                <tr key={ref.id} className="text-sm hover:bg-slate-55 hover:bg-slate-50 text-slate-650">
                                                    <td className="py-2.5 font-mono font-bold text-red-600">{ref.order_number}</td>
                                                    <td className="py-2.5">{new Date(ref.updated_at).toLocaleString()}</td>
                                                    <td className="py-2.5 font-semibold text-slate-800">{ref.customer_name}</td>
                                                    <td className="py-2.5">{ref.cashier?.name || 'Admin'}</td>
                                                    <td className="py-2.5 text-right font-bold text-slate-900 font-mono">{currency} {Number(ref.total).toLocaleString()}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                )}

            </div>

            {/* A. FLOATING TOAST MESSAGE NOTIFICATIONS */}
            {alertMessage && (
                <div className="fixed bottom-5 right-5 z-55 animate-in slide-in-from-bottom duration-250">
                    <div className={`px-5 py-3.5 rounded-xl shadow-2xl border font-bold text-sm flex items-center space-x-2.5 ${
                        alertMessage.type === 'success' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                            : 'bg-red-55 bg-red-50 text-red-800 border-red-200'
                    }`}>
                        <span>{alertMessage.type === 'success' ? '✓' : '✗'}</span>
                        <span>{alertMessage.message}</span>
                    </div>
                </div>
            )}

            {/* B. INLINE REGISTER NEW CUSTOMER MODAL */}
            {addCustomerModalOpen && (
                <div className="fixed inset-0 z-55 overflow-y-auto flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setAddCustomerModalOpen(false)}></div>
                    
                    <form 
                        onSubmit={handleAddCustomer} 
                        className="relative bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200"
                    >
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <span className="text-sm font-black tracking-wider uppercase text-slate-800">Register New Customer</span>
                            <button type="button" onClick={() => setAddCustomerModalOpen(false)}>
                                <X size={16} className="text-slate-400 hover:text-slate-800" />
                            </button>
                        </div>

                        <div className="space-y-3.5 text-sm text-slate-500">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-1">Customer Full Name *</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter full name"
                                    value={newCustName}
                                    onChange={(e) => setNewCustName(e.target.value)}
                                    className="bg-white border border-slate-200 rounded-xl !py-2.5 !px-3 !text-sm w-full text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-1">Active Mobile Number</label>
                                <input
                                    type="tel"
                                    placeholder="Enter mobile number"
                                    value={newCustPhone}
                                    onChange={(e) => setNewCustPhone(e.target.value)}
                                    className="bg-white border border-slate-200 rounded-xl !py-2.5 !px-3 !text-sm w-full text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase mb-1">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="Enter email address (optional)"
                                    value={newCustEmail}
                                    onChange={(e) => setNewCustEmail(e.target.value)}
                                    className="bg-white border border-slate-200 rounded-xl !py-2.5 !px-3 !text-sm w-full text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex space-x-3 pt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black py-3 rounded-xl transition-all shadow-md flex items-center justify-center uppercase"
                            >
                                Register Customer
                            </button>
                            <button
                                type="button"
                                onClick={() => setAddCustomerModalOpen(false)}
                                className="w-24 bg-slate-50 hover:bg-slate-100 border border-slate-205 border-slate-200 text-slate-500 text-sm font-black py-3 rounded-xl transition-all uppercase"
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* C. INVOICE THERMAL PRINT PREVIEW MODAL */}
            {receiptModalOpen && printedReceipt && (
                <div className="fixed inset-0 z-55 overflow-y-auto flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setReceiptModalOpen(false)}></div>
                    
                    <div className="relative bg-white max-w-sm w-full rounded-2xl border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-6 animate-in zoom-in-95 duration-200">
                        
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                            <span className="text-xs font-black tracking-wider uppercase text-slate-800">Sale Receipt Ticket</span>
                            <button onClick={() => setReceiptModalOpen(false)}>
                                <X size={16} className="text-slate-400 hover:text-slate-805" />
                            </button>
                        </div>

                        {/* Receipt Container formatted for thermal print standards */}
                        <div 
                            id="thermal-receipt" 
                            className="bg-white p-4 border border-dashed border-slate-350 rounded-xl max-h-[400px] overflow-y-auto text-xs font-mono space-y-6 text-black leading-snug"
                        >
                            {/* Logo & Info */}
                            <div className="text-center space-y-0.5 border-b border-dashed border-black pb-3">
                                <h3 className="brand-title text-black text-center font-bold">BRANDS STUDIO</h3>
                                <p style={{ fontSize: '9px', margin: '2px 0' }} className="text-center">PREMIUM DESIGNER CLOTHING</p>
                                <p style={{ fontSize: '8px', margin: '1px 0' }} className="text-center">{settings.contact_address || 'Zamzama Commercial, Karachi'}</p>
                                <p style={{ fontSize: '8px', margin: '1px 0' }} className="text-center">TEL: {settings.contact_phone || '+92 (21) 3583-0941'}</p>
                            </div>

                            {/* Details */}
                            <div style={{ fontSize: '9px' }} className="space-y-0.5 text-black">
                                <div className="flex justify-between"><span>INVOICE:</span><span className="font-bold">{printedReceipt.order_number}</span></div>
                                <div className="flex justify-between"><span>CASHIER:</span><span>{printedReceipt.cashier?.name || 'Admin'}</span></div>
                                <div className="flex justify-between"><span>DATE:</span><span>{new Date(printedReceipt.created_at).toLocaleString()}</span></div>
                                <div className="flex justify-between"><span>CUSTOMER:</span><span className="font-bold uppercase">{printedReceipt.customer_name}</span></div>
                                {printedReceipt.customer_phone && <div className="flex justify-between"><span>CONTACT:</span><span>{printedReceipt.customer_phone}</span></div>}
                            </div>

                            {/* Table */}
                            <div className="border-b border-t border-dashed border-black py-2 my-2 text-black">
                                <table className="items-table">
                                    <thead>
                                        <tr className="font-bold border-b border-black">
                                            <th>ITEM</th>
                                            <th className="text-center">QTY</th>
                                            <th className="text-right">PRICE</th>
                                            <th className="total">TOTAL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {printedReceipt.items?.map((item) => (
                                            <tr key={item.id}>
                                                <td>
                                                    <span className="font-bold uppercase">{item.product?.name}</span>
                                                    {item.variant && <span style={{ fontSize: '8px', display: 'block' }}>({item.variant.size} / {item.variant.color})</span>}
                                                </td>
                                                <td className="text-center">{item.quantity}</td>
                                                <td className="text-right">{currency}{Number(item.price).toFixed(2)}</td>
                                                <td className="total font-bold">{currency}{Number(item.total).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Breaks */}
                            <div style={{ fontSize: '9px' }} className="space-y-1 text-black">
                                <div className="flex justify-between"><span>SUBTOTAL</span><span>{currency}{Number(printedReceipt.subtotal).toFixed(2)}</span></div>
                                {Number(printedReceipt.discount) > 0 && (
                                    <div className="flex justify-between" style={{ color: 'red' }}>
                                        <span>DISCOUNT DEDUCTION</span>
                                        <span>-{currency}{Number(printedReceipt.discount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between"><span>TAX GST ({taxRate}%)</span><span>{currency}{Number(printedReceipt.tax).toFixed(2)}</span></div>
                                <div className="flex justify-between font-bold border-t border-dashed border-black pt-1.5" style={{ fontSize: '10px' }}>
                                    <span>GRAND TOTAL INVOICE</span>
                                    <span>{currency}{Number(printedReceipt.total).toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Payment breakdowns if Cash */}
                            {Number(printedReceipt.cash_received) > 0 && (
                                <div style={{ fontSize: '8px' }} className="bg-slate-100 p-1.5 rounded space-y-0.5 mt-1 border text-black">
                                    <div className="flex justify-between"><span>CASH HANDED:</span><span>{currency}{Number(printedReceipt.cash_received).toFixed(2)}</span></div>
                                    <div className="flex justify-between font-bold"><span>CHANGE RETURN:</span><span>{currency}{Number(printedReceipt.change_returned).toFixed(2)}</span></div>
                                </div>
                            )}

                            {/* Greet */}
                            <div style={{ fontSize: '8px' }} className="text-center pt-3 border-t border-dashed border-black text-black">
                                <p className="font-bold">♥ WEAR YOUR SIGNATURE. THANK YOU! ♥</p>
                                <p>Exchange and Return within 3 days.</p>
                            </div>

                        </div>

                        {/* Controls */}
                        <div className="flex space-x-3 pt-2">
                            <button
                                onClick={handlePrintReceipt}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black py-3 rounded-xl transition-all shadow-md flex items-center justify-center space-x-1.5 uppercase select-none"
                            >
                                <Printer size={15} />
                                <span>Print Thermal Ticket</span>
                            </button>
                            <button
                                onClick={() => setReceiptModalOpen(false)}
                                className="w-24 bg-slate-55 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-550 text-slate-500 text-sm font-black py-3 rounded-xl transition-all uppercase"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* D. CONFIRM REFUND TRANSACTION DIALOG */}
            {refundConfirmOrder && (
                <div className="fixed inset-0 z-55 overflow-y-auto flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setRefundConfirmOrder(null)}></div>
                    
                    <div className="relative bg-white max-w-sm w-full rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center space-x-3 text-red-655 text-red-700">
                            <AlertTriangle size={24} className="animate-bounce" />
                            <h4 className="text-base font-black uppercase tracking-wider font-serif">Confirm POS Return Refund</h4>
                        </div>
                        
                        <p className="text-sm text-slate-550 text-slate-600 leading-relaxed font-bold">
                            Are you sure you want to return this POS order (<span className="text-slate-800 font-mono font-black">{refundConfirmOrder.order_number}</span>)?
                            This action will:
                        </p>
                        <ul className="text-sm text-slate-500 list-disc list-inside space-y-1.5 font-bold">
                            <li>Mark the payment status as <span className="text-red-600 font-black">REFUNDED</span>.</li>
                            <li>Reconcile product inventory (increment stock back automatically).</li>
                            <li>Record this return in the administrator refunds log.</li>
                        </ul>

                        <div className="flex space-x-3 pt-2">
                            <button
                                onClick={handleRefundSubmit}
                                disabled={refundingLoading}
                                className="flex-1 bg-red-600 hover:bg-red-750 text-white text-sm font-black py-3 rounded-xl transition-all shadow-md flex items-center justify-center uppercase"
                            >
                                {refundingLoading ? 'Refunding...' : 'Confirm return refund'}
                            </button>
                            <button
                                onClick={() => setRefundConfirmOrder(null)}
                                className="w-24 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 text-sm font-black py-3 rounded-xl transition-all uppercase"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
