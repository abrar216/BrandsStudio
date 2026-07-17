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
                <div className="relative overflow-hidden bg-neutral-900 w-full aspect-[4/5] md:aspect-[21/9] min-h-[420px] md:min-h-[650px] border-b border-stone-200/60 group">
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

            {/* 3. "WHAT WOULD YOU LIKE TO EXPLORE?" SECTION */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                <div className="text-center mb-8">
                    <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-[0.25em]">
                        WHAT WOULD YOU LIKE TO EXPLORE?
                    </h2>
                </div>

                <div className="flex overflow-x-auto space-x-6 pb-4 md:grid md:grid-cols-6 md:gap-6 md:space-x-0 scrollbar-none snap-x snap-mandatory">
                    {[
                        { name: 'MEN POLOS', slug: 'menswear', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=300&auto=format&fit=crop' },
                        { name: 'MEN WESTERN', slug: 'menswear', image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop' },
                        { name: 'MEN EASTERN', slug: 'menswear', image: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?q=80&w=300&auto=format&fit=crop' },
                        { name: 'WOMEN EASTERN', slug: 'womenswear', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=300&auto=format&fit=crop' },
                        { name: 'WOMEN WESTERN', slug: 'womenswear', image: 'https://images.unsplash.com/photo-1595959183075-c1d09e773636?q=80&w=300&auto=format&fit=crop' },
                        { name: 'KIDS WEAR', slug: 'kids', image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=300&auto=format&fit=crop' }
                    ].map((tile, i) => (
                        <Link 
                            key={i}
                            href={`/shop?category=${tile.slug}`}
                            className="group flex flex-col items-center text-center space-y-3 flex-shrink-0 snap-center w-28 md:w-auto"
                        >
                            {/* Circular Explore Tile Image */}
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-stone-200 bg-stone-50 transition-all duration-300 group-hover:shadow-md">
                                <img 
                                    src={tile.image} 
                                    alt={tile.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                            </div>
                            <span className="text-[10px] font-black tracking-widest text-stone-850 group-hover:text-black uppercase">
                                {tile.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* 4. "BEST SELLER" PRODUCT GRID SECTION */}
            <div className="bg-stone-50 border-t border-stone-200/50 py-10 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-8 space-y-2 sm:space-y-0 text-center sm:text-left">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-[0.2em]">
                                BEST SELLER
                            </h2>
                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1">
                                Discover the limiteds
                            </p>
                        </div>
                        <Link 
                            href="/shop" 
                            className="text-[9px] font-black tracking-widest text-neutral-900 border-b border-black pb-1 hover:opacity-75 uppercase transition-opacity"
                        >
                            Discover the limiteds &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                        {(bestSellers.length > 0 ? bestSellers : featuredProducts).slice(0, 4).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="text-center pt-10">
                        <Link
                            href="/shop"
                            className="inline-block bg-black text-white hover:bg-white hover:text-black border border-black font-black text-[10px] tracking-widest px-10 py-4 rounded-none uppercase transition-all duration-300"
                        >
                            VIEW ALL PRODUCTS
                        </Link>
                    </div>

                </div>
            </div>

            {/* 5. "OUR NEW COLLECTIONS" CAROUSEL */}
            <div className="py-16 border-t border-stone-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center mb-10">
                        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-[0.2em]">
                            OUR NEW COLLECTIONS
                        </h2>
                        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mt-1">
                            Discover the masterpieces
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { name: 'SHALWAR KAMEEZ COLLECTION', url: '/shop?category=menswear', image: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?q=80&w=500&auto=format&fit=crop' },
                            { name: 'POLO SHIRT SERIES', url: '/shop?category=menswear', image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=500&auto=format&fit=crop' },
                            { name: 'FORMAL SUITING SETS', url: '/shop?category=menswear', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=500&auto=format&fit=crop' }
                        ].map((promo, idx) => (
                            <Link 
                                key={idx}
                                href={promo.url}
                                className="group relative overflow-hidden aspect-[4/5] bg-stone-100 flex flex-col justify-end p-6 border border-stone-200/50 rounded-none"
                            >
                                <img 
                                    src={promo.image} 
                                    alt={promo.name} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                                <div className="relative z-20 space-y-2">
                                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white">
                                        {promo.name}
                                    </h3>
                                    <span className="inline-flex items-center space-x-1.5 text-[8px] font-black uppercase tracking-widest text-white border-b border-white pb-0.5">
                                        <span>EXPLORE NOW</span>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>

            {/* 6. KIDS CATEGORY BANNER GRID */}
            <div className="bg-stone-50 border-t border-stone-200/50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center mb-10">
                        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-[0.2em]">
                            KIDS SPECIALS
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { title: 'BOYS EASTERN', image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=300&auto=format&fit=crop' },
                            { title: 'BOYS WESTERN', image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?q=80&w=300&auto=format&fit=crop' },
                            { title: 'GIRLS EASTERN', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=300&auto=format&fit=crop' },
                            { title: 'GIRLS WESTERN', image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=300&auto=format&fit=crop' }
                        ].map((kids, i) => (
                            <div key={i} className="group relative aspect-[3/4] bg-stone-100 border border-stone-200 overflow-hidden">
                                <img 
                                    src={kids.image} 
                                    alt={kids.title} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/35 z-10 flex flex-col justify-end p-4 text-center">
                                    <h4 className="text-[10px] font-black tracking-widest text-white mb-3 uppercase">
                                        {kids.title}
                                    </h4>
                                    <Link 
                                        href="/shop?category=kids"
                                        className="w-full bg-white hover:bg-neutral-900 hover:text-white text-black text-[8px] font-black tracking-widest py-2 rounded-none uppercase transition-all"
                                    >
                                        SHOP NOW
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link 
                            href="/shop?category=kids"
                            className="inline-block border border-black bg-transparent hover:bg-black hover:text-white text-black font-black text-[10px] tracking-widest px-8 py-3.5 rounded-none uppercase transition-all duration-300"
                        >
                            VISIT CATEGORY
                        </Link>
                    </div>

                </div>
            </div>

            {/* 7. APPAREL PROMO BANNERS */}
            <div className="py-16 border-t border-stone-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Men Couture Banner */}
                    <Link 
                        href="/shop?category=menswear"
                        className="group relative overflow-hidden aspect-[16/9] bg-stone-100 border border-stone-200 rounded-none flex items-center justify-center p-8"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?q=80&w=600&auto=format&fit=crop" 
                            alt="Men's Eastern Collection" 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/45 z-10 flex flex-col items-center justify-center text-center space-y-2 p-6">
                            <h3 className="text-sm sm:text-base font-black tracking-[0.25em] text-white uppercase">
                                MEN'S EASTERN COUTURE
                            </h3>
                            <span className="bg-white text-black text-[9px] font-black tracking-widest px-6 py-2.5 rounded-none uppercase">
                                SHOP COLLECTION
                            </span>
                        </div>
                    </Link>

                    {/* Women Couture Banner */}
                    <Link 
                        href="/shop?category=womenswear"
                        className="group relative overflow-hidden aspect-[16/9] bg-stone-100 border border-stone-200 rounded-none flex items-center justify-center p-8"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=600&auto=format&fit=crop" 
                            alt="Women's Luxury Collection" 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/45 z-10 flex flex-col items-center justify-center text-center space-y-2 p-6">
                            <h3 className="text-sm sm:text-base font-black tracking-[0.25em] text-white uppercase">
                                WOMEN'S LUXURY COUTURE
                            </h3>
                            <span className="bg-white text-black text-[9px] font-black tracking-widest px-6 py-2.5 rounded-none uppercase">
                                SHOP COLLECTION
                            </span>
                        </div>
                    </Link>

                </div>
            </div>

            {/* 8. CUSTOMER TESTIMONIALS SECTION */}
            <div className="bg-stone-50 border-t border-stone-200/50 py-10 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center mb-8">
                        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-[0.2em]">
                            WE LOVE TRUSTING BRANDS STUDIO
                        </h2>
                    </div>

                    <div className="flex overflow-x-auto space-x-6 pb-4 md:grid md:grid-cols-3 md:gap-6 md:space-x-0 scrollbar-none snap-x snap-mandatory">
                        {[
                            { name: 'Abrar Ahmed', text: 'Absolutely love the fabric quality of their kurta sets. Refined details, fits perfectly, and delivery was incredibly fast.', rating: 5 },
                            { name: 'Zainab Fatima', text: 'Brands Studio western wear collection is outstanding. The fabric is durable and stitches are premium quality. Highly recommended.', rating: 5 },
                            { name: 'Kamran Malik', text: 'Ordered formal signature shirts and chinos. Best price-to-quality ratio in Pakistan. Shopping experience was very smooth.', rating: 5 }
                        ].map((review, i) => (
                            <div key={i} className="bg-white border border-stone-200/60 p-6 flex flex-col justify-between space-y-4 rounded-none shadow-sm flex-shrink-0 snap-center w-[280px] md:w-auto">
                                <div className="space-y-2">
                                    <div className="flex space-x-0.5 text-amber-400">
                                        {[...Array(review.rating)].map((_, idx) => (
                                            <span key={idx} className="text-xs">&#9733;</span>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-stone-550 leading-relaxed font-bold uppercase tracking-wide">
                                        "{review.text}"
                                    </p>
                                </div>
                                <div className="flex justify-between items-center pt-3 border-t border-stone-100">
                                    <span className="text-[9px] font-black tracking-widest uppercase text-stone-900">
                                        {review.name}
                                    </span>
                                    <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest">
                                        Verified Buyer
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* 9. NEWSLETTER SIGNUP SECTION */}
            <div className="bg-white border-t border-stone-250 py-16">
                <div className="max-w-md mx-auto px-6 text-center space-y-4">
                    <h3 className="text-lg font-black uppercase tracking-widest text-black">
                        NEWSLETTER
                    </h3>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider leading-relaxed">
                        Be the first one to know about discounts, offers and events
                    </p>
                    <form 
                        onSubmit={(e) => {
                            e.preventDefault();
                            window.dispatchEvent(new CustomEvent('cart-updated', { 
                                detail: { product: { name: 'newsletter-signup' } } 
                            }));
                        }}
                        className="flex items-center pt-2"
                    >
                        <input 
                            type="email" 
                            required
                            placeholder="ENTER EMAIL ADDRESS..." 
                            className="bg-stone-50 border border-stone-200 text-[10px] tracking-wider text-black rounded-none px-4 py-3 w-full focus:bg-white focus:ring-0 focus:border-black uppercase font-bold"
                        />
                        <button 
                            type="submit" 
                            className="bg-black text-white hover:bg-white hover:text-black border border-black text-[10px] font-black tracking-widest rounded-none px-6 py-3 uppercase transition-all duration-300"
                        >
                            SUBMIT
                        </button>
                    </form>
                </div>
            </div>

        </StoreLayout>
    );
}
