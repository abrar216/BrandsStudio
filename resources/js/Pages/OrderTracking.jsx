import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import StoreLayout from '../Layouts/StoreLayout';
import { Search, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';

export default function OrderTracking({ trackedOrder, searchedNumber, currency: propCurrency }) {
    const { props } = usePage();
    const currency = propCurrency || props.settings?.currency || 'Rs.';

    const [orderNumber, setOrderNumber] = useState(searchedNumber || '');

    const handleSearch = (e) => {
        e.preventDefault();
        if (!orderNumber.trim()) return;

        router.get(route('order.tracking'), { order_number: orderNumber }, {
            preserveState: true,
        });
    };

    // Tracking milestones status helper
    const getStatusIndex = (status) => {
        const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
        return statuses.indexOf(String(status || '').toLowerCase());
    };

    const statusIndex = trackedOrder ? getStatusIndex(trackedOrder.status) : -1;

    const milestones = [
        { key: 'pending', title: 'Placed', desc: 'Order received' },
        { key: 'confirmed', title: 'Confirmed', desc: 'Sartorial processing' },
        { key: 'processing', title: 'Tailoring', desc: 'Garment prep & packing' },
        { key: 'shipped', title: 'Shipped', desc: 'En route with courier' },
        { key: 'delivered', title: 'Delivered', desc: 'Handed to customer' },
    ];

    return (
        <StoreLayout>
            <Head title="Track Your Order" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
                
                {/* Visual Header */}
                <div className="text-center space-y-4 max-w-lg mx-auto">
                    <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest bg-amber-50 px-4 py-1.5 rounded-full">
                        SHIPMENT CARRIER
                    </span>
                    <h1 className="text-3xl font-black font-serif text-slate-800 uppercase tracking-wide">
                        TRACK YOUR COUTURE
                    </h1>
                    <p className="text-xs text-slate-500 font-medium leading-normal">
                        Input your unique Brands Studio purchase order invoice number (e.g. BS-XXX-XXXXXXXXXX) to trace shipment coordinates and estimated dispatch deliveries.
                    </p>
                </div>

                {/* Tracking Search Input Widget */}
                <form onSubmit={handleSearch} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex flex-col sm:flex-row gap-4 items-center max-w-2xl mx-auto">
                    <div className="relative flex items-center w-full">
                        <Search size={16} className="absolute left-4 text-slate-400" />
                        <input
                            type="text"
                            required
                            placeholder="Enter Order Number (e.g., BS-ABC-1234567)"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-xs w-full focus:bg-white focus:ring-1 focus:ring-slate-400 focus:border-slate-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-slate-900 hover:bg-black text-white text-xs font-black px-8 py-3.5 rounded-2xl transition-all uppercase tracking-wider w-full sm:w-auto"
                    >
                        TRACK APPAREL
                    </button>
                </form>

                {/* Tracked Order Details display */}
                {trackedOrder ? (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        
                        {/* Summary details metadata */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
                            <div className="flex items-center space-x-3.5 justify-center sm:justify-start">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                    <Calendar size={18} />
                                </div>
                                <div className="text-xs font-semibold text-slate-650">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Estimated Delivery</p>
                                    <p className="text-slate-900 font-black">
                                        {trackedOrder.estimated_delivery ? new Date(trackedOrder.estimated_delivery).toLocaleDateString() : 'Pending'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3.5 justify-center sm:justify-start">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                    <MapPin size={18} />
                                </div>
                                <div className="text-xs font-semibold text-slate-650">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Destination</p>
                                    <p className="text-slate-900 font-black truncate max-w-[150px]">
                                        {trackedOrder.customer_name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3.5 justify-center sm:justify-start">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                    <Clock size={18} />
                                </div>
                                <div className="text-xs font-semibold text-slate-650">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Tracking Code</p>
                                    <p className="text-slate-900 font-black">
                                        {trackedOrder.tracking_number || `BS-TRK-${trackedOrder.id}`}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive status slider progress */}
                        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-12">
                            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest pb-4 border-b border-slate-50">
                                SHIPMENT JOURNEY
                            </h3>

                            {/* Milestones slider track */}
                            <div className="relative">
                                {/* Back line track */}
                                <div className="absolute top-4 left-0 right-0 h-1 bg-slate-100 rounded-full z-0"></div>
                                {/* Active progress track */}
                                <div 
                                    className="absolute top-4 left-0 h-1 bg-amber-500 rounded-full z-0 transition-all duration-500"
                                    style={{ width: `${(statusIndex / (milestones.length - 1)) * 100}%` }}
                                ></div>

                                {/* Milestone icons and texts */}
                                <div className="relative z-10 flex justify-between">
                                    {milestones.map((m, idx) => {
                                        const isCompleted = idx <= statusIndex;
                                        const isActive = idx === statusIndex;
                                        
                                        return (
                                            <div key={m.key} className="flex flex-col items-center text-center space-y-3 w-16">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                                                    isCompleted 
                                                        ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/10' 
                                                        : 'bg-white border-slate-200 text-slate-400'
                                                }`}>
                                                    {isCompleted ? <CheckCircle size={15} /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className={`text-[10px] font-black uppercase tracking-wider ${
                                                        isActive ? 'text-amber-500 font-black' : (isCompleted ? 'text-slate-900 font-bold' : 'text-slate-400')
                                                    }`}>{m.title}</p>
                                                    <p className="text-[8px] text-slate-400 font-bold max-w-[60px] leading-snug">{m.desc}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>
                ) : searchedNumber ? (
                    /* Search failure alert */
                    <div className="bg-red-50 text-red-800 border border-red-150 p-6 rounded-3xl text-center text-xs font-bold max-w-xl mx-auto shadow-sm">
                        ✗ Order invoice number <span className="font-extrabold">"{searchedNumber}"</span> was not found in our database records. Please double-check spelling typos and retry.
                    </div>
                ) : null}

            </div>
        </StoreLayout>
    );
}
