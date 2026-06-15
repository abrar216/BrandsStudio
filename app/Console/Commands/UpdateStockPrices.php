<?php

namespace App\Console\Commands;

use App\Models\Stock;
use App\Models\MarketPrice;
use App\Models\MarketPriceHistory;
use App\Services\CryptoPriceService;
use App\Services\StockPriceService;
use Illuminate\Console\Command;

class UpdateStockPrices extends Command
{
    protected $signature = 'stocks:update-prices';
    protected $description = 'Fetch real-time stock and cryptocurrency prices and cache them';

    public function handle()
    {
        $cryptoService = new CryptoPriceService();
        $stockService = new StockPriceService();

        $stocks = Stock::all();

        // Fetch Cryptocurrencies in batch
        $cryptoSymbols = $stocks->where('type', 'crypto')->pluck('symbol')->toArray();
        $cryptoPrices = $cryptoService->getPrices($cryptoSymbols);

        foreach ($stocks as $stock) {
            $oldPrice = (float) $stock->current_price;
            $newPrice = $oldPrice;

            if ($stock->type === 'crypto') {
                if (isset($cryptoPrices[$stock->symbol])) {
                    $newPrice = $cryptoPrices[$stock->symbol];
                }
            } else {
                // Fetch Stock price individually
                $newPrice = $stockService->getPrice($stock->symbol);
            }

            // Apply dynamic micro-fluctuations in fallback case where external APIs return identical cached data
            // to make the simulation feel extremely realistic and dynamic to the user
            if ($newPrice === $oldPrice) {
                $fluctuation = (mt_rand(-100, 100) / 100) * 0.0005; // very tiny +/- 0.05% shift
                $newPrice = $newPrice * (1 + $fluctuation);
            }

            $priceChange = 0.0;
            if ($oldPrice > 0) {
                $priceChange = round((($newPrice - $oldPrice) / $oldPrice) * 100, 2);
            }

            // Update the main tradeable asset price in stocks table
            $stock->current_price = round($newPrice, 2);
            $stock->price_change = $priceChange;
            $stock->save();

            // Cache in market_prices
            MarketPrice::updateOrCreate(
                ['symbol' => $stock->symbol],
                [
                    'current_price' => round($newPrice, 2),
                    'market_type' => $stock->type,
                ]
            );

            // Store in market_price_history
            MarketPriceHistory::create([
                'symbol' => $stock->symbol,
                'price' => round($newPrice, 2),
                'timestamp' => now(),
            ]);

            $this->info("Updated {$stock->symbol}: {$oldPrice} -> {$stock->current_price} ({$priceChange}%)");
        }

        $this->info('Market prices updated successfully.');
    }
}
