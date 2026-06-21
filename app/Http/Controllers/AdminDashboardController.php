<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Category;
use App\Models\Expense;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    private function checkAccess()
    {
        if (!auth()->user() || !auth()->user()->isAdmin()) {
            abort(403, 'Unauthorized access to Admin Dashboard.');
        }
    }

    private function checkSuperAdminAccess()
    {
        if (!auth()->user() || !auth()->user()->isSuperAdmin()) {
            abort(403, 'Unauthorized access. Super Admin credentials required.');
        }
    }

    public function index()
    {
        $this->checkAccess();

        // 1. Core aggregates
        $totalSales = Order::where('payment_status', 'paid')->sum('total');
        $totalOrders = Order::count();
        $totalExpenses = Expense::sum('amount');
        $netProfit = $totalSales - $totalExpenses;

        // Calculate total products and inventory valuation
        $totalProducts = Product::where('status', 'active')->count();
        $grossValuation = Product::where('status', 'active')
            ->get()
            ->sum(function($p) {
                return $p->price * $p->stock_quantity;
            });

        // 2. Monthly sales data for chart
        $driver = DB::connection()->getDriverName();
        if ($driver === 'pgsql') {
            $monthFormatted = "TO_CHAR(created_at, 'Mon YYYY')";
        } elseif ($driver === 'sqlite') {
            $monthFormatted = "case strftime('%m', created_at) when '01' then 'Jan' when '02' then 'Feb' when '03' then 'Mar' when '04' then 'Apr' when '05' then 'May' when '06' then 'Jun' when '07' then 'Jul' when '08' then 'Aug' when '09' then 'Sep' when '10' then 'Oct' when '11' then 'Nov' when '12' then 'Dec' end || ' ' || strftime('%Y', created_at)";
        } else {
            $monthFormatted = "DATE_FORMAT(created_at, '%b %Y')";
        }

        $monthlySales = Order::where('payment_status', 'paid')
            ->select(
                DB::raw('SUM(total) as sales'),
                DB::raw("$monthFormatted as month")
            )
            ->groupBy(DB::raw($monthFormatted))
            ->orderBy(DB::raw('MIN(created_at)'), 'asc')
            ->get();

        // 3. Low stock alerts (stock < 10)
        $lowStockProducts = Product::where('status', 'active')
            ->where('stock_quantity', '<', 10)
            ->limit(5)
            ->get();

        $lowStockVariants = ProductVariant::where('stock_quantity', '<', 5)
            ->with('product')
            ->limit(5)
            ->get();

        // 4. Recent orders
        $recentOrders = Order::latest()->limit(5)->get();

        // 5. Popular products
        $topProducts = OrderItem::select('product_id', DB::raw('SUM(quantity) as total_sold'))
            ->groupBy('product_id')
            ->orderBy('total_sold', 'desc')
            ->with('product')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_sales' => round($totalSales, 2),
                'total_orders' => $totalOrders,
                'total_expenses' => round($totalExpenses, 2),
                'net_profit' => round($netProfit, 2),
                'total_products' => $totalProducts,
                'total_valuation' => round($grossValuation, 2),
            ],
            'monthlySales' => $monthlySales,
            'lowStockProducts' => $lowStockProducts,
            'lowStockVariants' => $lowStockVariants,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
        ]);
    }

    // Products Management
    public function products()
    {
        $this->checkAccess();

        $products = Product::with(['variants', 'category', 'images'])
            ->orderBy('created_at', 'desc')
            ->get();
        $categories = Category::all();

        return Inertia::render('Admin/Products', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function storeProduct(Request $request)
    {
        $this->checkSuperAdminAccess();

        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku',
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'gst_rate' => 'nullable|numeric|min:0|max:100',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'stock_quantity' => 'required|integer|min:0',
            'is_featured' => 'boolean',
            'is_trending' => 'boolean',
            'is_best_seller' => 'boolean',
            'is_new_arrival' => 'boolean',
            'variants' => 'nullable|array',
            'image' => 'nullable|image|max:5120',
            'images' => 'nullable|array',
            'images.*' => 'image|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $this->imageToBase64($request->file('image'));
        }

        DB::transaction(function() use ($request, $imagePath) {
            $product = Product::create([
                'name' => $request->name,
                'slug' => Str::slug($request->name),
                'sku' => $request->sku,
                'price' => $request->price,
                'discount_price' => $request->discount_price,
                'cost_price' => $request->cost_price,
                'gst_rate' => $request->gst_rate ?? 0.00,
                'category_id' => $request->category_id,
                'description' => $request->description,
                'short_description' => $request->short_description,
                'stock_quantity' => $request->stock_quantity,
                'is_featured' => $request->is_featured ?? false,
                'is_trending' => $request->is_trending ?? false,
                'is_best_seller' => $request->is_best_seller ?? false,
                'is_new_arrival' => $request->is_new_arrival ?? false,
                'status' => 'active',
                'image' => $imagePath,
                'main_image' => $imagePath,
            ]);

            // Add variants if provided
            if (!empty($request->variants)) {
                $totalStock = 0;
                foreach ($request->variants as $variant) {
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'size' => $variant['size'],
                        'color' => $variant['color'],
                        'sku' => $product->sku . '-' . strtoupper(substr($variant['color'], 0, 2)) . '-' . $variant['size'],
                        'price' => $variant['price'] ?? null,
                        'cost_price' => $variant['cost_price'] ?? null,
                        'stock_quantity' => $variant['stock_quantity'],
                    ]);
                    $totalStock += $variant['stock_quantity'];
                }
                $product->update(['stock_quantity' => $totalStock]);
            }

            // Save multiple images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $path = $this->imageToBase64($file);
                    $product->images()->create([
                        'image_path' => $path,
                    ]);
                }
            }
        });

        return back()->with('success', 'Product created successfully!');
    }

    public function updateProduct(Request $request, Product $product)
    {
        $this->checkSuperAdminAccess();

        $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'price' => 'required|numeric|min:0',
            'discount_price' => 'nullable|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'gst_rate' => 'nullable|numeric|min:0|max:100',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'stock_quantity' => 'required|integer|min:0',
            'is_featured' => 'boolean',
            'is_trending' => 'boolean',
            'is_best_seller' => 'boolean',
            'is_new_arrival' => 'boolean',
            'status' => 'required|string|in:active,inactive',
            'image' => 'nullable|image|max:5120',
            'images' => 'nullable|array',
            'images.*' => 'image|max:5120',
        ]);

        $data = $request->except(['image', 'images']);
        if ($request->hasFile('image')) {
            if ($product->image && \Illuminate\Support\Facades\Storage::disk('public')->exists($product->image)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $this->imageToBase64($request->file('image'));
            $data['main_image'] = $data['image'];
        }

        $product->update($data);

        // Save multiple images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $this->imageToBase64($file);
                $product->images()->create([
                    'image_path' => $path,
                ]);
            }
        }

        return back()->with('success', 'Product updated successfully!');
    }

    // Categories Management
    public function categories()
    {
        $this->checkSuperAdminAccess();

        $categories = Category::withCount('products')->get();
        return Inertia::render('Admin/Categories', [
            'categories' => $categories,
        ]);
    }

    public function storeCategory(Request $request)
    {
        $this->checkSuperAdminAccess();

        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $this->imageToBase64($request->file('image'));
        }

        Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'image' => $imagePath,
        ]);

        return back()->with('success', 'Category created successfully!');
    }

    public function updateCategory(Request $request, Category $category)
    {
        $this->checkSuperAdminAccess();

        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
        ]);

        $data = [
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ];

        if ($request->hasFile('image')) {
            if ($category->image && \Illuminate\Support\Facades\Storage::disk('public')->exists($category->image)) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($category->image);
            }
            $data['image'] = $this->imageToBase64($request->file('image'));
        }

        $category->update($data);

        return back()->with('success', 'Category updated successfully!');
    }

    public function destroyCategory(Category $category)
    {
        $this->checkSuperAdminAccess();
        
        if ($category->image && \Illuminate\Support\Facades\Storage::disk('public')->exists($category->image)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($category->image);
        }
        
        $category->delete();

        return back()->with('success', 'Category deleted successfully!');
    }

    // Orders Management
    public function orders()
    {
        $this->checkAccess();

        $orders = Order::with(['items.product', 'items.variant', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Orders', [
            'orders' => $orders,
        ]);
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        $this->checkAccess();

        $request->validate([
            'status' => 'required|string|in:pending,confirmed,processing,shipped,delivered,cancelled,returned',
            'payment_status' => 'required|string|in:pending,paid,refunded,failed',
        ]);

        $oldStatus = $order->status;

        $order->update([
            'status' => $request->status,
            'payment_status' => $request->payment_status,
        ]);

        if ($oldStatus !== 'confirmed' && $request->status === 'confirmed') {
            if ($order->customer_phone) {
                $message = "Dear {$order->customer_name},\n\nYour order #{$order->order_number} has been confirmed successfully.\n\nOrder Total: Rs. {$order->total}\n\nThank you for shopping with Brands Studio.";
                \App\Services\WhatsAppService::sendMessage($order->customer_phone, $message);
            }
        }

        return back()->with('success', 'Order status updated successfully!');
    }

    // Expenses Management
    public function expenses()
    {
        $this->checkAccess();

        $expenses = Expense::orderBy('date', 'desc')->get();
        $categories = \App\Models\ExpenseCategory::orderBy('name', 'asc')->get();
        
        return Inertia::render('Admin/Expenses', [
            'expenses' => $expenses,
            'categories' => $categories,
        ]);
    }

    public function storeExpense(Request $request)
    {
        $this->checkAccess();

        $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        Expense::create($request->all());

        return back()->with('success', 'Expense recorded successfully!');
    }

    public function updateExpense(Request $request, Expense $expense)
    {
        $this->checkAccess();

        $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $expense->update($request->all());

        return back()->with('success', 'Expense updated successfully!');
    }

    public function destroyExpense(Expense $expense)
    {
        $this->checkAccess();
        $expense->delete();
        return back()->with('success', 'Expense deleted successfully!');
    }

    public function storeExpenseCategory(Request $request)
    {
        $this->checkAccess();

        $request->validate([
            'name' => 'required|string|max:255|unique:expense_categories,name',
        ]);

        \App\Models\ExpenseCategory::create([
            'name' => $request->name,
        ]);

        return back()->with('success', 'Expense category added successfully!');
    }

    public function updateExpenseCategory(Request $request, \App\Models\ExpenseCategory $category)
    {
        $this->checkAccess();

        $request->validate([
            'name' => 'required|string|max:255|unique:expense_categories,name,' . $category->id,
        ]);

        $oldName = $category->name;
        $newName = $request->name;

        $category->update([
            'name' => $newName,
        ]);

        // Reconcile existing expenses matching this category string
        Expense::where('category', $oldName)->update([
            'category' => $newName,
        ]);

        return back()->with('success', 'Expense category updated successfully!');
    }

    public function destroyExpenseCategory(\App\Models\ExpenseCategory $category)
    {
        $this->checkAccess();
        $category->delete();
        return back()->with('success', 'Expense category deleted successfully!');
    }

    // Settings Management
    public function settings()
    {
        $this->checkSuperAdminAccess();

        $settings = Setting::all()->pluck('value', 'key');
        return Inertia::render('Admin/Settings', [
            'settings' => $settings,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $this->checkSuperAdminAccess();

        foreach ($request->except('_token') as $key => $value) {
            Setting::set($key, $value);
        }

        return back()->with('success', 'Settings updated successfully!');
    }

    public function markAllNotificationsRead(Request $request)
    {
        $this->checkAccess();
        $request->user()->unreadNotifications->markAsRead();
        return back();
    }
}
