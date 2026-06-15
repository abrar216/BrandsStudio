import React, { useState, useMemo } from 'react';
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import { 
    Plus, 
    Search, 
    Edit2, 
    Save, 
    ArrowLeft, 
    Sparkles, 
    UploadCloud, 
    FolderKanban, 
    Tag, 
    Image as ImageIcon,
    Trash2,
    Eye,
    EyeOff,
    Check,
    SlidersHorizontal,
    Coins
} from 'lucide-react';
import { getAssetUrl } from '../../../Utils/asset';

export default function ProductsControl({ products = [], categories = [] }) {
    const { props } = usePage();
    const currency = props.settings?.currency || 'Rs.';

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    // Form controller for adding/updating products
    const { 
        data, 
        setData, 
        post, 
        processing, 
        errors, 
        reset 
    } = useForm({
        name: '',
        sku: '',
        price: '',
        discount_price: '',
        category_id: '',
        description: '',
        short_description: '',
        stock_quantity: 0,
        display_order: 0,
        status: 'active',
        show_in_featured_couture: false,
        show_in_new_arrivals: false,
        show_in_trending_apparel: false,
        show_in_best_sellers: false,
        show_in_explore_collections: false,
        show_in_collections: true,
        sizes: '',
        colors: '',
        main_image_file: null,
        gallery_image_files: []
    });

    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    // Curate product lists
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                p.sku.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategoryFilter === 'all' || String(p.category_id) === selectedCategoryFilter;
            const matchesStatus = selectedStatusFilter === 'all' || p.status === selectedStatusFilter;
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [products, searchQuery, selectedCategoryFilter, selectedStatusFilter]);

    const handleOpenCreateModal = () => {
        setEditProduct(null);
        setMainImagePreview(null);
        setGalleryPreviews([]);
        reset();
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product) => {
        setEditProduct(product);
        setMainImagePreview(product.main_image ? getAssetUrl(`storage/${product.main_image}`) : null);
        
        let existingGallery = [];
        try {
            if (product.gallery_images) {
                existingGallery = typeof product.gallery_images === 'string' 
                    ? JSON.parse(product.gallery_images) 
                    : product.gallery_images;
            }
        } catch(e) {}
        setGalleryPreviews(existingGallery.map(img => getAssetUrl(`storage/${img}`)));

        setData({
            name: product.name || '',
            sku: product.sku || '',
            price: product.price || '',
            discount_price: product.discount_price || '',
            category_id: product.category_id || '',
            description: product.description || '',
            short_description: product.short_description || '',
            stock_quantity: product.stock_quantity || 0,
            display_order: product.display_order || 0,
            status: product.status || 'active',
            show_in_featured_couture: !!product.show_in_featured_couture,
            show_in_new_arrivals: !!product.show_in_new_arrivals,
            show_in_trending_apparel: !!product.show_in_trending_apparel,
            show_in_best_sellers: !!product.show_in_best_sellers,
            show_in_explore_collections: !!product.show_in_explore_collections,
            show_in_collections: !!product.show_in_collections,
            sizes: '', // Only editable at creation or managed in dynamic variants
            colors: '',
            main_image_file: null,
            gallery_image_files: []
        });
        setIsModalOpen(true);
    };

    const handleMainImageChange = (file) => {
        if (!file) return;
        setData('main_image_file', file);
        setMainImagePreview(URL.createObjectURL(file));
    };

    const handleGalleryImagesChange = (files) => {
        if (!files.length) return;
        const filesArray = Array.from(files);
        setData('gallery_image_files', filesArray);

        const newPreviews = filesArray.map(file => URL.createObjectURL(file));
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editProduct) {
            // Using POST with multipart files to model update route
            post(route('admin.products-control.update', editProduct.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('admin.products-control.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    return (
        <AdminLayout title="Product Website Content Control">
            <Head title="Products Content Management - Superadmin" />

            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <Link 
                        href={route('admin.website-control')}
                        className="inline-flex items-center space-x-1 text-xs font-black uppercase text-blue-900 hover:text-blue-800 transition-colors"
                    >
                        <ArrowLeft size={12} />
                        <span>Back to Control Dashboard</span>
                    </Link>
                    <p className="text-xs text-slate-500 font-semibold mt-1">
                        Upload model photography cover shots, manage showcase badges, discount prices, and sizes.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreateModal}
                    className="inline-flex items-center space-x-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-black px-5 py-3 rounded-xl transition-all shadow-sm uppercase tracking-wider"
                >
                    <Plus size={14} />
                    <span>Create Couture Product</span>
                </button>
            </div>

            {/* Filtering Deck */}
            <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-grow w-full">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by product name or SKU..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-650 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-44"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedStatusFilter}
                        onChange={(e) => setSelectedStatusFilter(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-650 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-36"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Products Table Card */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Couture Item</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Retail & Sale Price</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Tag badges</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Catalog Visible</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Display Order</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-500">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/60 bg-white">
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-12 w-10 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img 
                                                        src={p.main_image ? getAssetUrl(`storage/${p.main_image}`) : p.image ? getAssetUrl(`storage/${p.image}`) : getAssetUrl('images/placeholder.png')} 
                                                        className="w-full h-full object-cover" 
                                                        alt={p.name}
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide leading-snug">{p.name}</h4>
                                                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5 font-mono">SKU: {p.sku} | Cat: {p.category?.name || 'Unassigned'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-0.5">
                                                {p.discount_price ? (
                                                    <>
                                                        <span className="text-xs font-black text-rose-600 block">{currency}{p.discount_price}</span>
                                                        <span className="text-[10px] text-slate-400 font-bold line-through">{currency}{p.price}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-xs font-black text-slate-800">{currency}{p.price}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1 max-w-[280px]">
                                                {p.show_in_featured_couture && <span className="bg-blue-50 border border-blue-200 text-[8px] font-black text-blue-700 px-1.5 py-0.5 rounded uppercase">Featured</span>}
                                                {p.show_in_new_arrivals && <span className="bg-purple-50 border border-purple-200 text-[8px] font-black text-purple-700 px-1.5 py-0.5 rounded uppercase">New Arrival</span>}
                                                {p.show_in_trending_apparel && <span className="bg-amber-50 border border-amber-200 text-[8px] font-black text-amber-700 px-1.5 py-0.5 rounded uppercase">Trending</span>}
                                                {p.show_in_best_sellers && <span className="bg-rose-50 border border-rose-200 text-[8px] font-black text-rose-700 px-1.5 py-0.5 rounded uppercase">Best Seller</span>}
                                                {p.show_in_explore_collections && <span className="bg-teal-50 border border-teal-200 text-[8px] font-black text-teal-700 px-1.5 py-0.5 rounded uppercase">Explore</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {p.show_in_collections ? (
                                                <span className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 border border-emerald-250/20 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                                                    <Eye size={10} />
                                                    <span>Visible</span>
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center space-x-1 text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                                                    <EyeOff size={10} />
                                                    <span>Hidden</span>
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-black text-slate-800 bg-slate-100 border border-slate-250/30 px-2.5 py-1 rounded-md font-mono">{p.display_order}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleOpenEditModal(p)}
                                                className="p-2 text-slate-600 hover:text-blue-650 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-xl transition-all"
                                                title="Edit Website Parameters"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                        No products matched the curate parameters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CREATE / EDIT SLIDE OVER MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                        
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-slate-50 z-10">
                            <div>
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles size={16} className="text-blue-600" />
                                    {editProduct ? 'Edit Couture Parameters' : 'Create New Couture Item'}
                                </h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                                    Configure marketing, sizes, prices, and media showcases
                                </p>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 text-xs font-black uppercase tracking-widest"
                            >
                                Close
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-grow">
                            
                            {/* Form Errors Notification */}
                            {Object.keys(errors).length > 0 && (
                                <div className="bg-rose-50 border border-rose-250 p-4 rounded-xl">
                                    <p className="text-xs font-black text-rose-800 uppercase tracking-wide">Please resolve the following inputs:</p>
                                    <ul className="list-disc list-inside text-[10px] text-rose-700 font-bold mt-1 space-y-0.5">
                                        {Object.entries(errors).map(([k, v]) => (
                                            <li key={k}>{v}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Section 1: Standard Details */}
                            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                                    <Tag size={12} className="text-blue-600" />
                                    Couture Specifications
                                </h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Product Name *</label>
                                        <input 
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="E.g. Sapphire Velvet Sherwani"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Product SKU *</label>
                                        <input 
                                            type="text"
                                            required
                                            value={data.sku}
                                            onChange={e => setData('sku', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="E.g. BS-SV-SH01"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Category Classification *</label>
                                        <select
                                            required
                                            value={data.category_id}
                                            onChange={e => setData('category_id', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Stock Quantity *</label>
                                        <input 
                                            type="number"
                                            required
                                            min="0"
                                            value={data.stock_quantity}
                                            onChange={e => setData('stock_quantity', parseInt(e.target.value) || 0)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Status *</label>
                                        <select
                                            required
                                            value={data.status}
                                            onChange={e => setData('status', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Short Summary / Teaser</label>
                                        <textarea 
                                            rows={2}
                                            value={data.short_description}
                                            onChange={e => setData('short_description', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Enter brief teaser description..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Full Detailed Copy</label>
                                        <textarea 
                                            rows={2}
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Enter complete material and size details..."
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Retail Pricing and Variants */}
                            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                                    <Coins size={12} className="text-amber-600" />
                                    Pricing & Dynamic Variants (Sizes & Colors)
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Retail Price *</label>
                                        <input 
                                            type="number"
                                            step="0.01"
                                            required
                                            value={data.price}
                                            onChange={e => setData('price', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="E.g. 5999"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Campaign Discount Price</label>
                                        <input 
                                            type="number"
                                            step="0.01"
                                            value={data.discount_price}
                                            onChange={e => setData('discount_price', e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="E.g. 4999 (Leave blank if none)"
                                        />
                                    </div>

                                    <div className="md:col-span-2 flex flex-col justify-end">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
                                            * Price fields set the storefront customer purchase fee. Discount price enables sale tags.
                                        </p>
                                    </div>
                                </div>

                                {!editProduct && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                                                Couture Sizes (Comma-separated)
                                            </label>
                                            <input 
                                                type="text"
                                                value={data.sizes}
                                                onChange={e => setData('sizes', e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="E.g. S, M, L, XL"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
                                                Couture Colors (Comma-separated)
                                            </label>
                                            <input 
                                                type="text"
                                                value={data.colors}
                                                onChange={e => setData('colors', e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="E.g. Indigo, Maroon, Silver"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 3: Media Uploads */}
                            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                                    <ImageIcon size={12} className="text-emerald-600" />
                                    Atelier Imagery
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Main Cover Image */}
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Main Cover Portrait Shot</label>
                                        <div className="relative border border-slate-200/65 bg-slate-50 rounded-2xl h-44 overflow-hidden flex flex-col items-center justify-center text-center">
                                            {mainImagePreview ? (
                                                <>
                                                    <img src={mainImagePreview} className="w-full h-full object-cover" alt="Main cover preview" />
                                                    <label className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                        <span className="text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                                            <UploadCloud size={16} /> Replace Shot
                                                        </span>
                                                        <input 
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={e => handleMainImageChange(e.target.files[0])}
                                                            className="hidden"
                                                        />
                                                    </label>
                                                </>
                                            ) : (
                                                <label className="p-4 cursor-pointer text-slate-400 hover:text-blue-600 transition-colors w-full h-full flex flex-col items-center justify-center">
                                                    <UploadCloud size={28} className="mb-1" />
                                                    <span className="text-[10px] font-black uppercase tracking-wider">Select Main Image</span>
                                                    <span className="text-[8px] mt-0.5">Vertical aspect ratio recommended</span>
                                                    <input 
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={e => handleMainImageChange(e.target.files[0])}
                                                        className="hidden"
                                                    />
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    {/* Gallery Images */}
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500">Multiple Gallery Slideshow Shots</label>
                                        <div className="border border-slate-200/65 bg-slate-50 rounded-2xl p-4 min-h-[176px] flex flex-col justify-between">
                                            <div className="grid grid-cols-4 gap-2 max-h-[110px] overflow-y-auto">
                                                {galleryPreviews.map((img, idx) => (
                                                    <div key={idx} className="aspect-square bg-white border border-slate-200 rounded-lg overflow-hidden relative">
                                                        <img src={img} className="w-full h-full object-cover" alt="Gallery thumbnail" />
                                                    </div>
                                                ))}
                                                {galleryPreviews.length === 0 && (
                                                    <div className="col-span-4 text-center text-[10px] text-slate-400 font-semibold uppercase py-8">
                                                        No gallery slides selected
                                                    </div>
                                                )}
                                            </div>

                                            <label className="mt-3 cursor-pointer inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-100 border border-slate-250 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-slate-700 transition-colors">
                                                <UploadCloud size={14} />
                                                <span>Add Slideshow files</span>
                                                <input 
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={e => handleGalleryImagesChange(e.target.files)}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: Showcase & Priority Badging */}
                            <div className="bg-white border border-slate-200/60 p-5 rounded-2xl space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                                    <SlidersHorizontal size={12} className="text-indigo-600" />
                                    Homepage Showcases & Sorting Flags
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {/* 1 */}
                                    <label className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                        <input 
                                            type="checkbox"
                                            checked={data.show_in_featured_couture}
                                            onChange={e => setData('show_in_featured_couture', e.target.checked)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <div>
                                            <span className="text-xs font-black text-slate-800 uppercase block">Featured Couture</span>
                                            <span className="text-[8px] text-slate-400 font-bold block mt-0.5">Top homepage grid showcase</span>
                                        </div>
                                    </label>
                                    {/* 2 */}
                                    <label className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                        <input 
                                            type="checkbox"
                                            checked={data.show_in_new_arrivals}
                                            onChange={e => setData('show_in_new_arrivals', e.target.checked)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <div>
                                            <span className="text-xs font-black text-slate-800 uppercase block">New Arrivals</span>
                                            <span className="text-[8px] text-slate-400 font-bold block mt-0.5">Seasonal fresh drop releases</span>
                                        </div>
                                    </label>
                                    {/* 3 */}
                                    <label className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                        <input 
                                            type="checkbox"
                                            checked={data.show_in_trending_apparel}
                                            onChange={e => setData('show_in_trending_apparel', e.target.checked)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <div>
                                            <span className="text-xs font-black text-slate-800 uppercase block">Trending Apparel</span>
                                            <span className="text-[8px] text-slate-400 font-bold block mt-0.5">Viral/Highly-demanded fits</span>
                                        </div>
                                    </label>
                                    {/* 4 */}
                                    <label className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                        <input 
                                            type="checkbox"
                                            checked={data.show_in_best_sellers}
                                            onChange={e => setData('show_in_best_sellers', e.target.checked)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <div>
                                            <span className="text-xs font-black text-slate-800 uppercase block">Best Sellers</span>
                                            <span className="text-[8px] text-slate-400 font-bold block mt-0.5">Most wanted wishlist items</span>
                                        </div>
                                    </label>
                                    {/* 5 */}
                                    <label className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                        <input 
                                            type="checkbox"
                                            checked={data.show_in_explore_collections}
                                            onChange={e => setData('show_in_explore_collections', e.target.checked)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <div>
                                            <span className="text-xs font-black text-slate-800 uppercase block">Explore Showcase</span>
                                            <span className="text-[8px] text-slate-400 font-bold block mt-0.5">Show under collections grid</span>
                                        </div>
                                    </label>
                                    {/* 6 */}
                                    <label className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                                        <input 
                                            type="checkbox"
                                            checked={data.show_in_collections}
                                            onChange={e => setData('show_in_collections', e.target.checked)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                        />
                                        <div>
                                            <span className="text-xs font-black text-slate-800 uppercase block">Visible Shop Catalog</span>
                                            <span className="text-[8px] text-slate-400 font-bold block mt-0.5">Visibility on Collections page</span>
                                        </div>
                                    </label>
                                </div>

                                <div className="pt-2 flex items-center space-x-4">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Homepage Sort Priority:</span>
                                    <input 
                                        type="number"
                                        min="0"
                                        value={data.display_order}
                                        onChange={e => setData('display_order', parseInt(e.target.value) || 0)}
                                        className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-black text-slate-800 text-center focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Submit Panel */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 sticky bottom-0 bg-slate-50 py-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-white border border-slate-250 hover:bg-slate-100 text-slate-700 text-xs font-black px-5 py-3.5 rounded-xl uppercase tracking-wider transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-black px-6 py-3.5 rounded-xl uppercase tracking-wider transition-colors inline-flex items-center space-x-1.5 shadow-md"
                                >
                                    <Save size={14} />
                                    <span>{processing ? 'Saving details...' : 'Save Product specifications'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
