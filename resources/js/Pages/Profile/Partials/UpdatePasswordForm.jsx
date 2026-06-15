import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    const inputClasses = "block w-full bg-stone-50 border border-stone-200/80 text-slate-800 font-bold focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 focus:bg-white rounded-xl py-3.5 transition-all placeholder:text-stone-400/80 text-sm focus:outline-none hover:border-stone-300";
    const labelClasses = "text-slate-400 text-[10px] font-extrabold uppercase tracking-widest ml-1 mb-2 block";

    return (
        <section className={className}>
            <header className="mb-8">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                    Update Password
                </h2>
                <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Ensure your account is utilizing a secure, long password to keep your personal data protected.
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-6">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Current Password"
                        className={labelClasses}
                    />
                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className={inputClasses}
                        autoComplete="current-password"
                    />
                    <InputError
                        message={errors.current_password}
                        className="mt-1 text-red-500 text-[10px] font-bold ml-1"
                    />
                </div>

                <div>
                    <InputLabel 
                        htmlFor="password" 
                        value="New Password" 
                        className={labelClasses}
                    />
                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className={inputClasses}
                        autoComplete="new-password"
                    />
                    <InputError 
                        message={errors.password} 
                        className="mt-1 text-red-500 text-[10px] font-bold ml-1" 
                    />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className={labelClasses}
                    />
                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className={inputClasses}
                        autoComplete="new-password"
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1 text-red-500 text-[10px] font-bold ml-1"
                    />
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton 
                        disabled={processing}
                        className="bg-slate-900 text-white hover:bg-black transition-all text-xs font-black uppercase tracking-widest rounded-xl shadow-md py-3.5 px-8"
                    >
                        Save Password
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-y-1"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">
                            Password updated successfully.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
