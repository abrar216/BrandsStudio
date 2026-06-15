import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';
import { 
    ShoppingBag, 
    CreditCard, 
    Calendar, 
    ArrowRight, 
    Package, 
    ShieldCheck, 
    Clock, 
    History,
    CheckCircle,
    User
} from 'lucide-react';

export default function Dashboard({ auth, stats, orders = [] }) {
    const user = auth.user;

    const formatCurrency = (val) => {
        return 'Rs. ' + new Intl.NumberFormat('en-PK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(parseFloat(val) || 0);
    };

    // Card grid config
    const cards = [
        {
            name: 'Total Orders',
            value: stats?.total_orders || 0,
            icon: ShoppingBag,
            color: 'text-slate-800',
            bg: 'bg-stone-100',
            subtitle: 'Placed orders'
        },
        {
            name: 'Lifetime Spend',
            value: formatCurrency(stats?.lifetime_spend || 0),
            icon: CreditCard,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            subtitle: 'Total clothing value'
        },
        {
            name: 'Active Curation',
            value: stats?.active_orders || 0,
            icon: Clock,
            color: 'text-indigo-600',
            bg: 'bg-indigo-50',
            subtitle: 'Orders in progress'
        },
        {
            name: 'Atelier Standing',
            value: stats?.total_orders > 3 ? 'Elite Client' : 'Atelier Member',
            icon: ShieldCheck,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            subtitle: `Member since ${stats?.member_since || 'N/A'}`
        }
    ];

    // Status styling helpers
    const getStatusStyle = (status) => {
        const s = String(status).toLowerCase();
        if (s === 'delivered') return 'bg-emerald-50 text-emerald-800 border-emerald-100';
        if (s === 'shipped') return 'bg-indigo-50 text-indigo-800 border-indigo-100';
        if (s === 'processing') return 'bg-blue-50 text-blue-800 border-blue-100';
        return 'bg-amber-50 text-amber-800 border-amber-100'; // pending, etc.
    };

    const getPaymentStatusStyle = (status) => {
        const s = String(status).toLowerCase();
        if (s === 'paid') return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
        return 'bg-amber-50 text-amber-700 border border-amber-100';
    };

    return (
        <StoreLayout>
            <Head title="Atelier Dashboard - Brands Studio" />

            {/* Premium Header Banner */}
            <div className="bg-stone-50 border-b border-slate-200/60 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2">
                            <span className="text-[10px] font-black uppercase text-amber-600 tracking-[3px] bg-amber-50 px-4 py-1.5 rounded-full inline-block">
                                CLIENT ATELIER HUB
                            </span>
                            <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-wide text-slate-900 uppercase">
                                WELCOME BACK, {user.name?.split(' ')[0] || 'GUEST'}
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide">
                                Access your curated purchase histories, track real-time shipments, and manage your luxury account.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <Link 
                                href={route('shop')}
                                className="bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest px-6 py-4 rounded-xl transition-all shadow-md inline-block"
                            >
                                Discover Collections
                            </Link>
                            <Link 
                                href={route('profile.edit')}
                                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black uppercase tracking-widest px-6 py-4 rounded-xl transition-all shadow-sm inline-block"
                            >
                                Settings
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* 4-Card Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {cards.map((card, i) => (
                        <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex items-center space-x-5 hover:shadow-md transition-shadow">
                            <div className={`p-4 rounded-2xl ${card.bg} ${card.color} flex-shrink-0`}>
                                <card.icon size={24} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{card.name}</p>
                                <h3 className="text-lg font-black text-slate-900 truncate">{card.value}</h3>
                                <p className="text-[10px] font-bold text-slate-400 mt-0.5">{card.subtitle}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Atelier Order Curation */}
                <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-stone-50 rounded-lg flex items-center justify-center text-slate-600">
                                <History size={16} />
                            </div>
                            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider">
                                ORDER CURATION HISTORY
                            </h2>
                        </div>
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                            {orders.length} {orders.length === 1 ? 'ORDER' : 'ORDERS'} RECORDED
                        </span>
                    </div>

                    {orders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-stone-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                        <th className="py-4 px-6">Order Details</th>
                                        <th className="py-4 px-6">Purchase Date</th>
                                        <th className="py-4 px-6">Total Amount</th>
                                        <th className="py-4 px-6">Payment</th>
                                        <th className="py-4 px-6">Delivery Status</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-6 px-6">
                                                <div className="space-y-1">
                                                    <span className="font-extrabold text-slate-800 block uppercase">
                                                        {order.order_number}
                                                    </span>
                                                    <div className="text-[10px] text-slate-400 font-bold max-w-xs truncate">
                                                        {order.items?.map(item => item.product?.name).join(', ') || 'No item details'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-6 font-semibold text-slate-600">
                                                {new Date(order.created_at).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-6 px-6 font-black text-slate-900">
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td className="py-6 px-6">
                                                <span className={`inline-block px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md border ${getPaymentStatusStyle(order.payment_status)}`}>
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className="py-6 px-6">
                                                <span className={`inline-block px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-md border ${getStatusStyle(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-6 px-6 text-right space-x-2">
                                                <Link
                                                    href={route('order.success', { order_number: order.order_number })}
                                                    className="inline-flex items-center space-x-1 bg-slate-900 hover:bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg transition-colors shadow-sm"
                                                >
                                                    <span>Receipt</span>
                                                    <ArrowRight size={10} />
                                                </Link>
                                                <Link
                                                    href={route('order.tracking', { order_number: order.order_number })}
                                                    className="inline-flex items-center space-x-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg transition-colors"
                                                >
                                                    <span>Track</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-16 text-center space-y-6 max-w-md mx-auto">
                            <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400 border border-slate-100 shadow-inner">
                                <Package size={24} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                                    No Curation History Available
                                </h3>
                                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                    You have not placed any orders under this account yet. Begin exploring our couture fits to start your curation collection.
                                </p>
                            </div>
                            <div className="pt-2">
                                <Link
                                    href={route('shop')}
                                    className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-md"
                                >
                                    <span>Discover Apparel</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </StoreLayout>
    );
}
