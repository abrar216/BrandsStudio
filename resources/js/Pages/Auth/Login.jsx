import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn, UserPlus, Info, User } from 'lucide-react';

export default function Login({ status, canResetPassword, initialMode = 'login' }) {
    const [mode, setMode] = useState(initialMode);
    
    // Parse redirect query parameter from URL
    const queryParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const redirectParam = queryParams ? queryParams.get('redirect') : '';

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'candidate',
        remember: false,
        redirect: redirectParam || '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Sync mode if initialMode changes
    useEffect(() => {
        setMode(initialMode);
        clearErrors();
    }, [initialMode]);

    const submit = (e) => {
        e.preventDefault();

        if (mode === 'login') {
            post(route('login'), {
                onFinish: () => reset('password'),
            });
        } else {
            post(route('register'), {
                onFinish: () => reset('password', 'password_confirmation'),
            });
        }
    };

    const toggleMode = (newMode) => {
        setMode(newMode);
        clearErrors();
    };

    const inputClasses = "block w-full bg-stone-50 border border-stone-200/80 text-slate-800 font-bold focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 focus:bg-white rounded-xl py-3.5 transition-all placeholder:text-stone-400/80 text-sm focus:outline-none hover:border-stone-300";
    const labelClasses = "text-slate-400 text-[10px] font-extrabold uppercase tracking-widest ml-1 mb-2 block";

    return (
        <GuestLayout 
            title={mode === 'login' ? "Welcome Back" : "Create Account"}
            subtitle={mode === 'login' ? "Log in to your Brands Studio account to continue shopping." : "Register to access order tracking, faster checkout, and exclusive updates."}
        >
            <Head title={mode === 'login' ? 'Log in' : 'Register'} />

            {/* Luxury White Form Card Container */}
            <div className="bg-white border border-stone-200/80 p-8 md:p-10 shadow-xl rounded-3xl relative overflow-hidden group">
                
                {status && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-start space-x-3 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-300">
                        <Info size={16} className="mt-0.5 text-emerald-600 flex-shrink-0" />
                        <span>{status}</span>
                    </div>
                )}

                {/* Tabs Header */}
                <div className="flex border-b border-slate-100 mb-8 relative">
                    <button
                        type="button"
                        onClick={() => toggleMode('login')}
                        className={`flex-1 py-4 text-sm font-black tracking-widest transition-all relative z-10 uppercase ${
                            mode === 'login' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        Log In
                        {mode === 'login' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 animate-in fade-in slide-in-from-left-4 duration-300"></div>}
                    </button>
                    <button
                        type="button"
                        onClick={() => toggleMode('register')}
                        className={`flex-1 py-4 text-sm font-black tracking-widest transition-all relative z-10 uppercase ${
                            mode === 'register' ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                    >
                        Sign Up
                        {mode === 'register' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-500 animate-in fade-in slide-in-from-right-4 duration-300"></div>}
                    </button>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {mode === 'login' ? (
                        /* Login Tab Content */
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="space-y-5">
                                <div>
                                    <InputLabel htmlFor="email" value="Email Address" className={labelClasses} />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className={inputClasses}
                                        autoComplete="username"
                                        placeholder="yourname@domain.com"
                                        isFocused={mode === 'login'}
                                        onChange={(e) => setData('email', e.target.value)}
                                        icon={Mail}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-1 text-red-500 text-[10px] font-bold ml-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password" value="Password" className={labelClasses} />
                                    <div className="relative">
                                        <TextInput
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            className={inputClasses + " pr-12"}
                                            autoComplete="current-password"
                                            placeholder="••••••••"
                                            onChange={(e) => setData('password', e.target.value)}
                                            icon={Lock}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-1 text-red-500 text-[10px] font-bold ml-1" />
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <label className="flex items-center cursor-pointer group">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            className="h-4 w-4 rounded border-slate-200 text-amber-500 focus:ring-amber-500/20"
                                            onChange={(e) => setData('remember', e.target.checked)}
                                        />
                                        <span className="ms-3 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">
                                            Remember Me
                                        </span>
                                    </label>
                                </div>

                                <div className="pt-4">
                                    <PrimaryButton 
                                        className="w-full justify-center py-4 bg-slate-900 text-white hover:bg-black transition-all text-xs font-black uppercase tracking-widest rounded-xl shadow-md" 
                                        disabled={processing}
                                    >
                                        Log In
                                    </PrimaryButton>
                                    
                                    {canResetPassword && (
                                        <div className="text-center mt-6">
                                            <Link
                                                href={route('password.request')}
                                                className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                Forgot Password?
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Register Tab Content */
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="first_name" value="First Name" className={labelClasses} />
                                        <TextInput
                                            id="first_name"
                                            name="first_name"
                                            value={data.first_name}
                                            className={inputClasses}
                                            placeholder="John"
                                            onChange={(e) => setData('first_name', e.target.value)}
                                            icon={User}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="last_name" value="Last Name" className={labelClasses} />
                                        <TextInput
                                            id="last_name"
                                            name="last_name"
                                            value={data.last_name}
                                            className={inputClasses}
                                            placeholder="Doe"
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            icon={User}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Email Address" className={labelClasses} />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className={inputClasses}
                                        autoComplete="username"
                                        placeholder="johndoe@domain.com"
                                        onChange={(e) => setData('email', e.target.value)}
                                        icon={Mail}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-1 text-red-500 text-[10px] font-bold ml-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password" value="Create Password" className={labelClasses} />
                                    <div className="relative">
                                        <TextInput
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            value={data.password}
                                            className={inputClasses + " pr-12"}
                                            autoComplete="new-password"
                                            placeholder="••••••••"
                                            onChange={(e) => setData('password', e.target.value)}
                                            icon={Lock}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <InputError message={errors.password} className="mt-1 text-red-500 text-[10px] font-bold ml-1" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className={labelClasses} />
                                    <div className="relative">
                                        <TextInput
                                            id="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className={inputClasses + " pr-12"}
                                            autoComplete="new-password"
                                            placeholder="••••••••"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            icon={Lock}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <PrimaryButton 
                                        className="w-full justify-center py-4 bg-slate-900 text-white hover:bg-black transition-all text-xs font-black uppercase tracking-widest rounded-xl shadow-md" 
                                        disabled={processing}
                                    >
                                        Create Account
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    )}
                </form>

                {/* Footer Link */}
                <div className="mt-10 text-center">
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        {mode === 'login' ? "New shopping customer?" : "Already have an account?"}{' '}
                        <button 
                            type="button"
                            onClick={() => toggleMode(mode === 'login' ? 'register' : 'login')}
                            className="text-amber-600 hover:text-amber-700 transition-colors ml-1 font-black underline"
                        >
                            {mode === 'login' ? "Register here" : "Log In"}
                        </button>
                    </p>
                </div>
            </div>

            <p className="mt-8 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-relaxed">
                Brands Studio Secure Portal <br />
                100% Encrypted Premium Shopping Connection
            </p>
        </GuestLayout>
    );
}
