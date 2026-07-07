import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    X, 
    Tag, 
    Calendar,
    CheckCircle,
    XCircle,
    Search,
    Percent
} from 'lucide-react';

export default function Coupons({ coupons = [] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    // Create Coupon Form
    const createForm = useForm({
        code: '',
        type: 'percentage',
        value: '',
        start_date: '',
        end_date: '',
        active: true
    });

    // Edit Coupon Form
    const editForm = useForm({
        code: '',
        type: 'percentage',
        value: '',
        start_date: '',
        end_date: '',
        active: true
    });

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createForm.post(route('admin.coupons.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            }
        });
    };

    const handleEditClick = (coupon) => {
        setEditingCoupon(coupon);
        editForm.setData({
            code: coupon.code,
            type: coupon.type,
            value: String(coupon.value),
            start_date: coupon.start_date ? coupon.start_date.substring(0, 10) : '',
            end_date: coupon.end_date ? coupon.end_date.substring(0, 10) : '',
            active: !!coupon.active
        });
        setIsEditOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editForm.patch(route('admin.coupons.update', editingCoupon.id), {
            onSuccess: () => {
                setIsEditOpen(false);
                setEditingCoupon(null);
                editForm.reset();
            }
        });
    };

    const handleDelete = (couponId) => {
        if (confirm('Are you sure you want to delete this coupon?')) {
            useForm().delete(route('admin.coupons.destroy', couponId));
        }
    };

    const filteredCoupons = coupons.filter(coupon => 
        coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout title="Coupons Control">
            <Head title="Coupons Management" />

            <div className="space-y-6">
                {/* Top Action Header Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-850 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-200">
                    <div className="flex items-center space-x-3.5">
                        <div className="p-3 bg-blue-100 dark:bg-slate-850 rounded-2xl text-blue-600 dark:text-blue-400">
                            <Tag size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wider leading-none">Coupon Codes</h2>
                            <p className="text-xs font-bold text-slate-450 dark:text-slate-400 mt-1.5">Manage and publish sitewide percentage or flat discount promotions.</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black tracking-wider py-3 px-5 rounded-2xl shadow-lg shadow-blue-500/10 transition-all flex items-center space-x-2 uppercase border border-blue-500/20"
                    >
                        <Plus size={14} />
                        <span>CREATE NEW COUPON</span>
                    </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex bg-white dark:bg-slate-855 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 shadow-sm items-center space-x-3">
                    <Search size={16} className="text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search promo codes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-0 p-0 text-sm w-full focus:ring-0 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                    />
                </div>

                {/* Coupons List Table */}
                <div className="bg-white dark:bg-slate-855 rounded-3xl border border-slate-200/60 dark:border-slate-850 shadow-sm overflow-hidden transition-all duration-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider border-b border-slate-150 dark:border-slate-800">
                                    <th className="px-6 py-4.5">PROMO CODE</th>
                                    <th className="px-6 py-4.5">DISCOUNT</th>
                                    <th className="px-6 py-4.5">START DATE</th>
                                    <th className="px-6 py-4.5">END DATE</th>
                                    <th className="px-6 py-4.5">STATUS</th>
                                    <th className="px-6 py-4.5 text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-200 font-semibold">
                                {filteredCoupons.length > 0 ? (
                                    filteredCoupons.map((coupon) => (
                                        <tr key={coupon.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all duration-150">
                                            <td className="px-6 py-4">
                                                <span className="font-mono bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-150 px-2.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 font-black tracking-wider">
                                                    {coupon.code}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-black text-slate-900 dark:text-white">
                                                    {coupon.type === 'percentage' 
                                                        ? `${Number(coupon.value)}%` 
                                                        : `Rs. ${Number(coupon.value).toFixed(2)}`
                                                    }
                                                </span>
                                                <span className="text-[10px] text-slate-400 block mt-0.5 capitalize">
                                                    {coupon.type} Discount
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                                {coupon.start_date ? new Date(coupon.start_date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                                                {coupon.end_date ? new Date(coupon.end_date).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {coupon.active ? (
                                                    <span className="inline-flex items-center space-x-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-full text-[10px] font-black uppercase">
                                                        <CheckCircle size={10} />
                                                        <span>Active</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center space-x-1 bg-red-50 dark:bg-red-950/40 text-red-500 dark:text-red-400 px-2 py-1 rounded-full text-[10px] font-black uppercase">
                                                        <XCircle size={10} />
                                                        <span>Disabled</span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center space-x-2">
                                                    <button 
                                                        onClick={() => handleEditClick(coupon)}
                                                        className="p-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-blue-950/40 dark:hover:text-blue-400 rounded-lg text-slate-500 transition-colors"
                                                        title="Edit Coupon"
                                                    >
                                                        <Edit2 size={13} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(coupon.id)}
                                                        className="p-2 bg-slate-100 hover:bg-red-50 hover:text-red-650 dark:bg-slate-800 dark:hover:bg-red-950/40 dark:hover:text-red-400 rounded-lg text-slate-500 transition-colors"
                                                        title="Delete Coupon"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-16 text-center text-slate-400">
                                            <Tag className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={36} />
                                            <p className="text-xs font-bold">No Coupon codes available.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Create Modal */}
                {isCreateOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Create Coupon</h3>
                                <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-450 dark:text-slate-400 uppercase tracking-widest mb-1.5">PROMO CODE</label>
                                    <input 
                                        type="text" 
                                        value={createForm.data.code}
                                        onChange={e => createForm.setData('code', e.target.value.toUpperCase())}
                                        placeholder="e.g. WELCOME10"
                                        className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900"
                                        required
                                    />
                                    {createForm.errors.code && <p className="text-[10px] text-red-500 font-bold mt-1">✗ {createForm.errors.code}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-450 dark:text-slate-400 uppercase tracking-widest mb-1.5">TYPE</label>
                                        <select 
                                            value={createForm.data.type}
                                            onChange={e => createForm.setData('type', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-100"
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (Rs.)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-450 dark:text-slate-400 uppercase tracking-widest mb-1.5">VALUE</label>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            value={createForm.data.value}
                                            onChange={e => createForm.setData('value', e.target.value)}
                                            placeholder={createForm.data.type === 'percentage' ? '10' : '500'}
                                            className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-100"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-450 dark:text-slate-400 uppercase tracking-widest mb-1.5">START DATE</label>
                                        <input 
                                            type="date" 
                                            value={createForm.data.start_date}
                                            onChange={e => createForm.setData('start_date', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-slate-850 dark:text-slate-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-450 dark:text-slate-400 uppercase tracking-widest mb-1.5">END DATE</label>
                                        <input 
                                            type="date" 
                                            value={createForm.data.end_date}
                                            onChange={e => createForm.setData('end_date', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-slate-850 dark:text-slate-100"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <input 
                                        type="checkbox"
                                        id="create_active"
                                        checked={createForm.data.active}
                                        onChange={e => createForm.setData('active', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5"
                                    />
                                    <label htmlFor="create_active" className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider select-none cursor-pointer">Active / Publish</label>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end space-x-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsCreateOpen(false)}
                                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black py-3 px-5 rounded-2xl uppercase"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={createForm.processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-3 px-6 rounded-2xl shadow-lg shadow-blue-500/10 uppercase"
                                    >
                                        {createForm.processing ? 'Creating...' : 'Create Coupon'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Modal */}
                {isEditOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Edit Coupon</h3>
                                <button onClick={() => setIsEditOpen(false)} className="text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-widest mb-1.5">PROMO CODE</label>
                                    <input 
                                        type="text" 
                                        value={editForm.data.code}
                                        onChange={e => editForm.setData('code', e.target.value.toUpperCase())}
                                        className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900"
                                        required
                                    />
                                    {editForm.errors.code && <p className="text-[10px] text-red-500 font-bold mt-1">✗ {editForm.errors.code}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-widest mb-1.5">TYPE</label>
                                        <select 
                                            value={editForm.data.type}
                                            onChange={e => editForm.setData('type', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-100"
                                        >
                                            <option value="percentage">Percentage (%)</option>
                                            <option value="fixed">Fixed Amount (Rs.)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-widest mb-1.5">VALUE</label>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            value={editForm.data.value}
                                            onChange={e => editForm.setData('value', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-slate-800 dark:text-slate-100"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-widest mb-1.5">START DATE</label>
                                        <input 
                                            type="date" 
                                            value={editForm.data.start_date}
                                            onChange={e => editForm.setData('start_date', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-slate-850 dark:text-slate-100"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-455 dark:text-slate-400 uppercase tracking-widest mb-1.5">END DATE</label>
                                        <input 
                                            type="date" 
                                            value={editForm.data.end_date}
                                            onChange={e => editForm.setData('end_date', e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl py-3 px-4 text-xs font-bold text-slate-855 dark:text-slate-100"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <input 
                                        type="checkbox"
                                        id="edit_active"
                                        checked={editForm.data.active}
                                        onChange={e => editForm.setData('active', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5"
                                    />
                                    <label htmlFor="edit_active" className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider select-none cursor-pointer">Active / Publish</label>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end space-x-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setIsEditOpen(false)}
                                        className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black py-3 px-5 rounded-2xl uppercase"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={editForm.processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black py-3 px-6 rounded-2xl shadow-lg shadow-blue-500/10 uppercase"
                                    >
                                        {editForm.processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
