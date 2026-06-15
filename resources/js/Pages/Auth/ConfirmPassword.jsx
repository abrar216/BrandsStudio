import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Lock } from 'lucide-react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    const inputClasses = "block w-full bg-stone-50 border border-stone-200/80 text-slate-800 font-bold focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 focus:bg-white rounded-xl py-3.5 transition-all placeholder:text-stone-400/80 text-sm focus:outline-none hover:border-stone-300";
    const labelClasses = "text-slate-400 text-[10px] font-extrabold uppercase tracking-widest ml-1 mb-2 block";

    return (
        <GuestLayout 
            title="Confirm Password"
            subtitle="Please confirm your password to verify your secure session."
        >
            <Head title="Confirm Password" />

            {/* Luxury White Form Card Container */}
            <div className="bg-white border border-stone-200/80 p-8 md:p-10 shadow-xl rounded-3xl relative overflow-hidden group">
                
                <div className="mb-8 p-6 bg-stone-50 border border-stone-100 rounded-2xl">
                    <p className="text-[10px] leading-relaxed text-slate-400 font-extrabold uppercase tracking-widest">
                        This is a secure area of the application. Please confirm your password before proceeding further.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="password" value="Password" className={labelClasses} />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className={inputClasses}
                            isFocused={true}
                            placeholder="••••••••"
                            onChange={(e) => setData('password', e.target.value)}
                            icon={Lock}
                            required
                        />
                        <InputError message={errors.password} className="mt-2 text-red-500 text-[10px] font-bold ml-1" />
                    </div>

                    <div className="pt-4">
                        <PrimaryButton 
                            className="w-full justify-center py-4 bg-slate-900 text-white hover:bg-black transition-all text-xs font-black uppercase tracking-widest rounded-xl shadow-md" 
                            disabled={processing}
                        >
                            Confirm Password
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
