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
    X,
    Layers
} from 'lucide-react';
import { getAssetUrl, getCategoryImageUrl } from '../../Utils/asset';

const compressImageFile = (file, maxDim = 800, quality = 0.7) => {
    return new Promise((resolve) => {
        if (!file || !file.type.startsWith('image/')) {
            resolve(file);
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxDim || height > maxDim) {
                    if (width > height) {
                        height = Math.round((height * maxDim) / width);
                        width = maxDim;
                    } else {
                        width = Math.round((width * maxDim) / height);
                        height = maxDim;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                try {
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const compressedFile = new File([blob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: Date.now(),
                                });
                                resolve(compressedFile);
                            } else {
                                resolve(file);
                            }
                        },
                        'image/jpeg',
                        quality
                     );
                } catch (e) {
                    resolve(file);
                }
            };
            img.onerror = () => resolve(file);
        };
        reader.onerror = () => resolve(file);
    });
};

export default function Subcategories({ parentCategories, subcategories }) {
    
    // Form controller for adding subcategory
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
        image: null,
        parent_id: parentCategories[0]?.id || ''
    });

    // Form controller for editing subcategory
    const { 
        data: editData, 
        setData: setEditData, 
        post: postEditSubcategory, 
        processing: editProcessing, 
        errors: editErrors, 
        reset: resetEditForm 
    } = useForm({
        _method: 'PATCH',
        name: '',
        description: '',
        image: null,
        parent_id: ''
    });

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingSubcategory, setEditingSubcategory] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.parent_id) {
            alert('Please select a parent category.');
            return;
        }
        post(route('admin.categories.store'), {
            onSuccess: () => {
                reset();
            }
        });
    };

    const openEditModal = (subcategory) => {
        setEditingSubcategory(subcategory);
        setEditData({
            _method: 'PATCH',
            name: subcategory.name,
            description: subcategory.description || '',
            image: null,
            parent_id: subcategory.parent_id || ''
        });
        setEditModalOpen(true);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!editData.parent_id) {
            alert('Please select a parent category.');
            return;
        }
        postEditSubcategory(route('admin.categories.update', editingSubcategory.id), {
            onSuccess: () => {
                setEditModalOpen(false);
                setEditingSubcategory(null);
            }
        });
    };

    const handleDelete = (subcategoryId) => {
        if (confirm("Are you sure you want to delete this subcategory? Associated products may lose their category link.")) {
            router.delete(route('admin.categories.destroy', subcategoryId));
        }
    };

    return (
        <AdminLayout title="Subcategories Manager">
            <Head title="Subcategories Management" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* LEFT: Quick Create Subcategory Form */}
                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-6 shadow-sm h-fit">
                    <div className="flex items-center space-x-2.5 pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                        <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-xl text-blue-600 dark:text-blue-400">
                            <Plus size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase text-slate-800 dark:text-slate-200 tracking-wider">Add New Subcategory</h3>
                            <p className="text-xs text-slate-500 font-semibold mt-0.5">Link a new subcategory under a main category</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Parent Category Selector */}
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 font-sans font-black">Parent Category *</label>
                            <select
                                required
                                value={data.parent_id}
                                onChange={(e) => setData('parent_id', e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                            >
                                <option value="" disabled>Select Parent Category</option>
                                {parentCategories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.parent_id && <p className="text-xs text-red-500 mt-1 font-bold">{errors.parent_id}</p>}
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 font-sans">Subcategory Name *</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Cotton, Wash & Wear, Silk"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-400 focus:ring-1 focus:ring-blue-500/20"
                            />
                            {errors.name && <p className="text-xs text-red-500 mt-1 font-bold">{errors.name}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 font-sans">Description</label>
                            <textarea
                                placeholder="Describe the specifics of this subcategory..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows="4"
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none placeholder-slate-400 focus:ring-1 focus:ring-blue-500/20"
                            ></textarea>
                            {errors.description && <p className="text-xs text-red-500 mt-1 font-bold">{errors.description}</p>}
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 font-sans">Subcategory Cover Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    if (e.target.files[0]) {
                                        const compressed = await compressImageFile(e.target.files[0]);
                                        setData('image', compressed);
                                    }
                                }}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
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
                            <span>{processing ? 'Creating Subcategory...' : 'Create Subcategory'}</span>
                        </button>
                    </form>
                </div>

                {/* RIGHT: Subcategories List */}
                <div className="lg:col-span-2 space-y-4">
                    
                    {/* Catalog Header */}
                    <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-6 shadow-sm">
                        <div className="flex items-center space-x-2">
                            <Layers size={16} className="text-blue-600 dark:text-blue-400" />
                            <h4 className="text-sm font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Active Subcategories</h4>
                        </div>
                        <p className="text-base font-bold text-slate-800 dark:text-slate-200 font-serif mt-1">Subelements under parent clothing divisions</p>
                    </div>

                    {/* Subcategory Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {subcategories.map((c) => (
                            <div key={c.id} className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-300 flex flex-col justify-between group shadow-sm">
                                <div className="space-y-3 z-10">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="p-1.5 bg-blue-50 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400">
                                                <Tag size={14} />
                                            </div>
                                            <div>
                                                <h5 className="text-base font-bold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-blue-600 transition-colors">{c.name}</h5>
                                                <span className="text-[9px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider block mt-0.5">
                                                    Parent: {c.parent?.name || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-600 dark:text-slate-400 px-2.5 py-1 rounded-md">
                                            <ShoppingBag size={10} className="text-blue-600 mr-0.5" />
                                            <span>{c.products_count || 0} Models</span>
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed min-h-[40px]">
                                        {c.description || 'No custom description defined for this subcategory.'}
                                    </p>

                                    {/* Cover Image Preview */}
                                    {getCategoryImageUrl(c) && (
                                        <div className="mt-3 relative h-28 w-full rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                                            <img src={getAssetUrl(`storage/${getCategoryImageUrl(c)}`)} className="w-full h-full object-cover" alt={c.name} />
                                        </div>
                                    )}
                                </div>

                                {/* Dynamic URL slug & Action buttons */}
                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
                                    <div className="flex items-center space-x-2 text-xs text-slate-450 dark:text-slate-500 font-bold font-mono">
                                        <LinkIcon size={12} className="text-slate-400" />
                                        <span>slug: {c.slug}</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={() => openEditModal(c)}
                                            className="p-1.5 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/50 border border-slate-200 dark:border-slate-800 hover:border-blue-400 rounded-lg transition-all"
                                            title="Edit Subcategory"
                                        >
                                            <Edit size={12} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(c.id)}
                                            className="p-1.5 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 border border-slate-200 dark:border-slate-800 hover:border-red-450 rounded-lg transition-all"
                                            title="Delete Subcategory"
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

            {/* EDIT SUBCATEGORY MODAL */}
            {editModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in scale-in duration-205">
                        
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-100 dark:bg-slate-900">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center">
                                    <Sparkles size={16} className="text-blue-600 mr-2" />
                                    <span>Edit Subcategory: {editingSubcategory?.name}</span>
                                </h3>
                                <p className="text-xs text-slate-500 font-semibold mt-0.5">Modify subcategory details</p>
                            </div>
                            <button onClick={() => { setEditModalOpen(false); setEditingSubcategory(null); }} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            {/* Parent Category Selector */}
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 font-sans font-black">Parent Category *</label>
                                <select
                                    required
                                    value={editData.parent_id}
                                    onChange={(e) => setEditData('parent_id', e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                >
                                    <option value="" disabled>Select Parent Category</option>
                                    {parentCategories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                {editErrors.parent_id && <p className="text-xs text-red-500 mt-1 font-bold">{editErrors.parent_id}</p>}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 font-sans">Subcategory Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={editData.name}
                                    onChange={(e) => setEditData('name', e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                />
                                {editErrors.name && <p className="text-xs text-red-500 mt-1 font-bold">{editErrors.name}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 font-sans">Description</label>
                                <textarea
                                    value={editData.description}
                                    onChange={(e) => setEditData('description', e.target.value)}
                                    rows="4"
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                ></textarea>
                                {editErrors.description && <p className="text-xs text-red-500 mt-1 font-bold">{editErrors.description}</p>}
                            </div>

                            {/* Cover Image */}
                            <div>
                                <label className="block text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mb-1.5 font-sans">New Cover Image (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        if (e.target.files[0]) {
                                            const compressed = await compressImageFile(e.target.files[0]);
                                            setEditData('image', compressed);
                                        }
                                    }}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-blue-500 rounded-xl px-4 py-2 text-sm text-slate-750 dark:text-slate-300 focus:outline-none file:mr-3 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                                />
                                {editErrors.image && <p className="text-xs text-red-500 mt-1 font-bold">{editErrors.image}</p>}
                            </div>

                            {/* Submit Buttons */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => { setEditModalOpen(false); setEditingSubcategory(null); }}
                                    className="bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
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
