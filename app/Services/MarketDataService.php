<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class MarketDataService
{
    protected $baseUrl = 'https://api.binance.com/api/v3';

    /**
     * Get the current price for a symbol.
     */
    public function getPrice(string $symbol = 'BTCUSDT')
    {
        return Cache::remember("price_{$symbol}", 10, function () use ($symbol) {
            $response = Http::get("{$this->baseUrl}/ticker/price", [
                'symbol' => strtoupper($symbol)
            ]);

            if ($response->successful()) {
                return (float)$response->json('price');
            }

            return null;
        });
    }

    /**
     * Get historical K-line (candlestick) data for charts.
     */
    public function getKlines(string $symbol = 'BTCUSDT', string $interval = '1h', int $limit = 100)
    {
        return Cache::remember("klines_{$symbol}_{$interval}", 60, function () use ($symbol, $interval, $limit) {
            $response = Http::get("{$this->baseUrl}/klines", [
                'symbol' => strtoupper($symbol),
                'interval' => $interval,
                'limit' => $limit
            ]);

            if ($response->successful()) {
                return array_map(function ($k) {
                    return [
                        'time' => $k[0] / 1000, // Convert to seconds
                        'open' => (float)$k[1],
                        'high' => (float)$k[2],
                        'low' => (float)$k[3],
                        'close' => (float)$k[4],
                    ];
                }, $response->json());
            }

            return [];
        });
    }

    /**
     * Get 24h ticker statistics.
     */
    public function getTickerStats(string $symbol = 'BTCUSDT')
    {
        return Cache::remember("ticker_stats_{$symbol}", 30, function () use ($symbol) {
            $response = Http::get("{$this->baseUrl}/ticker/24hr", [
                'symbol' => strtoupper($symbol)
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        });
    }
}
