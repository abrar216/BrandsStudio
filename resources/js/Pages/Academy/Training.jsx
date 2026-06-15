import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Play, 
    Video, 
    Newspaper, 
    ArrowRight, 
    Shield, 
    TrendingUp, 
    Coins, 
    ExternalLink, 
    Star,
    CheckCircle2,
    Building2,
    Activity,
    Info,
    X
} from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function Training({ brokers }) {
    const { user } = usePage().props.auth;
    const [activeTab, setActiveTab] = useState('tutorials');
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const handleMediaClick = (item) => {
        setModalContent(item);
        setShowModal(true);
    };

    const tutorials = [
        {
            id: 1,
            title: "Navigating the TradeX Terminal",
            description: "Learn how to use the TradeX platform to execute trades, view charts, and monitor your portfolio in real-time.",
            duration: "5:30",
            category: "Platform",
            type: "video",
            video_url: "https://www.youtube.com/embed/SSo_EIwHSd4", // Placeholder for actual TradeX tutorial
            fullContent: "The TradeX Terminal is designed for both beginners and professionals. In this video, we'll walk you through the symbol selector, the real-time order book, and how to use AI-driven insights to make better trading decisions."
        },
        {
            id: 2,
            title: "Executing Your First Trade",
            description: "How to use your virtual $100,000 to buy and sell global cryptocurrencies and US stocks.",
            duration: "4:15",
            category: "Execution",
            type: "video",
            video_url: "https://www.youtube.com/embed/jIdKIdGf7Y0", // Placeholder
            fullContent: "Trading assets on TradeX is simple. Select your asset, enter the quantity, and choose between Market or Limit orders. This video shows you the exact steps to build your first virtual portfolio."
        },
        {
            id: 3,
            title: "Risk Management Strategies",
            description: "Protecting your virtual balance. Learn why diversification is key and how to use stop-losses to minimize potential losses.",
            duration: "6:45",
            category: "Strategy",
            type: "article",
            fullContent: "Risk management is the most important part of trading. On the TradeX platform, we provide you with virtual capital so you can practice without fear. High-risk assets can offer huge gains but also deep losses. We recommend never putting more than 10% of your capital into a single asset. Use the 'Liquidate' button wisely if a position turns against you."
        }
    ];

    const newsItems = [
        {
            id: 1,
            title: "PSX Rockets to New Heights: KSE-100 Gains 800 Points",
            source: "Financial Times PK",
            time: "2 hours ago",
            image: "https://images.unsplash.com/photo-1611974717483-3600997e556f?auto=format&fit=crop&q=80&w=400",
            badge: "Trending"
        },
        {
            id: 2,
            title: "State Bank Maintains Interest Rates at 22%",
            source: "Business Recorder",
            time: "4 hours ago",
            image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=400",
            badge: "Breaking"
        },
        {
            id: 3,
            title: "Tech Sector Leads Market Recovery in Early Trading",
            source: "Live Market News",
            time: "6 hours ago",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
            badge: "Live"
        }
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tighter">
                            Training <span className="text-brand-accent">Center</span>
                        </h2>
                        <p className="text-white/50 text-sm mt-1">Master the markets with virtual points & expert guidance.</p>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                        {['tutorials', 'news', 'brokers'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-brand-accent text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            }
        >
            <Head title="Trader Training" />

            <div className="py-6 space-y-12 max-w-7xl mx-auto">
                
                {/* How to Trade Section (Visible when activeTab is tutorials) */}
                {activeTab === 'tutorials' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Trading Stats for Beginners */}
                            <div className="bg-brand-surface p-6 rounded-[2rem] border border-white/10 flex items-center gap-5">
                                <div className="h-14 w-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                                    <Coins size={28} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Simulated Capital</span>
                                    <p className="text-xl font-black text-white">$100,000</p>
                                </div>
                            </div>
                            <div className="bg-brand-surface p-6 rounded-[2rem] border border-white/10 flex items-center gap-5">
                                <div className="h-14 w-14 rounded-2xl bg-brand-emerald/10 flex items-center justify-center text-brand-emerald">
                                    <Activity size={28} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Market Status</span>
                                    <p className="text-xl font-black text-white">Live Execution</p>
                                </div>
                            </div>
                            <div className="bg-brand-surface p-6 rounded-[2rem] border border-white/10 flex items-center gap-5">
                                <div className="h-14 w-14 rounded-2xl bg-brand-coral/10 flex items-center justify-center text-brand-coral">
                                    <Shield size={28} />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Trading Risk</span>
                                    <p className="text-xl font-black text-white">Zero Risk (Sim)</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {tutorials.map((tutorial) => (
                                <div key={tutorial.id} className="group relative bg-brand-surface rounded-[2.5rem] border border-white/10 overflow-hidden hover:border-brand-accent/30 transition-all duration-500 shadow-sm">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                        {tutorial.type === 'video' ? <Video size={120} /> : <Newspaper size={120} />}
                                    </div>
                                    <div className="p-8 md:p-10 flex flex-col h-full relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="px-3 py-1 bg-brand-accent/10 rounded-full text-[10px] font-black text-brand-accent uppercase tracking-widest border border-brand-accent/20">
                                                {tutorial.category}
                                            </span>
                                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-1">
                                                <Play size={10} className="fill-white/30" /> {tutorial.duration} MIN
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-black text-white tracking-tight mb-4 group-hover:text-brand-accent transition-colors">
                                            {tutorial.title}
                                        </h3>
                                        <p className="text-white/60 text-sm leading-relaxed mb-8 flex-1">
                                            {tutorial.description}
                                        </p>
                                        <button 
                                            onClick={() => handleMediaClick(tutorial)}
                                            className="flex items-center gap-2 text-white font-black uppercase text-xs tracking-widest hover:gap-4 transition-all"
                                        >
                                            {tutorial.type === 'video' ? 'Watch Video' : 'Read Article'}
                                            <ArrowRight size={16} className="text-brand-accent" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Interactive Buy/Sell Promo */}
                            <div className="bg-gradient-to-br from-brand-accent to-brand-emerald rounded-[2.5rem] p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative z-10 space-y-6">
                                    <div className="h-20 w-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                                        <TrendingUp size={40} className="text-white" />
                                    </div>
                                    <h3 className="text-3xl font-black text-white tracking-tighter">Ready to Place Your First Trade?</h3>
                                    <p className="text-white/90 font-medium max-w-sm">Use your virtual $100,000 to buy assets in our demo trading terminal.</p>
                                    <Link 
                                        href={route('trading.index')}
                                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-brand-accent rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-transform shadow-xl"
                                    >
                                        Go to Trading Terminal
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Live News Section (Visible when activeTab is news) */}
                {activeTab === 'news' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="bg-brand-surface rounded-[2.5rem] border border-white/10 overflow-hidden">
                            <div className="p-8 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-brand-coral/10 rounded-xl flex items-center justify-center text-brand-coral">
                                        <Activity size={20} className="animate-pulse" />
                                    </div>
                                    <h3 className="text-xl font-black text-white tracking-tight">Market Live Feed</h3>
                                </div>
                                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Refreshes every 60s</span>
                            </div>
                            <div className="divide-y divide-white/10">
                                {newsItems.map((item) => (
                                    <div key={item.id} className="p-8 hover:bg-white/[0.02] transition-colors group cursor-pointer flex flex-col md:flex-row gap-8">
                                        <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="px-2 py-0.5 bg-brand-emerald-light/10 text-brand-emerald-light rounded-md text-[9px] font-black uppercase tracking-tighter">
                                                    {item.badge}
                                                </span>
                                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.source} • {item.time}</span>
                                            </div>
                                            <h4 className="text-lg font-black text-white group-hover:text-brand-accent transition-colors">
                                                {item.title}
                                            </h4>
                                             <div className="flex items-center gap-4 pt-2">
                                                <button 
                                                    onClick={() => handleMediaClick({...item, type: 'article', fullContent: "The Pakistan Stock Exchange (PSX) continues to show strength as the KSE-100 index crosses critical resistance levels. Analysts attribute this bullish momentum to positive developments in IMF negotiations and stable corporate earnings across the fertilizer and banking sectors."})}
                                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-accent hover:text-white transition-colors"
                                                >
                                                    Read Full Story <ExternalLink size={12} />
                                                </button>
                                                <button 
                                                    onClick={() => handleMediaClick({...item, type: 'video', video_url: 'https://www.youtube.com/embed/L7G0OfJUON8'})}
                                                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                                                >
                                                    Watch Analysis <Play size={10} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Broker Hub Section (Visible when activeTab is brokers) */}
                {activeTab === 'brokers' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="text-center max-w-2xl mx-auto space-y-4">
                            <h2 className="text-3xl font-black text-white tracking-tight">Select Your Preferred Broker</h2>
                            <p className="text-white/50 text-sm">Once you graduate from demo trading, choosing the right broker is your next step. Learn about the top institutional players in Pakistan.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {brokers.map((broker) => (
                                <div key={broker.id} className="bg-brand-surface p-8 rounded-[2.5rem] border border-white/10 hover:border-brand-accent/30 transition-all duration-500 group flex flex-col shadow-sm">
                                    <div className="h-20 w-full mb-8 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all bg-white/5 rounded-2xl p-4">
                                        <img 
                                            src={broker.logo} 
                                            alt={broker.name} 
                                            className="max-h-12 max-w-[80%] object-contain"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(broker.name)}&background=10b981&color=fff&size=128&bold=true`;
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-black text-white tracking-tight group-hover:text-brand-accent transition-colors">{broker.name}</h4>
                                            <div className="flex items-center gap-1 text-brand-gold">
                                                <Star size={12} className="fill-brand-gold" />
                                                <span className="text-[10px] font-bold text-white">{broker.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs text-white/50 leading-relaxed italic">"{broker.description}"</p>
                                        <div className="space-y-2 pt-4">
                                            <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/30 tracking-widest">
                                                <CheckCircle2 size={12} className="text-brand-emerald" />
                                                PSX Registered
                                            </div>
                                            <div className="flex items-center gap-2 text-[9px] font-black uppercase text-white/30 tracking-widest">
                                                <CheckCircle2 size={12} className="text-brand-emerald" />
                                                Low Commission
                                            </div>
                                        </div>
                                    </div>
                                    <Link 
                                        href={route('trading.index', { broker: broker.name })} 
                                        className="mt-8 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center group-hover:bg-brand-accent group-hover:text-white group-hover:border-brand-accent transition-all"
                                    >
                                        Select & Trade
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content Modal */}
                <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="2xl">
                    <div className="bg-[#0f1d18] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                        <button 
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 z-50 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
                        >
                            <X size={20} />
                        </button>

                        {modalContent?.type === 'video' ? (
                            <div className="space-y-6">
                                <div className="aspect-video w-full bg-black">
                                    <iframe 
                                        className="w-full h-full"
                                        src={modalContent.video_url}
                                        title={modalContent.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                                <div className="p-8 space-y-4">
                                    <h3 className="text-2xl font-black text-white">{modalContent.title}</h3>
                                    <p className="text-white/60 leading-relaxed italic border-l-4 border-brand-accent pl-4">
                                        {modalContent.fullContent || modalContent.description}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 md:p-12 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent">
                                        <Newspaper size={24} />
                                    </div>
                                    <h3 className="text-3xl font-black text-white">{modalContent?.title}</h3>
                                </div>
                                <div className="prose prose-invert max-w-none text-white/70 leading-relaxed space-y-6 text-lg">
                                    <p>{modalContent?.fullContent}</p>
                                    <p>As a reminder, all data in the TradeX platform is for educational purposes. Always double-check with official sources before making real-world financial decisions.</p>
                                </div>
                                <div className="pt-8 border-t border-white/10 flex justify-end">
                                    <button 
                                        onClick={() => setShowModal(false)}
                                        className="px-8 py-3 bg-brand-accent text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg"
                                    >
                                        Got it, thanks!
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </AuthenticatedLayout>
    );
}
