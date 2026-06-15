import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { User, Shield, ShieldOff, Mail, Calendar, Search, Edit3, Wallet, X } from 'lucide-react';
import { useState } from 'react';
import Modal from '@/Components/Dropdown'; // Wait, usually Modal is its own thing. I'll use a local state for now or check Modal.jsx structure.
// Actually I'll check Modal.jsx structure first.
import MyModal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ auth, users }) {
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    const { data, setData, patch, processing, errors, reset } = useForm({
        name: '',
        email: '',
        balance: 0,
        is_admin: false,
    });

    const toggleAdmin = (userId) => {
        if (confirm('Are you sure you want to change this user\'s admin status?')) {
            router.post(route('admin.users.toggle-admin', userId));
        }
    };

    const startEdit = (user) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            balance: user.balance,
            is_admin: user.is_admin ? true : false,
        });
    };

    const submitUpdate = (e) => {
        e.preventDefault();
        patch(route('admin.users.update', editingUser.id), {
            onSuccess: () => {
                setEditingUser(null);
                reset();
            },
        });
    };

    const filteredUsers = users.data.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) || 
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(val);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-white leading-tight">User Management</h2>}
        >
            <Head title="Admin - User Management" />

            <div className="py-12 bg-brand-bg min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tighter">User Management</h1>
                            <p className="text-gray-500 font-medium">Manage platform users and administrative privileges.</p>
                        </div>
                        
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search users..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-white/5 border-white/10 text-white pl-10 pr-4 py-3 rounded-2xl focus:border-brand-accent focus:ring-4 focus:ring-brand-accent/10 w-full md:w-80 transition-all"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        </div>
                    </div>

                    {/* Users Table */}
                    <div className="glass-card border border-white/5 rounded-[32px] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.02]">
                                    <th className="px-6 py-5 text-[10px] font-black text-white/40 uppercase tracking-[2px]">User</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-white/40 uppercase tracking-[2px]">Role</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-white/40 uppercase tracking-[2px]">Balance</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-white/40 uppercase tracking-[2px]">Joined</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-white/40 uppercase tracking-[2px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-gradient-gold flex items-center justify-center text-white font-black text-lg shadow-lg">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-white group-hover:text-brand-accent transition-colors">{user.name}</div>
                                                    <div className="text-[11px] text-white/40 flex items-center gap-1.5 font-bold uppercase tracking-wider mt-0.5">
                                                        <Mail size={12} className="text-brand-accent" /> {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                                user.is_admin 
                                                ? 'bg-brand-accent/20 text-brand-accent border border-brand-accent/20' 
                                                : 'bg-white/5 text-white/40 border border-white/5'
                                            }`}>
                                                {user.is_admin ? <Shield size={12} /> : <User size={12} />}
                                                {user.is_admin ? 'Admin' : 'Trader'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <Wallet size={14} className="text-brand-emerald" />
                                                <span className="text-sm font-black text-brand-emerald">{formatCurrency(user.balance)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-[11px] text-white/40 flex items-center gap-2 font-black uppercase tracking-widest">
                                                <Calendar size={14} className="text-white/20" />
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => startEdit(user)}
                                                    className="p-2.5 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-white/5"
                                                    title="Edit User"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                {user.id !== auth.user.id && (
                                                    <button 
                                                        onClick={() => toggleAdmin(user.id)}
                                                        className={`p-2.5 rounded-xl transition-all border ${
                                                            user.is_admin 
                                                            ? 'bg-brand-danger/10 text-brand-danger border-brand-danger/20 hover:bg-brand-danger/20' 
                                                            : 'bg-brand-accent/10 text-brand-accent border-brand-accent/20 hover:bg-brand-accent/20'
                                                        }`}
                                                        title={user.is_admin ? 'Remove Admin' : 'Make Admin'}
                                                    >
                                                        {user.is_admin ? <ShieldOff size={18} /> : <Shield size={18} />}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {/* Empty State */}
                        {filteredUsers.length === 0 && (
                            <div className="py-24 text-center">
                                <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/5 text-white/20 mb-6 border border-white/5">
                                    <Search size={32} />
                                </div>
                                <h3 className="text-xl font-black text-white mb-2">No users found</h3>
                                <p className="text-white/40 text-sm font-medium">Try adjusting your search query.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit User Modal */}
            <MyModal show={!!editingUser} onClose={() => setEditingUser(null)}>
                <div className="p-8 bg-[#0f1d18] border border-white/10 rounded-[32px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6">
                        <button onClick={() => setEditingUser(null)} className="text-white/20 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-12 w-12 bg-brand-accent/20 rounded-2xl flex items-center justify-center text-brand-accent">
                            <Edit3 size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Edit Customer</h2>
                            <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Update account details for {editingUser?.name}</p>
                        </div>
                    </div>

                    <form onSubmit={submitUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <InputLabel htmlFor="name" value="Full Name" className="text-white/40 uppercase tracking-widest text-[10px] font-black" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full bg-white/5 border-white/10 text-white rounded-xl focus:ring-brand-accent focus:border-brand-accent h-12"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="space-y-2">
                                <InputLabel htmlFor="email" value="Email Address" className="text-white/40 uppercase tracking-widest text-[10px] font-black" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full bg-white/5 border-white/10 text-white rounded-xl focus:ring-brand-accent focus:border-brand-accent h-12"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="space-y-2">
                                <InputLabel htmlFor="balance" value="Virtual Balance (USD)" className="text-white/40 uppercase tracking-widest text-[10px] font-black" />
                                <TextInput
                                    id="balance"
                                    type="number"
                                    step="0.01"
                                    className="mt-1 block w-full bg-white/5 border-white/10 text-white rounded-xl focus:ring-brand-emerald focus:border-brand-emerald h-12"
                                    value={data.balance}
                                    onChange={(e) => setData('balance', e.target.value)}
                                    required
                                />
                                <InputError message={errors.balance} className="mt-2" />
                            </div>

                            <div className="space-y-2">
                                <InputLabel value="Access Level" className="text-white/40 uppercase tracking-widest text-[10px] font-black" />
                                <div className="flex gap-4 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setData('is_admin', false)}
                                        className={`flex-1 py-3 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${!data.is_admin ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/20'}`}
                                    >
                                        Trader User
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData('is_admin', true)}
                                        className={`flex-1 py-3 px-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${data.is_admin ? 'bg-brand-accent/20 border-brand-accent/30 text-brand-accent' : 'bg-transparent border-white/5 text-white/20'}`}
                                    >
                                        Platform Admin
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/5">
                            <SecondaryButton onClick={() => setEditingUser(null)} className="!bg-transparent !border-white/10 !text-white/40 hover:!text-white h-12 px-8 !rounded-xl !uppercase !text-[10px] !font-black !tracking-widest">
                                Cancel
                            </SecondaryButton>
                            <PrimaryButton className="!bg-brand-accent !px-10 h-12 !rounded-xl !uppercase !text-[10px] !font-black !tracking-widest shadow-soft shadow-brand-accent/20" disabled={processing}>
                                Save Changes
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </MyModal>
        </AuthenticatedLayout>
    );
}
