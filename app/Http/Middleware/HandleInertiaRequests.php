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
                'notifications' => $request->user() && $request->user()->isAdmin() ? $request->user()->unreadNotifications()->take(5)->get() : [],
                'unread_notifications_count' => $request->user() && $request->user()->isAdmin() ? $request->user()->unreadNotifications()->count() : 0,
            ],
            'asset_url' => asset(''),
            'settings' => [
                'site_name' => Setting::get('site_name', 'Brands Studio'),
                'site_tagline' => Setting::get('site_tagline', 'Wear your signature.'),
                'currency' => Setting::get('currency', 'Rs.'),
                'currency_symbol' => Setting::get('currency', 'Rs.'),
                'tax_rate' => Setting::get('tax_rate', '0'),
                'shipping_charges' => Setting::get('shipping_charges', '0'),
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ]
        ];
    }
}
