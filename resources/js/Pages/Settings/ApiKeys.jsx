import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Key, Plus, Trash2, ShieldCheck, AlertCircle, Server } from 'lucide-react';

export default function ApiKeys({ apiKeys }) {
    const { data, setData, post, delete: destroy, processing, errors, reset } = useForm({
        exchange: 'Habib Bank Limited (HBL)',
        label: '',
        api_key: '',
        api_secret: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('api.store'), {
            onSuccess: () => reset(),
        });
    };

    const removeKey = (id) => {
        if (confirm('Are you sure you want to remove this API key? This will disable live trading for this exchange.')) {
            destroy(route('api.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="API Management" />

            <div className="py-12 px-4 sm:px-6 lg:px-8 bg-brand-bg min-h-screen">
                <div className="max-w-4xl mx-auto space-y-8">
                    
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-black text-white tracking-tighter">Bank <span className="text-brand-accent italic">Connectivity</span></h2>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Link your local bank account for seamless stock purchases</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        
                        {/* Status Card */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="glass-dark p-6 rounded-3xl border border-white/5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-brand-accent" />
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Security Note</h3>
                                </div>
                                <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase">
                                    Your sensitive data is encrypted using 256-bit protocols. TradeX only requires "Transaction Authorization" permissions to execute orders.
                                </p>
                            </div>

                            <div className="glass-dark p-6 rounded-3xl border border-white/5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Server className="w-5 h-5 text-brand-accent" />
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Active Nodes</h3>
                                </div>
                                <div className="space-y-3">
                                    {apiKeys.length === 0 ? (
                                        <p className="text-[10px] text-gray-600 font-black uppercase italic">No active connections</p>
                                    ) : apiKeys.map(key => (
                                        <div key={key.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-white uppercase">{key.exchange}</span>
                                                <span className="text-[9px] text-brand-accent font-black uppercase tracking-tighter">Online</span>
                                            </div>
                                            <button onClick={() => removeKey(key.id)} className="p-2 text-gray-600 hover:text-brand-danger transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Form Card */}
                        <div className="md:col-span-2">
                            <form onSubmit={submit} className="glass-dark p-8 rounded-3xl border border-white/5 space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Plus className="w-6 h-6 text-brand-accent" />
                                    <h3 className="text-xl font-bold text-white">Link New Bank Account</h3>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Bank Name</label>
                                        <select 
                                            value={data.exchange}
                                            onChange={e => setData('exchange', e.target.value)}
                                            className="w-full bg-brand-bg/50 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold focus:ring-1 focus:ring-brand-accent focus:border-brand-accent transition-all"
                                        >
                                            <option>Habib Bank Limited (HBL)</option>
                                            <option>United Bank Limited (UBL)</option>
                                            <option>MCB Bank</option>
                                            <option>Meezan Bank</option>
                                            <option>Standard Chartered</option>
                                            <option>Bank Alfalah</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Label (Optional)</label>
                                        <input 
                                            placeholder="e.g. Savings Primary"
                                            value={data.label}
                                            onChange={e => setData('label', e.target.value)}
                                            className="w-full bg-brand-bg/50 border border-white/10 rounded-2xl px-4 py-4 text-white font-bold focus:ring-1 focus:ring-brand-accent focus:border-brand-accent transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Account Number / IBAN</label>
                                    <div className="relative">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input 
                                            type="text"
                                            value={data.api_key}
                                            onChange={e => setData('api_key', e.target.value)}
                                            className="w-full bg-brand-bg/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-mono text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent transition-all"
                                        />
                                    </div>
                                    {errors.api_key && <p className="text-brand-danger text-[10px] font-bold mt-1 px-1">{errors.api_key}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1">Account PIN / Secret Key</label>
                                    <div className="relative">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input 
                                            type="password"
                                            value={data.api_secret}
                                            onChange={e => setData('api_secret', e.target.value)}
                                            className="w-full bg-brand-bg/50 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-mono text-sm focus:ring-1 focus:ring-brand-accent focus:border-brand-accent transition-all"
                                        />
                                    </div>
                                    {errors.api_secret && <p className="text-brand-danger text-[10px] font-bold mt-1 px-1">{errors.api_secret}</p>}
                                </div>

                                <button 
                                    disabled={processing}
                                    className="w-full py-5 bg-brand-accent text-brand-bg rounded-2xl font-black uppercase tracking-widest text-sm transition-all shadow-xl shadow-brand-accent/20 hover:bg-brand-accent/90 active:scale-95 disabled:opacity-50"
                                >
                                    {processing ? 'Establishing Connection...' : 'Initialize Connection'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
