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

            {/* Banner Header (Diners Style) */}
            <div className="bg-stone-50 border-b border-stone-200/60 py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
                    <h1 className="text-2xl font-black tracking-[0.2em] text-neutral-900 uppercase">
                        {selectedCategory 
                            ? (categoryList.find(c => c.slug === selectedCategory)?.name || '').toUpperCase() 
                            : 'ALL CLOTHING COLLECTIONS'}
                    </h1>
                    <p className="text-[10px] text-stone-400 font-bold tracking-[0.2em] uppercase">
                        Tailored Luxury Silhouettes. Curated Organic Textures. Perfect Fit.
                    </p>
                </div>
            </div>

            {/* Shop Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="space-y-6">
                    
                    {/* Sort & Stats Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-3 border border-stone-200/50 rounded-none gap-4">
                        <div className="text-[10px] font-black tracking-widest text-stone-400 uppercase">
                            Showing <span className="text-black font-black">{productList.length}</span> of <span className="text-black font-black">{totalProducts}</span> products
                        </div>
                        
                        <div className="flex items-center space-x-3 w-full sm:w-auto">
                            <div className="flex items-center space-x-1.5 w-full sm:w-auto">
                                <ArrowLeftRight size={12} className="text-stone-450 hidden sm:inline" />
                                <select
                                    value={sort}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="bg-stone-50 border border-stone-200 rounded-none text-[10px] font-black tracking-widest py-2 pl-3 pr-8 w-full sm:w-auto focus:ring-0 focus:border-stone-400 cursor-pointer uppercase"
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {productList.map((product) => (
                                <ProductCard key={product.id} product={product} currency={currency} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-stone-250 p-16 text-center rounded-none">
                            <p className="text-[11px] font-bold text-stone-500 uppercase tracking-widest">No apparel matches your active filter options.</p>
                            <button 
                                onClick={clearFilters}
                                className="mt-4 bg-black hover:bg-neutral-800 text-white text-[10px] tracking-widest font-black px-6 py-3 rounded-none transition-all uppercase"
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
                                        className={`px-4 py-2.5 text-[10px] font-black tracking-widest rounded-none border transition-all ${
                                            link.active
                                                ? 'bg-black border-black text-white'
                                                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                        }`}
                                    />
                                );
                            })}
                        </div>
                    )}

                </div>
            </div>

        </StoreLayout>
    );
}
