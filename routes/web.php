<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\POSController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ProfileController;

use Illuminate\Support\Facades\Route;


// Temporary utility route to initialize migrations, create/update admin accounts, and check users.
Route::get('/admin-setup', function (\Illuminate\Http\Request $request) {
    // Security check for production environment
    if (!app()->environment('local') && $request->query('key') !== 'brands_studio_secure_setup_9912') {
        return response()->json([
            'status' => 'error',
            'message' => 'Unauthorized access to setup route.',
        ], 403);
    }

    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);

        $email = $request->query('email', 'admin@brandsstudio.com');
        $password = $request->query('password', 'password');
        $name = $request->query('name', 'Super Admin');
        $role = $request->query('role', 'super_admin');

        $user = \App\Models\User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => \Illuminate\Support\Facades\Hash::make($password),
                'role' => $role,
                'email_verified_at' => now(),
            ]
        );

        $users = \App\Models\User::select('id', 'name', 'email', 'role', 'created_at')->get();
        $products = \App\Models\Product::select('id', 'name', 'slug', 'image', 'main_image', 'gallery_images')->get();

        // Optional: Auto-repair any products or categories where image is too large (> 150KB base64) or "0"
        $repairedProducts = 0;
        $repairedCategories = 0;
        if ($request->query('repair') === '1') {
            $transparentPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

            $allProducts = \App\Models\Product::all();
            foreach ($allProducts as $p) {
                $needsUpdate = false;
                $updateData = [];

                if ($p->image === '0' || $p->image === 0 || $p->image === '') {
                    $updateData['image'] = null;
                    $updateData['main_image'] = null;
                    $needsUpdate = true;
                }

                // If image is base64 and larger than 150KB, reset it to prevent Vercel payload crash
                if ($p->image && strlen($p->image) > 150000) {
                    $updateData['image'] = $transparentPixel;
                    $updateData['main_image'] = $transparentPixel;
                    $needsUpdate = true;
                }

                if ($needsUpdate) {
                    $p->update($updateData);
                    $repairedProducts++;
                }
            }

            $allCategories = \App\Models\Category::all();
            foreach ($allCategories as $c) {
                if ($c->image && strlen($c->image) > 150000) {
                    $c->update(['image' => $transparentPixel]);
                    $repairedCategories++;
                }
            }

            $allGalleryImages = \App\Models\ProductImage::all();
            $repairedGallery = 0;
            foreach ($allGalleryImages as $gi) {
                if ($gi->image_path && strlen($gi->image_path) > 150000) {
                    $gi->update(['image_path' => $transparentPixel]);
                    $repairedGallery++;
                }
            }

            // Refetch products without the heavy base64 strings to return in response
            $products = \App\Models\Product::select('id', 'name', 'slug', 'price', 'stock_quantity')->get();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'User account and products checked/updated!',
            'repaired_products' => $repairedProducts,
            'repaired_categories' => $repairedCategories,
            'repaired_gallery_images' => $repairedGallery,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'password' => $password
            ],
            'all_users' => $users,
            'all_products' => $products
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
});


// Temporary utility route to reset/cleanup database store data for fresh entries.
Route::get('/admin-cleanup', function (\Illuminate\Http\Request $request) {
    // Security check for production environment
    if (!app()->environment('local') && $request->query('key') !== 'brands_studio_secure_cleanup_9912') {
        return response()->json([
            'status' => 'error',
            'message' => 'Unauthorized access to cleanup route.',
        ], 403);
    }

    try {
        $tables = [
            'order_items',
            'orders',
            'product_variants',
            'products',
            'categories',
            'coupons',
            'expenses',
            'wishlists',
            'reviews',
            'notifications',
        ];

        $driver = \Illuminate\Support\Facades\DB::getDriverName();

        if ($driver === 'mysql') {
            \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
            foreach ($tables as $table) {
                \Illuminate\Support\Facades\DB::table($table)->truncate();
            }
            \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();
        } else {
            // PostgreSQL or other drivers: Use TRUNCATE with CASCADE
            \Illuminate\Support\Facades\DB::statement('TRUNCATE TABLE ' . implode(', ', $tables) . ' CASCADE;');
        }

        return response()->json([
            'status' => 'success',
            'message' => 'E-Commerce store data cleared successfully!',
            'driver_used' => $driver,
            'truncated_tables' => $tables,
            'note' => 'Users, roles, and settings tables were preserved as requested.'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
        ], 500);
    }
});






// 1. General E-Commerce Storefront Routes (Guest/Customer)
Route::get('/', [ProductController::class, 'welcome'])->name('welcome');
Route::get('/shop', [ProductController::class, 'shop'])->name('shop');
Route::get('/collections', [ProductController::class, 'collections'])->name('collections');
Route::get('/product/{slug}', [ProductController::class, 'show'])->name('product.show');
Route::get('/cart', [OrderController::class, 'cart'])->name('cart');
Route::get('/tracking', [OrderController::class, 'tracking'])->name('order.tracking');
Route::post('/api/coupon/apply', [OrderController::class, 'applyCoupon'])->name('coupon.apply');
Route::post('/coupon/apply', [OrderController::class, 'applyCoupon']);
Route::get('/shipping-info', function () {
    return Inertia\Inertia::render('ShippingInfo');
})->name('shipping.info');
Route::get('/faqs', function () {
    return Inertia\Inertia::render('FAQs');
})->name('faqs');

// Checkout & Orders (Guest/Customer)
Route::get('/checkout', [OrderController::class, 'checkout'])->name('checkout');
Route::post('/checkout', [OrderController::class, 'storeOrder'])->name('order.store');
Route::get('/order/success/{order_number}', [OrderController::class, 'orderSuccess'])->name('order.success');

