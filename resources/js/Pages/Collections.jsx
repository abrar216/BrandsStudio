import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '../Layouts/StoreLayout';
import ProductCard from '../Components/ProductCard';
import { Sparkles, ArrowRight, Layers, SlidersHorizontal, Search } from 'lucide-react';

export default function Collections({ categories = [], products = [] }) {
    const { props } = usePage();
    const currency = props.settings?.currency || 'Rs.';

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter products based on selected category and search query
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = selectedCategory === 'all' || 
                (product.category && String(product.category.slug).toLowerCase() === selectedCategory.toLowerCase());
            
            const matchesSearch = searchQuery.trim() === '' ||
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (product.category?.name && product.category.name.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, searchQuery]);

    // Active product count for each category in our dynamic client filter
    const activeCategoryCount = (categorySlug) => {
        if (categorySlug === 'all') return products.length;
        return products.filter(p => p.category && String(p.category.slug).toLowerCase() === categorySlug.toLowerCase()).length;
    };

    return (
        <StoreLayout>
            <Head title="Signature Collections - Brands Studio" />


            {/* Filter and Search Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white border border-stone-200/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    
                    {/* Top Row: Search & Count */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-100 pb-6">
                        <div className="flex items-center space-x-3">
                            <SlidersHorizontal size={18} className="text-stone-400" />
                            <h2 className="text-sm font-black uppercase tracking-widest text-stone-800">
                                Curate By Category
                            </h2>
                        </div>

                        {/* Search Input bar */}
                        <div className="relative w-full md:w-80">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                <Search size={16} />
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search collection pieces..."
                                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Bottom Row: Dynamic Category Pills */}
                    <div className="flex flex-wrap gap-2.5">
                        {/* 'All Collections' Pill */}
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`inline-flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                                selectedCategory === 'all'
                                    ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                                    : 'bg-stone-50 border-stone-200/80 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                            }`}
                        >
                            <span>ALL COUTURE</span>
                            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${
                                selectedCategory === 'all' ? 'bg-amber-500 text-slate-900' : 'bg-stone-200 text-stone-600'
                            }`}>
                                {activeCategoryCount('all')}
                            </span>
                        </button>

                        {/* Category specific pills */}
                        {categories.map((category) => {
                            const count = activeCategoryCount(category.slug);
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.slug)}
                                    className={`inline-flex items-center space-x-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                                        selectedCategory === category.slug
                                            ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                                            : 'bg-stone-50 border-stone-200/80 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                    }`}
                                >
                                    <span>{category.name}</span>
                                    <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${
                                        selectedCategory === category.slug ? 'bg-amber-500 text-slate-900' : 'bg-stone-200 text-stone-600'
                                    }`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Grid display / Empty State */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                {filteredProducts.length > 0 ? (
                    <div className="space-y-6 animate-fade-in">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase">
                                Showing {filteredProducts.length} premium {filteredProducts.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>

                        {/* High-end products grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} currency={currency} />
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Premium Styled Luxury Empty State */
                    <div className="max-w-xl mx-auto bg-white border border-stone-200/60 rounded-3xl p-12 sm:p-16 text-center shadow-md space-y-6 my-8">
                        <div className="w-16 h-16 bg-[#faf8f5] border border-amber-200/30 rounded-2xl flex items-center justify-center mx-auto text-amber-700/80">
                            <Layers size={26} />
                        </div>
                        
                        <div className="space-y-2">
                            <h3 className="text-base font-black tracking-widest text-stone-800 uppercase font-serif">
                                Seasonal Pieces In Production
                            </h3>
                            <p className="text-xs text-stone-500 font-medium leading-relaxed max-w-sm mx-auto">
                                No collections available yet. Our new seasonal drops are currently in design and coming soon to Brands Studio.
                            </p>
                        </div>

                        <div className="pt-2">
                            {selectedCategory !== 'all' ? (
                                <button 
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setSearchQuery('');
                                    }}
                                    className="inline-flex items-center space-x-2 bg-stone-900 hover:bg-black text-white text-xs font-black px-8 py-4 rounded-xl transition-all shadow-md uppercase tracking-wider"
                                >
                                    <span>EXPLORE ALL COUTURE</span>
                                    <ArrowRight size={14} />
                                </button>
                            ) : (
                                <Link 
                                    href={route('welcome')}
                                    className="inline-flex items-center space-x-2 bg-stone-900 hover:bg-black text-white text-xs font-black px-8 py-4 rounded-xl transition-all shadow-md uppercase tracking-wider"
                                >
                                    <span>BACK TO ATELIER</span>
                                    <ArrowRight size={14} />
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
