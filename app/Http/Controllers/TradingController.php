<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\Portfolio;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TradingController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $stocks = Stock::orderBy('name')->get();
        
        $firstStockSymbol = $stocks->first() ? $stocks->first()->symbol : 'ENGRO';
        $selectedSymbol = $request->get('symbol', $firstStockSymbol);
        $selectedStock = Stock::where('symbol', $selectedSymbol)->first();

        $portfolio = Portfolio::where('user_id', $user->id)->get()->keyBy('symbol');
        
        $recentTransactions = Transaction::where('user_id', $user->id)
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('Trading/Terminal', [
            'stocks' => $stocks,
            'selectedStock' => $selectedStock,
            'portfolio' => $portfolio,
            'recentTransactions' => $recentTransactions,
            'userBalance' => $user->balance,
        ]);
    }

    public function buy(Request $request)
    {
        $validated = $request->validate([
            'symbol' => 'required|exists:stocks,symbol',
            'quantity' => 'required|numeric|min:1',
            'order_type' => 'required|in:market,limit',
            'limit_price' => 'required_if:order_type,limit|nullable|numeric|min:0',
        ]);

        $user = auth()->user();
        $stock = Stock::where('symbol', $validated['symbol'])->first();
        $price = $validated['order_type'] === 'limit' ? $validated['limit_price'] : $stock->current_price;
        $totalPrice = $price * $validated['quantity'];

        if ($validated['order_type'] === 'market' && $user->balance < $totalPrice) {
            return back()->withErrors(['balance' => 'Insufficient balance to complete this purchase.']);
        }

        DB::transaction(function () use ($user, $stock, $validated, $totalPrice, $price) {
            $status = $validated['order_type'] === 'limit' ? 'pending' : 'completed';

            if ($status === 'completed') {
                $user->decrement('balance', $totalPrice);
                
                $portfolio = Portfolio::firstOrNew([
                    'user_id' => $user->id,
                    'symbol' => $stock->symbol,
                ]);
                $portfolio->quantity += $validated['quantity'];
                $portfolio->save();
            }

            Transaction::create([
                'user_id' => $user->id,
                'symbol' => $stock->symbol,
                'type' => 'buy',
                'order_type' => $validated['order_type'],
                'limit_price' => $validated['limit_price'] ?? null,
                'quantity' => $validated['quantity'],
                'price' => $price,
                'total_price' => $totalPrice,
                'status' => $status,
            ]);
        });

        $message = $validated['order_type'] === 'limit' 
            ? "Limit order placed for {$validated['quantity']} shares of {$stock->name} at {$validated['limit_price']}"
            : "Successfully bought {$validated['quantity']} shares of {$stock->name}";

        return back()->with('success', $message);
    }

    public function sell(Request $request)
    {
        $validated = $request->validate([
            'symbol' => 'required|exists:stocks,symbol',
            'quantity' => 'required|numeric|min:1',
            'order_type' => 'required|in:market,limit',
            'limit_price' => 'required_if:order_type,limit|nullable|numeric|min:0',
        ]);

        $user = auth()->user();
        $portfolio = Portfolio::where('user_id', $user->id)
            ->where('symbol', $validated['symbol'])
            ->first();

        if (!$portfolio || $portfolio->quantity < $validated['quantity']) {
            return back()->withErrors(['quantity' => 'You do not have enough shares to sell.']);
        }

        $stock = Stock::where('symbol', $validated['symbol'])->first();
        $price = $validated['order_type'] === 'limit' ? $validated['limit_price'] : $stock->current_price;
        $totalPrice = $price * $validated['quantity'];

        DB::transaction(function () use ($user, $stock, $portfolio, $validated, $totalPrice, $price) {
            $status = $validated['order_type'] === 'limit' ? 'pending' : 'completed';

            if ($status === 'completed') {
                $user->increment('balance', $totalPrice);
                
                $portfolio->quantity -= $validated['quantity'];
                if ($portfolio->quantity <= 0) {
                    $portfolio->delete();
                } else {
                    $portfolio->save();
                }
            }

            Transaction::create([
                'user_id' => $user->id,
                'symbol' => $stock->symbol,
                'type' => 'sell',
                'order_type' => $validated['order_type'],
                'limit_price' => $validated['limit_price'] ?? null,
                'quantity' => $validated['quantity'],
                'price' => $price,
                'total_price' => $totalPrice,
                'status' => $status,
            ]);
        });

        $message = $validated['order_type'] === 'limit' 
            ? "Limit sell order placed for {$validated['quantity']} shares of {$stock->name} at {$validated['limit_price']}"
            : "Successfully sold {$validated['quantity']} shares of {$stock->name}";

        return back()->with('success', $message);
    }

    public function portfolio()
    {
        $user = auth()->user();
        $portfolioItems = Portfolio::where('user_id', $user->id)
            ->with('stock')
            ->get()
            ->map(function ($item) {
                $currentValue = $item->stock->current_price * $item->quantity;
                // For simplified P/L, we'd need average buy price, let's assume it's current value for now or mock it
                // Real implementation would track original cost in portfolio table
                return [
                    'symbol' => $item->symbol,
                    'name' => $item->stock->name,
                    'quantity' => $item->quantity,
                    'current_price' => $item->stock->current_price,
                    'current_value' => $currentValue,
                    'risk' => $item->stock->risk_level,
                ];
            });

        return Inertia::render('Trading/Portfolio', [
            'portfolio' => $portfolioItems,
            'balance' => $user->balance,
        ]);
    }

    public function leaderboard()
    {
        $traders = User::with('portfolios.stock')->get()->map(function ($user) {
            $portfolioValue = $user->portfolios->sum(function ($item) {
                return ($item->stock->current_price ?? 0) * $item->quantity;
            });
            return [
                'id' => $user->id,
                'name' => $user->name,
                'balance' => (float)$user->balance,
                'total_wealth' => (float)($user->balance + $portfolioValue),
            ];
        })->sortByDesc('total_wealth')->take(10)->values();

        return Inertia::render('Trading/Leaderboard', [
            'traders' => $traders,
        ]);
    }

    public function getPrices()
    {
        $prices = Stock::all(['symbol', 'name', 'type', 'current_price', 'price_change', 'risk_level']);
        return response()->json($prices);
    }
}