// 2. Customer Auth Routes
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard & Profile
    Route::get('/dashboard', [OrderController::class, 'userOrders'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Shopping Interactivity
    Route::post('/wishlist/toggle', [ProductController::class, 'toggleWishlist'])->name('wishlist.toggle');
    Route::get('/wishlist', [ProductController::class, 'wishlist'])->name('wishlist');
    Route::post('/review/store', [ProductController::class, 'storeReview'])->name('review.store');

});

// 3. Admin Dashboard & POS Routes (Super Admin, Admin, Cashier, Staff via AdminMiddleware)
Route::middleware(['auth', \App\Http\Middleware\AdminMiddleware::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // POS System Operations
    Route::get('/pos', [POSController::class, 'index'])->name('pos.index');
    Route::get('/api/pos/search', [POSController::class, 'search'])->name('pos.search');
    Route::post('/api/pos/checkout', [POSController::class, 'checkout'])->name('pos.checkout');
    Route::post('/api/pos/refund/{order}', [POSController::class, 'refund'])->name('pos.refund');
    Route::post('/api/pos/customer', [POSController::class, 'storeCustomer'])->name('pos.customer.store');
    
    // Products Management
    Route::get('/products', [AdminDashboardController::class, 'products'])->name('products');
    Route::post('/products', [AdminDashboardController::class, 'storeProduct'])->name('products.store');
    Route::patch('/products/{product}', [AdminDashboardController::class, 'updateProduct'])->name('products.update');
    Route::delete('/products/{product}', [AdminDashboardController::class, 'destroyProduct'])->name('products.destroy');
    
    // Categories Management
    Route::get('/categories', [AdminDashboardController::class, 'categories'])->name('categories');
    Route::get('/subcategories', [AdminDashboardController::class, 'subcategories'])->name('subcategories');
    Route::post('/categories', [AdminDashboardController::class, 'storeCategory'])->name('categories.store');
    Route::patch('/categories/{category}', [AdminDashboardController::class, 'updateCategory'])->name('categories.update');
    Route::delete('/categories/{category}', [AdminDashboardController::class, 'destroyCategory'])->name('categories.destroy');
    
    // Orders Management
    Route::get('/orders', [AdminDashboardController::class, 'orders'])->name('orders');
    Route::patch('/orders/{order}', [AdminDashboardController::class, 'updateOrderStatus'])->name('orders.update');
    
    // Expenses Management
    Route::get('/expenses', [AdminDashboardController::class, 'expenses'])->name('expenses');
    Route::post('/expenses', [AdminDashboardController::class, 'storeExpense'])->name('expenses.store');
    Route::patch('/expenses/{expense}', [AdminDashboardController::class, 'updateExpense'])->name('expenses.update');
    Route::delete('/expenses/{expense}', [AdminDashboardController::class, 'destroyExpense'])->name('expenses.destroy');
    Route::post('/expenses/category', [AdminDashboardController::class, 'storeExpenseCategory'])->name('expenses.category.store');
    Route::patch('/expenses/category/{category}', [AdminDashboardController::class, 'updateExpenseCategory'])->name('expenses.category.update');
    Route::delete('/expenses/category/{category}', [AdminDashboardController::class, 'destroyExpenseCategory'])->name('expenses.category.destroy');
    
    // Settings Management
    Route::get('/settings', [AdminDashboardController::class, 'settings'])->name('settings');
    Route::post('/settings', [AdminDashboardController::class, 'updateSettings'])->name('settings.store');

    // Coupons Management
    Route::get('/coupons', [\App\Http\Controllers\Admin\CouponController::class, 'index'])->name('coupons');
    Route::post('/coupons', [\App\Http\Controllers\Admin\CouponController::class, 'store'])->name('coupons.store');
    Route::patch('/coupons/{coupon}', [\App\Http\Controllers\Admin\CouponController::class, 'update'])->name('coupons.update');
    Route::delete('/coupons/{coupon}', [\App\Http\Controllers\Admin\CouponController::class, 'destroy'])->name('coupons.destroy');

    // Notifications
    Route::post('/notifications/mark-all-read', [AdminDashboardController::class, 'markAllNotificationsRead'])->name('notifications.markAllRead');

    // 4. Superadmin Only Website Content Control Routes
    Route::middleware([\App\Http\Middleware\SuperAdminMiddleware::class])->group(function () {
        Route::get('/website-control', [\App\Http\Controllers\SuperAdminController::class, 'websiteControl'])->name('website-control');
        Route::post('/website-control', [\App\Http\Controllers\SuperAdminController::class, 'updateWebsiteControl'])->name('website-control.store');
        
        Route::get('/homepage-sections', [\App\Http\Controllers\SuperAdminController::class, 'homepageSections'])->name('homepage-sections');
        Route::post('/homepage-sections', [\App\Http\Controllers\SuperAdminController::class, 'updateHomepageSections'])->name('homepage-sections.store');
        
        Route::get('/products-control', [\App\Http\Controllers\SuperAdminController::class, 'productsControl'])->name('products-control');
        Route::post('/products-control', [\App\Http\Controllers\SuperAdminController::class, 'storeProductControl'])->name('products-control.store');
        Route::post('/products-control/{product}', [\App\Http\Controllers\SuperAdminController::class, 'updateProductControl'])->name('products-control.update');
        
        Route::get('/collections-control', [\App\Http\Controllers\SuperAdminController::class, 'collectionsControl'])->name('collections-control');
        Route::post('/collections-control', [\App\Http\Controllers\SuperAdminController::class, 'updateCollectionsControl'])->name('collections-control.store');
    });
});

require __DIR__.'/auth.php';
