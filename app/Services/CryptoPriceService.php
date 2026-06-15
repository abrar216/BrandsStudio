<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class CryptoPriceService
{
    protected $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.coingecko.key');
    }

    /**
     * Get prices for specified cryptocurrency symbols.
     * Returns an associative array: ['BTC' => 65000.0, ...]
     */
    public function getPrices(array $symbols = ['BTC', 'ETH', 'SOL', 'BNB']): array
    {
        return Cache::remember('crypto_prices_live', 10, function () use ($symbols) {
            $mapping = [
                'BTC' => 'bitcoin',
                'ETH' => 'ethereum',
                'SOL' => 'solana',
                'BNB' => 'binancecoin'
            ];

            $ids = [];
            foreach ($symbols as $sym) {
                if (isset($mapping[strtoupper($sym)])) {
                    $ids[] = $mapping[strtoupper($sym)];
                }
            }

            if (empty($ids)) {
                return [];
            }

            try {
                $headers = [];
                if ($this->apiKey) {
                    $headers['x-cg-demo-api-key'] = $this->apiKey;
                }

                $response = Http::withHeaders($headers)
                    ->timeout(5)
                    ->get('https://api.coingecko.com/api/v3/simple/price', [
                        'ids' => implode(',', $ids),
                        'vs_currencies' => 'usd'
                    ]);

                if ($response->successful()) {
                    $data = $response->json();
                    $prices = [];
                    foreach ($symbols as $sym) {
                        $id = $mapping[strtoupper($sym)] ?? null;
                        if ($id && isset($data[$id]['usd'])) {
                            $prices[strtoupper($sym)] = (float)$data[$id]['usd'];
                        }
                    }
                    return $prices;
                }
            } catch (\Exception $e) {
                Log::error("CoinGecko API request failed: " . $e->getMessage());
            }

            // Fallback: Query from existing database or default constants
            $prices = [];
            foreach ($symbols as $sym) {
                $stock = \App\Models\Stock::where('symbol', $sym)->first();
                if ($stock) {
                    $prices[strtoupper($sym)] = (float)$stock->current_price;
                } else {
                    $fallbacks = [
                        'BTC' => 65000.00,
                        'ETH' => 3500.00,
                        'SOL' => 150.00,
                        'BNB' => 580.00
                    ];
                    $prices[strtoupper($sym)] = $fallbacks[strtoupper($sym)] ?? 100.00;
                }
            }
            return $prices;
        });
    }
}
