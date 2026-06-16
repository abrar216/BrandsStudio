import React, { useState, useMemo } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { 
    Layers, 
    Save, 
    ArrowLeft, 
    Sparkles, 
    Eye, 
    EyeOff, 
    Search,
    ShoppingBag,
    Check,
    HelpCircle
} from 'lucide-react';
import { getAssetUrl, getProductImageUrl } from '../../../Utils/asset';

export default function CollectionsControl({ products = [] }) {
    const { props } = usePage();
    
    // Initialize form with the full products list for bulk updates
    const { 
        data, 
        setData, 
        post, 
        processing, 
        errors 
    } = useForm({
        products: products.map(p => ({
            id: p.id,
            name: p.name,
            sku: p.sku,
            main_image: p.main_image,
            image: p.image,
            show_in_collections: !!p.show_in_collections,
            display_order: p.display_order
        }))
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [visibilityFilter, setVisibilityFilter] = useState('all');

    // Filter index keys matching client-side search/visibilities
    const filteredIndexes = useMemo(() => {
        const indexes = [];
        data.products.forEach((p, index) => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                p.sku.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchesVisibility = visibilityFilter === 'all' || 
                (visibilityFilter === 'visible' && p.show_in_collections) || 
                (visibilityFilter === 'hidden' && !p.show_in_collections);

            if (matchesSearch && matchesVisibility) {
                indexes.push(index);
            }
        });
        return indexes;
    }, [data.products, searchQuery, visibilityFilter]);

    const handleToggleVisibility = (index) => {
        const updated = [...data.products];
        updated[index].show_in_collections = !updated[index].show_in_collections;
        setData('products', updated);
    };

    const handleOrderChange = (index, val) => {
        const updated = [...data.products];
        updated[index].display_order = parseInt(val) || 0;
        setData('products', updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.collections-control.store'), {
            preserveScroll: true
        });
    };

    return (
        <AdminLayout title="Collections Page Dynamic Catalog">
            <Head title="Collections Catalog Control - Superadmin" />

            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <Link 
                        href={route('admin.website-control')}
                        className="inline-flex items-center space-x-1 text-xs font-black uppercase text-blue-900 hover:text-blue-800 transition-colors"
                    >
                        <ArrowLeft size={12} />
                        <span>Back to Control Dashboard</span>
                    </Link>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                        Select exactly which premium catalog models are visible in the Signature Collections page.
                    </p>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={processing}
                    className="inline-flex items-center space-x-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-black px-5 py-3 rounded-xl transition-all shadow-sm uppercase tracking-wider"
                >
                    <Save size={14} />
                    <span>{processing ? 'Saving Catalog...' : 'Save Catalog Selections'}</span>
                </button>
            </div>

            {/* Filtering Deck */}
            <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-grow w-full">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by couture title or sku code..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>

                <div className="w-full sm:w-auto">
                    <select
                        value={visibilityFilter}
                        onChange={(e) => setVisibilityFilter(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-650 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-44"
                    >
                        <option value="all">All Catalog Statuses</option>
                        <option value="visible">Visible in Collections</option>
                        <option value="hidden">Hidden from Collections</option>
                    </select>
                </div>
            </div>

            {/* Error notifications */}
            {Object.keys(errors).length > 0 && (
                <div className="bg-rose-50 border border-rose-250 p-4 rounded-xl mb-6">
                    <p className="text-xs font-black text-rose-800 uppercase tracking-wide">Validation errors occurred during saving:</p>
                    <ul className="list-disc list-inside text-[11px] text-rose-700 font-bold mt-2 space-y-1">
                        {Object.entries(errors).map(([key, msg]) => (
                            <li key={key}>{msg}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Bulk Showcase Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredIndexes.length > 0 ? (
                    filteredIndexes.map((dataIndex) => {
                        const p = data.products[dataIndex];
                        return (
                            <div 
                                key={p.id} 
                                className={`bg-slate-50 border rounded-3xl p-5 shadow-sm flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                                    p.show_in_collections 
                                        ? 'border-emerald-200 shadow-md ring-1 ring-emerald-500/5' 
                                        : 'border-slate-200/80 opacity-80'
                                }`}
                            >
                                <div className="space-y-4">
                                    {/* Cover Shot Preview */}
                                    <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-slate-200 bg-white">
                                        <img 
                                            src={getProductImageUrl(p) ? getAssetUrl(`storage/${getProductImageUrl(p)}`) : getAssetUrl('images/placeholder.png')} 
                                            className="w-full h-full object-cover" 
                                            alt={p.name} 
                                        />
                                        {/* Status Tag Overlay */}
                                        <div className="absolute top-3 right-3">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleVisibility(dataIndex)}
                                                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-sm transition-all border ${
                                                    p.show_in_collections 
                                                        ? 'bg-emerald-50 border-emerald-250/20 text-emerald-800' 
                                                        : 'bg-slate-900 border-slate-950 text-white hover:bg-black'
                                                }`}
                                            >
                                                {p.show_in_collections ? (
                                                    <>
                                                        <Eye size={10} />
                                                        <span>Catalog ON</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff size={10} />
                                                        <span>Catalog OFF</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Identity Block */}
                                    <div>
                                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide leading-snug truncate">{p.name}</h4>
                                        <span className="text-[10px] text-slate-400 font-bold font-mono mt-0.5 block">SKU: {p.sku}</span>
                                    </div>
                                </div>

                                {/* Order & Actions Bar */}
                                <div className="mt-4 pt-4 border-t border-slate-200/65 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Order:</span>
                                        <input 
                                            type="number"
                                            min="0"
                                            value={p.display_order}
                                            onChange={e => handleOrderChange(dataIndex, e.target.value)}
                                            className="w-12 bg-white border border-slate-250/60 rounded-lg px-1.5 py-0.5 text-xs font-black text-slate-800 text-center focus:outline-none"
                                        />
                                    </div>

                                    {p.show_in_collections ? (
                                        <span className="inline-flex items-center space-x-0.5 text-emerald-650 text-[9px] font-black uppercase tracking-wider">
                                            <Check size={10} />
                                            <span>In Catalog</span>
                                        </span>
                                    ) : (
                                        <span className="text-[9px] font-bold text-slate-405 text-slate-400 uppercase tracking-wider">
                                            Excluded
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-4 bg-slate-50 border border-slate-200/80 rounded-3xl p-12 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        No product models matched your curate parameters.
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
