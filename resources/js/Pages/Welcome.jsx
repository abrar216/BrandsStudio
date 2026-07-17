import React, { useState, useEffect, useRef } from 'react';
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

    // Collections Carousel Logic
    const subCategories = (categories || []).filter(c => c.parent_id);
    const collectionsRef = useRef(null);

    useEffect(() => {
        if (subCategories.length <= 1) return;
        const interval = setInterval(() => {
            if (collectionsRef.current) {
                const maxScroll = collectionsRef.current.scrollWidth - collectionsRef.current.clientWidth;
                if (collectionsRef.current.scrollLeft >= maxScroll - 10) {
                    collectionsRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    collectionsRef.current.scrollBy({ left: 280, behavior: 'smooth' });
                }
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [subCategories.length]);

    const handleCollectionsScroll = (direction) => {
        if (collectionsRef.current) {
            const scrollAmount = direction === 'left' ? -280 : 280;
            collectionsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const getSubcategoryPlaceholder = (name) => {
        const title = String(name || '').toLowerCase();
        if (title.includes('polo')) {
            return 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=500&auto=format&fit=crop';
        }
        if (title.includes('shirt')) {
            return 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=500&auto=format&fit=crop';
        }
        if (title.includes('suit') || title.includes('coat') || title.includes('blazer')) {
            return 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=500&auto=format&fit=crop';
        }
        if (title.includes('kurta') || title.includes('ethnic') || title.includes('eastern')) {
            return 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?q=80&w=500&auto=format&fit=crop';
        }
        if (title.includes('denim') || title.includes('trouser') || title.includes('chino')) {
            return 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=500&auto=format&fit=crop';
        }
        return 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=500&auto=format&fit=crop';
    };
    
    // Kids Specials Dynamic Filter
    const kidsCategory = categories.find(c => String(c.slug).toLowerCase() === 'kids');
    const kidsCategoryIds = kidsCategory 
        ? [kidsCategory.id, ...categories.filter(c => c.parent_id === kidsCategory.id).map(c => c.id)]
        : [];
    const kidsProducts = [
        ...(featuredProducts || []),
        ...(bestSellers || []),
        ...(newArrivals || []),
        ...(trendingProducts || [])
    ].filter(product => {
        return kidsCategoryIds.includes(product.category_id) || 
               (product.category && kidsCategoryIds.includes(product.category.id)) ||
               (product.category?.parent_id && kidsCategoryIds.includes(product.category.parent_id));
    });
    const uniqueKidsProducts = Array.from(new Map(kidsProducts.map(p => [p.id, p])).values()).slice(0, 4);

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
                            {/* Clickable slide link to product details */}
                            <Link 
                                href={product.slug ? route('product.show', { slug: product.slug }) : '#'}
                                className="absolute inset-0 z-0 block w-full h-full cursor-pointer"
                            >
                                <img 
                                    src={getAssetUrl(`storage/${getProductImageUrl(product)}`)}
                                    alt={product.name}
                                    className="w-full h-full object-cover object-top opacity-100"
                                />
                            </Link>
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

                <div className="flex overflow-x-auto space-x-6 pb-4 md:flex md:flex-wrap md:justify-center md:space-x-8 lg:space-x-12 scrollbar-none snap-x snap-mandatory">
                    {categories.filter(category => !category.parent_id).map((category) => {
                        const imgPath = getCategoryImageUrl(category);
                        const imgUrl = imgPath 
                            ? getAssetUrl(`storage/${imgPath}`) 
                            : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=300&auto=format&fit=crop';
                        
                        return (
                            <Link 
                                key={category.id}
                                href={`/shop?category=${category.slug}`}
                                className="group flex flex-col items-center text-center space-y-3 flex-shrink-0 snap-center w-28 md:w-auto"
                            >
                                {/* Circular Explore Tile Image */}
                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-stone-200 bg-stone-50 transition-all duration-300 group-hover:shadow-md">
                                    <img 
                                        src={imgUrl} 
                                        alt={category.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                </div>
                                <span className="text-[10px] font-black tracking-widest text-stone-850 group-hover:text-black uppercase">
                                    {category.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* 4. "BEST SELLER" PRODUCT GRID SECTION */}
            <div className="bg-stone-50 border-t border-stone-200/50 py-10 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center mb-10 space-y-2">
                        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-[0.2em]">
                            BEST SELLER
                        </h2>
                        <div>
                            <Link 
                                href="/shop" 
                                className="inline-block text-[10px] font-bold tracking-widest text-stone-400 border-b border-stone-300 pb-0.5 hover:text-black hover:border-black uppercase transition-all"
                            >
                                Discover the limiteds
                            </Link>
                        </div>
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
            <div className="py-16 border-t border-stone-200/50 relative group/carousel">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center mb-10 space-y-2">
                        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-[0.2em]">
                            OUR NEW COLLECTIONS
                        </h2>
                        <div>
                            <Link 
                                href="/shop" 
                                className="inline-block text-[10px] font-bold tracking-widest text-stone-400 border-b border-stone-300 pb-0.5 hover:text-black hover:border-black uppercase transition-all"
                            >
                                Discover the masterpieces
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Scroll Container */}
                        <div 
                            ref={collectionsRef}
                            className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 scrollbar-none snap-x snap-mandatory scroll-smooth"
                        >
                            {subCategories.map((sub, idx) => {
                                const imgPath = getCategoryImageUrl(sub);
                                const imgUrl = imgPath 
                                    ? getAssetUrl(`storage/${imgPath}`) 
                                    : getSubcategoryPlaceholder(sub.name);
                                
                                return (
                                    <Link 
                                        key={sub.id || idx}
                                        href={`/shop?category=${sub.slug}`}
                                        className="group relative overflow-hidden aspect-[4/5] bg-stone-150 flex flex-col justify-end p-5 sm:p-6 border border-stone-200/50 rounded-none flex-shrink-0 snap-center w-[72vw] sm:w-[42vw] md:w-[28vw] lg:w-[22vw]"
                                    >
                                        <img 
                                            src={imgUrl} 
                                            alt={sub.name} 
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                                        <div className="relative z-20 text-center pb-2">
                                            <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-white">
                                                {sub.name}
                                            </h3>
                                            <span className="inline-block text-[8px] font-black uppercase tracking-[0.3em] text-stone-300 mt-1">
                                                COLLECTION
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Navigation Arrows */}
                        {subCategories.length > 3 && (
                            <>
                                <button
                                    onClick={() => handleCollectionsScroll('left')}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-4 z-30 w-10 h-10 bg-white/90 text-black border border-stone-200 shadow-md flex items-center justify-center rounded-none hover:bg-black hover:text-white transition-all opacity-0 group-hover/carousel:opacity-100 focus:outline-none"
                                    aria-label="Scroll Left"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={() => handleCollectionsScroll('right')}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-4 z-30 w-10 h-10 bg-white/90 text-black border border-stone-200 shadow-md flex items-center justify-center rounded-none hover:bg-black hover:text-white transition-all opacity-0 group-hover/carousel:opacity-100 focus:outline-none"
                                    aria-label="Scroll Right"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </div>

            {/* 6. KIDS CATEGORY BANNER GRID */}
            <div className="bg-stone-50 border-t border-stone-200/50 py-10 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <div className="text-center mb-10 space-y-2">
                        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 uppercase tracking-[0.2em]">
                            KIDS SPECIALS
                        </h2>
                        <div>
                            <Link 
                                href="/shop?category=kids" 
                                className="inline-block text-[10px] font-bold tracking-widest text-stone-400 border-b border-stone-300 pb-0.5 hover:text-black hover:border-black uppercase transition-all"
                            >
                                Shop Kids Collection
                            </Link>
                        </div>
                    </div>

                    {uniqueKidsProducts.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
                            {uniqueKidsProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white border border-stone-200/40 mb-8">
                            <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest">
                                No kids products currently in stock. Check back soon!
                            </p>
                        </div>
                    )}

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
