import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout 
            title="Verify Email Address"
            subtitle="Please verify your email to activate all premium checkout benefits."
        >
            <Head title="Email Verification" />

            {/* Luxury White Form Card Container */}
            <div className="bg-white border border-stone-200/80 p-8 md:p-10 shadow-xl rounded-3xl relative overflow-hidden group">
                
                <div className="mb-8 p-6 bg-stone-50 border border-stone-100 rounded-2xl">
                    <p className="text-[10px] leading-relaxed text-slate-400 font-extrabold uppercase tracking-widest">
                        Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">
                            A new verification link has been sent to the email address you provided during registration.
                        </p>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div className="pt-2">
                        <PrimaryButton 
                            className="w-full justify-center py-4 bg-slate-900 text-white hover:bg-black transition-all text-xs font-black uppercase tracking-widest rounded-xl shadow-md" 
                            disabled={processing}
                        >
                            Resend Verification Email
                        </PrimaryButton>
                    </div>
                </form>

                <div className="mt-8 flex items-center justify-center pt-6 border-t border-slate-100">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-[10px] font-extrabold uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors"
                    >
                        Log Out
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
