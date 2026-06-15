<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        return Inertia::render('Upgrade/Index', [
            'plans' => Plan::where('is_active', true)->get(),
            'currentSubscription' => auth()->user()->subscription()->with('plan')->first(),
        ]);
    }

    public function store(Request $request, Plan $plan)
    {
        $user = auth()->user();

        // In a real app, integrate Stripe/PayPal here.
        // For this demo, we'll just activate the subscription.

        if ($user->subscription) {
            $user->subscription()->update(['status' => 'expired']);
        }

        $user->subscriptions()->create([
            'plan_id' => $plan->id,
            'status' => 'active',
            'expires_at' => now()->addMonth(),
        ]);

        return redirect()->route('dashboard')->with('status', "Upgraded to {$plan->name} successfully!");
    }
}
