<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Category;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class SuperAdminController extends Controller
{
    /**
     * Module 1 & 9: Website Control (Hero and general settings)
     */
    public function websiteControl()
    {
        $settingsKeys = [
            'hero_badge', 'hero_title', 'hero_subtitle', 'hero_button_text', 'hero_button_link', 
            'hero_secondary_button_text', 'hero_secondary_button_link',
            'banner_badge', 'banner_title', 'banner_subtitle', 'banner_button_text', 'banner_button_link'
        ];

        $settings = [];
        foreach ($settingsKeys as $key) {
            $settings[$key] = Setting::get($key, '');
        }

        // Get count of products in different groups for summary
        $stats = [
            'total_products' => Product::count(),
            'featured' => Product::where('show_in_featured_couture', true)->count(),
            'new_arrivals' => Product::where('show_in_new_arrivals', true)->count(),
            'trending' => Product::where('show_in_trending_apparel', true)->count(),
            'best_sellers' => Product::where('show_in_best_sellers', true)->count(),
            'explore_collections' => Product::where('show_in_explore_collections', true)->count(),
            'collections_page' => Product::where('show_in_collections', true)->count(),
        ];

        return Inertia::render('Admin/Superadmin/WebsiteControl', [
            'settings' => $settings,
            'stats' => $stats,
        ]);
    }

    public function updateWebsiteControl(Request $request)
    {
        $request->validate([
            'hero_badge' => 'nullable|string|max:255',
            'hero_title' => 'nullable|string|max:255',
            'hero_subtitle' => 'nullable|string|max:1000',
            'hero_button_text' => 'nullable|string|max:255',
            'hero_button_link' => 'nullable|string|max:255',
            'hero_secondary_button_text' => 'nullable|string|max:255',
            'hero_secondary_button_link' => 'nullable|string|max:255',
            'banner_badge' => 'nullable|string|max:255',
            'banner_title' => 'nullable|string|max:255',
            'banner_subtitle' => 'nullable|string|max:1000',
            'banner_button_text' => 'nullable|string|max:255',
            'banner_button_link' => 'nullable|string|max:255',
        ]);

        foreach ($request->except('_token') as $key => $value) {
            Setting::set($key, $value);
        }

        return back()->with('success', 'Hero banner and general settings updated successfully!');
    }

    /**
     * Module 6: Homepage Sections Manager (Category Homepage settings)
     */
    public function homepageSections()
    {
        $categories = Category::orderBy('display_order', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('Admin/Superadmin/HomepageSections', [
            'categories' => $categories,
        ]);
    }

    public function updateHomepageSections(Request $request)
    {
        $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:categories,id',
            'categories.*.display_order' => 'required|integer',
            'categories.*.show_on_homepage' => 'required|boolean',
            'categories.*.image_file' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:20480',
        ]);

        DB::transaction(function() use ($request) {
            foreach ($request->input('categories') as $index => $catData) {
                $category = Category::find($catData['id']);
                if ($category) {
                    $updateData = [
                        'display_order' => $catData['display_order'],
                        'show_on_homepage' => $catData['show_on_homepage'],
                    ];

                    // Handle dynamic file uploads if sent inside files request
                    $fileKey = "categories.{$index}.image_file";
                    if ($request->hasFile($fileKey)) {
                        // Delete old image
                        if ($category->image && Storage::disk('public')->exists($category->image)) {
                            Storage::disk('public')->delete($category->image);
                        }
                        $updateData['image'] = $request->file($fileKey)->store('categories', 'public');
                    }

                    $category->update($updateData);
                }
            }
        });

        return back()->with('success', 'Homepage categories section updated successfully!');
    }

    /**
     * Module 2: Products Control (Full CRUD & Image upload systems)
     */
    public function productsControl()
    {
        $products = Product::with(['category', 'variants'])
            ->orderBy('display_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        $categories = Category::all();

        return Inertia::render('Admin/Superadmin/ProductsControl', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function storeProductControl(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'stock_quantity' => 'required|integer|min:0',
            'display_order' => 'required|integer',
            'status' => 'required|string|in:active,inactive',
            'show_in_featured_couture' => 'boolean',
            'show_in_new_arrivals' => 'boolean',
            'show_in_trending_apparel' => 'boolean',
            'show_in_best_sellers' => 'boolean',
            'show_in_explore_collections' => 'boolean',
            'show_in_collections' => 'boolean',
            'sizes' => 'nullable|string', // Comma separated sizes (e.g. S,M,L)
            'colors' => 'nullable|string', // Comma separated colors (e.g. Navy,Khaki)
            'main_image_file' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:20480',
            'gallery_image_files' => 'nullable|array',
            'gallery_image_files.*' => 'required|image|mimes:jpg,jpeg,png,webp|max:20480',
        ]);

        $mainImagePath = null;
        if ($request->hasFile('main_image_file')) {
            $mainImagePath = $request->file('main_image_file')->store('products', 'public');
        }

        $galleryImages = [];
        if ($request->hasFile('gallery_image_files')) {
            foreach ($request->file('gallery_image_files') as $file) {
                $galleryImages[] = $file->store('products', 'public');
            }
        }

        DB::transaction(function() use ($request, $mainImagePath, $galleryImages) {
            $product = Product::create([
                'name' => $request->name,
                'slug' => Str::slug($request->name),
                'sku' => $request->sku,
                'price' => $request->price,
                'discount_price' => $request->discount_price,
                'category_id' => $request->category_id,
                'description' => $request->description,
                'short_description' => $request->short_description,
                'stock_quantity' => $request->stock_quantity,
                'display_order' => $request->display_order,
                'status' => $request->status,
                'show_in_featured_couture' => $request->show_in_featured_couture ?? false,
                'show_in_new_arrivals' => $request->show_in_new_arrivals ?? false,
                'show_in_trending_apparel' => $request->show_in_trending_apparel ?? false,
                'show_in_best_sellers' => $request->show_in_best_sellers ?? false,
                'show_in_explore_collections' => $request->show_in_explore_collections ?? false,
                'show_in_collections' => $request->show_in_collections ?? true,
                'main_image' => $mainImagePath,
                'image' => $mainImagePath,
                'gallery_images' => count($galleryImages) > 0 ? json_encode($galleryImages) : null,
            ]);

            // Add sizes and colors variants
            $sizes = $request->filled('sizes') ? array_map('trim', explode(',', $request->sizes)) : [null];
            $colors = $request->filled('colors') ? array_map('trim', explode(',', $request->colors)) : [null];

            if ($request->filled('sizes') || $request->filled('colors')) {
                $totalStock = 0;
                foreach ($sizes as $size) {
                    foreach ($colors as $color) {
                        $variantSku = $product->sku;
                        if ($color) $variantSku .= '-' . strtoupper(substr($color, 0, 2));
                        if ($size) $variantSku .= '-' . strtoupper($size);

                        ProductVariant::create([
                            'product_id' => $product->id,
                            'size' => $size,
                            'color' => $color,
                            'sku' => $variantSku,
                            'price' => null,
                            'stock_quantity' => intval($request->stock_quantity / (count($sizes) * count($colors))) ?: 5,
                        ]);
                        $totalStock += intval($request->stock_quantity / (count($sizes) * count($colors))) ?: 5;
                    }
                }
                $product->update(['stock_quantity' => $totalStock]);
            }
        });

        return back()->with('success', 'Product created and dynamic controls saved successfully!');
    }

    public function updateProductControl(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'stock_quantity' => 'required|integer|min:0',
            'display_order' => 'required|integer',
            'status' => 'required|string|in:active,inactive',
            'show_in_featured_couture' => 'boolean',
            'show_in_new_arrivals' => 'boolean',
            'show_in_trending_apparel' => 'boolean',
            'show_in_best_sellers' => 'boolean',
            'show_in_explore_collections' => 'boolean',
            'show_in_collections' => 'boolean',
            'main_image_file' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:20480',
            'gallery_image_files' => 'nullable|array',
            'gallery_image_files.*' => 'required|image|mimes:jpg,jpeg,png,webp|max:20480',
        ]);

        $updateData = [
            'name' => $request->name,
            'sku' => $request->sku,
            'price' => $request->price,
            'discount_price' => $request->discount_price,
            'category_id' => $request->category_id,
            'description' => $request->description,
            'short_description' => $request->short_description,
            'stock_quantity' => $request->stock_quantity,
            'display_order' => $request->display_order,
            'status' => $request->status,
            'show_in_featured_couture' => $request->show_in_featured_couture ?? false,
            'show_in_new_arrivals' => $request->show_in_new_arrivals ?? false,
            'show_in_trending_apparel' => $request->show_in_trending_apparel ?? false,
            'show_in_best_sellers' => $request->show_in_best_sellers ?? false,
            'show_in_explore_collections' => $request->show_in_explore_collections ?? false,
            'show_in_collections' => $request->show_in_collections ?? true,
        ];

        // Handle Main Image replacement
        if ($request->hasFile('main_image_file')) {
            if ($product->main_image && Storage::disk('public')->exists($product->main_image)) {
                Storage::disk('public')->delete($product->main_image);
            }
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $storedPath = $request->file('main_image_file')->store('products', 'public');
            $updateData['main_image'] = $storedPath;
            $updateData['image'] = $storedPath;
        }

        // Handle Gallery Image additions
        if ($request->hasFile('gallery_image_files')) {
            $existingGallery = json_decode($product->gallery_images, true) ?: [];
            foreach ($request->file('gallery_image_files') as $file) {
                $existingGallery[] = $file->store('products', 'public');
            }
            $updateData['gallery_images'] = json_encode($existingGallery);
        }

        $product->update($updateData);

        return back()->with('success', 'Product details and website control flags updated!');
    }

    /**
     * Module 3: Collections Page Manager
     */
    public function collectionsControl()
    {
        $products = Product::orderBy('display_order', 'asc')
            ->orderBy('id', 'desc')
            ->get();

        return Inertia::render('Admin/Superadmin/CollectionsControl', [
            'products' => $products,
        ]);
    }

    public function updateCollectionsControl(Request $request)
    {
        $request->validate([
            'products' => 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.show_in_collections' => 'required|boolean',
            'products.*.display_order' => 'required|integer',
        ]);

        DB::transaction(function() use ($request) {
            foreach ($request->input('products') as $item) {
                $product = Product::find($item['id']);
                if ($product) {
                    $product->update([
                        'show_in_collections' => $item['show_in_collections'],
                        'display_order' => $item['display_order'],
                    ]);
                }
            }
        });

        return back()->with('success', 'Collections page visible products updated successfully!');
    }
}
