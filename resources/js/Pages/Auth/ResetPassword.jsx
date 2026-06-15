import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Mail, Lock } from 'lucide-react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const inputClasses = "block w-full bg-stone-50 border border-stone-200/80 text-slate-800 font-bold focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 focus:bg-white rounded-xl py-3.5 transition-all placeholder:text-stone-400/80 text-sm focus:outline-none hover:border-stone-300";
    const labelClasses = "text-slate-400 text-[10px] font-extrabold uppercase tracking-widest ml-1 mb-2 block";

    return (
        <GuestLayout 
            title="Reset Password"
            subtitle="Choose a secure new password for your Brands Studio account."
        >
            <Head title="Reset Password" />

            {/* Luxury White Form Card Container */}
            <div className="bg-white border border-stone-200/80 p-8 md:p-10 shadow-xl rounded-3xl relative overflow-hidden group">
                
                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <InputLabel htmlFor="email" value="Email Address" className={labelClasses} />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className={inputClasses}
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            icon={Mail}
                            required
                        />
                        <InputError message={errors.email} className="mt-1 text-red-500 text-[10px] font-bold ml-1" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="New Password" className={labelClasses} />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className={inputClasses}
                            autoComplete="new-password"
                            isFocused={true}
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                            icon={Lock}
                            required
                        />
                        <InputError message={errors.password} className="mt-1 text-red-500 text-[10px] font-bold ml-1" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                            className={labelClasses}
                        />
                        <TextInput
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className={inputClasses}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            icon={Lock}
                            required
                        />
                        <InputError
                            message={errors.password_confirmation}
                            className="mt-1 text-red-500 text-[10px] font-bold ml-1"
                        />
                    </div>

                    <div className="pt-6">
                        <PrimaryButton 
                            className="w-full justify-center py-4 bg-slate-900 text-white hover:bg-black transition-all text-xs font-black uppercase tracking-widest rounded-xl shadow-md" 
                            disabled={processing}
                        >
                            Reset Password
                        </PrimaryButton>
                    </div>
                </form>
            </div>

            <p className="mt-8 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-relaxed">
                Brands Studio Secure Portal <br />
                100% Encrypted Premium Shopping Connection
            </p>
        </GuestLayout>
    );
}
