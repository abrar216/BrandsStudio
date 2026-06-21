import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { 
    Plus, 
    FolderKanban, 
    Tag, 
    Link as LinkIcon, 
    ShoppingBag, 
    Check, 
    AlertCircle, 
    Sparkles,
    Edit,
    Trash2,
    X
} from 'lucide-react';
import { getAssetUrl, getCategoryImageUrl } from '../../Utils/asset';

export default function Categories({ categories }) {
    
    // Form controller for adding category
    const { 
        data, 
        setData, 
        post, 
        processing, 
        errors, 
        reset 
    } = useForm({
        name: '',
        description: '',
        image: null
    });

    // Form controller for editing category
    const { 
        data: editData, 
        setData: setEditData, 
        post: postEditCategory, 
        processing: editProcessing, 
        errors: editErrors, 
        reset: resetEditForm 
    } = useForm({
        _method: 'PATCH',
        name: '',
        description: '',
        image: null
    });

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.categories.store'), {
            onSuccess: () => {
                reset();
            }
        });
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setEditData({
            _method: 'PATCH',
            name: category.name,
            description: category.description || '',
            image: null
        });
        setEditModalOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        postEditCategory(route('admin.categories.update', editingCategory.id), {
            onSuccess: () => {
                setEditModalOpen(false);
                setEditingCategory(null);
            }
        });
    };

    const handleDelete = (categoryId) => {
        if (confirm("Are you sure you want to delete this category? All associated products may lose their category mapping.")) {
            router.delete(route('admin.categories.destroy', categoryId));
        }
    };

    return (
        <AdminLayout title="Categories Manager">
            <Head title="Categories Management" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT: Quick Create Category Form */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-6 shadow-sm h-fit">
                    <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 mb-5">
                        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                            <Plus size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase text-slate-800 tracking-wider">Add New Category</h3>
                            <p className="text-xs text-slate-500 font-semibold mt-0.5">Establish catalog classification categories</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1.5 font-sans">Category Name *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Athleisure, Winterwear"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none placeholder-slate-400 focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1 font-bold">{errors.name}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1.5 font-sans">Category Description</label>
                            <textarea
                                placeholder="Describe the style profile, fabric directions, or target seasonal vibe..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows="4"
                                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none placeholder-slate-400 focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500"
                            ></textarea>
                            {errors.description && <p className="text-xs text-red-500 mt-1 font-bold">{errors.description}</p>}
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-500 mb-1.5 font-sans">Category Cover Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setData('image', e.target.files[0])}
                                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2 text-sm text-slate-700 focus:outline-none file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                            />
                            {errors.image && <p className="text-xs text-red-500 mt-1 font-bold">{errors.image}</p>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-black transition-colors shadow-sm"
                        >
                            <Sparkles size={14} />
                            <span>{processing ? 'Creating Category...' : 'Create Category'}</span>
                        </button>
                    </form>
                </div>

                {/* RIGHT: Categories Showcase */}
                <div className="lg:col-span-2 space-y-4">
                    
                    {/* Catalog Header */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-6 shadow-sm">
                        <div className="flex items-center space-x-2">
                            <FolderKanban size={16} className="text-blue-600" />
                            <h4 className="text-sm font-bold uppercase text-slate-500 tracking-wider">Active Brand Categories</h4>
                        </div>
                        <p className="text-base font-bold text-slate-800 font-serif mt-1">Live divisions inside shop catalog</p>
                    </div>

                    {/* Category Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categories.map((c) => (
                            <div key={c.id} className="relative overflow-hidden bg-slate-50 p-6 rounded-2xl border border-slate-200/60 hover:border-blue-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between group shadow-sm">
                                <div className="space-y-3 z-10">
                                    {/* Title and stats badge */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                                                <Tag size={14} />
                                            </div>
                                            <h5 className="text-base font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{c.name}</h5>
                                        </div>
                                        <span className="flex items-center space-x-1 bg-slate-100 border border-slate-200 text-xs font-extrabold text-slate-600 px-2.5 py-1 rounded-md">
                                            <ShoppingBag size={10} className="text-blue-600 mr-0.5" />
                                            <span>{c.products_count || 0} Models</span>
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-slate-500 font-semibold leading-relaxed min-h-[40px]">
                                        {c.description || 'No custom description defined for this category.'}
                                    </p>

                                    {/* Cover Image Preview */}
                                    {getCategoryImageUrl(c) && (
                                        <div className="mt-3 relative h-28 w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                                            <img src={getAssetUrl(`storage/${getCategoryImageUrl(c)}`)} className="w-full h-full object-cover" alt={c.name} />
                                        </div>
                                    )}
                                </div>

                                {/* Dynamic URL slug & Action buttons */}
                                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between z-10">
                                    <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold font-mono">
                                        <LinkIcon size={12} className="text-slate-400" />
                                        <span>slug: {c.slug}</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={() => openEditModal(c)}
                                            className="p-1.5 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-lg transition-all"
                                            title="Edit Category"
                                        >
                                            <Edit size={12} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(c.id)}
                                            className="p-1.5 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-450 rounded-lg transition-all"
                                            title="Delete Category"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>

                                <div className="absolute right-0 bottom-0 w-24 h-24 bg-blue-500/2 rounded-full blur-2xl"></div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

            {/* EDIT CATEGORY MODAL */}
            {editModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-50 border border-slate-250 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in scale-in duration-205">
                        
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-100">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center">
                                    <Sparkles size={16} className="text-blue-600 mr-2" />
                                    <span>Edit Category: {editingCategory?.name}</span>
                                </h3>
                                <p className="text-xs text-slate-500 font-semibold mt-0.5">Modify category details</p>
                            </div>
                            <button onClick={() => { setEditModalOpen(false); setEditingCategory(null); }} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1.5 font-sans">Category Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={editData.name}
                                    onChange={(e) => setEditData('name', e.target.value)}
                                    className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                />
                                {editErrors.name && <p className="text-xs text-red-500 mt-1 font-bold">{editErrors.name}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1.5 font-sans">Category Description</label>
                                <textarea
                                    value={editData.description}
                                    onChange={(e) => setEditData('description', e.target.value)}
                                    rows="4"
                                    className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                ></textarea>
                                {editErrors.description && <p className="text-xs text-red-500 mt-1 font-bold">{editErrors.description}</p>}
                            </div>

                            {/* Cover Image */}
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 mb-1.5 font-sans">New Cover Image (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setEditData('image', e.target.files[0])}
                                    className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2 text-sm text-slate-750 focus:outline-none file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                                />
                                {editErrors.image && <p className="text-xs text-red-500 mt-1 font-bold">{editErrors.image}</p>}
                            </div>

                            {/* Submit Buttons */}
                            <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => { setEditModalOpen(false); setEditingCategory(null); }}
                                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm"
                                >
                                    {editProcessing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
