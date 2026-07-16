import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '../Layouts/StoreLayout';
import ProductCard from '../Components/ProductCard';
import { ArrowRight, Shirt, Compass, ShieldCheck, Truck, RefreshCw, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
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
        }, 5000); // 5 seconds interval for better slide viewing
        return () => clearInterval(interval);
    }, [uniqueSliderProducts.length]);

    return (
        <StoreLayout>
            <Head title="Premium Clothing Store" />

            {/* 1. Diners Style Hero Image Slider */}
            {uniqueSliderProducts.length > 0 ? (
                <div className="relative overflow-hidden bg-neutral-900 w-full aspect-[4/3] md:aspect-[21/9] min-h-[480px] md:min-h-[650px] border-b border-stone-200/60 group">
                    {uniqueSliderProducts.map((product, index) => (
                        <div 
                            key={product.id}
                            className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center ${
                                index === currentSlide ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-4 z-0 pointer-events-none'
                            }`}
                        >
                            {/* Full background image layout for slider */}
                            <div className="absolute inset-0 z-0">
                                <img 
                                    src={getAssetUrl(`storage/${getProductImageUrl(product)}`)}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-top opacity-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                            </div>

                            <div className="absolute inset-x-0 bottom-16 z-20 flex flex-col items-center text-center px-6 space-y-3 sm:space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-300">
                                    NEW ARRIVALS
                                </span>
                                <h2 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-widest text-white leading-tight max-w-3xl">
                                    {product.name}
                                </h2>
                                <p className="text-[10px] sm:text-xs text-stone-300 uppercase tracking-widest leading-relaxed line-clamp-2 max-w-xl">
                                    {product.short_description || product.description || 'Experience the premium refinement of Brands Studio. Indulge in tailored silhouettes, luxury textures, and contemporary clean apparel designed for the modern tastemaker.'}
                                </p>
                                <div className="pt-2">
                                    <Link 
                                        href={product.slug ? route('product.show', { slug: product.slug }) : '#'}
                                        className="inline-flex items-center space-x-3 bg-white hover:bg-neutral-900 text-black hover:text-white font-extrabold tracking-[0.25em] text-[10px] sm:text-xs px-10 py-3.5 rounded-none transition-all uppercase border border-white"
                                    >
                                        <span>SHOP NOW</span>
                                        <ArrowRight size={12} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Left & Right Navigation Arrows */}
                    {uniqueSliderProducts.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentSlide((prev) => (prev - 1 + uniqueSliderProducts.length) % uniqueSliderProducts.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/30 text-white flex items-center justify-center rounded-none hover:bg-black transition-all focus:outline-none"
                                aria-label="Previous Slide"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % uniqueSliderProducts.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/30 text-white flex items-center justify-center rounded-none hover:bg-black transition-all focus:outline-none"
                                aria-label="Next Slide"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </>
                    )}
                    
                    {/* Slider Navigation Dots */}
                    <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center space-x-2">
                        {uniqueSliderProducts.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-1 transition-all duration-300 ${
                                    index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40'
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="relative overflow-hidden bg-neutral-950 text-white min-h-[40vh] flex items-center justify-center">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-stone-500">No Banners Available</h2>
                </div>
            )}

            {/* 3. Shop by Category Grid (Diners Style) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400">
                        DESIGNED CATEGORIES
                    </span>
                    <h2 className="text-2xl font-extrabold text-neutral-900 mt-1 uppercase tracking-widest">
                        EXPLORE COLLECTIONS
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {categories.map((category) => {
                        const hasImage = !!getCategoryImageUrl(category);
                        return (
                            <Link 
                                key={category.id}
                                href={route('shop', { category: category.slug })}
                                className="group relative overflow-hidden aspect-[4/5] flex flex-col justify-end p-6 border border-stone-200/50 rounded-none bg-stone-100"
                            >
                                {hasImage ? (
                                    <>
                                        <img 
                                            src={getAssetUrl(`storage/${getCategoryImageUrl(category)}`)} 
                                            alt={category.name} 
                                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 z-0" 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                                    </>
                                ) : (
                                    <div className="absolute inset-0 bg-stone-50 group-hover:bg-stone-100 transition-colors z-0"></div>
                                )}

                                <div className="relative z-20 space-y-1">
                                    <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white">
                                        {category.name}
                                    </h3>
                                    <p className="text-[9px] text-stone-300 uppercase tracking-wider line-clamp-1">
                                        {category.description || 'Curated fashion essentials.'}
                                    </p>
                                    <span className="inline-flex items-center space-x-1 text-[8px] font-black uppercase tracking-widest text-white pt-2 border-b border-white">
                                        <span>SHOP NOW</span>
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* 4. Featured Couture */}
            {featuredProducts.length > 0 && (
                <div className="bg-stone-50 border-y border-stone-200/50 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400">
                                    HOT LIST
                                </span>
                                <h2 className="text-xl font-extrabold text-neutral-900 mt-1 uppercase tracking-widest">
                                    FEATURED COUTURE
                                </h2>
                            </div>
                            <Link href={route('collections')} className="text-[10px] font-black tracking-widest text-neutral-900 border-b border-black pb-1 hover:opacity-75 transition-opacity uppercase">
                                VIEW ALL
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {featuredProducts.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 5. New Arrivals Grid */}
            {newArrivals.length > 0 && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400">
                            JUST DROPPED
                        </span>
                        <h2 className="text-2xl font-extrabold text-neutral-900 mt-1 uppercase tracking-widest">
                            THE NEW ARRIVALS
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {newArrivals.slice(0, 8).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            {/* 6. Trending & Best Sellers (Side-by-Side) */}
            <div className="bg-stone-50 border-t border-stone-200/55 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    
                    {/* Trending block */}
                    {trendingProducts.length > 0 && (
                        <div>
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400 flex items-center space-x-1">
                                        <TrendingUp size={11} />
                                        <span>VIRAL CLOTHING</span>
                                    </span>
                                    <h3 className="text-lg font-extrabold text-neutral-900 uppercase tracking-widest mt-1">TRENDING</h3>
                                </div>
                                <Link href={route('shop', { sort: 'popular' })} className="text-[9px] font-black uppercase tracking-wider text-stone-400 hover:text-black transition-colors">
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
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400">MOST WANTED</span>
                                    <h3 className="text-lg font-extrabold text-neutral-900 uppercase tracking-widest mt-1">BEST SELLERS</h3>
                                </div>
                                <Link href={route('shop', { sort: 'popular' })} className="text-[9px] font-black uppercase tracking-wider text-stone-400 hover:text-black transition-colors">
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
