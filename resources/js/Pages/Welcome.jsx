import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '../Layouts/StoreLayout';
import ProductCard from '../Components/ProductCard';
import { ArrowRight, Shirt, Compass, ShieldCheck, Truck, RefreshCw, TrendingUp } from 'lucide-react';
import { getAssetUrl, getCategoryImageUrl } from '../Utils/asset';

export default function Welcome({ categories, featuredProducts, trendingProducts, bestSellers, newArrivals, settings = {} }) {
    const { props } = usePage();
    const storeSettings = props.settings || {};
    const currency = storeSettings.currency || 'Rs.';

    return (
        <StoreLayout>
            <Head title="Premium Clothing Store" />

            {/* 1. Dynamic Premium Hero Section */}
            <div className="relative overflow-hidden bg-neutral-900 text-white min-h-[75vh] flex items-center">
                {/* Background visual elements */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-black opacity-95"></div>
                <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none hidden lg:block"></div>
                
                {/* Visual grid backdrop */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Hero Left Content */}
                    <div className="lg:col-span-7 space-y-6 text-left">
                        <span className="inline-block bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-black tracking-widest px-4 py-1.5 rounded-full uppercase">
                            {settings.hero_badge || "New Season Arrival '26"}
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight font-serif leading-none text-white whitespace-pre-line uppercase">
                            {settings.hero_title || "WEAR YOUR\nSIGNATURE."}
                        </h1>
                        <p className="text-sm sm:text-base text-neutral-400 font-medium leading-relaxed max-w-xl">
                            {settings.hero_subtitle || "Experience the premium refinement of Brands Studio. Indulge in tailored silhouettes, luxury organic textures, and contemporary clean apparel designed for the modern tastemaker."}
                        </p>
                        
                        <div className="pt-4 flex flex-wrap gap-4">
                            <Link 
                                href={settings.hero_button_link || route('collections')} 
                                className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold tracking-wider text-xs px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-amber-500/20 uppercase"
                            >
                                {settings.hero_button_text || "EXPLORE COLLECTION"}
                            </Link>
                            {settings.hero_secondary_button_text && (
                                <Link 
                                    href={settings.hero_secondary_button_link || route('shop', { sort: 'popular' })} 
                                    className="bg-transparent hover:bg-white/10 text-white border border-white/20 hover:border-white font-extrabold tracking-wider text-xs px-8 py-4 rounded-xl transition-all uppercase"
                                >
                                    {settings.hero_secondary_button_text}
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Hero Right Visual Card */}
                    <div className="lg:col-span-5 hidden lg:block">
                        <div className="relative bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-3xl shadow-2xl flex flex-col items-center text-center max-w-sm mx-auto">
                            <div className="w-16 h-16 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                                <Shirt size={30} className="text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Tailored Luxury Fabrics</h3>
                            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                                Our signature wool blends and combed ringspun organic cotton garments offer a unique sensory experience.
                            </p>
                            <span className="bg-neutral-800 text-amber-400 text-[10px] font-black tracking-widest px-3 py-1 rounded-md uppercase">
                                100% QUALITY GUARANTEED
                            </span>
                        </div>
                    </div>

                </div>
            </div>

            {/* 2. Core Value Pillars Bar */}
            <div className="bg-white border-b border-slate-100 py-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                            <Truck size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs font-black tracking-wide text-slate-800 uppercase">Free Expedited Delivery</h4>
                            <p className="text-[11px] text-slate-500 font-medium">On all orders over {currency} 5000</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                            <RefreshCw size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs font-black tracking-wide text-slate-800 uppercase">30-Day Free Returns</h4>
                            <p className="text-[11px] text-slate-500 font-medium">Easy return and store exchange</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs font-black tracking-wide text-slate-800 uppercase">100% Secure Checkout</h4>
                            <p className="text-[11px] text-slate-500 font-medium">Stripe & PayPal fully encrypted</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                            <Compass size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs font-black tracking-wide text-slate-800 uppercase">Signature Fit Promise</h4>
                            <p className="text-[11px] text-slate-500 font-medium">Expertly calibrated premium sizing</p>
                        </div>
                    </div>

                </div>
            </div>

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

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 5. Luxury Promotional Static Banner */}
            <div className="bg-neutral-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 to-black opacity-90"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem]"></div>
                
                <div className="relative max-w-4xl mx-auto px-6 text-center space-y-6">
                    <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black tracking-widest px-4 py-1.5 rounded-full uppercase border border-amber-500/30">
                        {settings.banner_badge || "THE ART OF APPAREL"}
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-black font-serif tracking-tight leading-tight whitespace-pre-line uppercase">
                        {settings.banner_title || "SUSTAINABLE MATERIALS. \n MAJESTIC TAILORING."}
                    </h2>
                    <p className="text-neutral-400 text-sm max-w-lg mx-auto leading-relaxed">
                        {settings.banner_subtitle || "At Brands Studio, we combine age-old Italian sartorial techniques with 100% organic long-staple cotton and recycled fibers, crafting sustainable heirlooms that grow softer with every wear."}
                    </p>
                    <div className="pt-2">
                        <Link 
                            href={settings.banner_button_link || route('collections')} 
                            className="inline-block bg-white hover:bg-neutral-100 text-slate-900 font-extrabold tracking-wider text-xs px-10 py-4 rounded-xl shadow-lg transition-all uppercase"
                        >
                            {settings.banner_button_text || "SHOP COLLECTION"}
                        </Link>
                    </div>
                </div>
            </div>

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

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
