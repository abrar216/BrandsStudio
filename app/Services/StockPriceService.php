<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class StockPriceService
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.alphavantage.key');
    }

    /**
     * Get real-time price for a stock symbol.
     */
    public function getPrice(string $symbol): float
    {
        $symbol = strtoupper($symbol);

        return Cache::remember("stock_price_live_{$symbol}", 60, function () use ($symbol) {
            if (!$this->apiKey) {
                return $this->getFallbackPrice($symbol);
            }

            try {
                $response = Http::timeout(5)
                    ->get('https://www.alphavantage.co/query', [
                        'function' => 'GLOBAL_QUOTE',
                        'symbol' => $symbol,
                        'apikey' => $this->apiKey
                    ]);

                if ($response->successful()) {
                    $data = $response->json('Global Quote');
                    if (isset($data['05. price'])) {
                        return (float)$data['05. price'];
                    }

                    // Check if rate limited or invalid key
                    $raw = $response->json();
                    if (isset($raw['Note']) || isset($raw['Information'])) {
                        Log::warning("Alpha Vantage API rate limited or note returned for {$symbol}: " . json_encode($raw));
                    }
                }
            } catch (\Exception $e) {
                Log::error("Alpha Vantage API request failed for {$symbol}: " . $e->getMessage());
            }

            return $this->getFallbackPrice($symbol);
        });
    }

    /**
     * Fallback to stored database current price, or a predefined default.
     */
    private function getFallbackPrice(string $symbol): float
    {
        $stock = \App\Models\Stock::where('symbol', $symbol)->first();
        if ($stock) {
            return (float)$stock->current_price;
        }

        $fallbacks = [
            'AAPL' => 180.00,
            'TSLA' => 170.00,
            'NVDA' => 900.00,
            'AMZN' => 180.00
        ];

        return $fallbacks[strtoupper($symbol)] ?? 100.00;
    }
}
