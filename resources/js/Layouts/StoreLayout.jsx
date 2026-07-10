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
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-x-hidden">


            {/* Sticky Navigation */}
            <nav className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-white py-5'} border-b border-slate-100`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        
                        {/* Left: Brand Logo & Mobile Menu Toggle Button */}
                        <div className="flex items-center mr-4 lg:mr-8 xl:mr-12">
                            {/* Mobile Menu Button */}
                            <button 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-slate-600 hover:text-black focus:outline-none md:hidden mr-4 p-1"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? (
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-slate-900 hover:text-amber-600 transition-colors">
                                        <path d="M2 2L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        <path d="M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                ) : (
                                    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" className="text-slate-900 hover:text-amber-600 transition-colors">
                                        <path d="M1 2H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        <path d="M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        <path d="M1 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                )}
                            </button>

                            <Link href={route('welcome')} className="flex items-center space-x-2.5 text-slate-900 uppercase whitespace-nowrap select-none group">
                                {/* Elegant Hanger Logo Icon */}
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900 flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 group-hover:scale-110 transition-transform duration-300">
                                    <path d="M12 7a3 3 0 1 0-3-3" />
                                    <path d="M12 7l9 6.5A1 1 0 0 1 20.4 15H3.6a1 1 0 0 1-.6-1.5L12 7z" />
                                </svg>
                                <div className="flex items-baseline leading-none text-lg sm:text-xl md:text-2xl font-bold font-['Cinzel']">
                                    <span className="font-black tracking-[0.15em] text-slate-900">BRANDS</span>
                                    <span className="font-normal tracking-[0.2em] ml-1.5 text-slate-500 opacity-90">STUDIO</span>
                                </div>
                            </Link>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8 font-medium tracking-wide text-xs text-slate-600">
                            <Link href={route('collections')} className="hover:text-black transition-colors duration-200 uppercase tracking-widest text-[11px] lg:text-xs font-bold whitespace-nowrap">COLLECTION</Link>
                            
                            {categories.map((cat) => (
                                <div key={cat.id} className="group relative py-4">
                                    {cat.children && cat.children.length > 0 ? (
                                        <>
                                            <Link 
                                                href={route('shop', { category: cat.slug })} 
                                                className="flex items-center space-x-1 hover:text-black transition-colors duration-200 uppercase tracking-widest text-[11px] lg:text-xs font-bold whitespace-nowrap"
                                            >
                                                <span>{cat.name}</span>
                                                <ChevronDown size={10} className="transition-transform group-hover:rotate-180" />
                                            </Link>
                                            
                                            {/* Dropdown menu panel */}
                                            <div className="absolute left-1/2 -translate-x-1/2 top-full hidden group-hover:block w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                                {cat.children.map((sub) => (
                                                    <Link 
                                                        key={sub.id}
                                                        href={route('shop', { category: sub.slug })} 
                                                        className="block px-4 py-2 text-xs font-bold text-slate-600 hover:text-black hover:bg-slate-50 transition-colors"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <Link 
                                            href={route('shop', { category: cat.slug })} 
                                            className="hover:text-black transition-colors duration-200 uppercase tracking-widest text-[11px] lg:text-xs font-bold whitespace-nowrap"
                                        >
                                            {cat.name}
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Navigation Right Side (Search, Wishlist, Cart, Profile) */}
                        <div className="flex items-center space-x-4 sm:space-x-6">
                            
                            {/* Search bar (Desktop) */}
                            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
                                <input
                                    type="text"
                                    placeholder="Search apparel..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-full py-1.5 pl-4 pr-10 text-xs w-48 focus:w-64 focus:bg-white focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all duration-300"
                                    />
                                <button type="submit" className="absolute right-3 text-slate-400 hover:text-black">
                                    <Search size={14} />
                                </button>
                            </form>

                            {/* Wishlist Shortcut */}
                            <Link href={route('wishlist')} className="text-slate-600 hover:text-black relative transition-colors duration-200">
                                <Heart size={22} />
                            </Link>

                            {/* Cart Icon with badge */}
                            <Link href={route('cart')} className="text-slate-600 hover:text-black relative transition-colors duration-200 p-1">
                                <ShoppingBag size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
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
                                            className="flex items-center space-x-1 text-slate-700 hover:text-black focus:outline-none py-1"
                                        >
                                            <User size={20} />
                                            <span className="text-xs font-semibold">{(auth.user.name || '').split(' ')[0] || 'User'}</span>
                                            <ChevronDown size={12} className={`transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {userDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                                                <div className="px-4 py-2 border-b border-slate-100">
                                                    <p className="text-xs text-slate-400">Signed in as</p>
                                                    <p className="text-sm font-semibold truncate text-slate-800">{auth.user.email || ''}</p>
                                                    <span className="inline-block mt-1 bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                        {auth.user.role || ''}
                                                    </span>
                                                </div>

                                                <Link href={route('dashboard')} className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium">Order History</Link>
                                                <Link href={route('profile.edit')} className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium">Profile Settings</Link>
                                                <Link href={route('order.tracking')} className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium">Track Order</Link>
                                                
                                                {/* Cashier/Staff POS access */}
                                                {auth.user.is_staff && (
                                                    <Link href={route('admin.pos.index')} className="block px-4 py-2 text-xs text-amber-600 hover:bg-amber-50 font-bold border-t border-slate-100">
                                                        POS Terminal
                                                    </Link>
                                                )}

                                                {/* Admin Dashboard access */}
                                                {auth.user.is_admin && (
                                                    <Link href={route('admin.dashboard')} className="block px-4 py-2 text-xs text-indigo-600 hover:bg-indigo-50 font-bold">
                                                        Admin Dashboard
                                                    </Link>
                                                )}

                                                <Link 
                                                    href={route('logout')} 
                                                    method="post" 
                                                    as="button" 
                                                    className="w-full text-left block px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-bold border-t border-slate-100"
                                                >
                                                    Log Out
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3 text-xs font-bold tracking-wider">
                                        <Link href={route('login')} className="text-slate-600 hover:text-black transition-colors duration-200">LOGIN</Link>
                                        <span className="text-slate-200">|</span>
                                        <Link href={route('register')} className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-full transition-all duration-200 shadow-sm">REGISTER</Link>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Mobile Menu dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-slate-100 bg-white py-4 px-6 space-y-4 font-semibold text-slate-700 animate-in slide-in-from-top duration-300">
                        <Link href={route('collections')} onClick={() => setMobileMenuOpen(false)} className="block py-2 border-b border-slate-50 hover:text-black uppercase text-xs tracking-wider font-extrabold">Collection</Link>
                        
                        {categories.map((cat) => (
                            <div key={cat.id} className="space-y-1 py-1 border-b border-slate-50">
                                <Link 
                                    href={route('shop', { category: cat.slug })} 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block py-1 text-slate-800 hover:text-black uppercase text-xs tracking-wider font-extrabold"
                                >
                                    {cat.name}
                                </Link>
                                {cat.children && cat.children.length > 0 && (
                                    <div className="pl-3 py-1 space-y-2 border-l border-slate-100 ml-1">
                                        {cat.children.map((sub) => (
                                            <Link 
                                                key={sub.id}
                                                href={route('shop', { category: sub.slug })} 
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="block text-xs font-bold text-slate-500 hover:text-black py-0.5"
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        <Link href={route('wishlist')} onClick={() => setMobileMenuOpen(false)} className="block py-2 border-b border-slate-50 hover:text-black uppercase text-xs tracking-wider font-extrabold">Wishlist</Link>
                        
                        {/* Mobile Search */}
                        <form onSubmit={handleSearchSubmit} className="flex items-center relative mt-2">
                            <input
                                type="text"
                                placeholder="Search apparel..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-slate-50 border border-slate-200 rounded-xl py-2 pl-4 pr-10 text-xs w-full focus:bg-white"
                            />
                            <button type="submit" className="absolute right-3 text-slate-400">
                                <Search size={16} />
                            </button>
                        </form>

                        {/* Mobile Auth / Account links */}
                        <div className="pt-4 border-t border-slate-150">
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

            {/* Elegant Premium Footer */}
            <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <div className="flex items-baseline leading-none text-xl font-bold font-['Cinzel'] text-white">
                            <span className="font-black tracking-[0.15em]">BRANDS</span>
                            <span className="font-normal tracking-[0.2em] ml-1.5 text-neutral-400 opacity-90">STUDIO</span>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                            {settings?.site_tagline || 'Wear your signature.'} Offering high-fashion tailored silhouettes, premium textures, and contemporary styles designed for everyday luxury.
                        </p>
                        <div className="text-xs text-neutral-500 font-semibold">
                            <p>© 2026 BRANDS STUDIO. ALL RIGHTS RESERVED.</p>
                        </div>
                    </div>

                    {/* Quick Shop Links */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">COLLECTIONS</h4>
                        <ul className="space-y-2 text-xs text-neutral-400">
                            <li><Link href={route('shop')} className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link href={route('shop', { category: 'menswear' })} className="hover:text-white transition-colors">Mens Apparel</Link></li>
                            <li><Link href={route('shop', { category: 'womenswear' })} className="hover:text-white transition-colors">Womens Apparel</Link></li>
                            <li><Link href={route('shop', { category: 'kids' })} className="hover:text-white transition-colors">Kids Wear</Link></li>
                            <li><Link href={route('shop', { category: 'accessories' })} className="hover:text-white transition-colors">Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Support & Services */}
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">CUSTOMER SERVICE</h4>
                        <ul className="space-y-2 text-xs text-neutral-400">
                            <li><Link href={route('order.tracking')} className="hover:text-white transition-colors">Track Your Order</Link></li>
                            <li><Link href={route('cart')} className="hover:text-white transition-colors">Your Cart</Link></li>
                            <li><Link href={route('dashboard')} className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
                            <li><Link href={route('shipping.info')} className="hover:text-white transition-colors">Shipping Information</Link></li>
                            <li><Link href={route('faqs')} className="hover:text-white transition-colors">FAQs & Support</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter & Contact */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">STAY INSPIRED</h4>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                            Subscribe to receive early sales access, style guides, and exclusive new collections drop releases.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} className="flex items-center">
                            <input
                                type="email"
                                placeholder="Enter email..."
                                className="bg-neutral-800 text-xs border-0 text-white rounded-l-md px-3 py-2 w-full focus:ring-1 focus:ring-amber-500 focus:outline-none"
                            />
                            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-r-md px-4 py-2">
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
