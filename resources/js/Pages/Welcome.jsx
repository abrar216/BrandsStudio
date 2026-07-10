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

            {/* 1. Dynamic Premium Hero Image Slider */}
            {uniqueSliderProducts.length > 0 ? (
                <div className="relative overflow-hidden bg-gradient-to-br from-stone-50 via-neutral-50 to-stone-100 text-slate-800 min-h-[78vh] sm:min-h-[82vh] flex items-center border-b border-stone-200/60 group">
                    
                    {/* Subtle aesthetic backdrop patterns */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60"></div>
                    
                    {uniqueSliderProducts.map((product, index) => (
                        <div 
                            key={product.id}
                            className={`absolute inset-0 transition-all duration-1000 ease-in-out flex items-center ${
                                index === currentSlide ? 'opacity-100 translate-x-0 z-10' : 'opacity-0 translate-x-4 z-0 pointer-events-none'
                            }`}
                        >
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-10 lg:py-0">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                                    
                                    {/* Left Side: Bold Editorial Typography (Spans 5 cols) */}
                                    <div className="lg:col-span-5 text-left space-y-4 sm:space-y-6 z-20 order-2 lg:order-1 px-2">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <span className="h-[1.5px] w-6 bg-amber-500"></span>
                                                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-600">
                                                    EXCLUSIVE COLLECTION
                                                </span>
                                            </div>
                                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-slate-900 uppercase tracking-wide leading-tight font-light">
                                                Discover <br />
                                                <span className="font-extrabold text-slate-950 font-serif tracking-widest">{product.name}</span>
                                            </h2>
                                        </div>

                                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 max-w-md font-medium leading-relaxed">
                                            {product.short_description || product.description || 'Experience the premium refinement of Brands Studio. Indulge in tailored silhouettes, luxury textures, and contemporary clean apparel designed for the modern tastemaker.'}
                                        </p>

                                        <div className="pt-2">
                                            <Link 
                                                href={product.slug ? route('product.show', { slug: product.slug }) : '#'}
                                                className="inline-flex items-center space-x-3 bg-slate-950 hover:bg-amber-600 text-white font-extrabold tracking-[0.15em] text-[10px] sm:text-xs px-8 py-3.5 sm:px-10 sm:py-4 rounded-full transition-all hover:scale-105 duration-300 uppercase shadow-lg shadow-slate-950/15"
                                            >
                                                <span>EXPLORE PIECE</span>
                                                <ArrowRight size={13} />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Right Side: Portrait Canvas Image (Spans 7 cols) */}
                                    <div className="lg:col-span-7 flex justify-center lg:justify-end z-20 order-1 lg:order-2">
                                        <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md aspect-[3/4] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border-[6px] border-white p-0.5 hover:scale-[1.01] transition-transform duration-500">
                                            <img 
                                                src={getAssetUrl(`storage/${getProductImageUrl(product)}`)}
                                                alt={product.name}
                                                className="w-full h-full object-cover object-top rounded-[1.8rem] sm:rounded-[2.2rem]"
                                            />
                                            {/* Luxury watermark badge */}
                                            <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-sm text-[8px] font-black uppercase tracking-widest text-slate-900 font-serif">
                                                BRANDS STUDIO • TAILORED
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Left & Right Navigation Arrows */}
                    {uniqueSliderProducts.length > 1 && (
                        <>
                            <button
                                onClick={() => setCurrentSlide((prev) => (prev - 1 + uniqueSliderProducts.length) % uniqueSliderProducts.length)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white text-slate-800 shadow-md rounded-full flex items-center justify-center border border-slate-200/60 hover:scale-105 transition-all focus:outline-none opacity-0 group-hover:opacity-100 duration-300"
                                aria-label="Previous Slide"
                            >
                                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
                            </button>
                            <button
                                onClick={() => setCurrentSlide((prev) => (prev + 1) % uniqueSliderProducts.length)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/80 hover:bg-white text-slate-800 shadow-md rounded-full flex items-center justify-center border border-slate-200/60 hover:scale-105 transition-all focus:outline-none opacity-0 group-hover:opacity-100 duration-300"
                                aria-label="Next Slide"
                            >
                                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
                            </button>
                        </>
                    )}
                    
                    {/* Slider Navigation Dots */}
                    <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center space-x-2">
                        {uniqueSliderProducts.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-8 h-1 sm:w-12 rounded-full transition-all duration-300 ${
                                    index === currentSlide ? 'bg-amber-500 scale-100' : 'bg-white/40 hover:bg-white'
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
