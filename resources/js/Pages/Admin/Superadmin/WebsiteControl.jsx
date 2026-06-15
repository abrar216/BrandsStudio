import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { 
    Sparkles, 
    MonitorPlay, 
    Layers, 
    ShoppingBag, 
    Layout, 
    TrendingUp, 
    Heart, 
    ArrowRight,
    Save,
    Image as ImageIcon
} from 'lucide-react';

export default function WebsiteControl({ settings, stats }) {
    const { 
        data, 
        setData, 
        post, 
        processing, 
        errors 
    } = useForm({
        hero_badge: settings.hero_badge || '',
        hero_title: settings.hero_title || '',
        hero_subtitle: settings.hero_subtitle || '',
        hero_button_text: settings.hero_button_text || '',
        hero_button_link: settings.hero_button_link || '',
        hero_secondary_button_text: settings.hero_secondary_button_text || '',
        hero_secondary_button_link: settings.hero_secondary_button_link || '',
        banner_badge: settings.banner_badge || '',
        banner_title: settings.banner_title || '',
        banner_subtitle: settings.banner_subtitle || '',
        banner_button_text: settings.banner_button_text || '',
        banner_button_link: settings.banner_button_link || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.website-control.store'), {
            preserveScroll: true
        });
    };

    return (
        <AdminLayout title="Website Content & Sections Control">
            <Head title="Website Content Control - Superadmin" />

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link 
                    href={route('admin.homepage-sections')}
                    className="group bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
                >
                    <div className="flex justify-between items-start mb-5">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <Layout size={24} />
                        </div>
                        <ArrowRight size={18} className="text-slate-400 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                    <h3 className="text-base font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Homepage Sections</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Manage Explore Collections category order and landing page display rules.
                    </p>
                </Link>

                <Link 
                    href={route('admin.products-control')}
                    className="group bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
                >
                    <div className="flex justify-between items-start mb-5">
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                            <ImageIcon size={24} />
                        </div>
                        <ArrowRight size={18} className="text-slate-400 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                    <h3 className="text-base font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Products Showcase & Tags</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Flag items as Featured, New Arrivals, Best Sellers, or Trending, and manage images.
                    </p>
                </Link>

                <Link 
                    href={route('admin.collections-control')}
                    className="group bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
                >
                    <div className="flex justify-between items-start mb-5">
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                            <Layers size={24} />
                        </div>
                        <ArrowRight size={18} className="text-slate-400 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                    <h3 className="text-base font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">Collections Display Catalog</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        Curate exactly which products appear on the primary storefront Collections page.
                    </p>
                </Link>
            </div>

            {/* Statistics Cards */}
            <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 shadow-sm mb-8">
                <h2 className="text-sm font-black uppercase tracking-widest text-slate-450 dark:text-slate-400 mb-6 flex items-center gap-2">
                    <Sparkles size={16} className="text-blue-500" />
                    Atelier Display Analytics
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-5">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-6 rounded-2xl text-center shadow-sm">
                        <span className="text-3xl font-black text-slate-800 dark:text-white block mb-1">{stats.total_products}</span>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">Total Products</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-6 rounded-2xl text-center shadow-sm">
                        <span className="text-3xl font-black text-blue-600 dark:text-blue-400 block mb-1">{stats.featured}</span>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">Featured</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-6 rounded-2xl text-center shadow-sm">
                        <span className="text-3xl font-black text-purple-600 dark:text-purple-400 block mb-1">{stats.new_arrivals}</span>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">New Arrivals</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-6 rounded-2xl text-center shadow-sm">
                        <span className="text-3xl font-black text-amber-600 dark:text-amber-400 block mb-1">{stats.trending}</span>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">Trending</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-6 rounded-2xl text-center shadow-sm">
                        <span className="text-3xl font-black text-rose-600 dark:text-rose-400 block mb-1">{stats.best_sellers}</span>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">Best Sellers</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-6 rounded-2xl text-center shadow-sm">
                        <span className="text-3xl font-black text-teal-600 dark:text-teal-400 block mb-1">{stats.explore_collections}</span>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">Explore Collections</span>
                    </div>
                    <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-6 rounded-2xl text-center shadow-sm">
                        <span className="text-3xl font-black text-stone-700 dark:text-stone-300 block mb-1">{stats.collections_page}</span>
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">Catalog Visible</span>
                    </div>
                </div>
            </div>

            {/* Banner Content Management Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Hero Banner Section */}
                <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm">
                    <div className="border-b border-slate-200 dark:border-slate-700 pb-5 mb-6">
                        <h2 className="text-lg font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2.5">
                            <MonitorPlay size={22} className="text-blue-600" />
                            Homepage Hero Section
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1.5">
                            Modify the prominent text contents and action buttons rendered in the home hero banner.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-750 dark:text-slate-300 mb-2.5">
                                Badge Text (Small Overtitle)
                            </label>
                            <input 
                                type="text"
                                value={data.hero_badge}
                                onChange={e => setData('hero_badge', e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="E.g. COUTURE COLLECTION 2026"
                            />
                            {errors.hero_badge && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.hero_badge}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-750 dark:text-slate-300 mb-2.5">
                                Primary Hero Title
                            </label>
                            <input 
                                type="text"
                                value={data.hero_title}
                                onChange={e => setData('hero_title', e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-2xl px-5 py-4 text-base font-black text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="E.g. WEAR YOUR SIGNATURE STYLE"
                            />
                            {errors.hero_title && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.hero_title}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-750 dark:text-slate-300 mb-2.5">
                                Subtitle / Description
                            </label>
                            <textarea 
                                rows={4}
                                value={data.hero_subtitle}
                                onChange={e => setData('hero_subtitle', e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Enter a premium description detailing the collection edit..."
                            />
                            {errors.hero_subtitle && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.hero_subtitle}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-750 dark:text-slate-300 mb-2.5">
                                Primary Button Text
                            </label>
                            <input 
                                type="text"
                                value={data.hero_button_text}
                                onChange={e => setData('hero_button_text', e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="E.g. SHOP COLLECTION"
                            />
                            {errors.hero_button_text && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.hero_button_text}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-750 dark:text-slate-300 mb-2.5">
                                Primary Button Link (Route or URL)
                            </label>
                            <input 
                                type="text"
                                value={data.hero_button_link}
                                onChange={e => setData('hero_button_link', e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="E.g. /collections or /shop"
                            />
                            {errors.hero_button_link && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.hero_button_link}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-750 dark:text-slate-300 mb-2.5">
                                Secondary Button Text
                            </label>
                            <input 
                                type="text"
                                value={data.hero_secondary_button_text}
                                onChange={e => setData('hero_secondary_button_text', e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="E.g. CUSTOM ORDER"
                            />
                            {errors.hero_secondary_button_text && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.hero_secondary_button_text}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-750 dark:text-slate-300 mb-2.5">
                                Secondary Button Link
                            </label>
                            <input 
                                type="text"
                                value={data.hero_secondary_button_link}
                                onChange={e => setData('hero_secondary_button_link', e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="E.g. /faqs"
                            />
                            {errors.hero_secondary_button_link && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.hero_secondary_button_link}</p>}
                        </div>
                    </div>
                </div>

                {/* Promotional Banner Section */}
                <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-sm">
                    <div className="border-b border-slate-200 dark:border-slate-700 pb-5 mb-6">
                        <h2 className="text-lg font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2.5">
                            <Sparkles size={22} className="text-amber-600" />
                            Promotional Banner Section (Art of Apparel)
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1.5">
                            Manage details of the full-width promotional banner displaying secondary campaign links.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-750 dark:text-slate-300 mb-2.5">
                                Banner Badge
                            </label>
                            <input 
                                type="text"
                                value={data.banner_badge}
                                onChange={e => setData('banner_badge', e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="E.g. LIMITED EDITION DISCOUNTS"
                            />
                            {errors.banner_badge && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.banner_badge}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-750 dark:text-slate-300 mb-2.5">
                                Banner Campaign Title
                            </label>
                            <input 
                                type="text"
                                value={data.banner_title}
                                onChange={e => setData('banner_title', e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-2xl px-5 py-4 text-base font-black text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="E.g. THE FINE ART OF MID-SEASON APPAREL"
                            />
                            {errors.banner_title && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.banner_title}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-750 dark:text-slate-300 mb-2.5">
                                Banner Detailed Description
                            </label>
                            <textarea 
                                rows={4}
                                value={data.banner_subtitle}
                                onChange={e => setData('banner_subtitle', e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Enter promotional copy details..."
                            />
                            {errors.banner_subtitle && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.banner_subtitle}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-750 dark:text-slate-300 mb-2.5">
                                Action Button Text
                            </label>
                            <input 
                                type="text"
                                value={data.banner_button_text}
                                onChange={e => setData('banner_button_text', e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="E.g. SECURE EXCLUSIVE OFFERS"
                            />
                            {errors.banner_button_text && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.banner_button_text}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-750 dark:text-slate-300 mb-2.5">
                                Action Button Link
                            </label>
                            <input 
                                type="text"
                                value={data.banner_button_link}
                                onChange={e => setData('banner_button_link', e.target.value)}
                                className="w-full bg-white dark:bg-slate-800 border border-slate-250 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="E.g. /collections"
                            />
                            {errors.banner_button_link && <p className="text-red-500 text-xs mt-1.5 font-bold">{errors.banner_button_link}</p>}
                        </div>
                    </div>
                </div>

                {/* Submit Panel */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center space-x-2.5 bg-blue-900 hover:bg-blue-800 text-sm font-black px-8 py-5 rounded-2xl transition-all shadow-md uppercase tracking-wider disabled:opacity-50"
                    >
                        <Save size={16} />
                        <span>{processing ? 'Saving Configurations...' : 'Save Settings Configurations'}</span>
                    </button>
                </div>
            </form>
        </AdminLayout>
    );
}
