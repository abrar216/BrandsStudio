import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { 
    Search, 
    Filter, 
    ShoppingBag, 
    Calendar, 
    User, 
    MapPin, 
    ChevronDown, 
    ChevronUp, 
    FileText, 
    Check, 
    HelpCircle,
    Truck,
    CreditCard
} from 'lucide-react';

export default function Orders({ orders }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [paymentFilter, setPaymentFilter] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);

    // Form for updating status
    const { 
        data, 
        setData, 
        patch, 
        processing 
    } = useForm({
        status: '',
        payment_status: ''
    });

    const handleUpdateStatus = (e, orderId) => {
        e.preventDefault();
        patch(route('admin.orders.update', orderId), {
            preserveScroll: true
        });
    };

    const toggleExpand = (orderId, currentStatus, currentPaymentStatus) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
            setData({
                status: currentStatus,
                payment_status: currentPaymentStatus
            });
        }
    };

    // Filter logic
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (order.customer_email && order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter ? order.status === statusFilter : true;
        const matchesPayment = paymentFilter ? order.payment_status === paymentFilter : true;
        return matchesSearch && matchesStatus && matchesPayment;
    });

    const formatPrice = (val) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AdminLayout title="System Order Ledger">
            <Head title="Orders Management" />

            {/* Filter Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-250 shadow-sm">
                
                {/* Search */}
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by Order #, Customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        />
                        <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                    </div>

                    {/* Status filter */}
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                        >
                            <option value="">All Order Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing / Tailoring</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="returned">Returned</option>
                        </select>
                        <Filter size={12} className="absolute right-4 top-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Payment status filter */}
                    <div className="relative">
                        <select
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                        >
                            <option value="">All Payment Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="refunded">Refunded</option>
                            <option value="failed">Failed</option>
                        </select>
                        <Filter size={12} className="absolute right-4 top-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

            </div>

            {/* Orders Listing Panel */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs uppercase text-slate-550 text-slate-500 tracking-wider bg-slate-100">
                                <th className="py-4 px-6 font-bold w-12 text-center">Details</th>
                                <th className="py-4 px-4 font-bold">Order #</th>
                                <th className="py-4 px-4 font-bold">Date & Time</th>
                                <th className="py-4 px-4 font-bold">Customer</th>
                                <th className="py-4 px-4 font-bold">Full Address</th>
                                <th className="py-4 px-4 font-bold text-center">Fulfillment Status</th>
                                <th className="py-4 px-4 font-bold text-center">Payment Status</th>
                                <th className="py-4 px-6 font-bold text-right">Net Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="py-12 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                        No transactions settled under these parameters
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => {
                                    const isExpanded = expandedOrder === order.id;
                                    return (
                                        <React.Fragment key={order.id}>
                                            <tr className={`text-xs transition-colors hover:bg-slate-50 ${isExpanded ? 'bg-slate-50/60' : ''}`}>
                                                
                                                {/* Expand toggler */}
                                                <td className="py-4 px-6 text-center">
                                                    <button 
                                                        onClick={() => toggleExpand(order.id, order.status, order.payment_status)}
                                                        className="p-1 hover:bg-slate-100 rounded-md text-slate-500 hover:text-blue-600 transition-colors"
                                                        title="Expand invoice and order status settings"
                                                    >
                                                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                    </button>
                                                </td>

                                                {/* Order number */}
                                                <td className="py-4 px-4 font-mono font-bold text-slate-600">
                                                    {order.order_number}
                                                </td>

                                                {/* Date */}
                                                <td className="py-4 px-4 font-semibold text-slate-500">
                                                    {formatDate(order.created_at)}
                                                </td>

                                                {/* Customer */}
                                                <td className="py-4 px-4 font-bold text-slate-800">
                                                    <div className="flex flex-col">
                                                        <span>{order.customer_name}</span>
                                                        <span className="text-[10px] text-slate-450 font-medium">{order.customer_email || 'Walk-in customer'}</span>
                                                    </div>
                                                </td>

                                                {/* Shipping Address */}
                                                <td className="py-4 px-4 text-slate-500 truncate max-w-[180px]" title={order.shipping_address}>
                                                    {order.shipping_address || 'Walk-in Direct POS Checkout'}
                                                </td>

                                                {/* Fulfillment status */}
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`inline-block text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                                                        order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40' :
                                                        order.status === 'pending' ? 'bg-slate-100 text-slate-500' :
                                                        order.status === 'cancelled' ? 'bg-red-50 text-red-700 border border-red-200/40' :
                                                        'bg-blue-50 text-blue-700 border border-blue-200/40'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </td>

                                                {/* Payment status */}
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`inline-block text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                                                        order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/40' :
                                                        order.payment_status === 'pending' ? 'bg-amber-55 bg-amber-50 text-amber-700 border border-amber-200/40' :
                                                        'bg-red-50 text-red-700 border border-red-200/40'
                                                    }`}>
                                                        {order.payment_status}
                                                    </span>
                                                </td>

                                                {/* Total value */}
                                                <td className="py-4 px-6 text-right font-black text-slate-900 font-mono">
                                                    {formatPrice(order.total)}
                                                </td>

                                            </tr>

                                            {/* Expand detail card with update panels */}
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan="8" className="bg-slate-50/50 p-6 border-l-2 border-l-blue-600">
                                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                            
                                                            {/* COL 1: Invoice Items */}
                                                            <div className="lg:col-span-2 space-y-3">
                                                                <h5 className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center space-x-1.5 border-b border-slate-200 pb-2">
                                                                    <FileText size={10} />
                                                                    <span>Purchased Line Items ({order.items.length})</span>
                                                                </h5>

                                                                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                                                    {order.items.map((item) => (
                                                                        <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-200/60 shadow-sm flex items-center justify-between">
                                                                            <div className="min-w-0">
                                                                                <p className="text-xs font-bold text-slate-805 text-slate-800">{item.product?.name || 'Unknown Product Model'}</p>
                                                                                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                                                                                    SKU: <span className="font-mono">{item.variant?.sku || item.product?.sku || 'N/A'}</span>
                                                                                    {item.variant && <span className="ml-2 uppercase text-blue-600">({item.variant.color} / {item.variant.size})</span>}
                                                                                </p>
                                                                            </div>
                                                                            <div className="text-right flex-shrink-0 font-mono">
                                                                                <p className="text-xs font-black text-slate-800">{formatPrice(item.price)} x {item.quantity}</p>
                                                                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Subtotal: {formatPrice(item.price * item.quantity)}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                {/* Summary aggregates */}
                                                                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 text-xs font-semibold space-y-1.5 text-slate-500 shadow-inner">
                                                                    <div className="flex justify-between">
                                                                        <span>Shipping Charge</span>
                                                                        <span className="text-slate-800 font-medium font-mono">{formatPrice(order.shipping || 0)}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span>Tax Additions</span>
                                                                        <span className="text-slate-800 font-medium font-mono">{formatPrice(order.tax || 0)}</span>
                                                                    </div>
                                                                    {order.discount > 0 && (
                                                                        <div className="flex justify-between text-blue-600">
                                                                            <span>Coupon Discount ({order.coupon_code || 'PROMO'})</span>
                                                                            <span className="font-mono">-{formatPrice(order.discount)}</span>
                                                                        </div>
                                                                    )}
                                                                    <div className="flex justify-between border-t border-slate-250 border-slate-200 pt-1.5 text-sm font-black text-slate-900">
                                                                        <span>Final Settlement</span>
                                                                        <span className="text-blue-600 font-mono">{formatPrice(order.total)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* COL 2: Shipment & Controls */}
                                                            <div className="space-y-4">
                                                                
                                                                {/* Customer / Logistics info */}
                                                                <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-3.5 text-xs text-slate-650">
                                                                    <h6 className="text-[9px] font-black uppercase text-slate-500 tracking-wider border-b border-slate-100 pb-1.5">Logistics Details</h6>
                                                                    
                                                                    <div className="flex items-start space-x-2.5">
                                                                        <User size={13} className="text-slate-400 mt-0.5" />
                                                                        <div>
                                                                            <p className="font-bold text-slate-800">{order.customer_name}</p>
                                                                            <p className="text-[10px] text-slate-500 font-medium">{order.customer_phone || 'No phone supplied'}</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-start space-x-2.5">
                                                                        <MapPin size={13} className="text-slate-400 mt-0.5" />
                                                                        <div>
                                                                            <p className="font-semibold text-slate-600">Address Profile</p>
                                                                            <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-relaxed">{order.shipping_address || 'Walk-in Retail Order'}</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-start space-x-2.5">
                                                                        <CreditCard size={13} className="text-slate-400 mt-0.5" />
                                                                        <div>
                                                                            <p className="font-semibold text-slate-600">Payment Gateway</p>
                                                                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{order.payment_method || 'CASH'}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {/* Interactive status form */}
                                                                <form onSubmit={(e) => handleUpdateStatus(e, order.id)} className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm space-y-3">
                                                                    <h6 className="text-[9px] font-black uppercase text-slate-500 tracking-wider border-b border-slate-100 pb-1.5">Modify Order State</h6>
                                                                    
                                                                    {/* Shipment status */}
                                                                    <div>
                                                                        <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1 flex items-center">
                                                                            <Truck size={10} className="mr-1 text-blue-600" />
                                                                            <span>Fulfillment State</span>
                                                                        </label>
                                                                        <select
                                                                            value={data.status}
                                                                            onChange={(e) => setData('status', e.target.value)}
                                                                            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-1.5 text-[11px] text-slate-800 focus:outline-none cursor-pointer"
                                                                        >
                                                                            <option value="pending">Pending Placed</option>
                                                                            <option value="confirmed">Confirmed Accepted</option>
                                                                            <option value="processing">Processing / Tailoring</option>
                                                                            <option value="shipped">Shipped Transit</option>
                                                                            <option value="delivered">Delivered Completed</option>
                                                                            <option value="cancelled">Cancelled Invalid</option>
                                                                            <option value="returned">Returned Return</option>
                                                                        </select>
                                                                    </div>

                                                                    {/* Payment status */}
                                                                    <div>
                                                                        <label className="block text-[9px] uppercase font-bold text-slate-500 mb-1 flex items-center">
                                                                            <CreditCard size={10} className="mr-1 text-blue-600" />
                                                                            <span>Payment status</span>
                                                                        </label>
                                                                        <select
                                                                            value={data.payment_status}
                                                                            onChange={(e) => setData('payment_status', e.target.value)}
                                                                            className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-3 py-1.5 text-[11px] text-slate-800 focus:outline-none cursor-pointer"
                                                                        >
                                                                            <option value="pending">Pending Settle</option>
                                                                            <option value="paid">Paid Settled</option>
                                                                            <option value="refunded">Refunded Void</option>
                                                                            <option value="failed">Failed Declined</option>
                                                                        </select>
                                                                    </div>

                                                                    {/* Submit */}
                                                                    <button
                                                                        type="submit"
                                                                        disabled={processing}
                                                                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1"
                                                                    >
                                                                        <Check size={14} />
                                                                        <span>{processing ? 'Saving...' : 'Apply Status Update'}</span>
                                                                    </button>
                                                                </form>

                                                            </div>

                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </AdminLayout>
    );
}
