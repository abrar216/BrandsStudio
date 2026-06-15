import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            two_factor_enabled: user.two_factor_enabled,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const inputClasses = "block w-full bg-stone-50 border border-stone-200/80 text-slate-800 font-bold focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 focus:bg-white rounded-xl py-3.5 transition-all placeholder:text-stone-400/80 text-sm focus:outline-none hover:border-stone-300";
    const labelClasses = "text-slate-400 text-[10px] font-extrabold uppercase tracking-widest ml-1 mb-2 block";

    return (
        <section className={className}>
            <header className="mb-8">
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-wider">
                    Client Information
                </h2>
                <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Update your client profile details and contact email address.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" className={labelClasses} />
                    <TextInput
                        id="name"
                        className={inputClasses}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-1 text-red-500 text-[10px] font-bold ml-1" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className={labelClasses} />
                    <TextInput
                        id="email"
                        type="email"
                        className={inputClasses}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-1 text-red-500 text-[10px] font-bold ml-1" message={errors.email} />
                </div>

                {/* 2FA Card Custom Luxury Styling */}
                <div className="flex flex-col gap-2 p-5 bg-stone-50 rounded-2xl border border-stone-200/60">
                    <div className="flex items-center justify-between">
                        <div className="pr-4">
                            <InputLabel htmlFor="two_factor_enabled" value="Two-Factor Authentication" className="text-slate-800 font-extrabold text-xs tracking-wide uppercase" />
                            <p className="text-[11px] text-slate-400 mt-1 font-medium leading-relaxed">
                                Add an additional layer of luxury security verification to guard your Atelier transactions.
                            </p>
                        </div>
                        <div className="flex items-center flex-shrink-0">
                            <input
                                type="checkbox"
                                id="two_factor_enabled"
                                checked={data.two_factor_enabled}
                                onChange={(e) => setData('two_factor_enabled', e.target.checked)}
                                className="sr-only peer"
                            />
                            <label
                                htmlFor="two_factor_enabled"
                                className="relative inline-flex items-center cursor-pointer w-12 h-6 bg-slate-200 rounded-full transition-colors peer-checked:bg-amber-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6 shadow-inner"
                            ></label>
                        </div>
                    </div>
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-semibold">
                        <p>
                            Your email address is unverified.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="underline hover:text-amber-700 transition-colors font-bold"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-emerald-700 font-bold">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton 
                        disabled={processing}
                        className="bg-slate-900 text-white hover:bg-black transition-all text-xs font-black uppercase tracking-widest rounded-xl shadow-md py-3.5 px-8"
                    >
                        Save Details
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 translate-y-1"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest">
                            Changes saved successfully.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
