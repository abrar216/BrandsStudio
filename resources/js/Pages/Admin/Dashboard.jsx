import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { 
    TrendingUp, 
    ShoppingBag, 
    AlertTriangle, 
    Award, 
    ChevronRight, 
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    Wallet
} from 'lucide-react';

export default function Dashboard({ stats, monthlySales, lowStockProducts, lowStockVariants, recentOrders, topProducts }) {
    const { settings } = usePage().props;
    const currencySymbol = settings.currency_symbol || 'Rs.';
    
    // Format helper
    const formatPrice = (val) => {
        return `${currencySymbol} ${Number(val).toLocaleString()}`;
    };

    // Calculate maximum sales value for SVG chart height scaling
    const maxSales = monthlySales.length > 0 
        ? Math.max(...monthlySales.map(item => Number(item.sales))) 
        : 1000;
    
    // Render custom SVG chart lines
    const chartPadding = 40;
    const chartWidth = 500;
    const chartHeight = 180;
    
    // Generate SVG coordinates for lines
    const points = monthlySales.map((item, idx) => {
        const x = chartPadding + (idx / Math.max(monthlySales.length - 1, 1)) * (chartWidth - chartPadding * 2);
        const y = chartHeight - chartPadding - (Number(item.sales) / (maxSales || 1)) * (chartHeight - chartPadding * 2);
        return { x, y, label: item.month, value: item.sales };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    
    // Gradient area path
    const areaPath = points.length > 0
        ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - chartPadding} L ${points[0].x} ${chartHeight - chartPadding} Z`
        : '';

    return (
        <AdminLayout title="System Overview & Analytics">
            <Head title="Admin Dashboard" />

            {/* Top Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                
                {/* Gross Sales */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between group hover:border-blue-500 dark:hover:border-blue-450 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Gross Sales</span>
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-xl group-hover:scale-110 transition-transform">
                            <Wallet size={18} />
                        </div>
                    </div>
                    <div className="mt-3.5 z-10">
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans truncate">{formatPrice(stats.total_sales)}</h3>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-450 font-bold flex items-center mt-1">
                            <TrendingUp size={11} className="mr-1" />
                            <span>Paid settled</span>
                        </p>
                    </div>
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-500/5 dark:bg-emerald-500/2 rounded-full blur-2xl"></div>
                </div>

                {/* Orders Volume */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between group hover:border-blue-500 dark:hover:border-blue-450 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Orders</span>
                        <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-450 rounded-xl group-hover:scale-110 transition-transform">
                            <ShoppingBag size={18} />
                        </div>
                    </div>
                    <div className="mt-3.5 z-10">
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans truncate">{stats.total_orders} Orders</h3>
                        <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold mt-1">
                            Storefront & POS total
                        </p>
                    </div>
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-amber-500/5 dark:bg-amber-500/2 rounded-full blur-2xl"></div>
                </div>

                {/* Expenses logger */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between group hover:border-blue-500 dark:hover:border-blue-450 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Expenses</span>
                        <div className="p-2 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-450 rounded-xl group-hover:scale-110 transition-transform">
                            <Wallet size={18} />
                        </div>
                    </div>
                    <div className="mt-3.5 z-10">
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans truncate">{formatPrice(stats.total_expenses)}</h3>
                        <p className="text-[10px] text-red-500 dark:text-red-450 font-bold flex items-center mt-1">
                            <ArrowDownRight size={11} className="mr-0.5" />
                            <span>Overheads logged</span>
                        </p>
                    </div>
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-red-500/5 dark:bg-red-500/2 rounded-full blur-2xl"></div>
                </div>

                {/* Net Profits */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between group hover:border-blue-500 dark:hover:border-blue-450 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Net Profit</span>
                        <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-450 rounded-xl group-hover:scale-110 transition-transform">
                            <Award size={18} />
                        </div>
                    </div>
                    <div className="mt-3.5 z-10">
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans truncate">{formatPrice(stats.net_profit)}</h3>
                        <p className="text-[10px] text-blue-600 dark:text-blue-450 font-bold flex items-center mt-1">
                            <ArrowUpRight size={11} className="mr-0.5" />
                            <span>Margin: {stats.total_sales > 0 ? Math.round((stats.net_profit / stats.total_sales) * 100) : 0}%</span>
                        </p>
                    </div>
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-blue-500/5 dark:bg-blue-500/2 rounded-full blur-2xl"></div>
                </div>

                {/* Total Products */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between group hover:border-blue-500 dark:hover:border-blue-450 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Products</span>
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-455 rounded-xl group-hover:scale-110 transition-transform">
                            <ShoppingBag size={18} />
                        </div>
                    </div>
                    <div className="mt-3.5 z-10">
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans truncate">{stats.total_products || 0} Items</h3>
                        <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold mt-1">
                            Active catalog
                        </p>
                    </div>
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-indigo-500/5 dark:bg-indigo-500/2 rounded-full blur-2xl"></div>
                </div>

                {/* Inventory Valuation */}
                <div className="relative overflow-hidden bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between group hover:border-blue-500 dark:hover:border-blue-450 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Shop Valuation</span>
                        <div className="p-2 bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-450 rounded-xl group-hover:scale-110 transition-transform">
                            <Wallet size={18} />
                        </div>
                    </div>
                    <div className="mt-3.5 z-10">
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans truncate">{formatPrice(stats.total_valuation || 0)}</h3>
                        <p className="text-[10px] text-violet-600 dark:text-violet-455 font-bold flex items-center mt-1">
                            <TrendingUp size={11} className="mr-1" />
                            <span>Active stock valuation</span>
                        </p>
                    </div>
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-violet-500/5 dark:bg-violet-500/2 rounded-full blur-2xl"></div>
                </div>

            </div>

            {/* Sales Chart Section & Best Sellers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Sales Velocity Over Time</h4>
                            <p className="text-base font-bold text-slate-800 dark:text-white font-sans mt-0.5">Settled Gross Performance</p>
                        </div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 px-2.5 py-1.5 rounded-lg flex items-center">
                            <Calendar size={14} className="mr-1.5 text-blue-600 dark:text-blue-400" />
                            Monthly Trend
                        </span>
                    </div>

                    {/* Chart Container */}
                    <div className="relative w-full h-48 overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900/55 border border-slate-150 dark:border-slate-700 flex items-center justify-center p-2">
                        {monthlySales.length === 0 ? (
                            <div className="text-sm text-slate-400 font-semibold uppercase tracking-wider">No completed sales recorded yet</div>
                        ) : (
                            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full text-slate-550">
                                <defs>
                                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15"/>
                                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0"/>
                                    </linearGradient>
                                </defs>
                                
                                {/* Grid lines */}
                                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                                    const y = chartPadding + ratio * (chartHeight - chartPadding * 2);
                                    return (
                                        <line 
                                            key={i} 
                                            x1={chartPadding} 
                                            y1={y} 
                                            x2={chartWidth - chartPadding} 
                                            y2={y} 
                                            stroke="#e2e8f0" 
                                            strokeWidth="1" 
                                            strokeDasharray="4"
                                        />
                                    );
                                })}

                                {/* Area Fill */}
                                {areaPath && <path d={areaPath} fill="url(#areaGradient)" />}

                                {/* Line Path */}
                                {linePath && (
                                    <path 
                                        d={linePath} 
                                        fill="none" 
                                        stroke="#2563eb" 
                                        strokeWidth="2.5" 
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                )}

                                {/* Data Dots */}
                                {points.map((p, idx) => (
                                    <g key={idx} className="group/dot cursor-pointer">
                                        <circle 
                                            cx={p.x} 
                                            cy={p.y} 
                                            r="4" 
                                            fill="#2563eb" 
                                            stroke="#ffffff" 
                                            strokeWidth="1.5"
                                        />
                                        <circle 
                                            cx={p.x} 
                                            cy={p.y} 
                                            r="8" 
                                            fill="transparent"
                                            className="hover:fill-blue-500/20 transition-all duration-200"
                                        />
                                        <text
                                            x={p.x}
                                            y={p.y - 10}
                                            textAnchor="middle"
                                            fill="#1e293b"
                                            fontSize="10"
                                            fontWeight="bold"
                                            className="opacity-0 group-hover/dot:opacity-100 transition-opacity bg-slate-100 border border-slate-250 px-1.5 py-0.5 rounded shadow-sm font-sans"
                                        >
                                            {formatPrice(p.value)}
                                        </text>
                                    </g>
                                ))}

                                {/* X Axis Labels */}
                                {points.map((p, idx) => (
                                    <text 
                                        key={idx} 
                                        x={p.x} 
                                        y={chartHeight - 12} 
                                        textAnchor="middle" 
                                        fill="#94a3b8" 
                                        fontSize="9"
                                        fontWeight="bold"
                                    >
                                        {p.label}
                                    </text>
                                ))}
                            </svg>
                        )}
                    </div>
                </div>

                {/* Popular / Best Sellers */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between shadow-sm">
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">High Performers</h4>
                        <p className="text-base font-bold text-slate-800 dark:text-white font-sans mt-0.5">Top Selling Items</p>
                    </div>

                    <div className="mt-4 space-y-4 flex-grow">
                        {topProducts.length === 0 ? (
                            <div className="text-sm text-slate-400 font-semibold py-8 text-center uppercase tracking-wider">No sales logged yet</div>
                        ) : (
                            topProducts.map((item, idx) => {
                                const product = item.product;
                                if (!product) return null;
                                return (
                                    <div key={idx} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                        <div className="min-w-0 pr-2">
                                            <p className="text-sm font-bold text-slate-800 truncate">{product.name}</p>
                                            <p className="text-xs text-slate-500 font-semibold mt-0.5 font-mono">SKU: {product.sku}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className="inline-block bg-blue-50 text-blue-600 text-xs font-extrabold px-2.5 py-1 rounded-md">
                                                {item.total_sold} Sold
                                            </span>
                                            <p className="text-xs text-slate-500 font-bold mt-1 font-mono">{formatPrice(product.price)}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            </div>

            {/* Low Stock Alerts & Recent Transactions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Order Ledger</h4>
                            <p className="text-base font-bold text-slate-800 dark:text-white font-sans mt-0.5">Recent Operations Summary</p>
                        </div>
                        <Link 
                            href={route('admin.orders')} 
                            className="text-xs font-black text-blue-600 hover:text-blue-750 flex items-center space-x-0.5 transition-colors uppercase tracking-wider"
                        >
                            <span>Full Ledger</span>
                            <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto -mx-6">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-xs uppercase text-slate-550 text-slate-500 tracking-wider bg-slate-50">
                                    <th className="py-3 px-6 font-black">Order #</th>
                                    <th className="py-3 px-4 font-black">Customer</th>
                                    <th className="py-3 px-4 font-black text-center">Status</th>
                                    <th className="py-3 px-4 font-black text-center">Payment</th>
                                    <th className="py-3 px-6 font-black text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-sm text-slate-400 font-semibold uppercase tracking-wider">
                                            No recent orders found
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr key={order.id} className="text-sm hover:bg-slate-50 transition-colors">
                                            <td className="py-3.5 px-6 font-mono font-bold text-slate-600">
                                                {order.order_number}
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-slate-800">
                                                {order.customer_name}
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <span className={`inline-block text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                                                    order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40' :
                                                    order.status === 'pending' ? 'bg-slate-100 text-slate-655 text-slate-600' :
                                                    order.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200/40' :
                                                    'bg-amber-50 text-amber-705 text-amber-750 border border-amber-200/40'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <span className={`inline-block text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                                                    order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40' :
                                                    order.payment_status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200/40' :
                                                    'bg-red-55 bg-red-50 text-red-700 border border-red-200/40'
                                                }`}>
                                                    {order.payment_status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-6 text-right font-black text-slate-900 font-mono">
                                                {formatPrice(order.total)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Low Stock Alerts */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between shadow-sm">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Inventory Critical Alerts</h4>
                            {(lowStockProducts.length > 0 || lowStockVariants.length > 0) && (
                                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                            )}
                        </div>
                        <p className="text-base font-bold text-slate-800 dark:text-white font-sans mt-0.5">Low Stock Warnings</p>
                    </div>

                    <div className="mt-4 space-y-3.5 flex-grow">
                        {lowStockProducts.length === 0 && lowStockVariants.length === 0 ? (
                            <div className="text-sm text-slate-400 font-semibold py-8 text-center uppercase tracking-wider">
                                All items fully stocked!
                            </div>
                        ) : (
                            <>
                                {/* Low Stock Products */}
                                {lowStockProducts.map((p) => (
                                    <div key={`p-${p.id}`} className="flex items-center justify-between border border-red-150 bg-red-50/50 p-3.5 rounded-xl shadow-sm">
                                        <div className="min-w-0 pr-2">
                                            <p className="text-sm font-bold text-slate-800 truncate">{p.name}</p>
                                            <p className="text-xs text-slate-500 font-bold mt-0.5 font-mono">Master Item SKU: {p.sku}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className="inline-flex items-center bg-red-100 text-red-800 text-xs font-black px-2.5 py-1.5 rounded-md">
                                                <AlertTriangle size={12} className="mr-1 text-red-500" />
                                                <span>{p.stock_quantity} left</span>
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {/* Low Stock Variants */}
                                {lowStockVariants.map((v) => (
                                    <div key={`v-${v.id}`} className="flex items-center justify-between border border-amber-200 bg-amber-50/50 p-3.5 rounded-xl shadow-sm">
                                        <div className="min-w-0 pr-2">
                                            <p className="text-sm font-bold text-slate-800 truncate">{v.product?.name || 'Unknown Item'}</p>
                                            <p className="text-xs text-amber-700 font-bold mt-0.5">
                                                Variant: <span className="uppercase">{v.color} / {v.size}</span>
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className="inline-flex items-center bg-amber-100 text-amber-800 text-xs font-black px-2.5 py-1.5 rounded-md">
                                                <AlertTriangle size={12} className="mr-1 text-amber-600" />
                                                <span>{v.stock_quantity} left</span>
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>

            </div>

            {/* Quick Administrative Actions & Navigation Control Deck */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col space-y-4 mt-6">
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Brands Studio Actions Deck</h4>
                    <p className="text-base font-bold text-slate-800 dark:text-white font-sans mt-0.5">Quick Operations Launcher</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <Link
                        href={route('admin.pos.index')}
                        className="bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 p-4 rounded-xl shadow-sm text-center flex flex-col items-center justify-center space-y-2 transition-all group cursor-pointer"
                    >
                        <span className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform animate-pulse">
                            <ShoppingBag size={20} />
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider block">POS Terminal</span>
                    </Link>
                    <Link
                        href={route('admin.products')}
                        className="bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 p-4 rounded-xl shadow-sm text-center flex flex-col items-center justify-center space-y-2 transition-all group cursor-pointer"
                    >
                        <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                            <TrendingUp size={20} />
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider block">Products</span>
                    </Link>
                    <Link
                        href={route('admin.categories')}
                        className="bg-white border border-slate-200 hover:border-amber-500 hover:text-amber-600 p-4 rounded-xl shadow-sm text-center flex flex-col items-center justify-center space-y-2 transition-all group cursor-pointer"
                    >
                        <span className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                            <Award size={20} />
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider block">Categories</span>
                    </Link>
                    <Link
                        href={route('admin.orders')}
                        className="bg-white border border-slate-200 hover:border-purple-500 hover:text-purple-600 p-4 rounded-xl shadow-sm text-center flex flex-col items-center justify-center space-y-2 transition-all group cursor-pointer"
                    >
                        <span className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                            <ChevronRight size={20} className="rotate-90 sm:rotate-0" />
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider block">Orders</span>
                    </Link>
                    <Link
                        href="/admin/website-control"
                        className="bg-white border border-slate-200 hover:border-rose-500 hover:text-rose-600 p-4 rounded-xl shadow-sm text-center flex flex-col items-center justify-center space-y-2 transition-all group cursor-pointer"
                    >
                        <span className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:scale-110 transition-transform">
                            <Calendar size={20} />
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider block">Web Control</span>
                    </Link>
                    <Link
                        href={route('admin.settings')}
                        className="bg-white border border-slate-200 hover:border-slate-500 hover:text-slate-700 p-4 rounded-xl shadow-sm text-center flex flex-col items-center justify-center space-y-2 transition-all group cursor-pointer"
                    >
                        <span className="p-2.5 bg-slate-100 text-slate-700 rounded-xl group-hover:scale-110 transition-transform">
                            <Wallet size={20} />
                        </span>
                        <span className="text-xs font-black uppercase tracking-wider block">Settings</span>
                    </Link>
                </div>
            </div>

        </AdminLayout>
    );
}
