import React from 'react';
import { Link } from '@inertiajs/react';
import { Shirt, ShieldCheck, Heart } from 'lucide-react';

export default function GuestLayout({ children, title = "Welcome to Brands Studio", subtitle = "Indulge in premium curated clothing and tailored silhouettes." }) {
    return (
        <div className="flex min-h-screen font-sans selection:bg-amber-100 text-slate-800 overflow-hidden bg-stone-50">
            
            <div className="flex flex-col md:flex-row w-full z-10">
                {/* Left Panel: Branding & Luxury Vibe */}
                <div className="hidden md:flex flex-1 flex-col justify-center items-center px-16 text-center lg:items-start lg:text-left bg-gradient-to-tr from-stone-100 to-stone-50 border-r border-stone-200/60 relative">
                    {/* Visual pattern overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none"></div>
                    
                    <div className="animate-in fade-in slide-in-from-left-8 duration-1000 relative z-10">
                        <Link href="/">
                            <div className="flex items-center gap-4 group mb-12">
                                <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-all duration-500 text-white">
                                    <span className="text-2xl font-black font-serif tracking-widest">BS</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-black tracking-widest text-slate-900 font-serif leading-none">BRANDS STUDIO</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 text-center lg:text-left">WEAR YOUR SIGNATURE</span>
                                </div>
                            </div>
                        </Link>

                        <div className="max-w-xl space-y-6">
                            <h1 className="text-4xl lg:text-5xl font-black font-serif tracking-tight leading-tight text-slate-900">
                                {title}
                            </h1>
                            <p className="text-base text-slate-500 font-semibold leading-relaxed max-w-md">
                                {subtitle}
                            </p>
                        </div>

                        {/* Value Pillars List */}
                        <div className="mt-16 space-y-4 text-left">
                            <div className="flex items-center space-x-3 text-xs font-bold text-slate-600">
                                <span className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><Shirt size={14} /></span>
                                <span>Premium Long-Staple Organic Cottons</span>
                            </div>
                            <div className="flex items-center space-x-3 text-xs font-bold text-slate-600">
                                <span className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><ShieldCheck size={14} /></span>
                                <span>100% Encrypted & Secure Checkout</span>
                            </div>
                            <div className="flex items-center space-x-3 text-xs font-bold text-slate-600">
                                <span className="p-1.5 bg-amber-50 rounded-lg text-amber-600"><Heart size={14} /></span>
                                <span>Curated for Luxury Daily Lifestyles</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Auth Form Card */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 animate-in fade-in duration-1000 bg-white">
                    {/* Mobile Logo Only */}
                    <div className="md:hidden mb-8">
                        <Link href="/">
                            <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md text-white">
                                <span className="text-xl font-black font-serif tracking-widest">BS</span>
                            </div>
                        </Link>
                    </div>

                    <div className="w-full max-w-md">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
