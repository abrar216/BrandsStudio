<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Coupon;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function cart()
    {
        return Inertia::render('Cart');
    }

    public function checkout()
    {
        return Inertia::render('Checkout');
    }

    public function applyCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $coupon = Coupon::where('code', $request->code)->first();

        if (!$coupon || !$coupon->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired coupon code.',
            ], 422);
        }

        $discount = $coupon->calculateDiscount($request->subtotal);

        return response()->json([
            'success' => true,
            'code' => $coupon->code,
            'discount' => $discount,
            'type' => $coupon->type,
            'value' => $coupon->value,
            'message' => 'Coupon applied successfully!',
        ]);
    }

    public function storeOrder(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string',
            'payment_method' => 'required|string|in:cod,stripe,paypal',
            'cart_items' => 'required|array|min:1',
            'cart_items.*.id' => 'required|exists:products,id',
            'cart_items.*.quantity' => 'required|integer|min:1',
            'cart_items.*.variant_id' => 'nullable|exists:product_variants,id',
            'coupon_code' => 'nullable|string|exists:coupons,code',
        ]);

        // Begin transaction
        try {
            return DB::transaction(function() use ($request) {
                $subtotal = 0;
                $itemsToCreate = [];

                // 1. Calculate subtotal and verify inventory
                foreach ($request->cart_items as $item) {
                    $product = Product::findOrFail($item['id']);
                    $price = $product->discount_price ?? $product->price;
                    
                    $variant = null;
                    if (!empty($item['variant_id'])) {
                        $variant = ProductVariant::where('product_id', $product->id)
                            ->where('id', $item['variant_id'])
                            ->firstOrFail();
                        
                        if ($variant->stock_quantity < $item['quantity']) {
                            throw new \Exception("Product '{$product->name}' in size '{$variant->size}' and color '{$variant->color}' is out of stock.");
                        }
                    } else {
                        if ($product->stock_quantity < $item['quantity']) {
                            throw new \Exception("Product '{$product->name}' is out of stock.");
                        }
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

                // 2. Process Coupon discount
                $discount = 0;
                if ($request->filled('coupon_code')) {
                    $coupon = Coupon::where('code', $request->coupon_code)->first();
                    if ($coupon && $coupon->isValid()) {
                        $discount = $coupon->calculateDiscount($subtotal);
                    }
                }

                // 3. Process Shipping & Tax
                $shipping = (float) Setting::get('shipping_charges', 0.00);
                $taxRate = (float) Setting::get('tax_rate', 0.00); // percentage
                
                $taxableAmount = max(0, $subtotal - $discount);
                $tax = round(($taxableAmount * ($taxRate / 100)), 2);
                $total = round(($taxableAmount + $shipping + $tax), 2);

                // 4. Deduct inventory & create order items
                $order = Order::create([
                    'order_number' => 'BS-' . strtoupper(Str::random(3)) . '-' . time(),
                    'user_id' => auth()->id() ?? null,
                    'customer_type' => auth()->check() ? 'online' : 'guest',
                    'customer_name' => $request->customer_name,
                    'customer_email' => $request->customer_email,
                    'customer_phone' => $request->customer_phone,
                    'status' => 'pending',
                    'subtotal' => $subtotal,
                    'discount' => $discount,
                    'shipping_charges' => $shipping,
                    'tax' => $tax,
                    'total' => $total,
                    'payment_method' => $request->payment_method,
                    'payment_status' => $request->payment_method === 'cod' ? 'pending' : 'paid', // Mark paid immediately for stripe/paypal demo
                    'shipping_address' => $request->shipping_address,
                    'billing_address' => $request->shipping_address, // same for simplicity
                    'notes' => $request->notes,
                    'estimated_delivery' => now()->addDays(5),
                ]);

                foreach ($itemsToCreate as $itemData) {
                    // Deduct stock
                    if ($itemData['variant_model']) {
                        $itemData['variant_model']->decrement('stock_quantity', $itemData['quantity']);
                        
                        // Also decrement master product stock quantity
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

                // Send WhatsApp Notification to Admin
                $adminPhone = Setting::get('admin_whatsapp_number', '+920000000000');
                $message = "New Order Received\n\nOrder Number: {$order->order_number}\nCustomer Name: {$order->customer_name}\nPhone: {$order->customer_phone}\nTotal Amount: Rs. {$order->total}\n\nPlease review the order in the admin panel.";
                \App\Services\WhatsAppService::sendMessage($adminPhone, $message);

                // Send Database Notification to Admins
                $admins = \App\Models\User::whereIn('role', ['admin', 'super_admin'])->get();
                \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\NewOrderNotification($order));

                return redirect()->route('order.success', ['order_number' => $order->order_number])
                    ->with('success', 'Order placed successfully!');
            });
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function orderSuccess($orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)
            ->with(['items.product', 'items.variant'])
            ->firstOrFail();

        return Inertia::render('OrderSuccess', [
            'order' => $order,
        ]);
    }

    public function tracking(Request $request)
    {
        $order = null;
        if ($request->filled('order_number')) {
            $order = Order::where('order_number', $request->order_number)
                ->with(['items.product', 'items.variant'])
                ->first();
        }

        return Inertia::render('OrderTracking', [
            'trackedOrder' => $order,
            'searchedNumber' => $request->order_number,
        ]);
    }

    public function userOrders()
    {
        $user = auth()->user();

        // Prevent Admin and Staff leaks to customer dashboard
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        if ($user->isCashier() || $user->role === 'staff') {
            return redirect()->route('admin.pos.index');
        }
        
        // Retrieve orders with items and their products/variants
        $orders = Order::where('user_id', $user->id)
            ->with(['items.product', 'items.variant'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate e-commerce stats
        $totalOrders = $orders->count();
        $lifetimeSpend = $orders->sum('total');
        $activeOrders = $orders->whereIn('status', ['pending', 'processing', 'shipped'])->count();
        $memberSince = $user->created_at ? $user->created_at->format('F Y') : 'N/A';

        $stats = [
            'total_orders' => $totalOrders,
            'lifetime_spend' => $lifetimeSpend,
            'active_orders' => $activeOrders,
            'member_since' => $memberSince,
        ];

        return Inertia::render('Dashboard', [
            'orders' => $orders,
            'stats' => $stats,
        ]);
    }
}
