<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\POSController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\ProfileController;

use Illuminate\Support\Facades\Route;

// 1. General E-Commerce Storefront Routes (Guest/Customer)
Route::get('/', [ProductController::class, 'welcome'])->name('welcome');
Route::get('/shop', [ProductController::class, 'shop'])->name('shop');
Route::get('/collections', [ProductController::class, 'collections'])->name('collections');
Route::get('/product/{slug}', [ProductController::class, 'show'])->name('product.show');
Route::get('/cart', [OrderController::class, 'cart'])->name('cart');
Route::get('/tracking', [OrderController::class, 'tracking'])->name('order.tracking');
Route::post('/api/coupon/apply', [OrderController::class, 'applyCoupon'])->name('coupon.apply');
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
    
    // Categories Management
    Route::get('/categories', [AdminDashboardController::class, 'categories'])->name('categories');
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
