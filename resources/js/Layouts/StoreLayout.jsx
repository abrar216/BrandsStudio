import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { ShoppingBag, Heart, Search, User, Menu, X, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { getCartCount, getCart } from '../Utils/cart';

export default function StoreLayout({ children }) {
    const { auth, settings, flash, menuCategories: categories = [] } = usePage().props;
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        // Initial cart count
        setCartCount(getCartCount());

        // Event listener for cart updates
        let timer;
        const handleCartUpdate = (e) => {
            setCartCount(getCartCount());
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
        router.get(route('shop'), { search: searchQuery });
    };

    return (
        <div className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans overflow-x-hidden">
            
            {/* Diners Pakistan Style Top Announcement Bar */}
            <div className="bg-neutral-900 text-white text-[10px] tracking-[0.25em] font-extrabold uppercase py-2.5 text-center select-none border-b border-neutral-800">
                FREE SHIPPING IN PAKISTAN ON ORDERS ABOVE RS. 3000 | CASH ON DELIVERY
            </div>

            {/* Sticky Navigation */}
            <nav className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-white py-4'} border-b border-stone-200/60`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        
                        {/* Left: Brand Logo & Mobile Menu Toggle Button */}
                        <div className="flex items-center mr-4 lg:mr-8">
                            {/* Mobile Menu Button */}
                            <button 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-stone-600 hover:text-black focus:outline-none md:hidden mr-4 p-1"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? (
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-stone-900 transition-colors">
                                        <path d="M2 2L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                        <path d="M16 2L2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                ) : (
                                    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" className="text-stone-900 transition-colors">
                                        <path d="M1 2H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                        <path d="M1 7H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                        <path d="M1 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                )}
                            </button>

                            <Link href={route('welcome')} className="flex items-center space-x-1 text-black uppercase whitespace-nowrap select-none group">
                                <div className="flex flex-col items-start leading-none">
                                    <span className="font-extrabold tracking-[0.25em] text-lg sm:text-xl text-black">BRANDS STUDIO</span>
                                    <span className="text-[8px] font-bold tracking-[0.4em] text-stone-400 mt-0.5">SIGNATURE</span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation Links (Centered, Uppercase Montserrat) */}
                        <div className="hidden md:flex items-center space-x-6 lg:space-x-8 font-extrabold tracking-[0.18em] text-[10px] lg:text-[11px] text-stone-700">
                            <Link href={route('collections')} className="hover:text-black transition-colors duration-200 uppercase">COLLECTION</Link>
                            
                            {categories.map((cat) => (
                                <div key={cat.id} className="group relative py-4">
                                    {cat.children && cat.children.length > 0 ? (
                                        <>
                                            <Link 
                                                href={route('shop', { category: cat.slug })} 
                                                className="flex items-center space-x-1 hover:text-black transition-colors duration-200 uppercase"
                                            >
                                                <span>{cat.name}</span>
                                                <ChevronDown size={10} className="transition-transform group-hover:rotate-180" />
                                            </Link>
                                            
                                            {/* Dropdown menu panel - Sharp Rectangular look */}
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-48 bg-white border border-stone-200 shadow-lg py-2 z-50 rounded-none">
                                                {cat.children.map((sub) => (
                                                    <Link 
                                                        key={sub.id}
                                                        href={route('shop', { category: sub.slug })} 
                                                        className="block px-4 py-2.5 text-[10px] tracking-wider font-bold text-stone-600 hover:text-black hover:bg-stone-50 transition-colors"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <Link 
                                            href={route('shop', { category: cat.slug })} 
                                            className="hover:text-black transition-colors duration-200 uppercase"
                                        >
                                            {cat.name}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Navigation Right Side (Search, Wishlist, Cart, Profile) */}
                        <div className="flex items-center space-x-4 sm:space-x-6">
                            
                            {/* Search bar (Desktop) - Square styling */}
                            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
                                <input
                                    type="text"
                                    placeholder="SEARCH..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-stone-50 border border-stone-200/80 rounded-none py-1.5 pl-4 pr-10 text-[10px] tracking-wider w-40 focus:w-56 focus:bg-white focus:ring-0 focus:border-black transition-all duration-300 uppercase font-bold"
                                    />
                                <button type="submit" className="absolute right-3 text-stone-400 hover:text-black">
                                    <Search size={13} />
                                </button>
                            </form>

                            {/* Wishlist Shortcut */}
                            <Link href={route('wishlist')} className="text-stone-700 hover:text-black relative transition-colors duration-200">
                                <Heart size={20} className="stroke-[1.5]" />
                            </Link>

                            {/* Cart Icon with simple badge */}
                            <Link href={route('cart')} className="text-stone-700 hover:text-black relative transition-colors duration-200 p-1">
                                <ShoppingBag size={20} className="stroke-[1.5]" />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-600 text-white text-[8px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* User Account / Admin Panel links (Desktop only) */}
                            <div className="hidden md:block relative">
                                {auth?.user ? (
                                    <div>
                                        <button 
                                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                            className="flex items-center space-x-1 text-stone-700 hover:text-black focus:outline-none py-1"
                                        >
                                            <User size={18} className="stroke-[1.5]" />
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider">{(auth.user.name || '').split(' ')[0] || 'User'}</span>
                                            <ChevronDown size={10} className={`transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {userDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 shadow-lg py-1.5 z-50 rounded-none">
                                                <div className="px-4 py-2 border-b border-stone-100">
                                                    <p className="text-[9px] font-bold text-stone-450 uppercase tracking-widest">Signed in as</p>
                                                    <p className="text-xs font-bold truncate text-stone-800">{auth.user.email || ''}</p>
                                                    <span className="inline-block mt-1 bg-stone-100 text-stone-700 text-[8px] font-bold px-2 py-0.5 uppercase tracking-widest rounded-none">
                                                        {auth.user.role || ''}
                                                    </span>
                                                </div>

                                                <Link href={route('dashboard')} className="block px-4 py-2 text-[10px] tracking-wider uppercase font-bold text-stone-700 hover:bg-stone-50">Order History</Link>
                                                <Link href={route('profile.edit')} className="block px-4 py-2 text-[10px] tracking-wider uppercase font-bold text-stone-700 hover:bg-stone-50">Profile Settings</Link>
                                                <Link href={route('order.tracking')} className="block px-4 py-2 text-[10px] tracking-wider uppercase font-bold text-stone-700 hover:bg-stone-50">Track Order</Link>
                                                
                                                {/* Cashier/Staff POS access */}
                                                {auth.user.is_staff && (
                                                    <Link href={route('admin.pos.index')} className="block px-4 py-2 text-[10px] tracking-wider uppercase font-bold text-amber-600 hover:bg-amber-50 border-t border-stone-100">
                                                        POS Terminal
                                                    </Link>
                                                )}

                                                {/* Admin Dashboard access */}
                                                {auth.user.is_admin && (
                                                    <Link href={route('admin.dashboard')} className="block px-4 py-2 text-[10px] tracking-wider uppercase font-bold text-black hover:bg-stone-100">
                                                        Admin Dashboard
                                                    </Link>
                                                )}

                                                <Link 
                                                    href={route('logout')} 
                                                    method="post" 
                                                    as="button" 
                                                    className="w-full text-left block px-4 py-2 text-[10px] tracking-wider uppercase font-bold text-red-600 hover:bg-red-50 border-t border-stone-100"
                                                >
                                                    Log Out
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3 text-[10px] font-black tracking-[0.15em]">
                                        <Link href={route('login')} className="text-stone-700 hover:text-black transition-colors duration-200">LOGIN</Link>
                                        <span className="text-stone-200">|</span>
                                        <Link href={route('register')} className="bg-black hover:bg-neutral-800 text-white px-4 py-2.5 rounded-none transition-all duration-200">REGISTER</Link>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Mobile Menu dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-stone-100 bg-white py-4 px-6 space-y-4 font-bold text-stone-700">
                        <Link href={route('collections')} onClick={() => setMobileMenuOpen(false)} className="block py-2 border-b border-stone-50 hover:text-black uppercase text-[10px] tracking-[0.15em] font-extrabold">Collection</Link>
                        
                        {categories.map((cat) => (
                            <div key={cat.id} className="space-y-1 py-1 border-b border-stone-50">
                                <Link 
                                    href={route('shop', { category: cat.slug })} 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-1 text-stone-850 hover:text-black uppercase text-[10px] tracking-[0.15em] font-extrabold"
                                >
                                    {cat.name}
                                </Link>
                                {cat.children && cat.children.length > 0 && (
                                    <div className="pl-3 py-1 space-y-2 border-l border-stone-200 ml-1">
                                        {cat.children.map((sub) => (
                                            <Link 
                                                key={sub.id}
                                                href={route('shop', { category: sub.slug })} 
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block text-[10px] tracking-wider font-bold text-stone-500 hover:text-black py-0.5"
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        <Link href={route('wishlist')} onClick={() => setMobileMenuOpen(false)} className="block py-2 border-b border-stone-50 hover:text-black uppercase text-[10px] tracking-[0.15em] font-extrabold">Wishlist</Link>
                        
                        {/* Mobile Search */}
                        <form onSubmit={handleSearchSubmit} className="flex items-center relative mt-2">
                            <input
                                type="text"
                                placeholder="SEARCH APPAREL..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-stone-50 border border-stone-250 rounded-none py-2.5 pl-4 pr-10 text-[10px] tracking-wider w-full focus:bg-white uppercase font-bold"
                            />
                            <button type="submit" className="absolute right-3 text-stone-400">
                                <Search size={15} />
                            </button>
                        </form>

                        {/* Mobile Auth / Account links */}
                        <div className="pt-4 border-t border-stone-200">
                            {auth?.user ? (
                                <div className="space-y-3">
                                    <div className="px-2 py-1.5 bg-slate-50 rounded-xl">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                                        <p className="text-xs font-black truncate text-slate-800">{auth.user.name}</p>
                                    </div>
                                    <Link href={route('dashboard')} className="block py-2 hover:text-black text-sm">Order History</Link>
                                    <Link href={route('profile.edit')} className="block py-2 hover:text-black text-sm">Profile Settings</Link>
                                    <Link href={route('order.tracking')} className="block py-2 hover:text-black text-sm">Track Order</Link>
                                    
                                    {auth.user.is_staff && (
                                        <Link href={route('admin.pos.index')} className="block py-2 text-amber-600 font-bold text-sm">POS Terminal</Link>
                                    )}
                                    {auth.user.is_admin && (
                                        <Link href={route('admin.dashboard')} className="block py-2 text-indigo-650 font-bold text-sm">Admin Dashboard</Link>
                                    )}
                                    <Link 
                                        href={route('logout')} 
                                        method="post" 
                                        as="button" 
                                        className="w-full text-left block py-2 text-red-650 font-bold text-sm"
                                    >
                                        Log Out
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Link 
                                        href={route('login')} 
                                        className="border border-slate-200 text-slate-800 text-center py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-50 transition-all"
                                    >
                                        LOGIN
                                    </Link>
                                    <Link 
                                        href={route('register')} 
                                        className="bg-slate-900 text-white text-center py-3 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-black transition-all shadow-md"
                                    >
                                        REGISTER
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content Area */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Elegant Premium Footer (Diners inspired) */}
            <footer className="bg-neutral-950 text-stone-300 border-t border-stone-800 pt-16 pb-8 font-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <div className="flex flex-col items-start leading-none text-white">
                            <span className="font-extrabold tracking-[0.25em] text-lg text-white">BRANDS STUDIO</span>
                            <span className="text-[7px] font-bold tracking-[0.4em] text-stone-500 mt-0.5">SIGNATURE</span>
                        </div>
                        <p className="text-[11px] text-stone-400 leading-relaxed font-bold tracking-wider uppercase">
                            {settings?.site_tagline || 'Wear your signature.'} Offering high-fashion tailored silhouettes, premium textures, and contemporary styles designed for everyday luxury.
                        </p>
                        <div className="text-[9px] text-stone-500 font-extrabold tracking-widest uppercase">
                            <p>© 2026 BRANDS STUDIO. ALL RIGHTS RESERVED.</p>
                        </div>
                    </div>

                    {/* Quick Shop Links */}
                    <div>
                        <h4 className="text-[11px] font-extrabold text-white uppercase tracking-[0.18em] mb-4">COLLECTIONS</h4>
                        <ul className="space-y-2.5 text-[10px] tracking-wider uppercase font-bold text-stone-400">
                            <li><Link href={route('shop')} className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link href={route('shop', { category: 'menswear' })} className="hover:text-white transition-colors">Mens Apparel</Link></li>
                            <li><Link href={route('shop', { category: 'womenswear' })} className="hover:text-white transition-colors">Womens Apparel</Link></li>
                            <li><Link href={route('shop', { category: 'kids' })} className="hover:text-white transition-colors">Kids Wear</Link></li>
                            <li><Link href={route('shop', { category: 'accessories' })} className="hover:text-white transition-colors">Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Support & Services */}
                    <div>
                        <h4 className="text-[11px] font-extrabold text-white uppercase tracking-[0.18em] mb-4">CUSTOMER SERVICE</h4>
                        <ul className="space-y-2.5 text-[10px] tracking-wider uppercase font-bold text-stone-400">
                            <li><Link href={route('order.tracking')} className="hover:text-white transition-colors">Track Your Order</Link></li>
                            <li><Link href={route('cart')} className="hover:text-white transition-colors">Your Cart</Link></li>
                            <li><Link href={route('dashboard')} className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
                            <li><Link href={route('shipping.info')} className="hover:text-white transition-colors">Shipping Information</Link></li>
                            <li><Link href={route('faqs')} className="hover:text-white transition-colors">FAQs & Support</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter & Contact */}
                    <div className="space-y-4">
                        <h4 className="text-[11px] font-extrabold text-white uppercase tracking-[0.18em] mb-2">STAY INSPIRED</h4>
                        <p className="text-[11px] text-stone-400 leading-relaxed font-bold tracking-wider uppercase">
                            Subscribe to receive early sales access, style guides, and exclusive new collections drop releases.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} className="flex items-center">
                            <input
                                type="email"
                                placeholder="ENTER EMAIL..."
                                className="bg-neutral-900 text-[10px] tracking-wider border-stone-800 text-white rounded-none px-3 py-2.5 w-full focus:ring-0 focus:border-stone-500 focus:outline-none uppercase font-bold"
                            />
                            <button type="submit" className="bg-white hover:bg-stone-200 text-black text-[10px] tracking-widest font-black rounded-none px-5 py-2.5 uppercase transition-colors">
                                JOIN
                            </button>
                        </form>
                    </div>
                </div>
            </footer>

            {/* Notification Toast */}
            {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
                    <div className={`flex items-center space-x-3 px-6 py-3.5 rounded-2xl shadow-2xl border ${
                        toast.type === 'success' 
                            ? 'bg-slate-900 text-white border-slate-800' 
                            : 'bg-red-600 text-white border-red-500'
                    }`}>
                        {toast.type === 'success' ? <Check size={16} className="text-emerald-400" /> : <AlertCircle size={16} className="text-red-200" />}
                        <span className="text-xs font-bold tracking-wide text-white">{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
