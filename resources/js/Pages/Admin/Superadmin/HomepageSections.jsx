import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { 
    Layout, 
    Save, 
    ArrowLeft, 
    Sparkles, 
    Eye, 
    EyeOff, 
    ArrowUp, 
    UploadCloud,
    FolderKanban,
    Tag
} from 'lucide-react';
import { getAssetUrl, getCategoryImageUrl } from '../../../Utils/asset';

export default function HomepageSections({ categories }) {
    const { 
        data, 
        setData, 
        post, 
        processing, 
        errors 
    } = useForm({
        categories: categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            display_order: cat.display_order,
            show_on_homepage: !!cat.show_on_homepage,
            image: cat.image,
            image_file: null
        }))
    });

    const [previews, setPreviews] = useState({});

    const handleToggle = (index, value) => {
        const list = [...data.categories];
        list[index].show_on_homepage = value;
        setData('categories', list);
    };

    const handleOrderChange = (index, value) => {
        const list = [...data.categories];
        list[index].display_order = parseInt(value) || 0;
        setData('categories', list);
    };

    const handleFileChange = (index, file) => {
        if (!file) return;
        const list = [...data.categories];
        list[index].image_file = file;
        setData('categories', list);

        // Generate temporary local object URL for instant preview feedback
        const previewUrl = URL.createObjectURL(file);
        setPreviews(prev => ({
            ...prev,
            [index]: previewUrl
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.homepage-sections.store'), {
            preserveScroll: true
        });
    };

    return (
        <AdminLayout title="Homepage Sections & Collections Manager">
            <Head title="Homepage Sections Control - Superadmin" />

            {/* Header section with back button */}
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
                        Arrange display priority and toggle collections visible on the store front landing page.
                    </p>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={processing}
                    className="inline-flex items-center space-x-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-black px-5 py-3 rounded-xl transition-all shadow-sm uppercase tracking-wider"
                >
                    <Save size={14} />
                    <span>{processing ? 'Saving Order...' : 'Save Category Priorities'}</span>
                </button>
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

            {/* Categories deck grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.categories.map((cat, index) => {
                    const previewSrc = previews[index] || (getCategoryImageUrl(cat) ? getAssetUrl(`storage/${getCategoryImageUrl(cat)}`) : null);
                    
                    return (
                        <div 
                            key={cat.id} 
                            className={`bg-slate-50 border rounded-3xl p-6 shadow-sm flex flex-col justify-between transition-all duration-300 ${
                                cat.show_on_homepage 
                                    ? 'border-blue-200/80 shadow-md ring-1 ring-blue-500/5' 
                                    : 'border-slate-200/80 opacity-90'
                            }`}
                        >
                            <div className="space-y-4">
                                {/* Category Identity */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-2.5">
                                        <div className={`p-2 rounded-xl ${cat.show_on_homepage ? 'bg-blue-50 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                                            <FolderKanban size={16} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider leading-tight">{cat.name}</h3>
                                            <span className="text-[10px] text-slate-400 font-bold font-mono">slug: {cat.slug}</span>
                                        </div>
                                    </div>

                                    {/* Homepage toggle switch button */}
                                    <button
                                        type="button"
                                        onClick={() => handleToggle(index, !cat.show_on_homepage)}
                                        className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-colors ${
                                            cat.show_on_homepage 
                                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                                                : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                                        }`}
                                    >
                                        {cat.show_on_homepage ? (
                                            <>
                                                <Eye size={10} />
                                                <span>Visible Home</span>
                                            </>
                                        ) : (
                                            <>
                                                <EyeOff size={10} />
                                                <span>Hidden Home</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Banner/Image preview and upload panel */}
                                <div className="relative group bg-white border border-slate-200/60 rounded-2xl overflow-hidden h-36 flex flex-col items-center justify-center text-center">
                                    {previewSrc ? (
                                        <>
                                            <img 
                                                src={previewSrc} 
                                                alt={cat.name} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {/* Hover replace overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                <label className="text-white text-[10px] font-black uppercase tracking-wider flex flex-col items-center gap-1 cursor-pointer">
                                                    <UploadCloud size={20} />
                                                    Replace Banner Cover
                                                    <input 
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={e => handleFileChange(index, e.target.files[0])}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </>
                                    ) : (
                                        <label className="p-4 w-full h-full flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-blue-600 transition-colors">
                                            <UploadCloud size={24} className="mb-1" />
                                            <span className="text-[10px] font-black uppercase tracking-wider">Upload Cover Image</span>
                                            <span className="text-[8px] text-slate-400 mt-0.5">JPG, PNG, WEBP max 4MB</span>
                                            <input 
                                                type="file"
                                                accept="image/*"
                                                onChange={e => handleFileChange(index, e.target.files[0])}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* Settings controls row */}
                            <div className="mt-5 pt-4 border-t border-slate-200/60 flex items-center justify-between gap-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Display Priority:</span>
                                    <input 
                                        type="number"
                                        min="0"
                                        value={cat.display_order}
                                        onChange={e => handleOrderChange(index, e.target.value)}
                                        className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-black text-slate-800 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>

                                {cat.show_on_homepage && (
                                    <span className="inline-flex items-center gap-1 text-[9px] font-black text-blue-600 uppercase tracking-widest animate-pulse">
                                        <Sparkles size={10} />
                                        Explore List
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </AdminLayout>
    );
}
