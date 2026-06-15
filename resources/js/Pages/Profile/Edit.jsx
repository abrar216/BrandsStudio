import React from 'react';
import { Head } from '@inertiajs/react';
import StoreLayout from '@/Layouts/StoreLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <StoreLayout>
            <Head title="Client Settings - Brands Studio" />

            {/* Header Banner */}
            <div className="bg-stone-50 border-b border-slate-200/60 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                    <span className="text-[10px] font-black uppercase text-amber-600 tracking-[3px] bg-amber-50 px-4 py-1.5 rounded-full inline-block">
                        CLIENT ACCOUNT PREFERENCES
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-black font-serif tracking-wide text-slate-900 uppercase">
                        PROFILE SETTINGS
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide max-w-md mx-auto">
                        Manage your Atelier identity credentials, security passcodes, and control personal account visibility options.
                    </p>
                </div>
            </div>

            {/* Form Panels Container */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
                
                {/* Profile Info Form Panel */}
                <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
                    <div className="max-w-xl">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>
                </div>

                {/* Password Update Form Panel */}
                <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
                    <div className="max-w-xl">
                        <UpdatePasswordForm />
                    </div>
                </div>

                {/* Account Deletion Panel */}
                <div className="bg-white border border-red-100 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
                    <div className="max-w-xl">
                        <DeleteUserForm />
                    </div>
                </div>

            </div>
        </StoreLayout>
    );
}
