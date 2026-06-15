import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import StoreLayout from '../Layouts/StoreLayout';
import ProductCard from '../Components/ProductCard';
import { SlidersHorizontal, ArrowLeftRight, Check, X, Search, Filter } from 'lucide-react';

export default function Shop({ 
    products = { data: [], total: 0, links: [] }, 
    categories = [], 
    filters = {}, 
    availableColors = [], 
    availableSizes = [] 
}) {
    const { props } = usePage();
    const currency = props.settings?.currency || 'Rs.';

    // Robust default mapping selectors for defense
    const productList = products?.data || [];
    const totalProducts = products?.total || 0;
    const paginationLinks = products?.links || [];
    const categoryList = Array.isArray(categories) ? categories : [];
    const colorsList = Array.isArray(availableColors) ? availableColors : [];
    const sizesList = Array.isArray(availableSizes) ? availableSizes : [];

    // Robust default mapping selectors for defense
    const filtersObj = filters && typeof filters === 'object' && !Array.isArray(filters) ? filters : {};

    // Local filter states matching URL params
    const [search, setSearch] = useState(filtersObj.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filtersObj.category || '');
    const [minPrice, setMinPrice] = useState(filtersObj.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filtersObj.max_price || '');

    const initialColors = typeof filtersObj.color === 'string'
        ? filtersObj.color.split(',').filter(Boolean)
        : Array.isArray(filtersObj.color)
            ? filtersObj.color
            : [];

    const initialSizes = typeof filtersObj.size === 'string'
        ? filtersObj.size.split(',').filter(Boolean)
        : Array.isArray(filtersObj.size)
            ? filtersObj.size
            : [];

    const [selectedColors, setSelectedColors] = useState(initialColors);
    const [selectedSizes, setSelectedSizes] = useState(initialSizes);
    const [sort, setSort] = useState(filtersObj.sort || 'newest');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Apply filters function (triggers Inertia page refresh with query params)
    const applyFilters = (updatedParams = {}) => {
        const params = {
            search: search || undefined,
            category: selectedCategory || undefined,
            min_price: minPrice || undefined,
            max_price: maxPrice || undefined,
            color: selectedColors.length > 0 ? selectedColors.join(',') : undefined,
            size: selectedSizes.length > 0 ? selectedSizes.join(',') : undefined,
            sort: sort || undefined,
            ...updatedParams
        };

        // Strip undefined keys
        Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);

        router.get(route('shop'), params, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        applyFilters({ search });
    };

    const handleCategoryClick = (categorySlug) => {
        const newVal = selectedCategory === categorySlug ? '' : categorySlug;
        setSelectedCategory(newVal);
        applyFilters({ category: newVal });
    };

    const handleColorToggle = (color) => {
        let updated = [...selectedColors];
        if (updated.includes(color)) {
            updated = updated.filter(c => c !== color);
        } else {
            updated.push(color);
        }
        setSelectedColors(updated);
        applyFilters({ color: updated.length > 0 ? updated.join(',') : undefined });
    };

    const handleSizeToggle = (size) => {
        let updated = [...selectedSizes];
        if (updated.includes(size)) {
            updated = updated.filter(s => s !== size);
        } else {
            updated.push(size);
        }
        setSelectedSizes(updated);
        applyFilters({ size: updated.length > 0 ? updated.join(',') : undefined });
    };

    const handlePriceChange = () => {
        applyFilters({ min_price: minPrice, max_price: maxPrice });
    };

    const handleSortChange = (newSort) => {
        setSort(newSort);
        applyFilters({ sort: newSort });
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        setSelectedColors([]);
        setSelectedSizes([]);
        setSort('newest');
        
        router.get(route('shop'), {}, {
            preserveState: false,
        });
    };

    // Color Swatch hex helper
    const getColorClass = (colorName) => {
        if (!colorName) return 'bg-slate-250';
        const name = String(colorName).toLowerCase();
        if (name.includes('navy')) return 'bg-blue-900';
        if (name.includes('khaki')) return 'bg-amber-255 border border-slate-300';
        if (name.includes('black')) return 'bg-black';
        if (name.includes('white')) return 'bg-white border border-slate-300';
        if (name.includes('grey')) return 'bg-slate-450';
        if (name.includes('red')) return 'bg-red-650';
        if (name.includes('blue')) return 'bg-blue-650';
        if (name.includes('yellow')) return 'bg-yellow-450';
        if (name.includes('brown')) return 'bg-amber-850';
        if (name.includes('pink')) return 'bg-pink-450';
        return 'bg-slate-250';
    };

    return (
        <StoreLayout>
            <Head title="Shop Collections" />

            {/* Banner Header */}
            <div className="bg-slate-100 border-b border-slate-200/60 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl font-black font-serif tracking-wide text-slate-900">
                        {selectedCategory 
                            ? (categoryList.find(c => c.slug === selectedCategory)?.name || '').toUpperCase() 
                            : 'ALL CLOTHING COLLECTIONS'}
                    </h1>
                    <p className="text-xs text-slate-500 font-medium tracking-wide mt-2">
                        Tailored Luxury Silhouettes. Curated Organic Textures. Perfect Fit.
                    </p>
                </div>
            </div>

            {/* Shop Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
                    
                    {/* 1. Left Sidebar Filters (Desktop) */}
                    <div className="hidden lg:block space-y-8 bg-white p-6 border border-slate-100 rounded-2xl shadow-sm sticky top-28">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                            <span className="text-xs font-black tracking-widest uppercase flex items-center space-x-1.5">
                                <Filter size={14} className="text-amber-500" />
                                <span>FILTER APPAREL</span>
                            </span>
                            <button 
                                onClick={clearFilters}
                                className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase"
                            >
                                CLEAR ALL
                            </button>
                        </div>

                        {/* Search Input Widget */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">SEARCH</h4>
                            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                                <input
                                    type="text"
                                    placeholder="Keywords..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-xl py-2 pl-4 pr-10 text-xs w-full focus:bg-white"
                                />
                                <button type="submit" className="absolute right-3 text-slate-400">
                                    <Search size={14} />
                                </button>
                            </form>
                        </div>

                        {/* Category List Widget */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">CATEGORIES</h4>
                            <div className="space-y-1.5">
                                {categoryList.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategoryClick(cat.slug)}
                                        className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl transition-all ${
                                            selectedCategory === cat.slug 
                                                ? 'bg-amber-500 text-white font-black shadow-sm shadow-amber-500/20' 
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-black'
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selector Widget */}
                        {colorsList.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">COLORS</h4>
                                <div className="flex flex-wrap gap-2.5">
                                    {colorsList.map((color, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleColorToggle(color)}
                                            title={color}
                                            className={`w-7 h-7 rounded-full ${getColorClass(color)} ring-1 ring-offset-2 flex items-center justify-center transition-all ${
                                                selectedColors.includes(color) 
                                                    ? 'ring-amber-500 scale-110 shadow-sm' 
                                                    : 'ring-transparent hover:ring-slate-350'
                                            }`}
                                        >
                                            {selectedColors.includes(color) && (
                                                <Check size={11} className={String(color || '').toLowerCase().includes('white') || String(color || '').toLowerCase().includes('khaki') ? 'text-black' : 'text-white'} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Checkbox Widget */}
                        {sizesList.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">SIZES</h4>
                                <div className="grid grid-cols-3 gap-2">
                                    {sizesList.map((size, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSizeToggle(size)}
                                            className={`border rounded-xl text-center py-2 text-xs font-bold transition-all ${
                                                selectedSizes.includes(size)
                                                    ? 'border-amber-500 bg-amber-50 text-amber-600 font-extrabold shadow-sm'
                                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Price Range Widget */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">PRICE RANGE</h4>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs w-full text-center"
                                />
                                <span className="text-slate-300 font-bold">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 text-xs w-full text-center"
                                />
                            </div>
                            <button
                                onClick={handlePriceChange}
                                className="w-full bg-slate-900 hover:bg-black text-white text-xs font-black py-2 rounded-xl transition-all uppercase"
                            >
                                APPLY PRICE
                            </button>
                        </div>

                    </div>

                    {/* 2. Right Products Grid */}
                    <div className="lg:col-span-3 space-y-8">
                        
                        {/* Sort & Stats Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 border border-slate-100 rounded-2xl shadow-sm gap-4">
                            <div className="text-xs font-bold text-slate-500">
                                Showing <span className="text-slate-900 font-extrabold">{productList.length}</span> of <span className="text-slate-900 font-extrabold">{totalProducts}</span> products found
                            </div>
                            
                            <div className="flex items-center space-x-3 w-full sm:w-auto">
                                <button
                                    onClick={() => setMobileFiltersOpen(true)}
                                    className="lg:hidden flex items-center space-x-1.5 border border-slate-200 text-xs font-bold px-4 py-2 rounded-xl w-full justify-center"
                                >
                                    <SlidersHorizontal size={14} />
                                    <span>Filters</span>
                                </button>
                                
                                <div className="flex items-center space-x-1.5 w-full sm:w-auto">
                                    <ArrowLeftRight size={13} className="text-slate-400 hidden sm:inline" />
                                    <select
                                        value={sort}
                                        onChange={(e) => handleSortChange(e.target.value)}
                                        className="bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold py-2 pl-3 pr-8 w-full sm:w-auto focus:ring-0 focus:border-slate-300 cursor-pointer"
                                    >
                                        <option value="newest">NEWEST APPAREL</option>
                                        <option value="popular">BEST SELLING</option>
                                        <option value="price_low">PRICE: LOW TO HIGH</option>
                                        <option value="price_high">PRICE: HIGH TO LOW</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Products Cards Grid */}
                        {productList.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {productList.map((product) => (
                                    <ProductCard key={product.id} product={product} currency={currency} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm">
                                <p className="text-sm font-bold text-slate-500">No apparel matches your active filter options.</p>
                                <button 
                                    onClick={clearFilters}
                                    className="mt-4 bg-slate-900 hover:bg-black text-white text-xs font-black px-6 py-3 rounded-xl transition-all uppercase"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}

                        {/* Pagination Links */}
                        {paginationLinks && paginationLinks.length > 3 && (
                            <div className="flex justify-center items-center space-x-2 pt-8">
                                {paginationLinks.map((link, i) => {
                                    if (link.url === null) return null;
                                    
                                    return (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                                                link.active
                                                    ? 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-500/10'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                        />
                                    );
                                })}
                            </div>
                        )}

                    </div>

                </div>
            </div>

            {/* Mobile Filters Drawer Modal */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto lg:hidden">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)}></div>
                    <div className="relative min-h-screen flex justify-end">
                        <div className="relative w-full max-w-sm bg-white p-6 shadow-2xl flex flex-col space-y-6 animate-in slide-in-from-right duration-350">
                            
                            <div className="flex justify-between items-center pb-4 border-b">
                                <span className="text-xs font-black tracking-wider uppercase">FILTER APPAREL</span>
                                <button onClick={() => setMobileFiltersOpen(false)}>
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>

                            {/* Mobile Category List */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">CATEGORIES</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {categoryList.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                handleCategoryClick(cat.slug);
                                                setMobileFiltersOpen(false);
                                            }}
                                            className={`text-center py-2.5 rounded-xl text-xs font-bold ${
                                                selectedCategory === cat.slug 
                                                    ? 'bg-amber-500 text-white' 
                                                    : 'border border-slate-200 text-slate-600'
                                            }`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Colors */}
                            {colorsList.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">COLORS</h4>
                                    <div className="flex flex-wrap gap-2.5">
                                        {colorsList.map((color, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleColorToggle(color)}
                                                className={`w-8 h-8 rounded-full ${getColorClass(color)} ring-1 ring-offset-2 ${
                                                    selectedColors.includes(color) ? 'ring-amber-500' : 'ring-transparent'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Mobile Sizes */}
                            {sizesList.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">SIZES</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {sizesList.map((size, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSizeToggle(size)}
                                                className={`border rounded-xl py-2 text-xs font-bold ${
                                                    selectedSizes.includes(size) ? 'border-amber-500 bg-amber-50 text-amber-600' : 'border-slate-200'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => setMobileFiltersOpen(false)}
                                className="w-full bg-slate-900 text-white font-black text-xs py-3.5 rounded-xl uppercase mt-auto"
                            >
                                SHOW {totalProducts} RESULTS
                            </button>

                        </div>
                    </div>
                </div>
            )}

        </StoreLayout>
    );
}
