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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white border border-stone-200/60 rounded-none p-6 sm:p-8 space-y-6">
                    
                    {/* Top Row: Search & Count */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-100 pb-6">
                        <div className="flex items-center space-x-3">
                            <SlidersHorizontal size={14} className="text-stone-400" />
                            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-800">
                                Curate By Category
                            </h2>
                        </div>

                        {/* Search Input bar */}
                        <div className="relative w-full md:w-80">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                                <Search size={14} />
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="SEARCH COLLECTION..."
                                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-none text-[10px] font-bold tracking-wider text-stone-850 placeholder-stone-400 focus:outline-none focus:ring-0 focus:border-stone-500 uppercase"
                            />
                        </div>
                    </div>

                    {/* Bottom Row: Dynamic Category Pills */}
                    <div className="flex flex-wrap gap-2">
                        {/* 'All Collections' Pill */}
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`inline-flex items-center space-x-2.5 px-5 py-3 rounded-none text-[10px] font-black uppercase tracking-widest transition-all duration-200 border ${
                                selectedCategory === 'all'
                                    ? 'bg-black border-black text-white'
                                    : 'bg-stone-50 border-stone-200/80 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                            }`}
                        >
                            <span>ALL COUTURE</span>
                            <span className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-black rounded-none ${
                                selectedCategory === 'all' ? 'bg-white text-black' : 'bg-stone-200 text-stone-600'
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
                                    className={`inline-flex items-center space-x-2.5 px-5 py-3 rounded-none text-[10px] font-black uppercase tracking-widest transition-all duration-200 border ${
                                        selectedCategory === category.slug
                                            ? 'bg-black border-black text-white'
                                            : 'bg-stone-50 border-stone-200/80 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                                    }`}
                                >
                                    <span>{category.name}</span>
                                    <span className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-black rounded-none ${
                                        selectedCategory === category.slug ? 'bg-white text-black' : 'bg-stone-200 text-stone-600'
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {filteredProducts.length > 0 ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                            <span className="text-[9px] font-black tracking-widest text-stone-400 uppercase">
                                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                            </span>
                        </div>

                        {/* High-end products grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} currency={currency} />
                            ))}
                        </div>
                    </div>
                ) : (
                    /* Premium Styled Luxury Empty State */
                    <div className="max-w-xl mx-auto bg-white border border-stone-200/60 rounded-none p-12 sm:p-16 text-center space-y-6 my-8">
                        <div className="w-14 h-14 bg-stone-50 border border-stone-200/40 rounded-none flex items-center justify-center mx-auto text-stone-700">
                            <Layers size={22} />
                        </div>
                        
                        <div className="space-y-2">
                            <h3 className="text-xs font-black tracking-widest text-stone-850 uppercase">
                                Seasonal Pieces In Production
                            </h3>
                            <p className="text-[10px] text-stone-500 font-bold tracking-wider leading-relaxed max-w-sm mx-auto uppercase">
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
                                    className="inline-flex items-center space-x-2 bg-black hover:bg-neutral-800 text-white text-[10px] tracking-widest font-black px-8 py-3.5 rounded-none transition-all uppercase"
                                >
                                    <span>EXPLORE ALL COUTURE</span>
                                    <ArrowRight size={12} />
                                </button>
                            ) : (
                                <Link 
                                    href={route('welcome')}
                                    className="inline-flex items-center space-x-2 bg-black hover:bg-neutral-800 text-white text-[10px] tracking-widest font-black px-8 py-3.5 rounded-none transition-all uppercase"
                                >
                                    <span>BACK TO ATELIER</span>
                                    <ArrowRight size={12} />
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
