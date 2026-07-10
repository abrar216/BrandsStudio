import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '../Layouts/StoreLayout';
import ProductCard from '../Components/ProductCard';
import { ArrowRight, Shirt, Compass, ShieldCheck, Truck, RefreshCw, TrendingUp } from 'lucide-react';
import { getAssetUrl, getCategoryImageUrl, getProductImageUrl } from '../Utils/asset';

export default function Welcome({ 
    categories = [], 
    featuredProducts = [], 
    trendingProducts = [], 
    bestSellers = [], 
    newArrivals = [], 
    settings = {} 
}) {
    const { props } = usePage();
    const storeSettings = props.settings || {};
    const currency = storeSettings.currency || 'Rs.';

    // Slider Logic
    const allSliderProducts = [...(featuredProducts || []), ...(bestSellers || [])].filter(p => getProductImageUrl(p));
    const uniqueSliderProducts = Array.from(new Map(allSliderProducts.map(item => [item.id, item])).values()).slice(0, 5);
    
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (uniqueSliderProducts.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % uniqueSliderProducts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [uniqueSliderProducts.length]);

    return (
        <StoreLayout>
            <Head title="Premium Clothing Store" />

            {/* 1. Dynamic Premium Hero Image Slider */}
            {uniqueSliderProducts.length > 0 ? (
                <div className="relative overflow-hidden bg-neutral-900 text-white min-h-[75vh] flex items-center group">
                    {uniqueSliderProducts.map((product, index) => (
                        <div 
                            key={product.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                        >
                            <img 
                                src={getAssetUrl(`storage/${getProductImageUrl(product)}`)}
                                alt={product.name}
                                className="w-full h-full object-cover object-center"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                            
                            {/* Product Info Overlay */}
                            <div className="absolute inset-0 flex items-end pb-24 sm:items-center sm:pb-0">
                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                                    <div className="max-w-2xl text-left">
                                        <span className="inline-block bg-amber-500 text-white text-[8px] sm:text-[10px] font-black tracking-widest px-3 py-1 sm:px-4 sm:py-1.5 rounded-full uppercase mb-2 sm:mb-4 shadow-lg">
                                            TRENDING NOW
                                        </span>
                                        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight font-serif text-white uppercase drop-shadow-2xl leading-tight sm:leading-none">
                                            {product.name}
                                        </h2>
                                        <p className="hidden sm:block mt-6 text-sm text-gray-200 line-clamp-2 max-w-lg drop-shadow-md font-medium">
                                            {product.short_description || product.description || 'Experience the premium refinement of Brands Studio. Indulge in tailored silhouettes, luxury textures, and contemporary clean apparel designed for the modern tastemaker.'}
                                        </p>
                                        <div className="mt-5 sm:mt-8">
                                            <Link 
                                                href={product.slug ? route('product.show', { slug: product.slug }) : '#'}
                                                className="inline-block bg-white text-black font-extrabold tracking-wider text-[10px] sm:text-xs px-6 py-3 sm:px-10 sm:py-4 rounded-xl transition-all hover:bg-amber-500 hover:text-white uppercase shadow-xl"
                                            >
                                                SHOP NOW
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Slider Navigation Dots */}
                    <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-2">
                        {uniqueSliderProducts.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-8 h-1 sm:w-12 rounded-full transition-all duration-300 ${
                                    index === currentSlide ? 'bg-amber-500 scale-100' : 'bg-white/50 hover:bg-white'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="relative overflow-hidden bg-neutral-900 text-white min-h-[50vh] flex items-center justify-center">
                    <h2 className="text-2xl font-bold text-neutral-500 uppercase tracking-widest">No Featured Images Available</h2>
                </div>
            )}



            {/* 3. Shop by Category Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center max-w-xl mx-auto mb-12">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                        DESIGNED CATEGORIES
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-800 mt-1">
                        EXPLORE OUR COLLECTIONS
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categories.map((category) => {
                        const hasImage = !!getCategoryImageUrl(category);
                        return (
                            <Link 
                                key={category.id}
                                href={route('shop', { category: category.slug })}
                                className={`group relative p-8 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between aspect-square border transform hover:-translate-y-1 ${
                                    hasImage 
                                        ? 'bg-neutral-900 border-neutral-800 text-white' 
                                        : 'bg-white border-slate-100 text-slate-800'
                                }`}
                            >
                                {hasImage ? (
                                    <>
                                        <img 
                                            src={getAssetUrl(`storage/${getCategoryImageUrl(category)}`)} 
                                            alt={category.name} 
                                            className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700 z-0" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent z-10"></div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 to-white group-hover:from-amber-50/10 group-hover:to-amber-50/30 transition-all duration-300 z-0"></div>
                                )}


                                <div className="relative z-20">
                                    <h3 className={`text-lg font-black uppercase tracking-wider font-serif ${
                                        hasImage 
                                            ? 'text-white group-hover:text-amber-400 transition-colors' 
                                            : 'text-slate-800 group-hover:text-amber-600 transition-colors'
                                    }`}>
                                        {category.name}
                                    </h3>
                                    <p className={`text-xs mt-1 leading-normal line-clamp-2 ${
                                        hasImage ? 'text-neutral-200' : 'text-slate-500'
                                    }`}>
                                        {category.description || 'Premium curated fashion essentials.'}
                                    </p>
                                    <span className={`inline-flex items-center space-x-1.5 text-xs font-black mt-4 transition-transform group-hover:translate-x-1 ${
                                        hasImage 
                                            ? 'text-amber-400 group-hover:text-amber-300' 
                                            : 'text-slate-900 group-hover:text-amber-600'
                                    }`}>
                                        <span>DISCOVER NOW</span>
                                        <ArrowRight size={13} />
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* 4. Featured Products (Horizontal slider/grid) */}
            {featuredProducts.length > 0 && (
                <div className="bg-slate-100/50 border-y border-slate-100 py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                                    HOT LIST
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-800 mt-1">
                                    FEATURED COUTURE
                                </h2>
                            </div>
                            <Link href={route('collections')} className="text-xs font-black tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 hover:text-amber-600 hover:border-amber-600 transition-all">
                                VIEW ALL / SHOP
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {featuredProducts.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            )}


            {/* 6. New Arrivals (Grid of products) */}
            {newArrivals.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center max-w-xl mx-auto mb-12">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                            JUST DROPPED
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black font-serif text-slate-800 mt-1">
                            THE NEW ARRIVALS
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {newArrivals.slice(0, 8).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            {/* 7. Trending & Best Sellers Side-by-Side */}
            <div className="bg-slate-100/30 border-t border-slate-100 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
                    
                    {/* Trending block */}
                    {trendingProducts.length > 0 && (
                        <div>
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 flex items-center space-x-1">
                                        <TrendingUp size={11} />
                                        <span>VIRAL CLOTHING</span>
                                    </span>
                                    <h3 className="text-xl font-black text-slate-800 uppercase font-serif mt-1">TRENDING APPAREL</h3>
                                </div>
                                <Link href={route('shop', { sort: 'popular' })} className="text-xs font-bold text-slate-600 hover:text-black">
                                    See all
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {trendingProducts.slice(0, 2).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Best Sellers block */}
                    {bestSellers.length > 0 && (
                        <div>
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">MOST WANTED</span>
                                    <h3 className="text-xl font-black text-slate-800 uppercase font-serif mt-1">BEST SELLERS</h3>
                                </div>
                                <Link href={route('shop', { sort: 'popular' })} className="text-xs font-bold text-slate-600 hover:text-black">
                                    See all
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {bestSellers.slice(0, 2).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>

        </StoreLayout>
    );
}
