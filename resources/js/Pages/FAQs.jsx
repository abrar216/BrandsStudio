import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '../Layouts/StoreLayout';
import { Search, ChevronDown, MessageSquare, ShieldCheck, RefreshCw, Mail } from 'lucide-react';

export default function FAQs() {
    const faqSections = [
        {
            title: "ORDERING & LOGISTICS",
            items: [
                {
                    q: "How do I track the delivery status of my order?",
                    a: "You can track your order in real-time by navigating to our Track Order page in the footer, or visiting `/tracking`. Enter your unique order number (e.g. ORD-12345) to view courier dispatch status, custom packaging stages, and estimated time of arrival on our interactive map."
                },
                {
                    q: "What are your nationwide shipping rates and timelines?",
                    a: "We offer a flat shipping rate of Rs. 250 across all of Pakistan. However, all orders of Rs. 5000 or more qualify for completely free expedited shipping. Orders inside Karachi deliver in 1-2 business days; other major cities take 2-4 business days."
                },
                {
                    q: "Can I modify or cancel my order after placement?",
                    a: "Since we aim to package and dispatch all orders within 24 hours of confirmation, modifications or cancellations must be requested within 2 hours of checkout. Please contact our support team immediately with your order ID."
                }
            ]
        },
        {
            title: "PAYMENTS & SECURITY",
            items: [
                {
                    q: "What payment options are supported at checkout?",
                    a: "We fully support Cash on Delivery (COD) across Pakistan. We also accept direct secure online payments via Stripe (Visa, MasterCard, American Express) and PayPal for fully encrypted digital transactions."
                },
                {
                    q: "Is my personal and credit card information secure?",
                    a: "Absolutely. Brands Studio enforces 256-bit SSL encryption across the entire checkout gateway. We do not store any credit card credentials on our servers; payments are verified and completed securely by our payment partners (Stripe / PayPal)."
                }
            ]
        },
        {
            title: "RETURNS & SIZING",
            items: [
                {
                    q: "What is your return and exchange policy?",
                    a: "We offer an easy 30-day exchange and return policy on all unworn, unwashed garments with original tags attached. If the fit isn't signature, you can register a return from your dashboard and swap it or receive store credit."
                },
                {
                    q: "How do I ensure a perfect fit for tailored silhouettes?",
                    a: "Every product detail page has a unique, detailed size chart matching Pakistani and international dimensions. Since our premium apparel is tailored with modern bespoke fits, we recommend checking the size guidelines before ordering."
                }
            ]
        },
        {
            title: "FABRICS & SUSTAINABILITY",
            items: [
                {
                    q: "What materials and cottons does Brands Studio use?",
                    a: "We formulate our fabrics using premium long-staple organic cottons, combed ringspun fibers, and luxury merino wool blends. We focus entirely on durable, sustainable, and highly breathable textures designed to feel exceptionally premium."
                }
            ]
        }
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [activeItem, setActiveItem] = useState(null);

    const toggleItem = (index) => {
        setActiveItem(activeItem === index ? null : index);
    };

    return (
        <StoreLayout>
            <Head title="FAQs & Customer Support" />

            {/* Premium Header */}
            <div className="bg-stone-100 border-b border-stone-200/60 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                        BRANDS STUDIO ASSISTANCE
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-wide text-slate-900 mt-2">
                        SUPPORT & FAQS
                    </h1>
                    <p className="text-xs text-slate-500 font-medium tracking-wide mt-3 max-w-lg mx-auto leading-relaxed">
                        Find swift answers regarding orders, logistics, premium cotton materials, secure transactions, and general returns.
                    </p>
                </div>
            </div>

            {/* FAQ Accordion List */}
            <div className="max-w-3xl mx-auto px-4 py-16">
                
                <div className="space-y-12">
                    {faqSections.map((section, sIdx) => {
                        // Filter items based on search query
                        const filteredItems = section.items.filter(
                            item => item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    item.a.toLowerCase().includes(searchQuery.toLowerCase())
                        );

                        if (filteredItems.length === 0) return null;

                        return (
                            <div key={sIdx} className="space-y-4">
                                <h3 className="text-xs font-black tracking-widest text-amber-600 border-b border-stone-200 pb-2 uppercase">
                                    {section.title}
                                </h3>
                                
                                <div className="divide-y divide-stone-100 bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm">
                                    {filteredItems.map((item, iIdx) => {
                                        const globalIndex = `${sIdx}-${iIdx}`;
                                        const isOpen = activeItem === globalIndex;
                                        
                                        return (
                                            <div key={iIdx} className="transition-all">
                                                <button
                                                    onClick={() => toggleItem(globalIndex)}
                                                    className="w-full text-left px-6 py-4.5 flex justify-between items-center hover:bg-stone-50/50 transition-colors"
                                                >
                                                    <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide pr-4">
                                                        {item.q}
                                                    </span>
                                                    <ChevronDown 
                                                        size={16} 
                                                        className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-amber-600' : ''}`} 
                                                    />
                                                </button>
                                                
                                                {isOpen && (
                                                    <div className="px-6 pb-6 pt-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                                                            {item.a}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Contact Options */}
                <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-stone-50 border border-stone-200 p-8 rounded-3xl text-center space-y-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto">
                            <Mail size={18} />
                        </div>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-serif">
                            EMAIL ASSISTANCE
                        </h4>
                        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                            Need a custom size advice or having payment concerns? Email us directly.
                        </p>
                        <p className="text-xs font-black text-slate-900 pt-1">
                            support@brandsstudio.pk
                        </p>
                    </div>

                    <div className="bg-stone-50 border border-stone-200 p-8 rounded-3xl text-center space-y-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto">
                            <MessageSquare size={18} />
                        </div>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-serif">
                            LIVE CHAT DESK
                        </h4>
                        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                            Speak with our premium stylist regarding bespoke selections and active tracking.
                        </p>
                        <p className="text-xs font-black text-amber-600 pt-1">
                            Active 10:00 AM - 7:00 PM PKT
                        </p>
                    </div>
                </div>

            </div>
        </StoreLayout>
    );
}
