import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Lock } from 'lucide-react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    const inputClasses = "block w-full bg-stone-50 border border-stone-200/80 text-slate-800 font-bold focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:bg-white rounded-xl py-3.5 transition-all placeholder:text-stone-400/80 text-sm focus:outline-none hover:border-stone-300";
    const labelClasses = "text-slate-400 text-[10px] font-extrabold uppercase tracking-widest ml-1 mb-2 block";

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-black text-red-650 uppercase tracking-wider">
                    Delete Account
                </h2>
                <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                    Permanently delete your Brands Studio account. All of your saved favorites, curations, and personal records will be permanently erased.
                </p>
            </header>

            <DangerButton 
                onClick={confirmUserDeletion}
                className="bg-red-600 hover:bg-red-700 hover:shadow-lg focus:ring-red-600/20 text-white font-bold text-xs uppercase tracking-widest rounded-xl py-3.5 px-6"
            >
                Delete Account
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-8 bg-white text-slate-800 space-y-6 rounded-3xl">
                    <div className="space-y-2">
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-wide">
                            Delete Account Permanently
                        </h2>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Are you absolutely sure you want to delete your account? This action is irreversible. Please enter your password to confirm deletion.
                        </p>
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className={inputClasses}
                            isFocused
                            placeholder="Confirm with your password"
                            icon={Lock}
                        />
                        <InputError
                            message={errors.password}
                            className="mt-1 text-red-500 text-[10px] font-bold ml-1"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <SecondaryButton 
                            onClick={closeModal}
                            className="bg-stone-100 hover:bg-stone-200 text-slate-700 font-extrabold text-xs uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all"
                        >
                            Cancel
                        </SecondaryButton>
                        <DangerButton 
                            type="submit"
                            disabled={processing}
                            className="bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest py-3.5 px-6 rounded-xl transition-all shadow-md"
                        >
                            Confirm Delete
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
