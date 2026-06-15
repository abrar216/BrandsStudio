<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Category;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class POSController extends Controller
{
    public function index()
    {
        // Require cashier/staff/admin role
        if (!auth()->user()->isStaff()) {
            return redirect()->route('welcome')->with('error', 'Unauthorized access to POS terminal.');
        }

        // 1. Fetch active products with variants and categories
        $products = Product::where('status', 'active')
            ->with(['variants', 'category'])
            ->get()
            ->map(function($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'sku' => $product->sku,
                    'price' => $product->discount_price ?? $product->price,
                    'stock_quantity' => $product->stock_quantity,
                    'category_id' => $product->category_id,
                    'category_name' => $product->category ? $product->category->name : 'Uncategorized',
                    'variants' => $product->variants->map(function($v) use ($product) {
                        return [
                            'id' => $v->id,
                            'size' => $v->size,
                            'color' => $v->color,
                            'sku' => $v->sku,
                            'price' => $v->price ?? ($product->discount_price ?? $product->price),
                            'stock_quantity' => $v->stock_quantity,
                        ];
                    }),
                ];
            });

        // 2. Fetch categories for filtering
        $categories = Category::all();

        // 3. Fetch registered customers (users with role = customer)
        $customers = User::where('role', 'customer')
            ->select('id', 'name', 'phone', 'email')
            ->orderBy('name', 'asc')
            ->get();

        // 4. Fetch recent POS orders for the Ledger
        $recentOrders = Order::where('customer_type', 'walk-in')
            ->with(['items.product', 'items.variant', 'cashier'])
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        // 5. Gather Reports & Analytics (Only for Admins)
        $reports = null;
        if (auth()->user()->isAdmin()) {
            $reports = [];

            // A. Revenue Overview
            $reports['total_revenue'] = (float) Order::where('payment_status', 'paid')->sum('total');
            $reports['total_refunded'] = (float) Order::where('payment_status', 'refunded')->sum('total');

            // B. Daily Sales (last 30 days)
            $reports['daily_sales'] = Order::where('payment_status', 'paid')
                ->where('created_at', '>=', now()->subDays(30))
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('SUM(total) as revenue'),
                    DB::raw('COUNT(id) as count')
                )
                ->groupBy('date')
                ->orderBy('date', 'desc')
                ->get();

            // C. Monthly Sales
            $reports['monthly_sales'] = Order::where('payment_status', 'paid')
                ->select(
                    DB::raw("DATE_FORMAT(created_at, '%b %Y') as month"),
                    DB::raw('SUM(total) as revenue'),
                    DB::raw('COUNT(id) as count')
                )
                ->groupBy('month')
                ->orderBy('created_at', 'desc')
                ->get();

            // D. Cashier-wise Sales
            $reports['cashier_sales'] = Order::where('payment_status', 'paid')
                ->whereNotNull('cashier_id')
                ->select(
                    'cashier_id',
                    DB::raw('SUM(total) as revenue'),
                    DB::raw('COUNT(id) as count')
                )
                ->with('cashier')
                ->groupBy('cashier_id')
                ->get();

            // E. Product-wise Sales
            $reports['product_sales'] = OrderItem::select(
                    'product_id',
                    DB::raw('SUM(quantity) as quantity_sold'),
                    DB::raw('SUM(total) as revenue')
                )
                ->groupBy('product_id')
                ->with('product')
                ->orderBy('quantity_sold', 'desc')
                ->limit(30)
                ->get();

            // F. Refund Report
            $reports['refund_report'] = Order::where('payment_status', 'refunded')
                ->with(['items.product', 'cashier'])
                ->orderBy('updated_at', 'desc')
                ->get();

            // G. Stock report (combines low stock products and variants)
            $reports['low_stock_products'] = Product::where('status', 'active')
                ->where('stock_quantity', '<', 10)
                ->with('category')
                ->orderBy('stock_quantity', 'asc')
                ->get();

            $reports['low_stock_variants'] = ProductVariant::where('stock_quantity', '<', 5)
                ->with('product')
                ->orderBy('stock_quantity', 'asc')
                ->get();
        }

        return Inertia::render('Admin/POS', [
            'products' => $products,
            'categories' => $categories,
            'customers' => $customers,
            'recentOrders' => $recentOrders,
            'reports' => $reports,
        ]);
    }

    public function search(Request $request)
    {
        $term = $request->input('query');
        
        if (empty($term)) {
            return response()->json([]);
        }

        // Try exact match on variant SKU or master product SKU (acts like barcode scanning)
        $variant = ProductVariant::where('sku', $term)
            ->with('product')
            ->first();

        if ($variant && $variant->product->status === 'active') {
            return response()->json([
                'type' => 'variant',
                'id' => $variant->product->id,
                'name' => $variant->product->name,
                'variant_id' => $variant->id,
                'size' => $variant->size,
                'color' => $variant->color,
                'sku' => $variant->sku,
                'price' => $variant->price ?? ($variant->product->discount_price ?? $variant->product->price),
                'stock_quantity' => $variant->stock_quantity,
            ]);
        }

        $product = Product::where('sku', $term)
            ->where('status', 'active')
            ->first();

        if ($product) {
            return response()->json([
                'type' => 'product',
                'id' => $product->id,
                'name' => $product->name,
                'variant_id' => null,
                'sku' => $product->sku,
                'price' => $product->discount_price ?? $product->price,
                'stock_quantity' => $product->stock_quantity,
            ]);
        }

        // Partial match for search grid
        $products = Product::where('status', 'active')
            ->where(function($q) use ($term) {
                $q->where('name', 'like', "%{$term}%")
                  ->orWhere('sku', 'like', "%{$term}%");
            })
            ->with('variants')
            ->limit(10)
            ->get();

        return response()->json($products);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'customer_id' => 'nullable|exists:users,id',
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:20',
            'customer_email' => 'nullable|email|max:255',
            'payment_method' => 'required|string|in:cash,card,online,partial',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.variant_id' => 'nullable|exists:product_variants,id',
            'discount' => 'nullable|numeric|min:0',
            'cash_received' => 'nullable|numeric|min:0',
            'amount_paid' => 'nullable|numeric|min:0',
            'payment_details' => 'nullable|array',
        ]);

        return DB::transaction(function() use ($request) {
            $subtotal = 0;
            $itemsToCreate = [];

            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['id']);
                $price = $item['price'] ?? ($product->discount_price ?? $product->price);
                
                $variant = null;
                if (!empty($item['variant_id'])) {
                    $variant = ProductVariant::where('product_id', $product->id)
                        ->where('id', $item['variant_id'])
                        ->firstOrFail();
                    // Stock checks bypassed to allow selling unlimited quantities
                } else {
                    // Stock checks bypassed to allow selling unlimited quantities
                }

                $itemTotal = $price * $item['quantity'];
                $subtotal += $itemTotal;

                $itemsToCreate[] = [
                    'product_id' => $product->id,
                    'product_variant_id' => $variant ? $variant->id : null,
                    'quantity' => $item['quantity'],
                    'price' => $price,
                    'total' => $itemTotal,
                    'model' => $product,
                    'variant_model' => $variant,
                ];
            }

            // Calculations
            $discount = (float)($request->discount ?? 0.00);
            $taxRate = (float)Setting::get('tax_rate', 0.00);
            
            $taxableAmount = max(0, $subtotal - $discount);
            $tax = round(($taxableAmount * ($taxRate / 100)), 2);
            $total = round(($taxableAmount + $tax), 2);

            // Handle cash change returned logic
            $cashReceived = (float) ($request->cash_received ?? 0.00);
            $amountPaid = (float) ($request->amount_paid ?? $total);
            
            // Set correct payment status (paid or partial)
            $paymentStatus = 'paid';
            if ($request->payment_method === 'partial') {
                if ($amountPaid < $total) {
                    $paymentStatus = 'pending'; // Or mark as partial/pending
                }
            }

            $changeReturned = 0.00;
            if ($request->payment_method === 'cash' && $cashReceived > $total) {
                $changeReturned = $cashReceived - $total;
                $amountPaid = $total;
            }

            // Generate unique invoice number
            $invoiceNumber = 'POS-' . auth()->id() . '-' . date('ymd') . '-' . strtoupper(Str::random(4));

            // Determine customer user ID if selected
            $customerId = $request->customer_id;
            $customerName = $request->customer_name ?? 'Walk-in Customer';
            $customerPhone = $request->customer_phone;
            $customerEmail = $request->customer_email;

            if ($customerId) {
                $user = User::find($customerId);
                if ($user) {
                    $customerName = $user->name;
                    $customerPhone = $user->phone ?? $customerPhone;
                    $customerEmail = $user->email ?? $customerEmail;
                }
            }

            // Create Order
            $order = Order::create([
                'order_number' => $invoiceNumber,
                'user_id' => $customerId,
                'customer_type' => 'walk-in',
                'customer_name' => $customerName,
                'customer_phone' => $customerPhone,
                'customer_email' => $customerEmail,
                'status' => 'delivered', // POS items delivered immediately
                'subtotal' => $subtotal,
                'discount' => $discount,
                'shipping_charges' => 0.00,
                'tax' => $tax,
                'total' => $total,
                'payment_method' => $request->payment_method,
                'payment_status' => $paymentStatus,
                'cashier_id' => auth()->id(),
                'cash_received' => $cashReceived,
                'change_returned' => $changeReturned,
                'amount_paid' => $amountPaid,
                'payment_details' => $request->payment_details ? json_encode($request->payment_details) : null,
            ]);

            // Save order items & decrement inventory
            foreach ($itemsToCreate as $itemData) {
                if ($itemData['variant_model']) {
                    $itemData['variant_model']->decrement('stock_quantity', $itemData['quantity']);
                    $itemData['model']->decrement('stock_quantity', $itemData['quantity']);
                } else {
                    $itemData['model']->decrement('stock_quantity', $itemData['quantity']);
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $itemData['product_id'],
                    'product_variant_id' => $itemData['product_variant_id'],
                    'quantity' => $itemData['quantity'],
                    'price' => $itemData['price'],
                    'total' => $itemData['total'],
                ]);
            }

            // Return full receipt details
            $receipt = Order::where('id', $order->id)
                ->with(['items.product', 'items.variant', 'cashier'])
                ->first();

            return response()->json([
                'success' => true,
                'message' => 'POS transaction completed successfully!',
                'receipt' => $receipt,
            ]);
        });
    }

    public function refund(Request $request, Order $order)
    {
        // Require cashier/admin role
        if (!auth()->user()->isStaff()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized operation.'
            ], 403);
        }

        // Only Admin can perform refund
        if (!auth()->user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Only administrators can process returns and refunds.'
            ], 403);
        }

        if ($order->payment_status === 'refunded') {
            return response()->json([
                'success' => false,
                'message' => 'This order has already been refunded.'
            ], 422);
        }

        return DB::transaction(function() use ($order) {
            // Restore inventory
            $items = OrderItem::where('order_id', $order->id)->get();
            foreach ($items as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $product->increment('stock_quantity', $item->quantity);
                }

                if ($item->product_variant_id) {
                    $variant = ProductVariant::find($item->product_variant_id);
                    if ($variant) {
                        $variant->increment('stock_quantity', $item->quantity);
                    }
                }
            }

            // Mark order as refunded and returned
            $order->update([
                'status' => 'returned',
                'payment_status' => 'refunded'
            ]);

            return response()->json([
                'success' => true,
                'message' => 'POS Order refunded and stock restored successfully!',
            ]);
        });
    }

    public function storeCustomer(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255|unique:users,email',
        ]);

        $customer = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'email' => $request->email ?? ('pos_' . time() . '_' . Str::random(5) . '@brandsstudio.com'),
            'password' => bcrypt(Str::random(16)),
            'role' => 'customer',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Customer registered successfully!',
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'phone' => $customer->phone,
                'email' => $customer->email,
            ]
        ]);
    }
}
