<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $notifications = [];
        $unreadCount = 0;
        if ($request->user() && $request->user()->isAdmin()) {
            try {
                if (\Illuminate\Support\Facades\Schema::hasTable('notifications')) {
                    $notifications = $request->user()->unreadNotifications()->take(5)->get();
                    $unreadCount = $request->user()->unreadNotifications()->count();
                }
            } catch (\Throwable $e) {
                $notifications = [];
                $unreadCount = 0;
            }
        }

        $menuCategories = [];
        try {
            $menuCategories = \App\Models\Category::select(['id', 'name', 'slug', 'parent_id'])
                ->with(['children' => function($query) {
                    $query->select(['id', 'name', 'slug', 'parent_id']);
                }])
                ->whereNull('parent_id')
                ->orderBy('name', 'asc')
                ->get();
        } catch (\Throwable $e) {
            $menuCategories = [];
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'is_admin' => $request->user()->isAdmin(),
                    'is_cashier' => $request->user()->isCashier(),
                    'is_staff' => $request->user()->isStaff(),
                ] : null,
                'notifications' => $notifications,
                'unread_notifications_count' => $unreadCount,
            ],
            'asset_url' => asset(''),
            'menuCategories' => $menuCategories,
            'settings' => [
                'site_name' => Setting::get('site_name', 'Brands Studio'),
                'site_tagline' => Setting::get('site_tagline', 'Wear your signature.'),
                'currency' => Setting::get('currency', 'Rs.'),
                'currency_symbol' => Setting::get('currency', 'Rs.'),
                'tax_rate' => Setting::get('tax_rate', '0'),
                'shipping_charges' => Setting::get('shipping_charges', '0'),
                'contact_email' => Setting::get('contact_email', 'Brandstudiodik29@gmail.com'),
                'contact_phone' => Setting::get('contact_phone', '03356101234'),
                'contact_address' => Setting::get('contact_address', 'North Circular Road, Leeds College Opposite Byco Pertrol Pump, Dera Ismail Khan'),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ]
        ];
    }
}
