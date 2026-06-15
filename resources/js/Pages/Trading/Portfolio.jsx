import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Wallet, TrendingUp, TrendingDown, PieChart, Activity, Shield, ArrowUpRight } from 'lucide-react';
import { Link, Head } from '@inertiajs/react';

export default function Portfolio({ portfolio = [], balance }) {
    const [portfolioList, setPortfolioList] = useState(portfolio);

    useEffect(() => {
        const fetchPrices = () => {
            fetch(route('market.prices'))
                .then(res => res.json())
                .then(prices => {
                    if (Array.isArray(prices)) {
                        setPortfolioList(prev => prev.map(item => {
                            const match = prices.find(p => p.symbol === item.symbol);
                            if (match) {
                                const newPrice = Number(match.current_price || 0);
                                return {
                                    ...item,
                                    current_price: newPrice,
                                    current_value: item.quantity * newPrice
                                };
                            }
                            return item;
                        }));
                    }
                })
                .catch(err => console.error('Error polling prices in portfolio:', err));
        };

        const intervalId = setInterval(fetchPrices, 8000);
        return () => clearInterval(intervalId);
    }, []);

    const totalInvestedValue = portfolioList.reduce((acc, item) => acc + item.current_value, 0);
    const totalAssets = balance + totalInvestedValue;

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(val);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col">
                    <h2 className="text-2xl font-black text-white tracking-tight">Investment Portfolio</h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Track your holdings and performance</p>
                </div>
            }
        >
            <Head title="My Portfolio" />

            <div className="space-y-8 pb-20">
                {/* Portfolio Summary Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#0f1d18]/40 backdrop-blur-md p-8 rounded-[32px] border border-white/5 relative overflow-hidden group hover:border-brand-accent/30 transition-all cursor-default">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Wallet size={80} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Available Cash</p>
                            <h3 className="text-3xl font-black text-white mb-2">{formatCurrency(balance)}</h3>
                            <div className="flex items-center gap-2 text-brand-emerald">
                                <Activity size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Ready to Invest</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0f1d18]/40 backdrop-blur-md p-8 rounded-[32px] border border-white/5 relative overflow-hidden group hover:border-brand-accent/30 transition-all cursor-default">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp size={80} />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">Market Value</p>
                            <h3 className="text-3xl font-black text-white mb-2">{formatCurrency(totalInvestedValue)}</h3>
                            <div className="flex items-center gap-2 text-brand-accent">
                                <PieChart size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">{portfolioList.length} Active Positions</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-brand-emerald/10 backdrop-blur-md p-8 rounded-[32px] border border-brand-emerald/20 relative overflow-hidden group hover:border-brand-emerald/40 transition-all cursor-default">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Shield size={80} className="text-brand-emerald" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-brand-emerald/60 uppercase tracking-[0.2em] mb-4">Total Net Worth</p>
                            <h3 className="text-3xl font-black text-white mb-2">{formatCurrency(totalAssets)}</h3>
                            <div className="flex items-center gap-2 text-brand-emerald">
                                <ArrowUpRight size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Demo Trading Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Holdings Table */}
                <div className="bg-[#0f1d18]/40 backdrop-blur-md rounded-[32px] border border-white/5 overflow-hidden">
                    <div className="px-8 py-6 border-b border-white/5 bg-white/5">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Asset Breakdown</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] border-b border-white/5">
                                    <th className="px-8 py-6">Company</th>
                                    <th className="px-8 py-6">Shares</th>
                                    <th className="px-8 py-6">Current Price</th>
                                    <th className="px-8 py-6">Market Value</th>
                                    <th className="px-8 py-6">Risk</th>
                                    <th className="px-8 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {portfolioList.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 text-white/20">
                                                <PieChart size={48} />
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em]">No holdings found in your portfolio</p>
                                                <Link href={route('trading.index')} className="mt-4 px-6 py-3 bg-brand-accent text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-accent/80 transition-all">Start Trading</Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : portfolioList.map((item) => (
                                    <tr 
                                        key={item.symbol} 
                                        className="hover:bg-white/5 transition-all group cursor-pointer"
                                        onClick={() => window.location.href = route('trading.index', { symbol: item.symbol })}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center font-bold text-brand-accent border border-white/10 group-hover:scale-110 transition-transform">
                                                    {item.symbol.substring(0, 1)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white">{item.symbol}</p>
                                                    <p className="text-[10px] text-white/40 font-bold uppercase">{item.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-white/80">{item.quantity}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-bold text-white/80">{formatCurrency(item.current_price)}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-black text-brand-emerald">{formatCurrency(item.current_value)}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] font-black uppercase px-2 py-1 rounded border ${
                                                item.risk === 'Low' ? 'text-brand-emerald border-brand-emerald/20 bg-brand-emerald/5' :
                                                item.risk === 'Medium' ? 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5' :
                                                'text-brand-danger border-brand-danger/20 bg-brand-danger/5'
                                            }`}>
                                                {item.risk} Risk
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                                            <Link 
                                                href={route('trading.index', { symbol: item.symbol })}
                                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white/60 transition-all"
                                            >
                                                Trade
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
