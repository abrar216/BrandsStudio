import { Link, usePage, Head } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';
import { 
    LayoutDashboard, 
    BookOpen, 
    Zap, 
    Wifi, 
    User, 
    LogOut, 
    Search, 
    Bell,
    Menu,
    X,
    TrendingUp,
    Wallet,
    Home,
    MessageCircle,
    Settings,
    Activity
} from 'lucide-react';
import Dropdown from '@/Components/Dropdown';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        setShowResults(true);
        try {
            const response = await axios.get(route('api.search'), { params: { q: query } });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, route: 'dashboard', active: route().current('dashboard') },
        { label: 'Training Hub', icon: Zap, route: 'academy.training', active: route().current('academy.training') },
        { label: 'Trading Academy', icon: BookOpen, route: 'academy.index', active: route().current('academy.index') || route().current('academy.show') || route().current('academy.lesson') },
        { label: 'Stock Trading', icon: TrendingUp, route: 'trading.index', active: route().current('trading.index') },
        { label: 'My Portfolio', icon: Wallet, route: 'trading.portfolio', active: route().current('trading.portfolio') },
        { label: 'Leaderboard', icon: Activity, route: 'trading.leaderboard', active: route().current('trading.leaderboard') },
        { label: 'Connectivity', icon: Wifi, route: 'api.index', active: route().current('api.index') },
        { label: 'Settings', icon: Settings, route: 'profile.edit', active: route().current('profile.edit') },
    ];

    return (
        <div className="flex min-h-screen bg-brand-bg font-['Inter'] antialiased text-white relative">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
                <style>{`
                    body {
                        font-family: 'Inter', sans-serif;
                    }
                    .font-display {
                        font-family: 'Manrope', sans-serif;
                    }
                `}</style>
            </Head>
            {/* Animated Background */}
            <div className="background-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-[70] w-[280px] glass-card !rounded-none !border-y-0 !border-l-0 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full p-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                        <div className="h-11 w-11 bg-gradient-gold rounded-xl flex items-center justify-center shadow-[0_8px_32px_rgba(5,150,105,0.3)]">
                            <span className="text-xl font-bold text-white">X</span>
                        </div>
                        <span className="text-2xl font-semibold tracking-tight text-gradient-gold">tradeX</span>
                    </Link>

                    <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-2">
                        <div>
                            <span className="text-[11px] font-semibold text-white/40 uppercase tracking-[1.5px] mb-4 block ml-4">Main Menu</span>
                            <nav className="space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={route(item.route)}
                                        className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 group ${item.active ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <item.icon size={20} className={`${item.active ? 'text-brand-emerald-light' : 'opacity-80 group-hover:opacity-100'}`} />
                                        <span className={`text-sm font-medium`}>{item.label}</span>
                                        {item.label === 'Trading' && <span className="ml-auto text-[10px] font-bold bg-gradient-gold px-2 py-0.5 rounded-full text-white">PRO</span>}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {(user.is_admin === 1 || user.is_admin === true) && (
                            <div>
                                <span className="text-[11px] font-semibold text-white/40 uppercase tracking-[1.5px] mb-4 block ml-4">Administration</span>
                                <nav className="space-y-1">
                                    <Link
                                        href={route('admin.users.index')}
                                        className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 group ${route().current('admin.users.*') ? 'bg-brand-accent/10 text-brand-accent' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <User size={20} className={`${route().current('admin.users.*') ? 'text-brand-accent' : 'opacity-80 group-hover:opacity-100'}`} />
                                        <span className={`text-sm font-medium`}>Users</span>
                                    </Link>
                                    <Link
                                        href={route('admin.courses.index')}
                                        className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 group ${route().current('admin.courses.*') ? 'bg-brand-accent/10 text-brand-accent' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
                                    >
                                        <BookOpen size={20} className={`${route().current('admin.courses.*') ? 'text-brand-accent' : 'opacity-80 group-hover:opacity-100'}`} />
                                        <span className={`text-sm font-medium`}>Courses</span>
                                    </Link>
                                </nav>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Footer/User Profile */}
                    <div className="mt-auto pt-6 border-t border-white/10">
                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all group">
                            <div className="h-10 w-10 rounded-xl bg-gradient-gold flex items-center justify-center font-bold text-sm">
                                {user.name?.substring(0, 2).toUpperCase() || 'TR'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{user.first_name || user.name?.split(' ')[0] || 'User'} {user.last_name || ''}</p>
                                <p className="text-xs text-white/40 truncate">
                                    {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Trader'}
                                </p>
                            </div>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="p-2 text-white/40 hover:text-brand-danger transition-colors"
                            >
                                <LogOut size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Topbar */}
                <header className="h-[70px] flex items-center justify-between px-8 z-50 shrink-0">
                    <div className="flex items-center gap-6 flex-1">
                        <button 
                            className="lg:hidden p-2 text-white/70 hover:bg-white/10 rounded-xl"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <div className="max-w-2xl w-full relative hidden lg:block mx-auto">
                            <form onSubmit={(e) => e.preventDefault()} className="relative">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <input 
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                                    placeholder="Search stocks, courses, or traders..."
                                    className="w-full pl-12 pr-6 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-brand-emerald-light/50 focus:ring-4 focus:ring-brand-emerald-light/10 transition-all placeholder:text-white/30 text-white"
                                />
                                
                                {showResults && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowResults(false)} />
                                        <div className="absolute top-full left-0 right-0 mt-2 glass-card !bg-[#1a2e23] !border-white/10 shadow-2xl z-50 max-h-[400px] overflow-y-auto custom-scrollbar overflow-hidden">
                                            {isSearching ? (
                                                <div className="p-4 text-center text-white/40 text-sm">
                                                    <div className="animate-spin h-5 w-5 border-2 border-brand-emerald-light border-t-transparent rounded-full mx-auto mb-2"></div>
                                                    Searching...
                                                </div>
                                            ) : searchResults.length > 0 ? (
                                                <div className="p-2">
                                                    {searchResults.map((result) => (
                                                        <Link
                                                            key={result.id}
                                                            href={result.url}
                                                            onClick={() => setShowResults(false)}
                                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-all group"
                                                        >
                                                            <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center text-brand-emerald-light group-hover:bg-brand-emerald-light/10">
                                                                {result.category === 'Academy' ? <BookOpen size={18} /> : <TrendingUp size={18} />}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-white">{result.title}</div>
                                                                <div className="text-[11px] text-white/40">{result.subtitle}</div>
                                                            </div>
                                                            <div className="ml-auto text-[10px] font-semibold text-white/20 uppercase tracking-wider">
                                                                {result.category}
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-8 text-center">
                                                    <div className="text-white/40 text-sm">No results found for "{searchQuery}"</div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => alert('No new notifications')}
                            className="h-11 w-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:border-white/20 transition-all relative"
                        >
                            <Bell size={20} />
                            <span className="absolute top-3 right-3 h-2 w-2 bg-brand-coral rounded-full shadow-[0_0_10px_var(--coral)]"></span>
                        </button>
                        
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="h-11 w-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white/70 hover:text-white hover:border-white/20 transition-all">
                                    <User size={20} />
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content contentClasses="py-2 bg-[#1a2e23] border border-white/10 shadow-2xl rounded-xl">
                                <Dropdown.Link href={route('profile.edit')} className="!text-white hover:!bg-white/10">Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button" className="!text-brand-danger hover:!bg-white/10">Logout</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Subheader (Optional title bar) */}
                {header && (
                    <div className="px-8 pt-4 pb-2 shrink-0 text-white">
                        {header}
                    </div>
                )}

                {/* Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
