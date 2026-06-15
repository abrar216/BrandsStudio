import React, { useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { 
    Plus, 
    Coins, 
    Calendar, 
    Tag, 
    FileText, 
    Check, 
    TrendingDown,
    Sparkles,
    Wallet,
    Edit,
    Trash2,
    X,
    FolderKanban,
    Settings
} from 'lucide-react';

export default function Expenses({ expenses, categories }) {
    const { settings: sharedSettings } = usePage().props;
    const currencySymbol = sharedSettings?.currency_symbol || 'Rs.';

    // Form controller for adding expense
    const { 
        data: addData, 
        setData: setAddData, 
        post: postAddExpense, 
        processing: addProcessing, 
        errors: addErrors, 
        reset: resetAddForm 
    } = useForm({
        title: '',
        amount: '',
        category: categories[0]?.name || '',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });

    // Form controller for editing expense
    const { 
        data: editData, 
        setData: setEditData, 
        patch: patchEditExpense, 
        processing: editProcessing, 
        errors: editErrors, 
        reset: resetEditForm 
    } = useForm({
        title: '',
        amount: '',
        category: '',
        date: '',
        description: ''
    });

    // Form controller for adding expense category
    const {
        data: addCatData,
        setData: setAddCatData,
        post: postAddCat,
        processing: addCatProcessing,
        errors: addCatErrors,
        reset: resetAddCat
    } = useForm({
        name: ''
    });

    // Form controller for editing expense category
    const {
        data: editCatData,
        setData: setEditCatData,
        patch: patchEditCat,
        processing: editCatProcessing,
        errors: editCatErrors,
        reset: resetEditCat
    } = useForm({
        name: ''
    });

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    const [catManagerOpen, setCatManagerOpen] = useState(false);
    const [editCatModalOpen, setEditCatModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const handleAddSubmit = (e) => {
        e.preventDefault();
        postAddExpense(route('admin.expenses.store'), {
            onSuccess: () => {
                resetAddForm('title', 'amount', 'description');
            }
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        patchEditExpense(route('admin.expenses.update', editingExpense.id), {
            onSuccess: () => {
                setEditModalOpen(false);
                setEditingExpense(null);
            }
        });
    };

    const handleDeleteExpense = (expenseId) => {
        if (confirm("Are you sure you want to delete this expense record?")) {
            router.delete(route('admin.expenses.destroy', expenseId));
        }
    };

    const openEditModal = (expense) => {
        setEditingExpense(expense);
        setEditData({
            title: expense.title,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            description: expense.description || ''
        });
        setEditModalOpen(true);
    };

    const handleAddCatSubmit = (e) => {
        e.preventDefault();
        postAddCat(route('admin.expenses.category.store'), {
            onSuccess: () => {
                resetAddCat();
            }
        });
    };

    const openEditCatModal = (category) => {
        setEditingCategory(category);
        setEditCatData({
            name: category.name
        });
        setEditCatModalOpen(true);
    };

    const handleEditCatSubmit = (e) => {
        e.preventDefault();
        patchEditCat(route('admin.expenses.category.update', editingCategory.id), {
            onSuccess: () => {
                setEditCatModalOpen(false);
                setEditingCategory(null);
            }
        });
    };

    const handleDeleteCat = (categoryId) => {
        if (confirm("Are you sure you want to delete this category? All expenses belonging to this category will lose their group categorization.")) {
            router.delete(route('admin.expenses.category.destroy', categoryId));
        }
    };

    // Calculate aggregated net expenses
    const totalExpensesSum = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

    const formatPrice = (val) => {
        return `${currencySymbol} ${Number(val).toLocaleString()}`;
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <AdminLayout title="Operational Expense Tracker">
            <Head title="Expenses Management" />

            {/* KPI Net Summary Card */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-250 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-red-50 text-red-500 rounded-2xl">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Aggregated Total Overhead</h4>
                        <p className="text-2xl font-black text-slate-900 font-serif mt-0.5">{formatPrice(totalExpensesSum)}</p>
                    </div>
                </div>
                <button
                    onClick={() => setCatManagerOpen(true)}
                    className="flex items-center space-x-2 text-xs font-black text-blue-600 hover:text-blue-750 bg-blue-50 border border-blue-200/40 px-3.5 py-1.5 rounded-xl shadow-sm transition-colors uppercase tracking-wider"
                >
                    <Settings size={14} />
                    <span>Manage Categories</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT: Quick Record Expense Form */}
                <div className="bg-slate-50 rounded-2xl border border-slate-250 shadow-sm h-fit p-6">
                    <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 mb-5">
                        <div className="p-2 bg-red-50 rounded-xl text-red-500">
                            <Plus size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Log Operating Expense</h3>
                            <p className="text-xs text-slate-500 font-semibold mt-0.5">Record costs to track true net profits</p>
                        </div>
                    </div>

                    <form onSubmit={handleAddSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1.5 font-sans">Expense Title *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Tailoring Workshop Rent"
                                value={addData.title}
                                onChange={(e) => setAddData('title', e.target.value)}
                                className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none placeholder-slate-400 focus:ring-1 focus:ring-red-500/20"
                            />
                            {addErrors.title && <p className="text-[10px] text-red-500 mt-1 font-bold">{addErrors.title}</p>}
                        </div>

                        {/* Amount & Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Amount ({currencySymbol}) *</label>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    value={addData.amount}
                                    onChange={(e) => setAddData('amount', e.target.value)}
                                    className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none placeholder-slate-400 focus:ring-1 focus:ring-red-500/20"
                                />
                                {addErrors.amount && <p className="text-[10px] text-red-550 mt-1 font-bold">{addErrors.amount}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Record Date *</label>
                                <input
                                    type="date"
                                    required
                                    value={addData.date}
                                    onChange={(e) => setAddData('date', e.target.value)}
                                    className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-500/20"
                                />
                                {addErrors.date && <p className="text-[10px] text-red-550 mt-1 font-bold">{addErrors.date}</p>}
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Expense Category *</label>
                            <select
                                value={addData.category}
                                onChange={(e) => setAddData('category', e.target.value)}
                                className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-slate-850 focus:outline-none focus:ring-1 focus:ring-red-500/20 cursor-pointer"
                            >
                                <option value="">Select Category</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                            {addErrors.category && <p className="text-[10px] text-red-550 mt-1 font-bold">{addErrors.category}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Expense Description</label>
                            <textarea
                                placeholder="Describe specific vendors, payment methods, or details..."
                                value={addData.description}
                                onChange={(e) => setAddData('description', e.target.value)}
                                rows="3"
                                className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none placeholder-slate-400 focus:ring-1 focus:ring-red-500/20"
                            ></textarea>
                            {addErrors.description && <p className="text-[10px] text-red-550 mt-1 font-bold">{addErrors.description}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={addProcessing}
                            className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs font-black transition-colors shadow-sm"
                        >
                            <Sparkles size={14} />
                            <span>{addProcessing ? 'Logging Record...' : 'Log Operating Expense'}</span>
                        </button>
                    </form>
                </div>

                {/* RIGHT: Expenses Log Table */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                        {/* Table Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center space-x-2">
                            <Coins size={16} className="text-red-500" />
                            <div>
                                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Bookkeeping Log Ledger</h4>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Historical ledger of all recorded business overheads</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 text-[10px] uppercase text-slate-500 tracking-wider bg-slate-50/50">
                                        <th className="py-3.5 px-6 font-bold">Expense Details</th>
                                        <th className="py-3.5 px-4 font-bold">Date</th>
                                        <th className="py-3.5 px-4 font-bold">Classification</th>
                                        <th className="py-3.5 px-6 font-bold text-right">Debit Amount</th>
                                        <th className="py-3.5 px-4 font-bold text-center w-24">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {expenses.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="py-12 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                                No business overhead expenses logged yet
                                            </td>
                                        </tr>
                                    ) : (
                                        expenses.map((expense) => (
                                            <tr key={expense.id} className="text-xs hover:bg-slate-50 transition-colors">
                                                
                                                {/* Title & Description */}
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-800">{expense.title}</span>
                                                        {expense.description && (
                                                            <span className="text-[10px] text-slate-450 font-semibold leading-relaxed mt-0.5">
                                                                {expense.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Date */}
                                                <td className="py-4 px-4 text-slate-500 font-semibold whitespace-nowrap">
                                                    {formatDate(expense.date)}
                                                </td>

                                                {/* Category */}
                                                <td className="py-4 px-4">
                                                    <span className="inline-block text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border bg-slate-100 text-slate-650 border-slate-200">
                                                        {expense.category}
                                                    </span>
                                                </td>

                                                {/* Amount */}
                                                <td className="py-4 px-6 text-right font-black text-red-650 text-red-600 font-mono">
                                                    {formatPrice(expense.amount)}
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-4 text-center">
                                                    <div className="flex items-center justify-center space-x-1.5">
                                                        <button 
                                                            onClick={() => openEditModal(expense)}
                                                            className="p-1.5 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-lg transition-all"
                                                            title="Edit Expense"
                                                        >
                                                            <Edit size={11} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteExpense(expense.id)}
                                                            className="p-1.5 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-lg transition-all"
                                                            title="Delete Expense"
                                                        >
                                                            <Trash2 size={11} />
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Table Footer */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>Total Records: {expenses.length}</span>
                        <span>Aggregate Debit: <span className="text-red-600 font-black font-mono">{formatPrice(totalExpensesSum)}</span></span>
                    </div>

                </div>

            </div>

            {/* EDIT EXPENSE DETAILS MODAL */}
            {editModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-50 border border-slate-250 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in scale-in duration-200">
                        
                        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-100">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center">
                                    <Sparkles size={16} className="text-red-500 mr-2" />
                                    <span>Edit Operating Expense</span>
                                </h3>
                                <p className="text-xs text-slate-500 font-semibold mt-0.5">Modify bookkeeping log ledger record</p>
                            </div>
                            <button onClick={() => { setEditModalOpen(false); setEditingExpense(null); }} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1.5 font-sans">Expense Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={editData.title}
                                    onChange={(e) => setEditData('title', e.target.value)}
                                    className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none"
                                />
                                {editErrors.title && <p className="text-xs text-red-550 text-red-500 mt-1 font-bold">{editErrors.title}</p>}
                            </div>

                            {/* Amount & Date */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs uppercase font-bold text-slate-500 mb-1.5 font-sans">Amount ({currencySymbol}) *</label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        min="0"
                                        value={editData.amount}
                                        onChange={(e) => setEditData('amount', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none"
                                    />
                                    {editErrors.amount && <p className="text-xs text-red-550 text-red-500 mt-1 font-bold">{editErrors.amount}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-slate-500 mb-1.5 font-sans">Record Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={editData.date}
                                        onChange={(e) => setEditData('date', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none"
                                    />
                                    {editErrors.date && <p className="text-xs text-red-550 text-red-500 mt-1 font-bold">{editErrors.date}</p>}
                                </div>
                            </div>

                            {/* Category Selection */}
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1.5 font-sans">Expense Category *</label>
                                <select
                                    value={editData.category}
                                    onChange={(e) => setEditData('category', e.target.value)}
                                    className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl px-4 py-2.5 text-sm text-slate-850 focus:outline-none cursor-pointer"
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                                {editErrors.category && <p className="text-xs text-red-550 text-red-500 mt-1 font-bold">{editErrors.category}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1.5 font-sans">Expense Description</label>
                                <textarea
                                    value={editData.description}
                                    onChange={(e) => setEditData('description', e.target.value)}
                                    rows="3"
                                    className="w-full bg-white border border-slate-200 focus:border-red-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none"
                                ></textarea>
                                {editErrors.description && <p className="text-xs text-red-555 text-red-500 mt-1 font-bold">{editErrors.description}</p>}
                            </div>

                            {/* Submit Buttons */}
                            <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => { setEditModalOpen(false); setEditingExpense(null); }}
                                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing}
                                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm"
                                >
                                    {editProcessing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DYNAMIC CATEGORY MANAGER MODAL */}
            {catManagerOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-50 border border-slate-250 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in scale-in duration-200">
                        
                        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-100">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center">
                                    <FolderKanban size={16} className="text-blue-600 mr-2" />
                                    <span>Expense Categories Deck</span>
                                </h3>
                                <p className="text-xs text-slate-500 font-semibold mt-0.5">Manage operating overhead categories</p>
                            </div>
                            <button onClick={() => setCatManagerOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Add Category Input form */}
                            <form onSubmit={handleAddCatSubmit} className="flex gap-2.5 items-end">
                                <div className="flex-grow">
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1 font-sans">New Category Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Workshop Supplies, Tax Dues"
                                        value={addCatData.name}
                                        onChange={(e) => setAddCatData('name', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none"
                                    />
                                    {addCatErrors.name && <p className="text-[9px] text-red-500 mt-1 font-bold">{addCatErrors.name}</p>}
                                </div>
                                <button
                                    type="submit"
                                    disabled={addCatProcessing}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-colors"
                                >
                                    Add
                                </button>
                            </form>

                            {/* Active Category Registers List */}
                            <div className="space-y-2 max-h-[220px] overflow-y-auto border border-slate-200 bg-slate-100/40 p-3 rounded-2xl">
                                <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-2">Live Category Registers</h5>
                                {categories.length === 0 ? (
                                    <p className="text-xs text-slate-400 font-bold text-center py-4 uppercase">No expense categories registered</p>
                                ) : (
                                    categories.map((cat) => (
                                        <div key={cat.id} className="flex justify-between items-center bg-white border border-slate-200/80 p-2.5 rounded-xl shadow-sm">
                                            <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                                            <div className="flex space-x-1">
                                                <button
                                                    onClick={() => openEditCatModal(cat)}
                                                    className="p-1 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Rename Category"
                                                >
                                                    <Edit size={11} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCat(cat.id)}
                                                    className="p-1 hover:text-red-600 hover:bg-red-50 rounded"
                                                    title="Delete Category"
                                                >
                                                    <Trash2 size={11} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT EXPENSE CATEGORY RENAME MODAL */}
            {editCatModalOpen && (
                <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-50 border border-slate-250 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in scale-in duration-200">
                        
                        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-100">
                            <span className="text-xs font-black uppercase text-slate-800 tracking-wider">Rename Category</span>
                            <button onClick={() => { setEditCatModalOpen(false); setEditingCategory(null); }} className="text-slate-400 hover:text-slate-700">
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleEditCatSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Category Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={editCatData.name}
                                    onChange={(e) => setEditCatData('name', e.target.value)}
                                    className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
                                />
                                {editCatErrors.name && <p className="text-xs text-red-500 mt-1 font-bold">{editCatErrors.name}</p>}
                            </div>

                            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => { setEditCatModalOpen(false); setEditingCategory(null); }}
                                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 px-3.5 py-1.5 rounded-lg text-xs font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editCatProcessing}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg text-xs font-black"
                                >
                                    Save Rename
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
