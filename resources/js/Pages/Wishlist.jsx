import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '../Layouts/StoreLayout';
import ProductCard from '../Components/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Wishlist({ products = [] }) {
    const { props } = usePage();
    const currency = props.settings?.currency || 'Rs.';

    return (
        <StoreLayout>
            <Head title="Your Favorites - Brands Studio" />

            {/* Banner Header */}
            <div className="bg-stone-50 border-b border-slate-200/60 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                    <div className="inline-flex p-3 bg-amber-50 rounded-full text-amber-600 animate-pulse">
                        <Heart size={24} fill="currentColor" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-wide text-slate-900">
                        YOUR FAVOURITES
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide max-w-md mx-auto">
                        Your handpicked luxury clothing collection. Keep track of items you love and add them to your cart in one tap.
                    </p>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {products.length > 0 ? (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                            <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
                                {products.length} {products.length === 1 ? 'ITEM' : 'ITEMS'} SAVED
                            </span>
                            <Link 
                                href={route('shop')}
                                className="text-xs font-black tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 hover:text-amber-600 hover:border-amber-600 transition-all uppercase"
                            >
                                CONTINUE SHOPPING
                            </Link>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} currency={currency} inWishlist={true} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-lg mx-auto bg-white border border-slate-100 rounded-3xl p-12 sm:p-16 text-center shadow-md space-y-6">
                        <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                            <Heart size={28} />
                        </div>
                        
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wider">YOUR WISHLIST IS EMPTY</h3>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                Explore our latest collections, premium accessories, and signature fits to add items you love to your personal wishlist.
                            </p>
                        </div>

                        <div className="pt-2">
                            <Link 
                                href={route('shop')}
                                className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-black text-white text-xs font-black px-8 py-4 rounded-xl transition-all shadow-md uppercase tracking-wider"
                            >
                                <span>DISCOVER COLLECTIONS</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    );
}
