import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    Shirt, 
    FolderKanban, 
    ShoppingBag, 
    Coins, 
    Settings as SettingsIcon, 
    MonitorPlay, 
    LogOut, 
    Home, 
    Menu, 
    X, 
    Clock, 
    Check, 
    AlertCircle,
    UserCheck,
    Globe,
    Sun,
    Moon
} from 'lucide-react';

export default function AdminLayout({ children, title, noSidebar = false }) {
    const { auth, settings, flash } = usePage().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [time, setTime] = useState('');
    const [toast, setToast] = useState(null);

    // Initial state check for dark mode
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('admin_dark_mode') === 'true';
        }
        return false;
    });

    useEffect(() => {
        // Sync class with HTML root element
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('admin_dark_mode', 'true');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('admin_dark_mode', 'false');
        }
    }, [darkMode]);

    useEffect(() => {
        // Clock ticker
        const updateClock = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    // Watch Inertia flash notifications
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

    const navLinks = auth.user.role === 'cashier' 
        ? [
            { name: 'POS Cashier Terminal', href: route('admin.pos.index'), icon: MonitorPlay, current: route().current('admin.pos.index') }
          ]
        : auth.user.role === 'staff'
        ? [
            { name: 'POS Cashier Terminal', href: route('admin.pos.index'), icon: MonitorPlay, current: route().current('admin.pos.index') },
            { name: 'Products Inventory', href: route('admin.products'), icon: Shirt, current: route().current('admin.products') },
          ]
        : auth.user.role === 'super_admin'
        ? [
            { name: 'Dashboard', href: route('admin.dashboard'), icon: LayoutDashboard, current: route().current('admin.dashboard') },
            { name: 'POS System', href: route('admin.pos.index'), icon: MonitorPlay, current: route().current('admin.pos.index') },
            { name: 'Products Inventory', href: route('admin.products'), icon: Shirt, current: route().current('admin.products') },
            { name: 'Categories', href: route('admin.categories'), icon: FolderKanban, current: route().current('admin.categories') },
            { name: 'Order Ledger', href: route('admin.orders'), icon: ShoppingBag, current: route().current('admin.orders') },
            { name: 'Expense Tracker', href: route('admin.expenses'), icon: Coins, current: route().current('admin.expenses') },
            { name: 'Website Control', href: route('admin.website-control'), icon: Globe, current: route().current('admin.website-control') || route().current('admin.homepage-sections') || route().current('admin.products-control') || route().current('admin.collections-control') },
            { name: 'Global Settings', href: route('admin.settings'), icon: SettingsIcon, current: route().current('admin.settings') },
          ]
        : [
            { name: 'Dashboard', href: route('admin.dashboard'), icon: LayoutDashboard, current: route().current('admin.dashboard') },
            { name: 'POS System', href: route('admin.pos.index'), icon: MonitorPlay, current: route().current('admin.pos.index') },
            { name: 'Products Inventory', href: route('admin.products'), icon: Shirt, current: route().current('admin.products') },
            { name: 'Categories', href: route('admin.categories'), icon: FolderKanban, current: route().current('admin.categories') },
            { name: 'Order Ledger', href: route('admin.orders'), icon: ShoppingBag, current: route().current('admin.orders') },
            { name: 'Expense Tracker', href: route('admin.expenses'), icon: Coins, current: route().current('admin.expenses') },
            { name: 'Global Settings', href: route('admin.settings'), icon: SettingsIcon, current: route().current('admin.settings') },
        ];

    return (
        <div className={`bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex font-sans transition-colors duration-200 ${noSidebar ? 'h-screen overflow-hidden flex-col' : 'min-h-screen flex-col md:flex-row'}`}>
            
            {/* Desktop & Tablet Sidebar */}
            {!noSidebar && (
                <aside className="pos-sidebar hidden md:flex flex-col w-64 bg-blue-900 dark:bg-slate-950 p-6 space-y-8 flex-shrink-0 shadow-lg border-r border-blue-950/40 dark:border-slate-800 transition-colors duration-200">
                {/* Brand header */}
                <div className="flex flex-col space-y-1 pb-6 border-b border-blue-800/40 dark:border-slate-800/60">
                    <Link href={route('welcome')} className="text-xl font-black tracking-widest text-white font-serif hover:text-blue-200 dark:hover:text-blue-400 transition-colors">
                        BRANDS STUDIO
                    </Link>
                    <span className="text-xs text-blue-200 dark:text-slate-400 font-extrabold uppercase tracking-wider">
                        Management Terminal
                    </span>
                </div>

                {/* Navigation links */}
                <nav className="flex-grow space-y-1.5">
                    {navLinks.map((link) => {
                        const IconComponent = link.icon;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${
                                    link.current
                                        ? 'bg-blue-800 dark:bg-slate-800 text-white shadow-md border border-blue-700/50 dark:border-slate-700/60'
                                        : 'text-blue-100 hover:bg-blue-800/80 dark:hover:bg-slate-800/50 hover:text-white dark:text-slate-300'
                                }`}
                            >
                                <IconComponent className="menu-icon" size={18} />
                                <span className="menu-text">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Operations Terminal Shortcuts */}
                <div className="space-y-2 pt-4 border-t border-blue-800/40 dark:border-slate-800/60">
                    <p className="text-xs font-black text-blue-300 dark:text-slate-400 uppercase tracking-widest px-4 mb-2">Operations</p>
                    <Link
                        href={route('admin.pos.index')}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-black text-white bg-blue-700 dark:bg-slate-800 hover:bg-blue-650 dark:hover:bg-slate-700 border border-blue-600/50 dark:border-slate-600/50 transition-colors shadow-sm"
                    >
                        <MonitorPlay size={16} />
                        <span>Launch POS Terminal</span>
                    </Link>
                    <Link
                        href={route('welcome')}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-blue-100 dark:text-slate-350 hover:bg-blue-800/80 dark:hover:bg-slate-800/55 hover:text-white transition-colors"
                    >
                        <Home size={16} />
                        <span>Back to Storefront</span>
                    </Link>
                </div>

                {/* Active user profile info */}
                <div className="bg-blue-950/40 dark:bg-slate-900/60 p-4 rounded-xl border border-blue-800/30 dark:border-slate-800/60 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5 truncate">
                        <div className="p-1.5 bg-blue-800/60 dark:bg-slate-800 rounded-lg text-blue-200">
                            <UserCheck size={16} />
                        </div>
                        <div className="truncate text-white">
                            <p className="text-sm font-bold truncate leading-tight">{auth.user.name}</p>
                            <p className="text-xs text-blue-200 dark:text-slate-400 font-extrabold uppercase mt-0.5">{auth.user.role}</p>
                        </div>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-blue-300 dark:text-slate-400 hover:text-red-300 dark:hover:text-red-400 p-1.5 hover:bg-red-950/30 rounded-lg transition-colors"
                        title="Log Out"
                    >
                        <LogOut size={16} />
                    </Link>
                </div>
            </aside>
            )}

            {/* Mobile Header Bar */}
            {!noSidebar && (
                <header className="md:hidden bg-blue-900 dark:bg-slate-950 border-b border-blue-950 dark:border-slate-900 px-6 py-4 flex items-center justify-between z-30 text-white shadow-md transition-colors duration-200">
                <div className="flex flex-col">
                    <Link href={route('welcome')} className="text-lg font-black tracking-widest text-white font-serif">
                        BRANDS STUDIO
                    </Link>
                    <span className="text-xs text-blue-200 dark:text-slate-400 font-bold uppercase tracking-wider">
                        Management Terminal
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 text-blue-100 hover:text-white rounded-lg focus:outline-none"
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-blue-100 hover:text-white focus:outline-none"
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </header>
            )}

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="pos-sidebar md:hidden fixed inset-0 z-40 bg-blue-900 dark:bg-slate-950 pt-20 px-6 pb-6 flex flex-col space-y-6 animate-in slide-in-from-top duration-300 text-white transition-colors duration-200">
                    <nav className="flex-grow space-y-2">
                        {navLinks.map((link) => {
                            const IconComponent = link.icon;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all ${
                                        link.current
                                            ? 'bg-blue-800 dark:bg-slate-800 text-white'
                                            : 'text-blue-100 hover:bg-blue-800/80 dark:hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <IconComponent className="menu-icon" size={18} />
                                    <span className="menu-text">{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="space-y-2 pt-4 border-t border-blue-800/40 dark:border-slate-800">
                        <Link
                            href={route('admin.pos.index')}
                            className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-xs font-black text-white bg-blue-700 dark:bg-slate-800 hover:bg-blue-650 border border-blue-600/50"
                        >
                            <MonitorPlay size={16} />
                            <span>Launch POS Terminal</span>
                        </Link>
                        <Link
                            href={route('welcome')}
                            className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-bold text-blue-100"
                        >
                            <Home size={16} />
                            <span>Back to Storefront</span>
                        </Link>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-bold text-red-300 bg-red-950/20"
                        >
                            <LogOut size={16} />
                            <span>Log Out</span>
                        </Link>
                    </div>
                </div>
            )}

            {/* Main Application Area */}
            <div className="flex-grow flex flex-col min-w-0 bg-slate-100 dark:bg-slate-900 transition-colors duration-200">
                {/* Secondary Topbar Header for Desktop */}
                {noSidebar ? (
                    <header className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm z-30 flex-shrink-0">
                        <div className="flex items-center space-x-3.5">
                            <Link
                                href={auth.user.role === 'cashier' || auth.user.role === 'staff' ? route('welcome') : route('admin.dashboard')}
                                className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-250/60 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-extrabold transition-all border border-slate-200 dark:border-slate-700/60"
                            >
                                <span>{auth.user.role === 'cashier' || auth.user.role === 'staff' ? '← Storefront' : '← Dashboard'}</span>
                            </Link>
                            <div className="h-4 w-[1px] bg-slate-250 dark:bg-slate-700"></div>
                            <h1 className="text-xs font-black text-slate-850 dark:text-white uppercase tracking-wider">{title}</h1>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {/* Clock */}
                            <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 text-xs font-bold font-mono">
                                <Clock size={12} className="text-blue-600" />
                                <span>{time || '--:--:--'}</span>
                            </div>
                            
                            {/* Dark mode */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500"
                            >
                                {darkMode ? <Sun size={12} className="text-amber-500" /> : <Moon size={12} className="text-blue-500" />}
                            </button>

                            {/* Logged cashier */}
                            <div className="text-right hidden sm:block">
                                <span className="text-[9px] font-black text-slate-400 block uppercase tracking-widest leading-none">Logged Cashier</span>
                                <span className="text-xs font-black text-slate-700 dark:text-slate-200 block mt-0.5">{auth.user.name.toUpperCase()}</span>
                            </div>
                        </div>
                    </header>
                ) : (
                    <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-slate-200/80 dark:border-slate-800/60 bg-slate-100 dark:bg-slate-900 transition-colors duration-200">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-wide font-sans">{title}</h1>
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        </div>

                        <div className="flex items-center space-x-6">
                            {/* Light / Dark Toggle button */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700/65 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm transition-all"
                                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            >
                                {darkMode ? <Sun size={15} className="text-amber-500" /> : <Moon size={15} className="text-blue-500" />}
                            </button>

                            {/* Notification Bell */}
                            {auth.user?.is_admin && (
                                <div className="relative group">
                                    <button className="p-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700/65 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-sm transition-all relative">
                                        <AlertCircle size={15} />
                                        {auth.unread_notifications_count > 0 && (
                                            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-black text-white">
                                                {auth.unread_notifications_count > 9 ? '9+' : auth.unread_notifications_count}
                                            </span>
                                        )}
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                                        <div className="p-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                                            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Notifications</h3>
                                            {auth.unread_notifications_count > 0 && (
                                                <Link href={route('admin.notifications.markAllRead')} method="post" as="button" className="text-[10px] text-blue-600 font-bold hover:underline">
                                                    Mark all read
                                                </Link>
                                            )}
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {auth.notifications?.length > 0 ? (
                                                auth.notifications.map((notif) => (
                                                    <div key={notif.id} className="p-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex justify-between items-start">
                                                        <div className="flex-grow pr-2">
                                                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{notif.data.message || 'New Notification'}</p>
                                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{notif.data.description || ''}</p>
                                                            <p className="text-[9px] text-slate-400 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-6 text-center text-xs text-slate-400">
                                                    No new notifications.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Live clock display */}
                            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-350 bg-white dark:bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs font-bold tracking-wider font-mono shadow-sm">
                                <Clock size={14} className="text-blue-600 dark:text-blue-400" />
                                <span>{time || '--:--:--'}</span>
                            </div>

                            {/* General Site Tagline display */}
                            <div className="text-sm text-slate-500 dark:text-slate-350 font-semibold">
                                Currency: <span className="text-slate-800 dark:text-white font-black">{settings.currency_symbol || 'Rs.'}</span>
                            </div>
                        </div>
                    </header>
                )}

                {/* Sub-page Content */}
                <main className={noSidebar ? "flex-grow overflow-hidden bg-slate-50 dark:bg-slate-900/30 flex flex-col min-h-0" : "flex-grow p-6 md:p-8 overflow-y-auto bg-slate-100/50 dark:bg-slate-900/30"}>
                    {noSidebar ? children : (
                        <div className="max-w-7xl mx-auto space-y-6">
                            {children}
                        </div>
                    )}
                </main>
            </div>

            {/* Notification Toast */}
            {toast && (
                <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom duration-300">
                    <div className={`flex items-center space-x-3 px-5 py-3.5 rounded-xl shadow-2xl border ${
                        toast.type === 'success' 
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-250/30 dark:border-slate-800 font-bold' 
                            : 'bg-red-50 text-red-800 border-red-250/30 dark:border-slate-800 font-bold'
                    }`}>
                        {toast.type === 'success' ? <Check size={18} className="text-emerald-500" /> : <AlertCircle size={18} className="text-red-500" />}
                        <span className="text-xs font-bold tracking-wide">{toast.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
