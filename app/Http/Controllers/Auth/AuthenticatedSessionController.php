<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'initialMode' => 'login',
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        // 1. Super Admin and Admin: ALWAYS redirect to Brands Studio Admin Dashboard
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        // 2. Cashier and Staff: ALWAYS redirect to POS Sales Screen
        if ($user->isCashier() || $user->role === 'staff') {
            return redirect()->route('admin.pos.index');
        }

        // 3. Customer: check if redirected from cart/checkout/wishlist
        $redirect = $request->input('redirect');
        if ($redirect) {
            if ($redirect === 'wishlist') {
                return redirect()->route('wishlist');
            }
            if ($redirect === 'checkout') {
                return redirect()->route('checkout');
            }
            if ($redirect === 'cart') {
                return redirect()->route('cart');
            }
            if (str_starts_with($redirect, '/')) {
                return redirect($redirect);
            }
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
