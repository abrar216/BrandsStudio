import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import StoreLayout from '../Layouts/StoreLayout';
import { CheckCircle, Printer, ArrowRight } from 'lucide-react';

export default function OrderSuccess({ order, currency: propCurrency }) {
    const { props } = usePage();
    const currency = propCurrency || props.settings?.currency || 'Rs.';

    const handlePrint = () => {
        window.print();
    };

    return (
        <StoreLayout>
            <Head title="Order Placed Successfully" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 print:py-0">
                
                {/* Visual success Header */}
                <div className="text-center space-y-4 mb-16 print:hidden">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
                        <CheckCircle size={32} />
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest bg-emerald-50 px-4 py-1.5 rounded-full">
                        TRANSACTION COMPLETED
                    </span>
                    <h1 className="text-3xl font-black font-serif text-slate-800 uppercase tracking-wide">
                        THANK YOU FOR YOUR PURCHASE!
                    </h1>
                    <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                        Your order has been placed. We have sent a confirmation invoice and shipment tracking credentials to <span className="font-extrabold text-slate-800">{order.customer_email}</span>.
                    </p>
                </div>

                {/* Print Invoice Card layout */}
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-md space-y-8 print:border-0 print:shadow-none print:p-0">
                    
                    {/* Invoice header metadata */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b border-slate-100 gap-4">
                        <div>
                            <h2 className="text-lg font-black font-serif tracking-widest text-slate-900">BRANDS STUDIO</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PREMIUM COUTURE LABEL</p>
                        </div>
                        <div className="text-left sm:text-right text-xs font-bold text-slate-650 space-y-0.5">
                            <p>INVOICE NO: <span className="text-slate-900 font-black">{order.order_number}</span></p>
                            <p>DATE: <span className="text-slate-900">{new Date(order.created_at).toLocaleDateString()}</span></p>
                            <p>STATUS: <span className="text-emerald-600 uppercase font-black">{order.status}</span></p>
                        </div>
                    </div>

                    {/* Customer details info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs font-semibold text-slate-650">
                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">SHIPPED TO</h4>
                            <p className="text-slate-900 font-extrabold">{order.customer_name}</p>
                            <p>{order.customer_phone}</p>
                            <p className="leading-relaxed whitespace-pre-line">{order.shipping_address}</p>
                        </div>

                        <div className="space-y-1">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">PAYMENT METADATA</h4>
                            <p>Method: <span className="text-slate-900 font-extrabold uppercase">{order.payment_method}</span></p>
                            <p>Status: <span className="text-slate-900 font-extrabold uppercase">{order.payment_status}</span></p>
                            <p>Est. Delivery: <span className="text-slate-900 font-extrabold">{order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleDateString() : 'N/A'}</span></p>
                        </div>
                    </div>

                    {/* Itemized list of items */}
                    <div className="border-t border-b border-slate-100 py-6">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-4">ORDERED ITEMS</h4>
                        
                        <div className="space-y-4">
                            {order.items?.map((item) => (
                                <div key={item.id} className="flex justify-between items-center text-xs">
                                    <div className="space-y-0.5">
                                        <p className="text-slate-900 font-extrabold uppercase">{item.product?.name}</p>
                                        <div className="flex space-x-2 text-[10px] font-black uppercase text-slate-400">
                                            {item.variant?.color && <span>Color: {item.variant.color}</span>}
                                            {item.variant?.color && item.variant?.size && <span>•</span>}
                                            {item.variant?.size && <span>Size: {item.variant.size}</span>}
                                            <span>• SKU: {item.variant?.sku || item.product?.sku}</span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-slate-900 font-black">
                                            {currency}{Number(item.total).toFixed(2)}
                                        </p>
                                        <p className="text-[10px] text-slate-400 font-bold">
                                            {item.quantity} x {currency}{Number(item.price).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Invoice Aggregates */}
                    <div className="flex justify-end pt-4">
                        <div className="w-full sm:w-64 space-y-3.5 text-xs font-semibold text-slate-650">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-slate-900 font-bold">{currency}{Number(order.subtotal).toFixed(2)}</span>
                            </div>

                            {Number(order.discount) > 0 && (
                                <div className="flex justify-between text-emerald-600">
                                    <span>Coupon Discount</span>
                                    <span>-{currency}{Number(order.discount).toFixed(2)}</span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span>Shipping & Handling</span>
                                <span className="text-slate-900 font-bold">
                                    {Number(order.shipping_charges) === 0 ? (
                                        <span className="text-emerald-600 font-bold uppercase">FREE</span>
                                    ) : (
                                        `${currency}${Number(order.shipping_charges).toFixed(2)}`
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>Estimated GST Tax</span>
                                <span className="text-slate-900 font-bold">{currency}{Number(order.tax).toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between text-sm font-black text-slate-955 border-t border-slate-100 pt-4">
                                <span className="font-serif">INVOICE TOTAL</span>
                                <span className="font-serif">{currency}{Number(order.total).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Print/Continue Shopping Buttons */}
                <div className="flex justify-between items-center mt-12 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black px-6 py-3.5 rounded-xl transition-all shadow-sm flex items-center space-x-2 focus:outline-none uppercase"
                    >
                        <Printer size={14} />
                        <span>PRINT INVOICE RECEIPT</span>
                    </button>

                    <Link
                        href={route('welcome')}
                        className="bg-slate-900 hover:bg-black text-white text-xs font-black px-8 py-3.5 rounded-xl transition-all shadow-md flex items-center space-x-2 uppercase"
                    >
                        <span>CONTINUE SHOPPING</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

            </div>
        </StoreLayout>
    );
}
