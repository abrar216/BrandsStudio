<?php

namespace App\Services;

use App\Models\ApiKey;
use Illuminate\Support\Facades\Log;

class LiveTradingService
{
    /**
     * Simulate placing a live order on an exchange.
     */
    public function placeOrder(ApiKey $apiKey, string $symbol, string $type, float $amount)
    {
        // In a real application, you would use CCXT or a specific exchange SDK here.
        // For this demo, we'll log the "interaction" and return a simulated success.

        Log::info("LIVE ORDER PLACED on {$apiKey->exchange}", [
            'api_key' => substr($apiKey->api_key, 0, 8) . '...',
            'symbol' => $symbol,
            'type' => $type,
            'amount' => $amount,
        ]);

        return [
            'success' => true,
            'order_id' => 'LIVE_' . uniqid(),
            'price' => (new MarketDataService())->getPrice($symbol),
        ];
    }

    /**
     * Fetch user balances from the exchange.
     */
    public function getBalances(ApiKey $apiKey)
    {
        // Mocking balance response
        return [
            'USDT' => rand(5000, 15000),
            'BTC' => rand(0, 100) / 100,
            'ETH' => rand(1, 5),
        ];
    }
}
