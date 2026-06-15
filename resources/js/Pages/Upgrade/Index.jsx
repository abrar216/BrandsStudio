import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Check, Zap, Star, Shield, ArrowRight } from 'lucide-react';

export default function Index({ plans, currentSubscription }) {
    const { post, processing } = useForm();

    const upgrade = (planId) => {
        post(route('subscription.store', planId));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Upgrade Account" />

            <div className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-bg min-h-screen">
                <div className="max-w-7xl mx-auto space-y-16">
                    
                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                        <h2 className="text-5xl font-black text-white tracking-tighter">Elevate Your <span className="text-brand-accent italic">Edge</span></h2>
                        <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-sm">Professional tools for elite market performance</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div key={plan.id} className={`glass-dark rounded-[2.5rem] border border-white/5 p-10 flex flex-col transition-all duration-500 hover:-translate-y-2 ${currentSubscription?.plan_id === plan.id ? 'border-brand-accent shadow-2xl shadow-brand-accent/10' : 'hover:border-white/10'}`}>
                                {currentSubscription?.plan_id === plan.id && (
                                    <div className="self-start px-4 py-1.5 bg-brand-accent/10 border border-brand-accent/20 rounded-full mb-6">
                                        <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Active Plan</span>
                                    </div>
                                )}
                                
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-white">${parseFloat(plan.price).toFixed(0)}</span>
                                        <span className="text-sm font-bold text-gray-600 uppercase">/ Month</span>
                                    </div>
                                </div>

                                <div className="mt-8 flex-1 space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="h-5 w-5 rounded-full bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20">
                                                <Check className="w-3 h-3 text-brand-accent" />
                                            </div>
                                            <span className="text-sm font-bold text-gray-400 uppercase tracking-tight">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button 
                                    disabled={processing || currentSubscription?.plan_id === plan.id}
                                    onClick={() => upgrade(plan.id)}
                                    className={`mt-10 w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 ${currentSubscription?.plan_id === plan.id ? 'bg-white/5 text-gray-500 border border-white/5' : 'bg-brand-accent text-brand-bg shadow-xl shadow-brand-accent/20 hover:bg-white hover:text-brand-bg'}`}
                                >
                                    {currentSubscription?.plan_id === plan.id ? 'Current Plan' : (
                                        <>
                                            Upgrade Now <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="max-w-4xl mx-auto glass-dark p-8 rounded-3xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-2xl bg-brand-accent/10 flex items-center justify-center border border-brand-accent/20 rotate-3 group-hover:rotate-0 transition-transform">
                                <Shield className="w-8 h-8 text-brand-accent" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-bold text-white uppercase tracking-tighter">Enterprise Level Security</h4>
                                <p className="text-xs text-gray-500 font-black uppercase tracking-widest">All payments processed via encrypted Stripe gateway</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 border border-white/5 rounded-xl bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest">PCI DSS</div>
                            <div className="px-4 py-2 border border-white/5 rounded-xl bg-white/5 text-[10px] font-black text-gray-500 uppercase tracking-widest">SSL Secure</div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
