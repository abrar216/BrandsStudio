<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stock;

class SearchController extends Controller
{
    public function __invoke(Request $request)
    {
        $query = $request->input('q');
        
        if (strlen($query) < 2) {
            return response()->json(['stocks' => []]);
        }
        
        $stocks = Stock::where('symbol', 'like', "%{$query}%")
            ->orWhere('name', 'like', "%{$query}%")
            ->limit(5)
            ->get(['symbol', 'name', 'current_price', 'price_change']);
            
        return response()->json([
            'stocks' => $stocks
        ]);
    }
}
