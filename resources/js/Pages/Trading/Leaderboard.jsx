import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Trophy, Medal, Crown, TrendingUp, Users, Activity, Star } from 'lucide-react';

export default function Leaderboard({ traders = [] }) {
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col">
                    <h2 className="text-2xl font-black text-white tracking-tight">Trader Excellence</h2>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Top performance rankings across the platform</p>
                </div>
            }
        >
            <Head title="Trader Leaderboard" />

            <div className="space-y-12 pb-20 max-w-5xl mx-auto">
                {/* Podium for top 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pt-8">
                    {/* Rank 2 */}
                    {traders[1] && (
                        <div className="order-2 md:order-1">
                            <div className="bg-[#0f1d18]/40 backdrop-blur-md p-8 rounded-[40px] border border-white/5 relative flex flex-col items-center group hover:border-brand-accent/20 transition-all">
                                <div className="absolute -top-6 h-12 w-12 bg-[#C0C0C0] rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/20">
                                    <Medal size={24} className="text-[#333]" />
                                </div>
                                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-2xl font-black text-white mb-6 group-hover:scale-110 transition-transform">
                                    {traders[1].name.substring(0, 2).toUpperCase()}
                                </div>
                                <h3 className="text-xl font-black text-white mb-1">{traders[1].name}</h3>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Elite Trader</p>
                                <div className="px-6 py-2 bg-white/5 rounded-full text-brand-accent font-black text-sm">
                                    {formatCurrency(traders[1].total_wealth)}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rank 1 */}
                    {traders[0] && (
                        <div className="order-1 md:order-2">
                            <div className="bg-[#0f1d18]/60 backdrop-blur-lg p-10 rounded-[48px] border border-brand-accent/30 relative flex flex-col items-center group scale-105 shadow-[0_32px_64px_-16px_rgba(5,150,105,0.2)]">
                                <div className="absolute -top-8 h-16 w-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[24px] flex items-center justify-center shadow-[0_0_40px_rgba(234,179,8,0.4)] border-4 border-[#1a1a1a]">
                                    <Crown size={32} className="text-[#1a1a1a]" />
                                </div>
                                <div className="h-24 w-24 rounded-[32px] bg-gradient-to-br from-brand-accent to-brand-emerald border border-white/20 flex items-center justify-center text-3xl font-black text-white mb-6 group-hover:rotate-6 transition-transform">
                                    {traders[0].name.substring(0, 2).toUpperCase()}
                                </div>
                                <h3 className="text-3xl font-black text-white mb-2">{traders[0].name}</h3>
                                <p className="text-[10px] font-black text-brand-emerald uppercase tracking-[0.3em] mb-6">Master Profit - #1</p>
                                <div className="px-8 py-4 bg-brand-accent text-white rounded-[24px] font-black text-xl shadow-[0_12px_24px_-8px_rgba(5,150,105,0.5)]">
                                    {formatCurrency(traders[0].total_wealth)}
                                </div>
                                <div className="mt-6 flex items-center gap-2">
                                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Achieved All Targets</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Rank 3 */}
                    {traders[2] && (
                        <div className="order-3 md:order-3">
                            <div className="bg-[#0f1d18]/40 backdrop-blur-md p-8 rounded-[40px] border border-white/5 relative flex flex-col items-center group hover:border-brand-accent/20 transition-all">
                                <div className="absolute -top-6 h-12 w-12 bg-[#CD7F32] rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/20">
                                    <Trophy size={24} className="text-[#333]" />
                                </div>
                                <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center text-2xl font-black text-white mb-6 group-hover:scale-110 transition-transform">
                                    {traders[2].name.substring(0, 2).toUpperCase()}
                                </div>
                                <h3 className="text-xl font-black text-white mb-1">{traders[2].name}</h3>
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Top Performer</p>
                                <div className="px-6 py-2 bg-white/5 rounded-full text-brand-accent font-black text-sm">
                                    {formatCurrency(traders[2].total_wealth)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* List for rest of ranks */}
                <div className="bg-[#0f1d18]/40 backdrop-blur-md rounded-[32px] border border-white/5 overflow-hidden">
                    <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Users size={16} /> Global Standings
                        </h3>
                        <span className="text-[10px] font-bold text-white/40 uppercase">Updated real-time</span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {traders.slice(3).map((trader, index) => (
                            <div key={trader.id} className="px-8 py-5 flex items-center justify-between hover:bg-white/5 transition-all group">
                                <div className="flex items-center gap-6">
                                    <span className="text-lg font-black text-white/10 group-hover:text-white/30 transition-colors w-8">#{index + 4}</span>
                                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs">
                                        {trader.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white">{trader.name}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="h-1 w-1 rounded-full bg-brand-emerald"></div>
                                            <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Active Trader</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-base font-black text-brand-emerald">{formatCurrency(trader.total_wealth)}</p>
                                    <div className="flex items-center gap-1 justify-end text-brand-accent">
                                        <TrendingUp size={10} />
                                        <span className="text-[9px] font-black uppercase tracking-tighter">Outperforming Market</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
