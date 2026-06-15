import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link, usePage } from '@inertiajs/react';
import { createChart, ColorType } from 'lightweight-charts';
import { useEffect, useRef, useState, useMemo } from 'react';
import { 
    TrendingUp, 
    TrendingDown, 
    Zap, 
    Clock, 
    History, 
    Activity, 
    Search,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    Info,
    Shield,
    Globe,
    Newspaper,
    Users,
    ChevronDown,
    Maximize2,
    AlertCircle,
    X,
    BarChart3,
    LineChart
} from 'lucide-react';
import Modal from '@/Components/Modal';

export default function Terminal({ stocks = [], selectedStock, portfolio = {}, recentTransactions = [], userBalance }) {
    const { url } = usePage() || {};
    const queryParams = new URL(url || '', window.location.origin).searchParams;
    const brokerName = queryParams.get('broker');

    const chartContainerRef = useRef();
    const chartRef = useRef();
    const seriesRef = useRef();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSecondaryTab, setActiveSecondaryTab] = useState('Transactions');
    const [orderType, setOrderType] = useState('market');
    const [chartType, setChartType] = useState('candle');
    const [timeframe, setTimeframe] = useState('1H');
    const [isLive, setIsLive] = useState(true);
    const [priceList, setPriceList] = useState(stocks || []);
    const [livePrices, setLivePrices] = useState(() => {
        const prices = {};
        (stocks || []).forEach(s => {
            prices[s.symbol] = Number(s.current_price || 0);
        });
        return prices;
    });

    const isLiveRef = useRef(isLive);
    useEffect(() => {
        isLiveRef.current = isLive;
    }, [isLive]);

    useEffect(() => {
        const fetchPrices = () => {
            if (!isLiveRef.current) return;
            fetch(route('market.prices'))
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setPriceList(data);
                        const prices = {};
                        data.forEach(s => {
                            prices[s.symbol] = Number(s.current_price || 0);
                        });
                        setLivePrices(prices);
                    }
                })
                .catch(err => console.error('Error fetching live prices:', err));
        };

        fetchPrices();
        const intervalId = setInterval(fetchPrices, 8000);
        return () => clearInterval(intervalId);
    }, []);

    const [showAssetSelector, setShowAssetSelector] = useState(false);
    const [showNewsModal, setShowNewsModal] = useState(false);
    const [selectedNews, setSelectedNews] = useState(null);

    const handleNewsClick = (news) => {
        setSelectedNews(news);
        setShowNewsModal(true);
    };

    const filteredStocks = (priceList || []).filter(stock => 
        stock?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        stock?.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        symbol: selectedStock?.symbol || '',
        quantity: 10,
        order_type: 'market',
        limit_price: selectedStock?.current_price || 0,
    });

    useEffect(() => {
        if (selectedStock) {
            setData({
                ...data,
                symbol: selectedStock.symbol,
                limit_price: selectedStock.current_price
            });
        }
    }, [selectedStock]);

    const handleOrderTypeChange = (type) => {
        setOrderType(type);
        setData('order_type', type);
    };

    // Simulated News
    const marketNews = [
        { id: 1, title: 'PSX Hits Record High as IMF Talks Progress', time: '2h ago', source: 'Express Tribune' },
        { id: 2, title: 'Interest Rates Expected to Hold Steady in Next Meeting', time: '4h ago', source: 'Dawn News' },
        { id: 3, title: 'Corporate Earnings Surge for Banking Sector', time: 'Yesterday', source: 'Profit' },
        { id: 4, title: 'Global Markets Rally on Tech Sector Strength', time: 'Yesterday', source: 'Reuters' },
    ];

    useEffect(() => {
        if (!chartContainerRef.current || !selectedStock) return;

        try {
            chartContainerRef.current.innerHTML = '';
            const sym = selectedStock.symbol.toUpperCase();
            let tvSymbol = 'NASDAQ:AAPL';

            if (sym === 'BTC') tvSymbol = 'BINANCE:BTCUSDT';
            else if (sym === 'ETH') tvSymbol = 'BINANCE:ETHUSDT';
            else if (sym === 'SOL') tvSymbol = 'BINANCE:SOLUSDT';
            else if (sym === 'BNB') tvSymbol = 'BINANCE:BNBUSDT';
            else if (['AAPL', 'TSLA', 'NVDA', 'AMZN'].includes(sym)) {
                tvSymbol = `NASDAQ:${sym}`;
            }

            const script = document.createElement("script");
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
            script.type = "text/javascript";
            script.async = true;
            script.innerHTML = JSON.stringify({
                "autosize": true,
                "symbol": tvSymbol,
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "enable_publishing": false,
                "allow_symbol_change": false,
                "calendar": false,
                "support_host": "https://www.tradingview.com"
            });
            chartContainerRef.current.appendChild(script);
        } catch (error) {
            console.error('TradingView Widget initialization failed:', error);
        }
    }, [selectedStock]);

    const executeTrade = (type) => {
        post(route(type === 'buy' ? 'trading.buy' : 'trading.sell'), {
            onSuccess: () => reset('quantity', 'limit_price'),
        });
    };

    const handleLiquidate = () => {
        if (confirm('Are you sure you want to liquidate this position?')) {
            setData('quantity', portfolio[selectedStock?.symbol]?.quantity || 0);
            executeTrade('sell');
        }
    };

    const selectStock = (symbol) => {
        setShowAssetSelector(false);
        router.get(route('trading.index', { symbol }));
    };

    const formatCurrency = (val) => {
        if (isNaN(val) || val === null || val === undefined) return '$0.00';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(val);
    };

    const aiSuggestion = useMemo(() => {
        if (!selectedStock) return null;
        const change = selectedStock.price_change;
        if (change > 2) return { type: 'strong_buy', text: 'STRONG BUY - Momentum is building rapidly. Bullish engulfing pattern detected.', color: 'text-brand-emerald', icon: <Zap className="fill-brand-emerald" size={14} /> };
        if (change > 0) return { type: 'buy', text: 'BUY SUGGESTION - Positive trend support. RSI indicates oversold conditions.', color: 'text-emerald-400', icon: <TrendingUp size={14} /> };
        if (change < -2) return { type: 'strong_sell', text: 'STRONG SELL - Heavy distribution detected. Support level breached.', color: 'text-brand-danger', icon: <TrendingDown size={14} /> };
        return { type: 'sell', text: 'SELL SUGGESTION - Negative momentum starting. Overbought in short timeframe.', color: 'text-red-400', icon: <TrendingDown size={14} /> };
    }, [selectedStock]);

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-brand-accent/20 rounded-xl flex items-center justify-center border border-brand-accent/20">
                            <Activity className="text-brand-accent" size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">
                                {brokerName ? `${brokerName} Terminal` : 'TradeX Terminal'}
                            </h2>
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">
                                {brokerName ? `Trading through ${brokerName}` : 'Live Market Engine v2.0'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Available Balance</p>
                            <p className="text-lg font-black text-brand-emerald">{formatCurrency(userBalance)}</p>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title={`Trade ${selectedStock?.symbol} | TradeX`} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
                {/* Left Sidebar: Market List */}
                <div className="lg:col-span-3 space-y-6 hidden lg:block">
                    <div className="bg-[#0f1d18]/40 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden h-[calc(100vh-140px)] flex flex-col">
                        <div className="p-4 border-b border-white/5 bg-white/5">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                                <input 
                                    type="text"
                                    placeholder="Search market..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-white focus:outline-none focus:border-brand-accent/50 placeholder:text-white/20 transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                            {filteredStocks.map((stock) => (
                                <button
                                    key={stock.id}
                                    onClick={() => selectStock(stock.symbol)}
                                    className={`w-full p-4 flex items-center justify-between hover:bg-white/5 transition-all text-left ${selectedStock?.symbol === stock.symbol ? 'bg-white/5 border-l-4 border-brand-accent' : 'border-l-4 border-transparent'}`}
                                >
                                    <div>
                                        <p className="font-bold text-white text-sm">{stock.symbol}</p>
                                        <p className="text-[10px] text-white/40 font-medium truncate w-24">{stock.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white text-xs">{formatCurrency(livePrices[stock.symbol] || stock.current_price)}</p>
                                        <p className={`text-[9px] font-bold ${stock.price_change >= 0 ? 'text-brand-emerald' : 'text-brand-danger'}`}>
                                            {stock.price_change >= 0 ? '+' : ''}{stock.price_change}%
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-6 space-y-6">
                    {/* Price Header */}
                    <div className="bg-[#0f1d18]/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 flex flex-wrap items-center justify-between gap-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 blur-[80px] rounded-full"></div>
                        <div className="flex items-center gap-4 relative">
                            <div className="h-14 w-14 bg-gradient-to-br from-brand-accent/20 to-brand-accent/5 rounded-2xl flex items-center justify-center font-black text-2xl text-brand-accent border border-brand-accent/20 shadow-inner">
                                {selectedStock?.symbol?.substring(0, 1) || '?'}
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white leading-tight">{selectedStock?.symbol}</h3>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">{selectedStock?.name}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 relative">
                            <div className="text-right">
                                <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-1">Live Price</p>
                                <div className="flex items-end gap-2">
                                    <p className="text-2xl font-black text-white">{formatCurrency(livePrices[selectedStock?.symbol] || selectedStock?.current_price)}</p>
                                    <span className={`text-xs font-bold mb-1 ${selectedStock?.price_change >= 0 ? 'text-brand-emerald' : 'text-brand-danger'}`}>
                                        {selectedStock?.price_change >= 0 ? '▲' : '▼'} {selectedStock?.price_change}%
                                    </span>
                                </div>
                            </div>

                            <div className="h-10 w-px bg-white/10 hidden sm:block"></div>

                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => executeTrade('buy')}
                                    disabled={processing}
                                    className="px-6 py-3 bg-brand-emerald hover:bg-emerald-400 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-brand-emerald/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                                >
                                    <ArrowUpRight size={14} /> Buy
                                </button>
                                <button 
                                    onClick={() => executeTrade('sell')}
                                    disabled={processing || !selectedStock || !portfolio[selectedStock?.symbol]}
                                    className="px-6 py-3 bg-brand-danger hover:bg-red-400 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-brand-danger/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 disabled:opacity-20"
                                >
                                    <ArrowDownRight size={14} /> Sell
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Chart & Order Book */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-12 bg-[#0f1d18]/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 min-h-[480px]">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex gap-3">
                                    <div className="flex bg-white/5 p-1 rounded-xl">
                                        {['1H', '1D', '1W', '1M'].map((t) => (
                                            <button 
                                                key={t}
                                                onClick={() => setTimeframe(t)}
                                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === t ? 'bg-brand-accent text-white shadow-soft' : 'text-white/40 hover:text-white'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                                        <button 
                                            onClick={() => setChartType('candle')}
                                            className={`px-3 py-1.5 rounded-lg transition-all ${chartType === 'candle' ? 'bg-brand-accent text-white shadow-soft' : 'text-white/40 hover:text-white'}`}
                                            title="Candlestick Chart"
                                        >
                                            <BarChart3 size={14} />
                                        </button>
                                        <button 
                                            onClick={() => setChartType('line')}
                                            className={`px-3 py-1.5 rounded-lg transition-all ${chartType === 'line' ? 'bg-brand-accent text-white shadow-soft' : 'text-white/40 hover:text-white'}`}
                                            title="Line Graph"
                                        >
                                            <LineChart size={14} />
                                        </button>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsLive(!isLive)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${isLive ? 'bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald' : 'bg-white/5 border-white/5 text-white/40'}`}
                                >
                                    <div className={`h-1.5 w-1.5 rounded-full ${isLive ? 'bg-brand-emerald animate-pulse' : 'bg-white/20'}`}></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{isLive ? 'Live Feed' : 'Feed Paused'}</span>
                                </button>
                            </div>
                            <div ref={chartContainerRef} className="w-full relative h-[400px]" />
                        </div>
                    </div>

                    {/* Secondary Tabs: Transactions & News */}
                    <div className="bg-[#0f1d18]/40 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden">
                        <div className="flex border-b border-white/5 bg-white/5 p-1 mx-4 mt-4 rounded-2xl w-fit">
                            {['Transactions', 'Market News'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveSecondaryTab(tab)}
                                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSecondaryTab === tab ? 'bg-brand-accent text-white' : 'text-white/40 hover:text-white'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="p-4">
                            {activeSecondaryTab === 'Transactions' ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-white/5 text-[9px] font-black text-white/20 uppercase tracking-widest">
                                                <th className="px-4 py-3 text-left">Stock</th>
                                                <th className="px-4 py-3 text-left">Type</th>
                                                <th className="px-4 py-3 text-left">Order</th>
                                                <th className="px-4 py-3 text-left">Qty</th>
                                                <th className="px-4 py-3 text-left">Price</th>
                                                <th className="px-4 py-3 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {recentTransactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="px-4 py-12 text-center text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">No transactions recorded</td>
                                                </tr>
                                            ) : recentTransactions.map((tx) => (
                                                <tr key={tx.id} className="hover:bg-white/5 transition-all group">
                                                    <td className="px-4 py-4">
                                                        <span className="text-xs font-black text-white">{tx.symbol}</span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-opacity-10 ${tx.type === 'buy' ? 'text-brand-emerald bg-brand-emerald' : 'text-brand-danger bg-brand-danger'}`}>
                                                            {tx.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-[10px] font-bold text-white/40 uppercase">{tx.order_type || 'market'}</span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-xs font-bold text-white/70">{tx.quantity}</span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-xs font-bold text-white/70">{formatCurrency(tx.price)}</span>
                                                    </td>
                                                    <td className="px-4 py-4 text-right">
                                                        <span className={`text-[9px] font-black uppercase ${tx.status === 'completed' ? 'text-brand-emerald' : tx.status === 'pending' ? 'text-yellow-400' : 'text-brand-danger'}`}>
                                                            {tx.status || 'completed'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {marketNews.map(news => (
                                        <div 
                                            key={news.id} 
                                            onClick={() => handleNewsClick(news)}
                                            className="flex flex-col gap-1 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-brand-accent/30 transition-all cursor-pointer group"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-[8px] font-black text-brand-accent uppercase tracking-widest flex items-center gap-1">
                                                    <Globe size={10} /> {news.source}
                                                </span>
                                                <span className="text-[8px] text-white/20 font-black uppercase">{news.time}</span>
                                            </div>
                                            <h5 className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors">{news.title}</h5>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Order Desk */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="rounded-2xl shadow-2xl p-6 border border-white/10 bg-[#0f1d18]/80 dark:bg-slate-900 sticky top-24 space-y-6 transition-all duration-300">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-black text-white uppercase tracking-wider">Order Desk</h3>
                                <div className="px-2 py-0.5 bg-brand-accent/20 rounded-md border border-brand-accent/20">
                                    <span className="text-[8px] font-black text-brand-accent uppercase tracking-[0.2em]">Ready</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Secure Virtual Trading Terminal</p>
                        </div>

                        {/* Order Type Toggle */}
                        <div className="flex bg-white/5 p-1.5 rounded-[20px] border border-white/5">
                            <button 
                                onClick={() => handleOrderTypeChange('market')}
                                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${orderType === 'market' ? 'bg-brand-accent text-white shadow-soft shadow-brand-accent/20' : 'text-white/40 hover:text-white'}`}
                            >
                                Market
                            </button>
                            <button 
                                onClick={() => handleOrderTypeChange('limit')}
                                className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${orderType === 'limit' ? 'bg-brand-accent text-white shadow-soft shadow-brand-accent/20' : 'text-white/40 hover:text-white'}`}
                            >
                                Limit
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Asset Selector */}
                            <div className="space-y-3 relative">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Symbol Selection</label>
                                <button 
                                    onClick={() => setShowAssetSelector(!showAssetSelector)}
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:bg-white/10 hover:border-brand-accent/30 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-brand-accent/10 rounded-lg flex items-center justify-center font-black text-xs text-brand-accent">
                                            {selectedStock?.symbol?.substring(0, 1) || '?'}
                                        </div>
                                        <span className="text-sm font-black text-white">{selectedStock?.symbol}</span>
                                    </div>
                                    <ChevronDown size={14} className={`text-white/40 group-hover:text-brand-accent transition-transform ${showAssetSelector ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Overlay */}
                                {showAssetSelector && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f1d18] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                                        <div className="p-3 border-b border-white/5">
                                            <input 
                                                autoFocus
                                                type="text"
                                                placeholder="Quick search..."
                                                className="w-full bg-white/5 border-none rounded-xl text-xs text-white focus:ring-1 focus:ring-brand-accent/50 placeholder:text-white/20"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                            {filteredStocks.map(stock => (
                                                <button
                                                    key={`drop-${stock.id}`}
                                                    onClick={() => selectStock(stock.symbol)}
                                                    className="w-full p-4 flex items-center justify-between hover:bg-white/5 text-left border-l-2 border-transparent hover:border-brand-accent transition-all"
                                                >
                                                    <span className="text-xs font-black text-white">{stock.symbol}</span>
                                                    <span className="text-[10px] font-bold text-white/40">{formatCurrency(stock.current_price)}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Quantity Input */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Execution Quantity</label>
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <input 
                                            type="number"
                                            min="1"
                                            value={data.quantity}
                                            onChange={e => setData('quantity', parseInt(e.target.value) || 0)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-5 text-2xl font-black text-white focus:outline-none focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/10 transition-all placeholder:text-white/10"
                                            placeholder="00"
                                        />
                                        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-white/20 uppercase tracking-widest group-focus-within:text-brand-accent transition-colors">Shares</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[10, 50, 100, 500].map(val => (
                                            <button 
                                                key={val}
                                                onClick={() => setData('quantity', val)}
                                                className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black text-white/60 transition-all hover:text-white active:scale-95"
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Limit Price Input */}
                            {orderType === 'limit' && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <label className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em] ml-1">Target Limit Price (USD)</label>
                                    <input 
                                        type="number"
                                        step="0.01"
                                        value={data.limit_price}
                                        onChange={e => setData('limit_price', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-brand-accent/5 border border-brand-accent/20 rounded-2xl px-5 py-4 text-lg font-black text-white focus:outline-none focus:border-brand-accent transition-all"
                                    />
                                </div>
                            )}

                            {/* Totals Box */}
                            <div className="p-5 bg-white/5 border border-white/5 rounded-[24px] space-y-4">
                                <div className="flex justify-between items-center text-white/60">
                                    <span className="text-[10px] font-black uppercase tracking-widest">In Portfolio</span>
                                    <span className="text-xs font-black text-brand-emerald">{portfolio[selectedStock?.symbol]?.quantity || 0} Shares</span>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Est. Order Value</span>
                                        <span className="text-[8px] text-white/30 font-bold">Qty × Price</span>
                                    </div>
                                    <span className="text-xl font-black text-white">
                                        {formatCurrency((orderType === 'limit' ? (data.limit_price || 0) : (livePrices[selectedStock?.symbol] || selectedStock?.current_price || 0)) * (data.quantity || 0))}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="px-4 py-3 bg-brand-accent/5 rounded-2xl border border-dashed border-brand-accent/20">
                                <p className="text-[9px] text-brand-emerald-light font-bold leading-relaxed flex items-center gap-2">
                                    <Info size={12} />
                                    <span>Enter quantity above, then click <strong>Buy</strong> to acquire shares or <strong>Sell</strong> to liquidate holdings. Use <strong>Limit</strong> to set a target price.</span>
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-4 pt-4">
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => executeTrade('buy')}
                                    disabled={processing}
                                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20"
                                >
                                    {processing ? '...' : <><ArrowUpRight size={18} /> Buy / Long</>}
                                </button>
                                <button 
                                    onClick={() => executeTrade('sell')}
                                    disabled={processing || !selectedStock || !portfolio[selectedStock?.symbol]}
                                    className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-20 disabled:scale-100 flex items-center justify-center gap-2 shadow-lg shadow-red-950/20"
                                >
                                    {processing ? '...' : <><ArrowDownRight size={18} /> Sell / Short</>}
                                </button>
                            </div>
                            
                            <button 
                                onClick={handleLiquidate}
                                disabled={processing || !portfolio[selectedStock?.symbol]}
                                className="w-full py-4 bg-white/5 hover:bg-brand-danger/20 border-2 border-dashed border-white/10 hover:border-brand-danger/40 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] text-white/40 hover:text-brand-danger transition-all active:scale-95 disabled:opacity-10 group flex items-center justify-center gap-3"
                            >
                                <AlertCircle size={14} /> LIQUIDATE FULL POSITION
                            </button>
                        </div>

                        {/* AI Insight Box */}
                        {aiSuggestion && (
                            <div className="p-5 bg-brand-accent/10 border border-brand-accent/20 rounded-3xl space-y-3 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-brand-accent/10 blur-2xl rounded-full"></div>
                                <div className="flex items-center gap-2 relative">
                                    <div className="p-1.5 bg-brand-accent rounded-lg text-white">
                                        {aiSuggestion.icon}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">AI Suggestion</span>
                                </div>
                                <div className="space-y-2 relative">
                                    <p className={`text-[11px] font-black uppercase tracking-wider ${aiSuggestion.color}`}>
                                        {aiSuggestion.text.split(' - ')[0]}
                                    </p>
                                    <p className="text-[10px] text-white/50 leading-relaxed font-bold">
                                        {aiSuggestion.text.split(' - ')[1]}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* News Modal */}
            <Modal show={showNewsModal} onClose={() => setShowNewsModal(false)} maxWidth="2xl">
                <div className="bg-[#0f1d18] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
                    <button 
                        onClick={() => setShowNewsModal(false)}
                        className="absolute top-6 right-6 z-50 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all border border-white/5"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-10 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent border border-brand-accent/20">
                                <Newspaper size={24} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">{selectedNews?.source}</span>
                                <h3 className="text-2xl font-black text-white leading-tight mt-1">{selectedNews?.title}</h3>
                            </div>
                        </div>
                        
                        <div className="prose prose-invert max-w-none">
                            <p className="text-white/60 leading-relaxed text-lg">
                                PSX (Pakistan Stock Exchange) witnessed a strong recovery today with the KSE-100 index gaining significant points. 
                                The market sentiment remained positive following developments in international trade talks and encouraging corporate 
                                earnings reports. Investors are closely monitoring the upcoming monetary policy meeting for further direction.
                            </p>
                            <p className="text-white/60 leading-relaxed text-lg pt-4 border-t border-white/5">
                                Disclaimer: This news is part of the TradeX educational simulation. For real-time trading information, 
                                please refer to your official broker terminal or the PSX data portal.
                            </p>
                        </div>

                        <div className="pt-6 flex justify-between items-center">
                            <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">PUBLISHED {selectedNews?.time}</span>
                            <button 
                                onClick={() => setShowNewsModal(false)}
                                className="px-8 py-3 bg-brand-accent text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 transition-transform"
                            >
                                Close Article
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}


