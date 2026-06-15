import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import { 
    Plus, 
    Search, 
    Filter, 
    Edit, 
    Eye, 
    EyeOff, 
    ChevronDown, 
    ChevronUp, 
    Tag, 
    X,
    Sparkles,
    AlertCircle,
    Info,
    RotateCcw
} from 'lucide-react';
import { getAssetUrl } from '../../Utils/asset';

export default function Products({ products, categories }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [expandedProduct, setExpandedProduct] = useState(null);
    
    // Modals visibility
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const { settings } = usePage().props;
    const currencySymbol = settings?.currency_symbol || 'Rs.';

    // Create form controller
    const { 
        data: addData, 
        setData: setAddData, 
        post: postAddProduct, 
        processing: addProcessing, 
        errors: addErrors, 
        reset: resetAddForm 
    } = useForm({
        name: '',
        sku: '',
        price: '',
        discount_price: '',
        cost_price: '',
        gst_rate: '0.00',
        category_id: categories[0]?.id || '',
        description: '',
        short_description: '',
        stock_quantity: 0,
        is_featured: false,
        is_trending: false,
        is_best_seller: false,
        is_new_arrival: false,
        variants: [], // Array of { size, color, stock_quantity, price, cost_price }
        image: null,
        images: []
    });

    // Edit form controller
    const { 
        data: editData, 
        setData: setEditData, 
        post: postEditProduct, 
        processing: editProcessing, 
        errors: editErrors,
        reset: resetEditForm 
    } = useForm({
        _method: 'PATCH',
        name: '',
        sku: '',
        price: '',
        discount_price: '',
        cost_price: '',
        gst_rate: '0.00',
        category_id: '',
        description: '',
        short_description: '',
        stock_quantity: 0,
        is_featured: false,
        is_trending: false,
        is_best_seller: false,
        is_new_arrival: false,
        status: 'active',
        image: null,
        images: []
    });

    // Form handlers
    const handleAddProductSubmit = (e) => {
        e.preventDefault();
        postAddProduct(route('admin.products.store'), {
            onSuccess: () => {
                setAddModalOpen(false);
                resetAddForm();
            }
        });
    };

    const handleEditProductSubmit = (e) => {
        e.preventDefault();
        // Spoof PATCH via POST to allow file uploads to parse correctly in PHP
        postEditProduct(route('admin.products.update', editingProduct.id), {
            onSuccess: () => {
                setEditModalOpen(false);
                setEditingProduct(null);
            }
        });
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setEditData({
            _method: 'PATCH',
            name: product.name,
            sku: product.sku,
            price: product.price,
            discount_price: product.discount_price || '',
            cost_price: product.cost_price || '',
            gst_rate: product.gst_rate || '0.00',
            category_id: product.category_id,
            description: product.description || '',
            short_description: product.short_description || '',
            stock_quantity: product.stock_quantity,
            is_featured: Boolean(product.is_featured),
            is_trending: Boolean(product.is_trending),
            is_best_seller: Boolean(product.is_best_seller),
            is_new_arrival: Boolean(product.is_new_arrival),
            status: product.status,
            image: null,
            images: []
        });
        setEditModalOpen(true);
    };

    // Helper to dynamically manage variant fields in ADD FORM
    const addVariantRow = () => {
        const currentVariants = [...addData.variants];
        currentVariants.push({ size: 'M', color: 'Black', stock_quantity: 10, price: '', cost_price: '' });
        setAddData('variants', currentVariants);
    };

    const updateVariantRow = (index, key, value) => {
        const currentVariants = [...addData.variants];
        currentVariants[index][key] = value;
        setAddData('variants', currentVariants);
    };

    const removeVariantRow = (index) => {
        const currentVariants = [...addData.variants];
        currentVariants.splice(index, 1);
        setAddData('variants', currentVariants);
    };

    // Toggle expand row
    const toggleExpand = (productId) => {
        if (expandedProduct === productId) {
            setExpandedProduct(null);
        } else {
            setExpandedProduct(productId);
        }
    };

    // Filters
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              product.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? product.category_id === Number(selectedCategory) : true;
        const matchesStatus = selectedStatus ? product.status === selectedStatus : true;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const formatPrice = (val) => {
        return `${currencySymbol} ${Number(val).toLocaleString()}`;
    };

    return (
        <AdminLayout title="Products Inventory Manager">
            <Head title="Products Management" />

            {/* Header Operations Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-250 shadow-sm">
                
                {/* Search / Filters */}
                <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Search Field */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by name, SKU..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                        />
                        <Search size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                        >
                            <option value="">All Collections</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                        <Filter size={12} className="absolute right-4 top-4 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500 appearance-none cursor-pointer"
                        >
                            <option value="">All Statuses</option>
                            <option value="active">Active Catalog</option>
                            <option value="inactive">Inactive Catalog</option>
                        </select>
                        <Filter size={12} className="absolute right-4 top-4 text-slate-400 pointer-events-none" />
                    </div>

                </div>

                {/* Add Product Button */}
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-black transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    <span>Create Master Product</span>
                </button>

            </div>

            {/* Core Inventory Table */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs uppercase text-slate-500 tracking-wider bg-slate-100">
                                <th className="py-4 px-6 font-bold w-12 text-center">Details</th>
                                <th className="py-4 px-4 font-bold">Product Model</th>
                                <th className="py-4 px-4 font-bold">SKU</th>
                                <th className="py-4 px-4 font-bold">Collection</th>
                                <th className="py-4 px-4 font-bold text-right">MSRP Price</th>
                                <th className="py-4 px-4 font-bold text-center">Net Inventory</th>
                                <th className="py-4 px-4 font-bold text-center">Badges</th>
                                <th className="py-4 px-4 font-bold text-center">Status</th>
                                <th className="py-4 px-6 font-bold text-right w-24">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="py-12 text-center text-xs text-slate-400 font-semibold uppercase tracking-wider">
                                        No matching inventory models found
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const hasVariants = product.variants && product.variants.length > 0;
                                    const isExpanded = expandedProduct === product.id;
                                    
                                    return (
                                        <React.Fragment key={product.id}>
                                            <tr className={`text-sm transition-colors hover:bg-slate-100/50 ${isExpanded ? 'bg-slate-100/30' : ''}`}>
                                                
                                                {/* Variant Toggler */}
                                                <td className="py-4 px-6 text-center">
                                                    {hasVariants ? (
                                                        <button 
                                                            onClick={() => toggleExpand(product.id)}
                                                            className="p-1 hover:bg-slate-200 rounded-md text-slate-500 hover:text-blue-600 transition-colors"
                                                            title="Toggle size/color variants breakdown"
                                                        >
                                                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                        </button>
                                                    ) : (
                                                        <span className="text-slate-400 block text-center">-</span>
                                                    )}
                                                </td>

                                                {/* Name */}
                                                <td className="py-4 px-4 font-bold text-slate-800">
                                                    <div className="flex items-center space-x-3">
                                                        {product.image ? (
                                                            <div className="h-10 w-10 rounded-lg overflow-hidden border border-slate-250 flex-shrink-0 bg-slate-50">
                                                                <img src={getAssetUrl(`storage/${product.image}`)} className="h-full w-full object-cover" alt="" />
                                                            </div>
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-lg border border-slate-200 flex-shrink-0 bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 select-none">
                                                                BS
                                                            </div>
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span>{product.name}</span>
                                                            {product.discount_price && (
                                                                <span className="text-xs text-blue-600 font-semibold mt-0.5">
                                                                    Sale: {formatPrice(product.discount_price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* SKU */}
                                                <td className="py-4 px-4 font-mono text-slate-650 font-medium">
                                                    {product.sku}
                                                </td>

                                                {/* Collection / Category */}
                                                <td className="py-4 px-4 font-semibold text-slate-550">
                                                    {product.category?.name || 'N/A'}
                                                </td>

                                                {/* MSRP Price */}
                                                <td className="py-4 px-4 text-right font-bold text-slate-800">
                                                    {formatPrice(product.price)}
                                                </td>

                                                {/* Net Stock Quantity */}
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`inline-block font-extrabold text-xs px-2.5 py-0.5 rounded ${
                                                        product.stock_quantity === 0 ? 'bg-red-50 text-red-700 border border-red-200/40' :
                                                        product.stock_quantity < 10 ? 'bg-amber-50 text-amber-705 text-amber-700 border border-amber-200/40' :
                                                        'bg-emerald-50 text-emerald-700 border border-emerald-200/40'
                                                    }`}>
                                                        {product.stock_quantity} Items
                                                    </span>
                                                </td>

                                                {/* Badges flags */}
                                                <td className="py-4 px-4 text-center">
                                                    <div className="flex items-center justify-center gap-1 flex-wrap">
                                                        {product.is_featured === 1 && (
                                                            <span className="bg-indigo-50 text-indigo-600 text-[10px] font-black px-1.5 py-0.5 rounded border border-indigo-250/20 uppercase">
                                                                Featured
                                                            </span>
                                                        )}
                                                        {product.is_trending === 1 && (
                                                            <span className="bg-purple-55 bg-purple-50 text-purple-650 text-purple-600 text-[10px] font-black px-1.5 py-0.5 rounded border border-purple-250/20 uppercase">
                                                                Trending
                                                            </span>
                                                        )}
                                                        {product.is_best_seller === 1 && (
                                                            <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-1.5 py-0.5 rounded border border-amber-250/20 uppercase">
                                                                Best Seller
                                                            </span>
                                                        )}
                                                        {product.is_new_arrival === 1 && (
                                                            <span className="bg-teal-50 text-teal-650 text-teal-600 text-[10px] font-black px-1.5 py-0.5 rounded border border-teal-250/20 uppercase">
                                                                New
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Catalog Status */}
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`inline-flex items-center space-x-1 text-xs font-extrabold px-2 py-0.5 rounded-full ${
                                                        product.status === 'active' 
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/30' 
                                                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                                                    }`}>
                                                        <span className={`h-1.5 w-1.5 rounded-full ${product.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                                        <span className="uppercase">{product.status}</span>
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-6 text-right">
                                                    <button
                                                        onClick={() => openEditModal(product)}
                                                        className="p-2 bg-slate-50 border border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 text-slate-500 rounded-xl transition-all"
                                                        title="Modify Product Parameters"
                                                    >
                                                        <Edit size={12} />
                                                    </button>
                                                </td>

                                            </tr>

                                            {/* Expanded variants list row */}
                                            {isExpanded && (
                                                <tr>
                                                    <td colSpan="9" className="bg-slate-100/70 p-6 border-l-2 border-l-blue-600">
                                                        <div className="space-y-4">
                                                            {/* Multiple Images Gallery */}
                                                            {product.images && product.images.length > 0 && (
                                                                <div className="space-y-2 pb-3 border-b border-slate-200/50">
                                                                    <h5 className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                                                                        Product Gallery Carousel / Pictures ({product.images.length})
                                                                    </h5>
                                                                    <div className="flex items-center space-x-3 overflow-x-auto py-1">
                                                                        {product.images.map((img) => (
                                                                            <div key={img.id} className="h-16 w-16 rounded-xl overflow-hidden border border-slate-200 shadow-sm flex-shrink-0 bg-white hover:scale-105 transition-transform duration-200">
                                                                                <img src={getAssetUrl(`storage/${img.image_path}`)} className="h-full w-full object-cover" alt="Product thumbnail" />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <h5 className="text-xs font-black uppercase text-blue-600 tracking-widest flex items-center space-x-1.5">
                                                                <Tag size={10} />
                                                                <span>Size & Color Variants Breakdown ({product.variants.length})</span>
                                                            </h5>
                                                            
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                                {product.variants.map((v) => (
                                                                    <div key={v.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-col justify-between shadow-sm">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-xs font-mono text-slate-500 font-bold">{v.sku}</span>
                                                                            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                                                                                v.stock_quantity === 0 ? 'bg-red-50 text-red-650 text-red-600' :
                                                                                v.stock_quantity < 5 ? 'bg-amber-50 text-amber-700' :
                                                                                'bg-slate-100 text-slate-600 border border-slate-200'
                                                                            }`}>
                                                                                {v.stock_quantity} left
                                                                            </span>
                                                                        </div>
                                                                        
                                                                        <div className="mt-2.5 flex items-center justify-between">
                                                                            <div className="flex items-center space-x-2">
                                                                                <span 
                                                                                    className="h-3 w-3 rounded-full border border-slate-200 block shadow-inner"
                                                                                    style={{ backgroundColor: v.color.toLowerCase() }}
                                                                                ></span>
                                                                                <span className="text-xs text-slate-800 font-bold uppercase">{v.color} / Size {v.size}</span>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                {v.cost_price && (
                                                                                    <p className="text-[10px] text-slate-400 font-bold">Cost: {formatPrice(v.cost_price)}</p>
                                                                                )}
                                                                                <span className="text-xs font-black text-slate-900 font-mono">{formatPrice(v.price || product.price)}</span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="mt-2 text-[9px] text-slate-400 font-semibold border-t border-slate-100 pt-2 flex justify-between items-center">
                                                                            <span>Updated:</span>
                                                                            <span>{v.updated_at ? new Date(v.updated_at).toLocaleString() : 'N/A'}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CREATE PRODUCT MODAL */}
            {addModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-50 border border-slate-250 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in scale-in duration-200">
                        
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-100">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center">
                                    <Sparkles size={16} className="text-blue-600 mr-2" />
                                    <span>Create Master Product Model</span>
                                </h3>
                                <p className="text-xs text-slate-500 font-semibold mt-0.5">Settle parameters, pricing thresholds, and options</p>
                            </div>
                            <button onClick={() => { setAddModalOpen(false); resetAddForm(); }} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleAddProductSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
                            
                            {/* General Parameters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Model Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Silk Summer Blazer"
                                        value={addData.name}
                                        onChange={(e) => setAddData('name', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    />
                                    {addErrors.name && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{addErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Master SKU *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. BSTUDIO-SLK-BLZ"
                                        value={addData.sku}
                                        onChange={(e) => setAddData('sku', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    />
                                    {addErrors.sku && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{addErrors.sku}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">MSRP Price (Rs.) *</label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={addData.price}
                                        onChange={(e) => setAddData('price', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    />
                                    {addErrors.price && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{addErrors.price}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Discount Price (Rs.)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="Optional"
                                        value={addData.discount_price}
                                        onChange={(e) => setAddData('discount_price', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    />
                                    {addErrors.discount_price && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{addErrors.discount_price}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Cost Price (Rs.)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="Optional"
                                        value={addData.cost_price}
                                        onChange={(e) => setAddData('cost_price', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    />
                                    {addErrors.cost_price && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{addErrors.cost_price}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">GST Tax Rate (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        placeholder="e.g. 18.00"
                                        value={addData.gst_rate}
                                        onChange={(e) => setAddData('gst_rate', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    />
                                    {addErrors.gst_rate && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{addErrors.gst_rate}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Collection Category *</label>
                                    <select
                                        value={addData.category_id}
                                        onChange={(e) => setAddData('category_id', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    >
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    {addErrors.category_id && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{addErrors.category_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Product Image Cover</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setAddData('image', e.target.files[0])}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-slate-700 focus:outline-none file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                                    />
                                    {addErrors.image && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{addErrors.image}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Gallery Images (Multiple)</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => setAddData('images', Array.from(e.target.files))}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-slate-700 focus:outline-none file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                                    />
                                    {addErrors.images && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{addErrors.images}</p>}
                                </div>
                            </div>

                            {/* Descriptions */}
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Short Description</label>
                                <input
                                    type="text"
                                    placeholder="Brief tagline for list pages..."
                                    value={addData.short_description}
                                    onChange={(e) => setAddData('short_description', e.target.value)}
                                    className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Full Product Description</label>
                                <textarea
                                    placeholder="Write details of fabric content, fit profile, style notes..."
                                    value={addData.description}
                                    onChange={(e) => setAddData('description', e.target.value)}
                                    rows="3"
                                    className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                ></textarea>
                            </div>

                            {/* Options Flags */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                                <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold select-none">
                                    <input
                                        type="checkbox"
                                        checked={addData.is_featured}
                                        onChange={(e) => setAddData('is_featured', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
                                    />
                                    <span className="text-slate-700">Featured</span>
                                </label>
                                <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold select-none">
                                    <input
                                        type="checkbox"
                                        checked={addData.is_trending}
                                        onChange={(e) => setAddData('is_trending', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
                                    />
                                    <span className="text-slate-700">Trending</span>
                                </label>
                                <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold select-none">
                                    <input
                                        type="checkbox"
                                        checked={addData.is_best_seller}
                                        onChange={(e) => setAddData('is_best_seller', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
                                    />
                                    <span className="text-slate-700">Best Seller</span>
                                </label>
                                <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold select-none">
                                    <input
                                        type="checkbox"
                                        checked={addData.is_new_arrival}
                                        onChange={(e) => setAddData('is_new_arrival', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
                                    />
                                    <span className="text-slate-700">New Arrival</span>
                                </label>
                            </div>

                            {/* Base stock if no variants, OR multi-variants interface */}
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider flex items-center">
                                            <Tag size={12} className="text-blue-600 mr-1.5" />
                                            <span>Sizes & Colors Variations</span>
                                        </h4>
                                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Define variants to activate granular inventory management</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addVariantRow}
                                        className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 hover:border-blue-500/40 text-slate-600 hover:text-blue-600 px-3.5 py-1.5 rounded-lg text-[10px] font-black transition-colors"
                                    >
                                        <Plus size={12} />
                                        <span>Add Variant Row</span>
                                    </button>
                                </div>

                                {addData.variants.length === 0 ? (
                                    <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                                        <div className="flex items-start space-x-3">
                                            <Info size={14} className="text-blue-600 mt-0.5" />
                                            <div className="text-xs">
                                                <p className="font-bold text-slate-800 font-sans">Defaulting to Single Master Stock</p>
                                                <p className="text-slate-500 font-semibold mt-0.5 mb-2.5">If you do not define variants, the master inventory stock value below will represent the entire size-less product.</p>
                                                
                                                <div className="max-w-[200px]">
                                                    <label className="block text-[9px] uppercase font-bold text-slate-550 text-slate-500 mb-1">Master Net Stock *</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        min="0"
                                                        value={addData.stock_quantity}
                                                        onChange={(e) => setAddData('stock_quantity', Number(e.target.value))}
                                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-[9px] uppercase text-slate-500 tracking-wider font-bold">
                                                    <th className="pb-2 w-1/5">Color *</th>
                                                    <th className="pb-2 w-1/5">Size *</th>
                                                    <th className="pb-2 w-1/5 text-center">Variant Stock *</th>
                                                    <th className="pb-2 w-1/5 text-center">Cost Price (Rs.)</th>
                                                    <th className="pb-2 w-1/5 text-center">Custom Price (Rs.)</th>
                                                    <th className="pb-2 w-12 text-center">Remove</th>
                                                </tr>
                                            </thead>
                                            <tbody className="space-y-2">
                                                {addData.variants.map((v, index) => (
                                                    <tr key={index} className="align-middle">
                                                        <td className="pr-2 pb-2">
                                                            <input
                                                                type="text"
                                                                required
                                                                placeholder="e.g. Navy, Khaki"
                                                                value={v.color}
                                                                onChange={(e) => updateVariantRow(index, 'color', e.target.value)}
                                                                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                                                            />
                                                        </td>
                                                        <td className="pr-2 pb-2">
                                                            <select
                                                                value={v.size}
                                                                onChange={(e) => updateVariantRow(index, 'size', e.target.value)}
                                                                className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs text-slate-850 focus:outline-none"
                                                            >
                                                                <option value="S">S (Small)</option>
                                                                <option value="M">M (Medium)</option>
                                                                <option value="L">L (Large)</option>
                                                                <option value="XL">XL (Extra Large)</option>
                                                                <option value="XXL">XXL (Double Extra)</option>
                                                                <option value="Free">Free Size</option>
                                                            </select>
                                                        </td>
                                                        <td className="pr-2 pb-2">
                                                            <input
                                                                type="number"
                                                                required
                                                                min="0"
                                                                placeholder="Qty"
                                                                value={v.stock_quantity}
                                                                onChange={(e) => updateVariantRow(index, 'stock_quantity', Number(e.target.value))}
                                                                className="w-full bg-white border border-slate-200 text-center focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                                                            />
                                                        </td>
                                                        <td className="pr-2 pb-2">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                placeholder="Optional"
                                                                value={v.cost_price}
                                                                onChange={(e) => updateVariantRow(index, 'cost_price', e.target.value)}
                                                                className="w-full bg-white border border-slate-200 text-center focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                                                            />
                                                        </td>
                                                        <td className="pr-2 pb-2">
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                placeholder="MSRP fallback"
                                                                value={v.price}
                                                                onChange={(e) => updateVariantRow(index, 'price', e.target.value)}
                                                                className="w-full bg-white border border-slate-200 text-center focus:border-blue-500 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                                                            />
                                                        </td>
                                                        <td className="pb-2 text-center">
                                                            <button
                                                                type="button"
                                                                onClick={() => removeVariantRow(index)}
                                                                className="text-slate-400 hover:text-red-500 p-1.5 bg-slate-50 hover:bg-red-50 border border-slate-200 rounded-lg transition-colors"
                                                            >
                                                                <X size={12} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => { setAddModalOpen(false); resetAddForm(); }}
                                    className="bg-slate-50 hover:bg-slate-150 hover:bg-slate-100 border border-slate-200 text-slate-500 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={addProcessing}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-sm"
                                >
                                    {addProcessing ? 'Creating...' : 'Initialize Product'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* EDIT PRODUCT DETAILS MODAL */}
            {editModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-50 border border-slate-250 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in scale-in duration-200">
                        
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-100">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center">
                                    <Sparkles size={16} className="text-blue-600 mr-2" />
                                    <span>Modify Parameters: <span className="font-mono text-blue-600 font-semibold">{editingProduct?.sku}</span></span>
                                </h3>
                                <p className="text-xs text-slate-500 font-semibold mt-0.5">Update catalog metadata and overall stock count</p>
                            </div>
                            <button onClick={() => { setEditModalOpen(false); setEditingProduct(null); }} className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleEditProductSubmit} className="p-6 space-y-5">
                            
                            {/* General Parameters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Model Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={editData.name}
                                        onChange={(e) => setEditData('name', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    />
                                    {editErrors.name && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{editErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Master SKU *</label>
                                    <input
                                        type="text"
                                        required
                                        value={editData.sku}
                                        onChange={(e) => setEditData('sku', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    />
                                    {editErrors.sku && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{editErrors.sku}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">MSRP Price (Rs.) *</label>
                                    <input
                                        type="number"
                                        required
                                        step="0.01"
                                        min="0"
                                        value={editData.price}
                                        onChange={(e) => setEditData('price', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    />
                                    {editErrors.price && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{editErrors.price}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Discount Price (Rs.)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editData.discount_price}
                                        onChange={(e) => setEditData('discount_price', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    />
                                    {editErrors.discount_price && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{editErrors.discount_price}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Cost Price (Rs.)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editData.cost_price}
                                        onChange={(e) => setEditData('cost_price', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    />
                                    {editErrors.cost_price && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{editErrors.cost_price}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">GST Tax Rate (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={editData.gst_rate}
                                        onChange={(e) => setEditData('gst_rate', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    />
                                    {editErrors.gst_rate && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{editErrors.gst_rate}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Collection Category *</label>
                                    <select
                                        value={editData.category_id}
                                        onChange={(e) => setEditData('category_id', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    >
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    {editErrors.category_id && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{editErrors.category_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Product Image Cover</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setEditData('image', e.target.files[0])}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-slate-700 focus:outline-none file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                                    />
                                    {editErrors.image && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{editErrors.image}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Upload More Images (Gallery)</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => setEditData('images', Array.from(e.target.files))}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2 text-xs text-slate-700 focus:outline-none file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                                    />
                                    {editErrors.images && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{editErrors.images}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Master Net Stock Count *</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={editData.stock_quantity}
                                        onChange={(e) => setEditData('stock_quantity', Number(e.target.value))}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    />
                                    {editErrors.stock_quantity && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{editErrors.stock_quantity}</p>}
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Catalog Status *</label>
                                    <select
                                        value={editData.status}
                                        onChange={(e) => setEditData('status', e.target.value)}
                                        className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-850 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                    >
                                        <option value="active">Active (Visible on shop)</option>
                                        <option value="inactive">Inactive (Hidden from customers)</option>
                                    </select>
                                    {editErrors.status && <p className="text-[10px] text-red-555 text-red-500 mt-1 font-bold">{editErrors.status}</p>}
                                </div>
                            </div>

                            {/* Descriptions */}
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Short Description</label>
                                <input
                                    type="text"
                                    value={editData.short_description}
                                    onChange={(e) => setEditData('short_description', e.target.value)}
                                    className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1.5 font-sans">Full Product Description</label>
                                <textarea
                                    value={editData.description}
                                    onChange={(e) => setEditData('description', e.target.value)}
                                    rows="3"
                                    className="w-full bg-white border border-slate-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500/20"
                                ></textarea>
                            </div>

                            {/* Option Flags */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                                <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold select-none">
                                    <input
                                        type="checkbox"
                                        checked={editData.is_featured}
                                        onChange={(e) => setEditData('is_featured', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
                                    />
                                    <span className="text-slate-700">Featured</span>
                                </label>
                                <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold select-none">
                                    <input
                                        type="checkbox"
                                        checked={editData.is_trending}
                                        onChange={(e) => setEditData('is_trending', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
                                    />
                                    <span className="text-slate-700">Trending</span>
                                </label>
                                <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold select-none">
                                    <input
                                        type="checkbox"
                                        checked={editData.is_best_seller}
                                        onChange={(e) => setEditData('is_best_seller', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
                                    />
                                    <span className="text-slate-700">Best Seller</span>
                                </label>
                                <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-semibold select-none">
                                    <input
                                        type="checkbox"
                                        checked={editData.is_new_arrival}
                                        onChange={(e) => setEditData('is_new_arrival', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
                                    />
                                    <span className="text-slate-700">New Arrival</span>
                                </label>
                            </div>

                            {/* Submit Buttons */}
                            <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => { setEditModalOpen(false); setEditingProduct(null); }}
                                    className="bg-slate-50 hover:bg-slate-150 hover:bg-slate-100 border border-slate-200 text-slate-500 px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-sm"
                                >
                                    {editProcessing ? 'Saving Changes...' : 'Commit Modifications'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}
