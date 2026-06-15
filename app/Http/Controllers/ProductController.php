<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\Wishlist;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function welcome()
    {
        // 1. Explore Collections: categories marked as show_on_homepage = true, ordered by display_order
        $categories = Category::where('show_on_homepage', true)
            ->orderBy('display_order', 'asc')
            ->orderBy('id', 'asc')
            ->withCount('products')
            ->get();
            
        if ($categories->isEmpty()) {
            $categories = Category::withCount('products')->orderBy('id', 'asc')->get();
        }

        // 2. Featured Couture: show_in_featured_couture = true
        $featured = Product::where('status', 'active')
            ->where('show_in_featured_couture', true)
            ->orderBy('display_order', 'asc')
            ->with(['variants', 'category'])
            ->get();
            
        if ($featured->isEmpty()) {
            $featured = Product::where('status', 'active')
                ->where('is_featured', true)
                ->with(['variants', 'category'])
                ->limit(8)
                ->get();
        }

        // 3. Trending Apparel / Viral Clothing: show_in_trending_apparel = true
        $trending = Product::where('status', 'active')
            ->where('show_in_trending_apparel', true)
            ->orderBy('display_order', 'asc')
            ->with(['variants', 'category'])
            ->get();

        if ($trending->count() < 4) {
            // Load by completed order item sales volumes as fallback
            $trendingProductIds = \Illuminate\Support\Facades\DB::table('order_items')
                ->select('product_id', \Illuminate\Support\Facades\DB::raw('SUM(quantity) as total_sold'))
                ->groupBy('product_id')
                ->orderBy('total_sold', 'desc')
                ->pluck('product_id')
                ->toArray();

            $fallbackTrending = Product::where('status', 'active')
                ->whereIn('id', $trendingProductIds)
                ->whereNotIn('id', $trending->pluck('id')->toArray())
                ->with(['variants', 'category'])
                ->get()
                ->sortBy(function ($product) use ($trendingProductIds) {
                    return array_search($product->id, $trendingProductIds);
                });
                
            $trending = $trending->concat($fallbackTrending);
            
            if ($trending->count() < 4) {
                $fallbackIsTrending = Product::where('status', 'active')
                    ->where('is_trending', true)
                    ->whereNotIn('id', $trending->pluck('id')->toArray())
                    ->with(['variants', 'category'])
                    ->limit(4 - $trending->count())
                    ->get();
                $trending = $trending->concat($fallbackIsTrending);
            }
            
            // limit to 4
            $trending = $trending->take(4)->values();
        }

        // 4. Best Sellers: show_in_best_sellers = true
        $bestSellers = Product::where('status', 'active')
            ->where('show_in_best_sellers', true)
            ->orderBy('display_order', 'asc')
            ->with(['variants', 'category'])
            ->get();

        if ($bestSellers->count() < 4) {
            // Load by wishlist frequencies as fallback
            $mostWantedIds = \Illuminate\Support\Facades\DB::table('wishlists')
                ->select('product_id', \Illuminate\Support\Facades\DB::raw('COUNT(id) as wishlist_count'))
                ->groupBy('product_id')
                ->orderBy('wishlist_count', 'desc')
                ->pluck('product_id')
                ->toArray();

            $fallbackBest = Product::where('status', 'active')
                ->whereIn('id', $mostWantedIds)
                ->whereNotIn('id', $bestSellers->pluck('id')->toArray())
                ->with(['variants', 'category'])
                ->get()
                ->sortBy(function ($product) use ($mostWantedIds) {
                    return array_search($product->id, $mostWantedIds);
                });
                
            $bestSellers = $bestSellers->concat($fallbackBest);
            
            if ($bestSellers->count() < 4) {
                $fallbackIsBest = Product::where('status', 'active')
                    ->where('is_best_seller', true)
                    ->whereNotIn('id', $bestSellers->pluck('id')->toArray())
                    ->with(['variants', 'category'])
                    ->limit(4 - $bestSellers->count())
                    ->get();
                $bestSellers = $bestSellers->concat($fallbackIsBest);
            }
            
            // limit to 4
            $bestSellers = $bestSellers->take(4)->values();
        }

        // 5. New Arrivals: show_in_new_arrivals = true
        $newArrivals = Product::where('status', 'active')
            ->where('show_in_new_arrivals', true)
            ->orderBy('display_order', 'asc')
            ->with(['variants', 'category'])
            ->get();
            
        if ($newArrivals->isEmpty()) {
            $newArrivals = Product::where('status', 'active')
                ->where('is_new_arrival', true)
                ->with(['variants', 'category'])
                ->limit(8)
                ->get();
        }

        // Settings (Hero and Banners)
        $settingsKeys = [
            'hero_badge', 'hero_title', 'hero_subtitle', 'hero_button_text', 'hero_button_link', 
            'hero_secondary_button_text', 'hero_secondary_button_link',
            'banner_badge', 'banner_title', 'banner_subtitle', 'banner_button_text', 'banner_button_link'
        ];

        $settings = [];
        foreach ($settingsKeys as $key) {
            $settings[$key] = \App\Models\Setting::get($key, '');
        }

        return Inertia::render('Welcome', [
            'categories' => $categories,
            'featuredProducts' => $featured,
            'trendingProducts' => $trending,
            'bestSellers' => $bestSellers,
            'newArrivals' => $newArrivals,
            'settings' => $settings,
        ]);
    }

    public function shop(Request $request)
    {
        $query = Product::where('status', 'active')->with(['category', 'variants']);

        // Filter by category
        if ($request->filled('category')) {
            $categorySlug = $request->input('category');
            $category = Category::where('slug', $categorySlug)->first();
            if ($category) {
                // If it has children, get products from children as well
                $categoryIds = Category::where('parent_id', $category->id)->pluck('id')->push($category->id);
                $query->whereIn('category_id', $categoryIds);
            }
        }

        // Filter by search query
        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('sku', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%");
            });
        }

        // Filter by price range
        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->input('min_price'));
        }
        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->input('max_price'));
        }

        // Filter by color (in variants)
        if ($request->filled('color')) {
            $colors = explode(',', $request->input('color'));
            $query->whereHas('variants', function($q) use ($colors) {
                $q->whereIn('color', $colors);
            });
        }

        // Filter by size (in variants)
        if ($request->filled('size')) {
            $sizes = explode(',', $request->input('size'));
            $query->whereHas('variants', function($q) use ($sizes) {
                $q->whereIn('size', $sizes);
            });
        }

        // Sort products
        $sort = $request->input('sort', 'newest');
        switch ($sort) {
            case 'price_low':
                $query->orderBy('price', 'asc');
                break;
            case 'price_high':
                $query->orderBy('price', 'desc');
                break;
            case 'popular':
                $query->orderBy('is_best_seller', 'desc');
                break;
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $products = $query->paginate(9)->withQueryString();
        $categories = Category::all();

        // Get unique colors and sizes for filter sidebar
        $allColors = \App\Models\ProductVariant::distinct()->pluck('color')->filter()->values();
        $allSizes = \App\Models\ProductVariant::distinct()->pluck('size')->filter()->values();

        return Inertia::render('Shop', [
            'products' => $products,
            'categories' => $categories,
            'filters' => (object) $request->only(['category', 'search', 'min_price', 'max_price', 'color', 'size', 'sort']),
            'availableColors' => $allColors,
            'availableSizes' => $allSizes,
        ]);
    }

    public function collections(Request $request)
    {
        $categories = Category::withCount('products')->get();
        
        $products = Product::where('status', 'active')
            ->where('show_in_collections', true)
            ->with(['category', 'variants'])
            ->orderBy('display_order', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Collections', [
            'categories' => $categories,
            'products' => $products,
        ]);
    }

    public function show($slug)
    {
        $product = Product::where('slug', $slug)
            ->where('status', 'active')
            ->with(['category', 'variants', 'reviews.user'])
            ->firstOrFail();

        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('status', 'active')
            ->limit(4)
            ->get();

        // Check if item is in user's wishlist
        $inWishlist = false;
        if (auth()->check()) {
            $inWishlist = Wishlist::where('user_id', auth()->id())
                ->where('product_id', $product->id)
                ->exists();
        }

        return Inertia::render('ProductDetail', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'inWishlist' => $inWishlist,
        ]);
    }

    public function toggleWishlist(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $userId = auth()->id();
        $productId = $request->input('product_id');

        $exists = Wishlist::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($exists) {
            $exists->delete();
            $inWishlist = false;
            $message = 'Product removed from wishlist.';
        } else {
            Wishlist::create([
                'user_id' => $userId,
                'product_id' => $productId,
            ]);
            $inWishlist = true;
            $message = 'Product added to wishlist.';
        }

        return back()->with('success', $message);
    }

    public function wishlist()
    {
        $wishlistItems = Wishlist::where('user_id', auth()->id())
            ->whereHas('product', function($q) {
                $q->where('status', 'active');
            })
            ->with(['product.category', 'product.variants'])
            ->get()
            ->pluck('product');

        return Inertia::render('Wishlist', [
            'products' => $wishlistItems,
        ]);
    }

    public function storeReview(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        Review::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'product_id' => $request->product_id,
            ],
            [
                'rating' => $request->rating,
                'comment' => $request->comment,
            ]
        );

        return back()->with('success', 'Thank you for your review!');
    }
}
