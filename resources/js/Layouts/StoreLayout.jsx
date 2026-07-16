import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { ShoppingBag, Heart, Search, User, Menu, X, ChevronDown, Check, AlertCircle, Plus, Minus, Trash2, Loader2, ArrowRight } from 'lucide-react';
import { getCartCount, getCart, removeFromCart, updateQuantity, getCartTotal } from '../Utils/cart';
import { getAssetUrl, getProductImageUrl } from '../Utils/asset';

export default function StoreLayout({ children }) {
    const { auth, settings, flash, menuCategories: categories = [] } = usePage().props;
    const [cartCount, setCartCount] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [toast, setToast] = useState(null);

    // Diners Style Interactive Panel States
    const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
    const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [backInStockOpen, setBackInStockOpen] = useState(false);
    const [backInStockProduct, setBackInStockProduct] = useState(null);
    const [backInStockEmail, setBackInStockEmail] = useState('');
    const [backInStockLoading, setBackInStockLoading] = useState(false);

    // Quick View state
    const [quickViewOpen, setQuickViewOpen] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    const [quickViewSelectedSize, setQuickViewSelectedSize] = useState(null);

    // Form inputs for Login Modal
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const refreshCartData = () => {
        setCartCount(getCartCount());
        setCartItems(getCart());
        setCartTotal(getCartTotal());
    };

    useEffect(() => {
        refreshCartData();

        // Event listener for cart updates
        let timer;
        const handleCartUpdate = (e) => {
            refreshCartData();
            // Automatically open cart drawer on item addition (premium Shopify feel)
            setCartDrawerOpen(true);

            if (e.detail && e.detail.product) {
                setToast({
                    type: 'success',
                    message: `"${e.detail.product.name}" was successfully added to your cart.`
                });
                if (timer) clearTimeout(timer);
                timer = setTimeout(() => setToast(null), 4000);
            }
        };

        window.addEventListener('cart-updated', handleCartUpdate);
        
        // Listen for global Back In Stock notification triggers from size chips
        const handleBackInStockTrigger = (e) => {
            if (e.detail && e.detail.product) {
                setBackInStockProduct(e.detail.product);
                setBackInStockOpen(true);
            }
        };
        window.addEventListener('trigger-back-in-stock', handleBackInStockTrigger);

        // Listen for global Quick View triggers
        const handleQuickViewTrigger = (e) => {
            if (e.detail && e.detail.product) {
                setQuickViewProduct(e.detail.product);
                setQuickViewSelectedSize(null);
                setQuickViewOpen(true);
            }
        };
        window.addEventListener('trigger-quick-view', handleQuickViewTrigger);

        // Scroll event listener
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('cart-updated', handleCartUpdate);
            window.removeEventListener('trigger-back-in-stock', handleBackInStockTrigger);
            window.removeEventListener('trigger-quick-view', handleQuickViewTrigger);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Flash message watch
    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchOverlayOpen(false);
        router.get(route('shop'), { search: searchQuery });
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError('');
        
        router.post(route('login'), {
            email: loginEmail,
            password: loginPassword
        }, {
            onSuccess: () => {
                setLoginModalOpen(false);
                setLoginEmail('');
                setLoginPassword('');
            },
            onError: (errs) => {
                setLoginError(errs.email || errs.password || 'Invalid credentials.');
            },
            onFinish: () => setLoginLoading(false)
        });
    };

    const handleBackInStockSubmit = (e) => {
        e.preventDefault();
        if (!backInStockEmail) return;
        setBackInStockLoading(true);

        // Simulate subscribing
        setTimeout(() => {
            setBackInStockLoading(false);
            setBackInStockOpen(false);
            setBackInStockEmail('');
            setToast({
                type: 'success',
                message: 'Notification subscription created successfully!'
            });
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans overflow-x-hidden">
            
            {/* Diners Pakistan Style Top Announcement Bar */}
            <div className="bg-neutral-900 text-white text-[10px] tracking-[0.25em] font-extrabold uppercase py-2.5 text-center select-none border-b border-neutral-800">
                FREE SHIPPING IN PAKISTAN ON ORDERS ABOVE RS. 3000 | CASH ON DELIVERY
            </div>

            {/* Sticky Header Wrapper */}
            <header className={`sticky top-0 z-40 bg-white border-b border-stone-200/60 transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
                
                {/* Row 1: Logo and Action Icons */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 relative">
                        
                        {/* Left Side: Mobile Menu Hamburger Button */}
                        <div className="flex items-center">
                            <button 
                                onClick={() => setMobileMenuOpen(true)}
                                className="text-stone-900 hover:text-black focus:outline-none md:hidden p-2 -ml-2"
                                aria-label="Open mobile menu"
                            >
                                <Menu size={20} className="stroke-[1.5]" />
                            </button>
                        </div>

                        {/* Center: Brand Logo (Clickable -> Homepage) */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                            <Link href={route('welcome')} className="flex flex-col items-center select-none group text-center">
                                <span className="font-black tracking-[0.3em] text-xl sm:text-2xl text-black">BRANDS STUDIO</span>
                                <span className="text-[8px] font-black tracking-[0.55em] text-stone-400 -mt-0.5 ml-1">SIGNATURE</span>
                            </Link>
                        </div>

                        {/* Right Side: Action Icons Row */}
                        <div className="flex items-center space-x-3 sm:space-x-5">
                            
                            {/* Search Icon (opens full-screen overlay) */}
                            <button 
                                onClick={() => setSearchOverlayOpen(true)}
                                className="text-stone-700 hover:text-black p-1 transition-colors duration-200"
                                aria-label="Open Search"
                            >
                                <Search size={20} className="stroke-[1.5]" />
                            </button>

                            {/* Wishlist Icon */}
                            <Link 
                                href={route('wishlist')} 
                                className="text-stone-700 hover:text-black p-1 transition-colors duration-200"
                                aria-label="Wishlist"
                            >
                                <Heart size={20} className="stroke-[1.5]" />
                            </Link>

                            {/* User Account / Profile Icon */}
                            <div className="relative">
                                {auth?.user ? (
                                    <>
                                        <button 
                                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                            className="flex items-center space-x-1 text-stone-700 hover:text-black focus:outline-none p-1 transition-colors duration-200"
                                        >
                                            <User size={20} className="stroke-[1.5]" />
                                            <span className="hidden sm:inline text-[9px] font-black uppercase tracking-widest">
                                                {(auth.user.name || '').split(' ')[0]}
                                            </span>
                                            <ChevronDown size={10} className={`transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {userDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 shadow-xl py-1.5 z-50 rounded-none animate-in fade-in duration-200">
                                                <div className="px-4 py-2 border-b border-stone-100">
                                                    <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Signed in as</p>
                                                    <p className="text-xs font-bold truncate text-stone-850">{auth.user.email}</p>
                                                    <span className="inline-block mt-1 bg-stone-100 text-stone-700 text-[8px] font-black px-2 py-0.5 uppercase tracking-widest rounded-none">
                                                        {auth.user.role || 'customer'}
                                                    </span>
                                                </div>

                                                <Link href={route('dashboard')} className="block px-4 py-2 text-[10px] tracking-wider uppercase font-bold text-stone-700 hover:bg-stone-50">Order History</Link>
                                                <Link href={route('profile.edit')} className="block px-4 py-2 text-[10px] tracking-wider uppercase font-bold text-stone-700 hover:bg-stone-50">Profile Settings</Link>
                                                <Link href={route('order.tracking')} className="block px-4 py-2 text-[10px] tracking-wider uppercase font-bold text-stone-700 hover:bg-stone-50">Track Order</Link>
                                                
                                                {auth.user.is_staff && (
                                                    <Link href={route('admin.pos.index')} className="block px-4 py-2 text-[10px] tracking-wider uppercase font-bold text-amber-600 hover:bg-amber-50 border-t border-stone-100">
                                                        POS Terminal
                                                    </Link>
                                                )}

                                                {auth.user.is_admin && (
                                                    <Link href={route('admin.dashboard')} className="block px-4 py-2 text-[10px] tracking-wider uppercase font-bold text-black hover:bg-stone-100">
                                                        Admin Dashboard
                                                    </Link>
                                                )}

                                                <Link 
                                                    href={route('logout')} 
                                                    method="post" 
                                                    as="button" 
                                                    className="w-full text-left block px-4 py-2 text-[10px] tracking-wider uppercase font-bold text-red-650 hover:bg-red-50 border-t border-stone-100"
                                                >
                                                    Log Out
                                                </Link>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <button 
                                        onClick={() => setLoginModalOpen(true)}
                                        className="text-stone-700 hover:text-black p-1 transition-colors duration-200 focus:outline-none"
                                        aria-label="Account Login"
                                    >
                                        <User size={20} className="stroke-[1.5]" />
                                    </button>
                                )}
                            </div>

                            {/* Cart Icon (opens right slide-out Cart Drawer) */}
                            <button 
                                onClick={() => setCartDrawerOpen(true)}
                                className="text-stone-700 hover:text-black p-1 relative transition-colors duration-200 focus:outline-none"
                                aria-label="Open Cart"
                            >
                                <ShoppingBag size={20} className="stroke-[1.5]" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[8px] font-black rounded-none w-4 h-4 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                        </div>
                    </div>
                </div>

                {/* Row 2: Horizontal Mega-Menu Navigation Bar (Desktop Only) */}
                <div className="hidden md:block border-t border-stone-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-center items-center h-12 font-black tracking-[0.2em] text-[10px] lg:text-[11px] text-stone-700 space-x-6 lg:space-x-8">
                            
                            {/* SALE - Highlighted in Red */}
                            <div className="relative group py-3">
                                <Link href={route('shop', { sort: 'discount' })} className="text-red-650 hover:text-red-700 transition-colors uppercase font-black">
                                    MID SEASON SALE
                                </Link>
                                {/* Dropdown panel */}
                                <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-[450px] bg-white border border-stone-200 shadow-2xl p-6 z-50 rounded-none animate-in fade-in duration-200">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <h5 className="font-black text-black border-b border-stone-200 pb-2 mb-3 uppercase tracking-wider">Men Sale</h5>
                                            <ul className="space-y-2 text-stone-500 font-bold tracking-widest text-[9px] uppercase">
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Polos & Tees</Link></li>
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Casual Shirts</Link></li>
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Formal Shirts</Link></li>
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Denim & Trousers</Link></li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-black text-black border-b border-stone-200 pb-2 mb-3 uppercase tracking-wider">Women Sale</h5>
                                            <ul className="space-y-2 text-stone-500 font-bold tracking-widest text-[9px] uppercase">
                                                <li><Link href="/shop?category=womenswear" className="hover:text-black">Ethnic Pret</Link></li>
                                                <li><Link href="/shop?category=womenswear" className="hover:text-black">Western Tops</Link></li>
                                                <li><Link href="/shop?category=womenswear" className="hover:text-black">Trousers</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link href={route('shop')} className="hover:text-black py-3 transition-colors uppercase">Daily New In</Link>
                            
                            {/* Men Western */}
                            <div className="relative group py-3">
                                <Link href="/shop?category=menswear" className="hover:text-black transition-colors uppercase">Men Western</Link>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-[600px] bg-white border border-stone-200 shadow-2xl p-6 z-50 rounded-none">
                                    <div className="grid grid-cols-3 gap-6">
                                        <div>
                                            <h5 className="font-black text-black border-b border-stone-200 pb-2 mb-3 uppercase tracking-wider">Suiting & Blazers</h5>
                                            <ul className="space-y-2 text-stone-500 font-bold tracking-widest text-[9px] uppercase">
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Formal Suits</Link></li>
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Blazers</Link></li>
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Waistcoats</Link></li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-black text-black border-b border-stone-200 pb-2 mb-3 uppercase tracking-wider">Shirts & Polos</h5>
                                            <ul className="space-y-2 text-stone-500 font-bold tracking-widest text-[9px] uppercase">
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Formal Shirts</Link></li>
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Casual Shirts</Link></li>
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Polo Shirts</Link></li>
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">T-Shirts</Link></li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-black text-black border-b border-stone-200 pb-2 mb-3 uppercase tracking-wider">Trousers</h5>
                                            <ul className="space-y-2 text-stone-500 font-bold tracking-widest text-[9px] uppercase">
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Chinos</Link></li>
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Denim Jeans</Link></li>
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Formal Pants</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Men Ethnic */}
                            <div className="relative group py-3">
                                <Link href="/shop?category=menswear" className="hover:text-black transition-colors uppercase">Men Ethnic</Link>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-[400px] bg-white border border-stone-200 shadow-2xl p-6 z-50 rounded-none">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <h5 className="font-black text-black border-b border-stone-200 pb-2 mb-3 uppercase tracking-wider">Wear</h5>
                                            <ul className="space-y-2 text-stone-500 font-bold tracking-widest text-[9px] uppercase">
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Kurta Shalwar</Link></li>
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Kameez Shalwar</Link></li>
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Kurtas</Link></li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-black text-black border-b border-stone-200 pb-2 mb-3 uppercase tracking-wider">Fabric</h5>
                                            <ul className="space-y-2 text-stone-500 font-bold tracking-widest text-[9px] uppercase">
                                                <li><Link href="/shop?category=menswear" className="hover:text-black">Unstitched Fabric</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Women */}
                            <div className="relative group py-3">
                                <Link href="/shop?category=womenswear" className="hover:text-black transition-colors uppercase">Women</Link>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-[400px] bg-white border border-stone-200 shadow-2xl p-6 z-50 rounded-none">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <h5 className="font-black text-black border-b border-stone-200 pb-2 mb-3 uppercase tracking-wider">Eastern Wear</h5>
                                            <ul className="space-y-2 text-stone-500 font-bold tracking-widest text-[9px] uppercase">
                                                <li><Link href="/shop?category=womenswear" className="hover:text-black">Kurta Pret</Link></li>
                                                <li><Link href="/shop?category=womenswear" className="hover:text-black">Unstitched 3pc</Link></li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-black text-black border-b border-stone-200 pb-2 mb-3 uppercase tracking-wider">Western Wear</h5>
                                            <ul className="space-y-2 text-stone-500 font-bold tracking-widest text-[9px] uppercase">
                                                <li><Link href="/shop?category=womenswear" className="hover:text-black">Tops & Shirts</Link></li>
                                                <li><Link href="/shop?category=womenswear" className="hover:text-black">Jeans & Pants</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Kids */}
                            <div className="relative group py-3">
                                <Link href="/shop?category=kids" className="hover:text-black transition-colors uppercase">Kids</Link>
                                <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-[400px] bg-white border border-stone-200 shadow-2xl p-6 z-50 rounded-none">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <h5 className="font-black text-black border-b border-stone-200 pb-2 mb-3 uppercase tracking-wider">Boys</h5>
                                            <ul className="space-y-2 text-stone-500 font-bold tracking-widest text-[9px] uppercase">
                                                <li><Link href="/shop?category=kids" className="hover:text-black">Boys Eastern</Link></li>
                                                <li><Link href="/shop?category=kids" className="hover:text-black">Boys Western</Link></li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h5 className="font-black text-black border-b border-stone-200 pb-2 mb-3 uppercase tracking-wider">Girls</h5>
                                            <ul className="space-y-2 text-stone-500 font-bold tracking-widest text-[9px] uppercase">
                                                <li><Link href="/shop?category=kids" className="hover:text-black">Girls Eastern</Link></li>
                                                <li><Link href="/shop?category=kids" className="hover:text-black">Girls Western</Link></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Link href="/shop?category=fragrance" className="hover:text-black py-3 transition-colors uppercase">Fragrance</Link>
                            <Link href="/shop?category=footwear" className="hover:text-black py-3 transition-colors uppercase">Footwear</Link>
                            <Link href="/shop?category=winter-wear" className="hover:text-black py-3 transition-colors uppercase">Winter Wear</Link>
                            <Link href={route('collections')} className="hover:text-black py-3 transition-colors uppercase">Lookbook</Link>
                        </div>
                    </div>
                </div>

            </header>

            {/* Main Content Area */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Diners-Styled Footer */}
            <footer className="bg-neutral-950 text-stone-300 border-t border-stone-850 pt-16 pb-8 font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Top Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
                        
                        {/* Logo + Tagline Column */}
                        <div className="space-y-4">
                            <div className="flex flex-col items-start leading-none text-white select-none">
                                <span className="font-black tracking-[0.25em] text-lg text-white">BRANDS STUDIO</span>
                                <span className="text-[7px] font-black tracking-[0.45em] text-stone-500 mt-0.5">SIGNATURE</span>
                            </div>
                            <p className="text-[11px] text-stone-400 leading-relaxed font-bold tracking-wider uppercase">
                                {settings?.site_tagline || 'Experience Premium Fashion.'} Delivering high-fashion silhouettes, tailored styles, and everyday clothing luxury. Founded to deliver quality premium selections.
                            </p>
                            
                            {/* Social Media Row */}
                            <div className="flex space-x-4 pt-2">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Facebook">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h3v-9h3.6l.4-3H12V6c0-.88.39-1 1-1h2V2h-3c-2.9 0-5 1.55-5 4.5V8z"/></svg>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                                </a>
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="YouTube">
                                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.519 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.869.508 9.388.508 9.388.508s7.519 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                </a>
                            </div>

                            <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider pt-2">
                                How can we help you?<br />
                                Let us know at <span className="text-stone-300">info@brandsstudio.com</span>
                            </p>
                        </div>

                        {/* Column 1: Help */}
                        <div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-4">HELP</h4>
                            <ul className="space-y-2 text-[10px] tracking-widest uppercase font-bold text-stone-400">
                                <li><Link href={route('dashboard')} className="hover:text-white transition-colors">Exchange & Return</Link></li>
                                <li><Link href={route('shipping.info')} className="hover:text-white transition-colors">Shipping & Handling</Link></li>
                                <li><Link href={route('faqs')} className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                                <li><Link href={route('faqs')} className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            </ul>
                        </div>

                        {/* Column 2: About */}
                        <div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-4">ABOUT</h4>
                            <ul className="space-y-2 text-[10px] tracking-widest uppercase font-bold text-stone-400">
                                <li><Link href={route('faqs')} className="hover:text-white transition-colors">Corporate Orders</Link></li>
                                <li><Link href={route('faqs')} className="hover:text-white transition-colors">Store Locator</Link></li>
                                <li><Link href={route('faqs')} className="hover:text-white transition-colors">Contact Us</Link></li>
                                <li><Link href={route('faqs')} className="hover:text-white transition-colors">Career</Link></li>
                                <li><Link href={route('faqs')} className="hover:text-white transition-colors">Size Guide</Link></li>
                            </ul>
                        </div>

                        {/* Column 3: My Account */}
                        <div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-4">MY ACCOUNT</h4>
                            <ul className="space-y-2 text-[10px] tracking-widest uppercase font-bold text-stone-400">
                                <li><button onClick={() => !auth?.user && setLoginModalOpen(true)} className="hover:text-white transition-colors uppercase text-left">Login</button></li>
                                <li><Link href={route('cart')} className="hover:text-white transition-colors">Checkout</Link></li>
                                <li><Link href={route('faqs')} className="hover:text-white transition-colors">FAQs</Link></li>
                            </ul>
                        </div>

                    </div>

                    {/* Bottom Copyright & Payments */}
                    <div className="border-t border-stone-900 pt-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[9px] text-stone-500 font-bold uppercase tracking-widest">
                        <p>Copyright © {new Date().getFullYear()} BRANDS STUDIO. All Rights Reserved.</p>
                        
                        {/* Fake Payment Method Icons */}
                        <div className="flex space-x-2 text-stone-400">
                            <span className="border border-stone-850 px-2 py-0.5 text-[8px] font-black">VISA</span>
                            <span className="border border-stone-850 px-2 py-0.5 text-[8px] font-black">MASTERCARD</span>
                            <span className="border border-stone-850 px-2 py-0.5 text-[8px] font-black">UNIONPAY</span>
                            <span className="border border-stone-850 px-2 py-0.5 text-[8px] font-black">COD</span>
                        </div>
                    </div>

                </div>
            </footer>

            {/* ========================================================================= */}
            {/* FLOATING WHATSAPP BUTTON (On all pages, bottom right) */}
            {/* ========================================================================= */}
            <a 
                href="https://wa.me/923001234567" 
                target="_blank" 
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3.5 shadow-2xl hover:scale-110 transition-transform duration-300 select-none rounded-none"
                title="Chat on WhatsApp"
            >
                {/* Clean inline SVG WhatsApp logo */}
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.73.001-2.597-1.002-5.037-2.824-6.862C16.633 2.19 14.204 1.184 11.606 1.184c-5.442 0-9.866 4.372-9.87 9.73-.002 1.777.472 3.51 1.372 5.062L2.148 21.3l5.5-1.432c.001-.001.001-.001.002-.002zM17.5 14.1c-.28-.14-1.65-.82-1.9-.91-.25-.09-.43-.14-.61.14-.18.28-.7 1.9-.86 2.08-.16.18-.32.2-.6.06-2.58-1.29-4.22-2.73-5.22-4.47-.26-.45.26-.42.75-1.41.08-.16.04-.31-.02-.45-.06-.14-.62-1.5-.85-2.06-.22-.53-.45-.46-.62-.47-.16-.01-.35-.01-.54-.01-.19 0-.5.07-.76.35-.26.28-1 1-1 2.45s1.04 2.85 1.19 3.05c.15.2 2.04 3.17 4.93 4.43.69.3 1.23.48 1.65.61.69.22 1.32.19 1.82.11.56-.08 1.65-.67 1.88-1.32.23-.65.23-1.21.16-1.32-.08-.12-.26-.18-.55-.32z"/>
                </svg>
            </a>

            {/* ========================================================================= */}
            {/* CART DRAWER (Slides over from right) */}
            {/* ========================================================================= */}
            {cartDrawerOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 transition-opacity" 
                        onClick={() => setCartDrawerOpen(false)}
                    />
                    
                    {/* Panel */}
                    <div className="absolute inset-y-0 right-0 max-w-full flex">
                        <div className="w-screen max-w-md bg-white flex flex-col shadow-2xl rounded-none border-l border-stone-200 animate-in slide-in-from-right duration-350">
                            
                            {/* Drawer Header */}
                            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
                                <h3 className="text-sm font-black uppercase tracking-widest text-black flex items-center space-x-2">
                                    <span>Shopping Cart</span>
                                    <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5">
                                        {cartCount} {cartCount === 1 ? 'item' : 'items'}
                                    </span>
                                </h3>
                                <button 
                                    onClick={() => setCartDrawerOpen(false)}
                                    className="text-stone-500 hover:text-black focus:outline-none p-1"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Drawer Items Body */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                                {cartItems.length > 0 ? (
                                    cartItems.map((item) => (
                                        <div key={`${item.id}-${item.variant_id}`} className="flex space-x-4 border-b border-stone-50 pb-4">
                                            {/* Item Image */}
                                            <div className="w-16 h-20 bg-stone-50 flex-shrink-0">
                                                <img 
                                                    src={item.image ? getAssetUrl(`storage/${item.image}`) : ''} 
                                                    alt={item.name} 
                                                    className="w-full h-full object-cover rounded-none"
                                                />
                                            </div>
                                            
                                            {/* Item Info */}
                                            <div className="flex-grow flex flex-col justify-between">
                                                <div>
                                                    <h4 className="text-xs font-black uppercase text-stone-900 tracking-wider truncate max-w-[200px]">
                                                        {item.name}
                                                    </h4>
                                                    {(item.size || item.color) && (
                                                        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                                                            {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                                                        </p>
                                                    )}
                                                    <p className="text-xs font-black text-black mt-1">
                                                        Rs. {item.price.toLocaleString()}
                                                    </p>
                                                </div>

                                                {/* Qty & Remove Row */}
                                                <div className="flex items-center justify-between pt-1">
                                                    {/* Qty Adjuster */}
                                                    <div className="flex items-center border border-stone-200">
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, item.variant_id, item.quantity - 1)}
                                                            className="px-2 py-1 text-stone-500 hover:text-black transition-colors"
                                                        >
                                                            <Minus size={10} />
                                                        </button>
                                                        <span className="px-2.5 text-[10px] font-bold select-none">{item.quantity}</span>
                                                        <button 
                                                            onClick={() => updateQuantity(item.id, item.variant_id, item.quantity + 1)}
                                                            className="px-2 py-1 text-stone-500 hover:text-black transition-colors"
                                                        >
                                                            <Plus size={10} />
                                                        </button>
                                                    </div>

                                                    {/* Remove Button */}
                                                    <button 
                                                        onClick={() => removeFromCart(item.id, item.variant_id)}
                                                        className="text-stone-400 hover:text-red-650 transition-colors p-1"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                                        <ShoppingBag size={48} className="text-stone-300 stroke-[1]" />
                                        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                                            Your Shopping bag is empty.
                                        </p>
                                        <button 
                                            onClick={() => setCartDrawerOpen(false)}
                                            className="bg-black hover:bg-neutral-800 text-white font-black text-[10px] tracking-widest px-8 py-3.5 rounded-none uppercase transition-colors"
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Drawer Footer Subtotal & Action CTA */}
                            {cartItems.length > 0 && (
                                <div className="border-t border-stone-100 p-6 space-y-4 bg-stone-50">
                                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-black">
                                        <span>Subtotal</span>
                                        <span>Rs. {cartTotal.toLocaleString()}</span>
                                    </div>
                                    <p className="text-[9px] text-stone-450 uppercase tracking-widest font-bold">
                                        Shipping fees & taxes calculated at checkout.
                                    </p>
                                    <div className="space-y-2 pt-2">
                                        <Link 
                                            href={route('cart')} 
                                            onClick={() => setCartDrawerOpen(false)}
                                            className="w-full block text-center bg-black hover:bg-neutral-800 text-white font-black text-[10px] tracking-widest py-3.5 rounded-none uppercase transition-colors"
                                        >
                                            Proceed to Checkout
                                        </Link>
                                        <Link 
                                            href={route('cart')} 
                                            onClick={() => setCartDrawerOpen(false)}
                                            className="w-full block text-center border border-black hover:bg-black hover:text-white text-black font-black text-[10px] tracking-widest py-3.5 rounded-none uppercase transition-all"
                                        >
                                            View Full Cart
                                        </Link>
                                        <button 
                                            onClick={() => setCartDrawerOpen(false)}
                                            className="w-full text-center text-stone-500 hover:text-black font-bold text-[9px] uppercase tracking-widest pt-2"
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* SEARCH OVERLAY (Full screen top-down overlay when magnifying glass clicked) */}
            {/* ========================================================================= */}
            {searchOverlayOpen && (
                <div className="fixed inset-0 z-50 bg-white flex flex-col justify-start animate-in slide-in-from-top duration-300">
                    
                    {/* Header Controls */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-end py-6">
                        <button 
                            onClick={() => setSearchOverlayOpen(false)}
                            className="text-black hover:scale-110 transition-transform p-2 border border-black flex items-center justify-center rounded-none"
                            aria-label="Close Search"
                        >
                            <X size={20} className="stroke-[1.5]" />
                        </button>
                    </div>

                    {/* Search Panel Content Container */}
                    <div className="max-w-4xl mx-auto px-6 w-full flex-grow flex flex-col justify-start pt-12 space-y-12">
                        
                        {/* Search Input Form */}
                        <form onSubmit={handleSearchSubmit} className="relative w-full border-b border-black pb-4">
                            <input 
                                type="text"
                                placeholder="WHAT ARE YOU LOOKING FOR?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-transparent border-none text-2xl sm:text-4xl font-extrabold tracking-widest uppercase placeholder-stone-300 text-black focus:ring-0 focus:outline-none"
                                autoFocus
                            />
                            <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-black hover:opacity-70 p-2">
                                <Search size={26} className="stroke-[2]" />
                            </button>
                        </form>

                        {/* Trending Now Categories Section */}
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-stone-400">
                                Trending Now
                            </h4>
                            <div className="flex flex-wrap gap-2.5">
                                {['Men Western', 'Men Ethnic', 'Women', 'Kids', 'Fragrance', 'Footwear', 'Accessories'].map((catLabel) => (
                                    <Link
                                        key={catLabel}
                                        href={`/shop?search=${encodeURIComponent(catLabel)}`}
                                        onClick={() => setSearchOverlayOpen(false)}
                                        className="border border-stone-250 hover:border-black text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-5 py-2.5 rounded-none transition-colors"
                                    >
                                        {catLabel}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Popular Categories Links / Guidelines */}
                        <div className="space-y-4">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-stone-400">
                                Popular Categories
                            </h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {categories.slice(0, 4).map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={route('shop', { category: cat.slug })}
                                        onClick={() => setSearchOverlayOpen(false)}
                                        className="relative group overflow-hidden aspect-[16/10] bg-stone-100 flex items-center justify-center text-center p-4 border border-stone-200/50 rounded-none"
                                    >
                                        <span className="relative z-10 font-black text-[10px] tracking-widest uppercase text-black group-hover:text-red-650 transition-colors">
                                            {cat.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* LOGIN MODAL (Guest Login Popup Modal) */}
            {/* ========================================================================= */}
            {loginModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60" onClick={() => setLoginModalOpen(false)} />
                    
                    {/* Popup Body */}
                    <div className="relative w-full max-w-md bg-white border border-stone-200 shadow-2xl p-8 z-10 rounded-none animate-in scale-in duration-200">
                        {/* Close button */}
                        <button 
                            onClick={() => setLoginModalOpen(false)}
                            className="absolute top-4 right-4 text-stone-400 hover:text-black p-1"
                        >
                            <X size={18} />
                        </button>

                        <div className="text-center mb-6">
                            <h3 className="text-lg font-black uppercase tracking-widest text-black">Login</h3>
                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-1">
                                Access your Brands Studio Account
                            </p>
                        </div>

                        {loginError && (
                            <div className="bg-red-50 text-red-650 border border-red-200 p-3 text-[10px] font-bold uppercase tracking-wider mb-4 flex items-center space-x-2 rounded-none">
                                <AlertCircle size={12} />
                                <span>{loginError}</span>
                            </div>
                        )}

                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1">
                                    Email Address
                                </label>
                                <input 
                                    type="email"
                                    required
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-none px-3.5 py-2.5 text-xs focus:bg-white focus:ring-0 focus:border-black uppercase font-bold"
                                    placeholder="Enter your email"
                                />
                            </div>

                            <div>
                                <label className="block text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1">
                                    Password
                                </label>
                                <input 
                                    type="password"
                                    required
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-none px-3.5 py-2.5 text-xs focus:bg-white focus:ring-0 focus:border-black uppercase font-bold"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <div className="pt-2">
                                <button 
                                    type="submit"
                                    disabled={loginLoading}
                                    className="w-full bg-black hover:bg-neutral-800 text-white font-black text-[10px] tracking-widest py-3.5 rounded-none uppercase transition-colors flex items-center justify-center space-x-2"
                                >
                                    {loginLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                    <span>LOGIN</span>
                                </button>
                            </div>
                        </form>

                        <div className="flex justify-between items-center pt-5 border-t border-stone-100 mt-6 text-[9px] font-black uppercase tracking-widest text-stone-400">
                            <Link href={route('login')} onClick={() => setLoginModalOpen(false)} className="hover:text-black">
                                Forgot your password?
                            </Link>
                            <Link href={route('register')} onClick={() => setLoginModalOpen(false)} className="hover:text-black text-black border-b border-black pb-0.5">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* BACK IN STOCK NOTIFICATION MODAL */}
            {/* ========================================================================= */}
            {backInStockOpen && backInStockProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60" onClick={() => setBackInStockOpen(false)} />
                    
                    {/* Popup Body */}
                    <div className="relative w-full max-w-md bg-white border border-stone-200 shadow-2xl p-8 z-10 rounded-none animate-in scale-in duration-200">
                        <button 
                            onClick={() => setBackInStockOpen(false)}
                            className="absolute top-4 right-4 text-stone-400 hover:text-black p-1"
                        >
                            <X size={18} />
                        </button>

                        <div className="text-center mb-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-black">Notify Me</h3>
                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mt-1 max-w-[280px] mx-auto leading-relaxed">
                                Leave your email and we will notify you as soon as the product or variant is back in stock
                            </p>
                        </div>

                        <div className="flex space-x-3 mb-6 p-3 bg-stone-50 border border-stone-100">
                            <div className="w-12 h-14 bg-stone-200 flex-shrink-0">
                                <img 
                                    src={getProductImageUrl(backInStockProduct) ? getAssetUrl(`storage/${getProductImageUrl(backInStockProduct)}`) : ''} 
                                    alt={backInStockProduct.name}
                                    className="w-full h-full object-cover rounded-none" 
                                />
                            </div>
                            <div className="flex-grow justify-center flex flex-col">
                                <h4 className="text-[10px] font-black uppercase text-stone-900 tracking-wider truncate">
                                    {backInStockProduct.name}
                                </h4>
                                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                                    Rs. {(backInStockProduct.discount_price ?? backInStockProduct.price).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleBackInStockSubmit} className="space-y-4">
                            <input 
                                type="email"
                                required
                                value={backInStockEmail}
                                onChange={(e) => setBackInStockEmail(e.target.value)}
                                className="w-full bg-stone-50 border border-stone-200 rounded-none px-3.5 py-2.5 text-xs focus:bg-white focus:ring-0 focus:border-black uppercase font-bold"
                                placeholder="Enter your email"
                            />
                            <button 
                                type="submit"
                                disabled={backInStockLoading}
                                className="w-full bg-black hover:bg-neutral-800 text-white font-black text-[10px] tracking-widest py-3.5 rounded-none uppercase transition-colors flex items-center justify-center space-x-2"
                            >
                                {backInStockLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                <span>SUBSCRIBE</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* MOBILE MENU ACCORDION DRAWER (Slide-in from left) */}
            {/* ========================================================================= */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden md:hidden">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
                    
                    {/* Drawer Panel */}
                    <div className="absolute inset-y-0 left-0 max-w-full flex">
                        <div className="w-screen max-w-xs bg-white flex flex-col shadow-2xl rounded-none border-r border-stone-200 animate-in slide-in-from-left duration-300">
                            
                            {/* Drawer Header */}
                            <div className="px-6 py-5 border-b border-stone-150 flex items-center justify-between">
                                <span className="font-black tracking-[0.25em] text-sm text-black">MENU</span>
                                <button 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-stone-900 hover:text-black focus:outline-none p-1"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Accordion Categories Body */}
                            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 font-black uppercase tracking-widest text-[10px] text-stone-700">
                                
                                {/* Sale Link */}
                                <Link 
                                    href="/shop?sort=discount"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2 text-red-650 border-b border-stone-50"
                                >
                                    MID SEASON SALE
                                </Link>

                                <Link 
                                    href="/shop"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2 border-b border-stone-50"
                                >
                                    Daily New In
                                </Link>

                                {/* Accordion Items for Categories */}
                                {categories.map((cat) => (
                                    <MobileAccordionGroup 
                                        key={cat.id} 
                                        category={cat} 
                                        closeMenu={() => setMobileMenuOpen(false)} 
                                    />
                                ))}

                                <Link 
                                    href="/collections"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2 border-b border-stone-50"
                                >
                                    Lookbook
                                </Link>

                                <Link 
                                    href={route('wishlist')} 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-2 border-b border-stone-50"
                                >
                                    My Wish List
                                </Link>
                            </div>

                            {/* Footer links inside mobile menu */}
                            <div className="border-t border-stone-100 p-6 space-y-3 bg-stone-50">
                                {auth?.user ? (
                                    <div className="space-y-2">
                                        <p className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">Logged in as {auth.user.name}</p>
                                        <Link 
                                            href={route('logout')} 
                                            method="post" 
                                            as="button" 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full block text-center bg-black text-white text-[9px] font-black tracking-widest py-3 rounded-none uppercase"
                                        >
                                            Logout
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                                setLoginModalOpen(true);
                                            }}
                                            className="border border-stone-300 text-black text-center py-3 rounded-none text-[9px] font-black uppercase tracking-widest bg-white"
                                        >
                                            Sign In
                                        </button>
                                        <Link 
                                            href={route('register')} 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="bg-black text-white text-center py-3 rounded-none text-[9px] font-black uppercase tracking-widest"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                                
                                {/* Quick WhatsApp link inside menu */}
                                <a 
                                    href="https://wa.me/923001234567" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center space-x-2 text-[9px] font-black uppercase tracking-widest text-[#25D366] pt-1"
                                >
                                    <span>Chat on WhatsApp</span>
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* QUICK VIEW MODAL (Triggered by Quick View button on card hover) */}
            {/* ========================================================================= */}
            {quickViewOpen && quickViewProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60" onClick={() => setQuickViewOpen(false)} />
                    
                    {/* Modal Content */}
                    <div className="relative w-full max-w-2xl bg-white border border-stone-200 shadow-2xl p-6 sm:p-8 z-10 rounded-none animate-in scale-in duration-200 flex flex-col md:flex-row gap-6">
                        
                        {/* Close button */}
                        <button 
                            onClick={() => setQuickViewOpen(false)}
                            className="absolute top-4 right-4 text-stone-400 hover:text-black p-1 z-10"
                        >
                            <X size={18} />
                        </button>

                        {/* Left: Product Image */}
                        <div className="w-full md:w-1/2 aspect-[3/4] bg-stone-50 overflow-hidden flex-shrink-0">
                            <img 
                                src={getProductImageUrl(quickViewProduct) ? getAssetUrl(`storage/${getProductImageUrl(quickViewProduct)}`) : ''} 
                                alt={quickViewProduct.name}
                                className="w-full h-full object-cover rounded-none" 
                            />
                        </div>

                        {/* Right: Info and Size Grid */}
                        <div className="flex-grow flex flex-col justify-between">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[8px] uppercase font-black text-stone-400 tracking-[0.25em] mb-1">
                                        BRANDS STUDIO
                                    </p>
                                    <h3 className="text-sm sm:text-base font-black uppercase text-stone-900 tracking-wider">
                                        {quickViewProduct.name}
                                    </h3>
                                    <p className="text-xs font-black text-red-650 mt-1">
                                        Rs. {(quickViewProduct.discount_price ?? quickViewProduct.price).toLocaleString()}
                                    </p>
                                </div>

                                <p className="text-[10px] sm:text-xs text-stone-450 leading-relaxed font-bold tracking-wider uppercase">
                                    {quickViewProduct.short_description || quickViewProduct.description || 'Exclusive Brands Studio creation.'}
                                </p>

                                {/* Size selector grid */}
                                <div>
                                    <span className="block text-[9px] font-black uppercase tracking-widest text-stone-400 mb-2">
                                        Select Size
                                    </span>
                                    <div className="grid grid-cols-4 gap-2">
                                        {(quickViewProduct.variants ? [...new Set(quickViewProduct.variants.map(v => v.size).filter(Boolean))] : []).map((sz) => {
                                            const inStock = quickViewProduct.variants.some(v => v.size === sz && v.stock_quantity > 0);
                                            const isSelected = quickViewSelectedSize === sz;
                                            return (
                                                <button
                                                    key={sz}
                                                    onClick={() => {
                                                        if (inStock) {
                                                            setQuickViewSelectedSize(sz === quickViewSelectedSize ? null : sz);
                                                        } else {
                                                            setQuickViewOpen(false);
                                                            window.dispatchEvent(new CustomEvent('trigger-back-in-stock', { detail: { product: quickViewProduct, size: sz } }));
                                                        }
                                                    }}
                                                    className={`py-2 text-[9px] font-black tracking-widest uppercase border transition-all ${
                                                        isSelected 
                                                            ? 'bg-black text-white border-black'
                                                            : inStock
                                                                ? 'bg-white text-stone-750 border-stone-200/80 hover:border-black'
                                                                : 'bg-stone-50 text-stone-300 border-stone-200 line-through cursor-pointer'
                                                    }`}
                                                >
                                                    {sz}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Add to Cart button */}
                            <div className="pt-6">
                                <button
                                    onClick={() => {
                                        const selectedVariant = quickViewProduct.variants && quickViewSelectedSize
                                            ? quickViewProduct.variants.find(v => v.size === quickViewSelectedSize)
                                            : (quickViewProduct.variants && quickViewProduct.variants.length > 0 ? quickViewProduct.variants[0] : null);
                                            
                                        addToCart(quickViewProduct, selectedVariant, 1);
                                        setQuickViewOpen(false);
                                        window.dispatchEvent(new CustomEvent('cart-updated', { detail: { product: quickViewProduct } }));
                                    }}
                                    className="w-full bg-black hover:bg-neutral-800 text-white font-black text-[10px] tracking-widest py-3.5 rounded-none uppercase transition-colors"
                                >
                                    {quickViewSelectedSize ? `Add Size ${quickViewSelectedSize} to bag` : 'Add to bag'}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Notification Toast */}
            {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
                    <div className={`flex items-center space-x-3 px-6 py-3.5 rounded-none shadow-2xl border ${
                        toast.type === 'success' 
                            ? 'bg-neutral-900 text-white border-neutral-850' 
                            : 'bg-red-650 text-white border-red-600'
                    }`}>
                        {toast.type === 'success' ? <Check size={14} className="text-emerald-400" /> : <AlertCircle size={14} className="text-red-200" />}
                        <span className="text-[10px] font-black tracking-widest uppercase text-white">{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Inner helper component for Mobile Menu Accordion expansion
function MobileAccordionGroup({ category, closeMenu }) {
    const [expanded, setExpanded] = useState(false);
    const hasChildren = category.children && category.children.length > 0;

    if (!hasChildren) {
        return (
            <Link 
                href={route('shop', { category: category.slug })}
                onClick={closeMenu}
                className="block py-2 border-b border-stone-50"
            >
                {category.name}
            </Link>
        );
    }

    return (
        <div className="border-b border-stone-50 py-1">
            <div className="flex justify-between items-center py-1">
                <Link 
                    href={route('shop', { category: category.slug })} 
                    onClick={closeMenu}
                    className="hover:text-black"
                >
                    {category.name}
                </Link>
                <button 
                    onClick={() => setExpanded(!expanded)} 
                    className="p-2 text-stone-400 hover:text-black focus:outline-none"
                >
                    <span className="text-xs font-black select-none">{expanded ? '−' : '+'}</span>
                </button>
            </div>
            
            {expanded && (
                <div className="pl-3 py-1 space-y-2.5 border-l border-stone-200 ml-1 mb-2 animate-in slide-in-from-top duration-200">
                    {category.children.map((sub) => (
                        <Link 
                            key={sub.id}
                            href={route('shop', { category: sub.slug })} 
                            onClick={closeMenu}
                            className="block text-[9px] tracking-widest font-black text-stone-500 hover:text-black"
                        >
                            {sub.name}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
