import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StoreLayout from '../Layouts/StoreLayout';
import { Truck, ShieldCheck, Gift, Clock, MapPin } from 'lucide-react';

export default function ShippingInfo() {
    return (
        <StoreLayout>
            <Head title="Shipping & Delivery Information" />

            {/* Premium Header */}
            <div className="bg-stone-100 border-b border-stone-200/60 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                        BRANDS STUDIO LOGISTICS
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-wide text-slate-900 mt-2">
                        SHIPPING & DELIVERY
                    </h1>
                    <p className="text-xs text-slate-500 font-medium tracking-wide mt-3 max-w-lg mx-auto leading-relaxed">
                        Learn about our premium packaging, dispatch processes, expedited nationwide delivery networks, and flexible shipping options.
                    </p>
                </div>
            </div>

            {/* Content Details */}
            <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
                
                {/* Visual Quick Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-stone-200/80 p-6 rounded-2xl shadow-sm text-center space-y-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto">
                            <Truck size={20} />
                        </div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">STANDARD SHIPPING</h3>
                        <p className="text-xs text-slate-500 font-medium">
                            Flat rate of <span className="font-extrabold text-slate-800">Rs. 250</span> for all orders nationwide.
                        </p>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-6 rounded-2xl shadow-sm text-center space-y-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto">
                            <Gift size={20} />
                        </div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">FREE DELIVERY</h3>
                        <p className="text-xs text-slate-500 font-medium">
                            Completely free expedited shipping on orders over <span className="font-extrabold text-slate-800">Rs. 5000</span>.
                        </p>
                    </div>

                    <div className="bg-white border border-stone-200/80 p-6 rounded-2xl shadow-sm text-center space-y-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto">
                            <Clock size={20} />
                        </div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">TIMELY DISPATCH</h3>
                        <p className="text-xs text-slate-500 font-medium">
                            Orders are dispatched within 24 hours of confirmation.
                        </p>
                    </div>
                </div>

                {/* Detailed Sections */}
                <div className="space-y-8">
                    <div className="border-b border-stone-200 pb-6">
                        <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                            <MapPin size={18} className="text-amber-600" />
                            Nationwide Coverage & Timelines
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed mt-3">
                            All Brands Studio couture garments are packed and shipped directly from our flagship fulfillment hub in Karachi. We work with leading premium courier networks to deliver your tailored apparel securely to your doorstep.
                        </p>
                        
                        <div className="mt-6 overflow-hidden border border-stone-200 rounded-xl bg-white">
                            <table className="min-w-full divide-y divide-stone-200 text-left text-xs">
                                <thead className="bg-stone-50 font-bold uppercase tracking-wider text-slate-600">
                                    <tr>
                                        <th className="px-6 py-4">Destination</th>
                                        <th className="px-6 py-4">Delivery Timeline</th>
                                        <th className="px-6 py-4">Shipping Cost</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 font-semibold text-slate-700">
                                    <tr>
                                        <td className="px-6 py-4">Karachi</td>
                                        <td className="px-6 py-4">1 - 2 Business Days</td>
                                        <td className="px-6 py-4">Rs. 250 (Free over Rs. 5000)</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4">Major Cities (Lahore, Islamabad, etc.)</td>
                                        <td className="px-6 py-4">2 - 4 Business Days</td>
                                        <td className="px-6 py-4">Rs. 250 (Free over Rs. 5000)</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4">Other Nationwide Locations</td>
                                        <td className="px-6 py-4">3 - 5 Business Days</td>
                                        <td className="px-6 py-4">Rs. 250 (Free over Rs. 5000)</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="border-b border-stone-200 pb-6 space-y-3">
                        <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                            <Gift size={18} className="text-amber-600" />
                            Premium Luxury Packaging
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Every garment ordered from Brands Studio is wrapped in protective, custom acid-free tissue paper and shipped in our Signature minimalist rigid matte boxes. We ensure that your tailored apparel arrives pristine, crease-free, and ready to wear.
                        </p>
                    </div>

                    <div className="border-b border-stone-200 pb-6 space-y-3">
                        <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                            <ShieldCheck size={18} className="text-amber-600" />
                            Real-Time Tracking & Verification
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Once your order has been registered and prepared, you will receive an SMS and email containing a unique tracking code. You can monitor the exact shipping stages of your shipment in real-time by visiting our <Link href={route('order.tracking')} className="text-amber-600 hover:text-amber-700 underline font-bold">Order Tracking Portal</Link> or entering your order number on our site.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                            Returns, Exchanges & Damaged Deliveries
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            We pride ourselves on perfection. If your luxury package arrives damaged or does not align with your selected sizes, you can request an exchange or refund within 30 days of purchase. Please refer to our support guidelines or connect with our service representative.
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-stone-50 border border-stone-200 rounded-3xl p-8 text-center space-y-4">
                    <h3 className="text-base font-bold text-slate-800 uppercase tracking-wider font-serif">
                        Still have shipping inquiries?
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed font-semibold">
                        Our premium customer support desk is active 24/7 to resolve any dispatch, tracking, or delivery queries you may have.
                    </p>
                    <div className="pt-2 flex justify-center gap-4">
                        <Link 
                            href={route('faqs')}
                            className="bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md"
                        >
                            VISIT SUPPORT FAQS
                        </Link>
                        <Link 
                            href={route('shop')}
                            className="border border-stone-300 text-slate-700 bg-white hover:bg-stone-50 text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all"
                        >
                            CONTINUE SHOPPING
                        </Link>
                    </div>
                </div>

            </div>
        </StoreLayout>
    );
}
