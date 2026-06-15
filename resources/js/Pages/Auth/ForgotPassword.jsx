import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    const inputClasses = "block w-full bg-stone-50 border border-stone-200/80 text-slate-800 font-bold focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 focus:bg-white rounded-xl py-3.5 transition-all placeholder:text-stone-400/80 text-sm focus:outline-none hover:border-stone-300";
    const labelClasses = "text-slate-400 text-[10px] font-extrabold uppercase tracking-widest ml-1 mb-2 block";

    return (
        <GuestLayout 
            title="Recover Password"
            subtitle="Request a secure password reset link for your Brands Studio account."
        >
            <Head title="Forgot Password" />

            {/* Luxury White Form Card Container */}
            <div className="bg-white border border-stone-200/80 p-8 md:p-10 shadow-xl rounded-3xl relative overflow-hidden group">
                
                <div className="mb-8 p-6 bg-stone-50 border border-stone-100 rounded-2xl">
                    <p className="text-[10px] leading-relaxed text-slate-400 font-extrabold uppercase tracking-widest">
                        Forgot your password? No problem. Just let us know your email address and we will email you a password reset link to establish a new one.
                    </p>
                </div>

                {status && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                            {status}
                        </p>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" className={labelClasses} />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className={inputClasses}
                            isFocused={true}
                            placeholder="yourname@domain.com"
                            onChange={(e) => setData('email', e.target.value)}
                            icon={Mail}
                            required
                        />
                        <InputError message={errors.email} className="mt-1 text-red-500 text-[10px] font-bold ml-1" />
                    </div>

                    <div className="pt-4">
                        <PrimaryButton 
                            className="w-full justify-center py-4 bg-slate-900 text-white hover:bg-black transition-all text-xs font-black uppercase tracking-widest rounded-xl shadow-md" 
                            disabled={processing}
                        >
                            Email Password Reset Link
                        </PrimaryButton>
                    </div>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-slate-100">
                    <Link
                        href={route('login')}
                        className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        ← Return to Login
                    </Link>
                </div>
            </div>

            <p className="mt-8 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-relaxed">
                Brands Studio Secure Portal <br />
                100% Encrypted Premium Shopping Connection
            </p>
        </GuestLayout>
    );
}
