import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { 
    Settings as SettingsIcon, 
    Sparkles, 
    Coins, 
    Mail, 
    Check, 
    ShieldAlert,
    Sliders,
    Percent,
    Truck
} from 'lucide-react';

export default function Settings({ settings }) {
    const [activeTab, setActiveTab] = useState('branding');

    // Initialize form with existing values or fallbacks
    const { 
        data, 
        setData, 
        post, 
        processing, 
        errors 
    } = useForm({
        site_name: settings.site_name || 'Brands Studio',
        site_tagline: settings.site_tagline || 'Wear your signature.',
        currency: settings.currency || '$',
        currency_code: settings.currency_code || 'USD',
        tax_rate: settings.tax_rate || '10',
        shipping_charges: settings.shipping_charges || '5.99',
        contact_email: settings.contact_email || 'support@brandsstudio.com',
        contact_phone: settings.contact_phone || '',
        contact_address: settings.contact_address || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.settings.store'), {
            preserveScroll: true
        });
    };

    const tabs = [
        { id: 'branding', label: 'Branding & Identity', icon: Sliders },
        { id: 'financials', label: 'Taxes & Shipping Logistics', icon: Coins },
        { id: 'coordinates', label: 'Support & Coordinates', icon: Mail },
    ];

    return (
        <AdminLayout title="Global System Settings">
            <Head title="Settings Management" />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                
                {/* LEFT Panel: Settings Nav Tabs */}
                <div className="bg-slate-50 rounded-2xl border border-slate-250 p-4 shadow-sm h-fit space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">Settings Categories</p>
                    
                    {tabs.map((tab) => {
                        const IconComponent = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                                    isActive
                                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/10'
                                        : 'text-slate-500 hover:bg-slate-100 hover:text-blue-600'
                                }`}
                            >
                                <IconComponent size={14} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* RIGHT Panel: Settings Configuration Forms */}
                <div className="lg:col-span-3 bg-slate-50 rounded-2xl border border-slate-250 p-6 shadow-sm flex flex-col justify-between">
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* 1. BRANDING TAB */}
                        {activeTab === 'branding' && (
                            <div className="space-y-5 animate-in fade-in duration-200">
                                <div>
                                    <h4 className="text-sm font-black uppercase text-blue-600 tracking-wider">Branding & Corporate Identity</h4>
                                    <p className="text-xs text-slate-500 font-semibold mt-0.5">Determine how the store represents itself to the public.</p>
                                </div>
                                <hr className="border-slate-100" />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Site Brand Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.site_name}
                                            onChange={(e) => setData('site_name', e.target.value)}
                                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Slogan & Tagline</label>
                                        <input
                                            type="text"
                                            value={data.site_tagline}
                                            onChange={(e) => setData('site_tagline', e.target.value)}
                                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 2. FINANCIALS TAB */}
                        {activeTab === 'financials' && (
                            <div className="space-y-5 animate-in fade-in duration-200">
                                <div>
                                    <h4 className="text-xs font-black uppercase text-blue-600 tracking-wider">Checkout Calculations & Logistics</h4>
                                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Settle taxes, shipping additions, currency symbols and codes.</p>
                                </div>
                                <hr className="border-slate-100" />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Currency Symbol *</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.currency}
                                            onChange={(e) => setData('currency', e.target.value)}
                                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none font-mono focus:ring-1 focus:ring-blue-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5">Currency ISO Code *</label>
                                        <input
                                            type="text"
                                            required
                                            value={data.currency_code}
                                            onChange={(e) => setData('currency_code', e.target.value)}
                                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none font-mono focus:ring-1 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-slate-505 text-slate-500 mb-1.5 flex items-center">
                                            <Percent size={11} className="mr-1 text-slate-400" />
                                            <span>Surtax Rate (%) *</span>
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            max="100"
                                            value={data.tax_rate}
                                            onChange={(e) => setData('tax_rate', e.target.value)}
                                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-slate-505 text-slate-500 mb-1.5 flex items-center">
                                            <Truck size={11} className="mr-1 text-slate-400" />
                                            <span>Flat Shipping Fee ($) *</span>
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            step="0.01"
                                            min="0"
                                            value={data.shipping_charges}
                                            onChange={(e) => setData('shipping_charges', e.target.value)}
                                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. COORDINATES TAB */}
                        {activeTab === 'coordinates' && (
                            <div className="space-y-5 animate-in fade-in duration-200">
                                <div>
                                    <h4 className="text-xs font-black uppercase text-blue-600 tracking-wider">Support Channels & Showroom Address</h4>
                                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Determine standard channels for contact and printed invoices.</p>
                                </div>
                                <hr className="border-slate-100" />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-slate-505 text-slate-500 mb-1.5">Official Support Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={data.contact_email}
                                            onChange={(e) => setData('contact_email', e.target.value)}
                                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-slate-505 text-slate-500 mb-1.5">Support Phone Line</label>
                                        <input
                                            type="text"
                                            value={data.contact_phone}
                                            onChange={(e) => setData('contact_phone', e.target.value)}
                                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-505 text-slate-500 mb-1.5">Corporate Headquarters Address</label>
                                    <textarea
                                        value={data.contact_address}
                                        onChange={(e) => setData('contact_address', e.target.value)}
                                        rows="3"
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none placeholder-slate-400 focus:ring-1 focus:ring-blue-500/20"
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {/* Save Button */}
                        <div className="pt-4 border-t border-slate-100 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl text-xs font-black transition-colors shadow-sm"
                            >
                                <Check size={16} />
                                <span>{processing ? 'Saving...' : 'Apply Global Parameters'}</span>
                            </button>
                        </div>

                    </form>
                </div>

            </div>

        </AdminLayout>
    );
}
