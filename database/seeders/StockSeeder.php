<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Stock;

class StockSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $stocks = [
            // Crypto
            [
                'name' => 'Bitcoin',
                'symbol' => 'BTC',
                'type' => 'crypto',
                'current_price' => 65000.00,
                'price_change' => 2.50,
                'risk_level' => 'High'
            ],
            [
                'name' => 'Ethereum',
                'symbol' => 'ETH',
                'type' => 'crypto',
                'current_price' => 3500.00,
                'price_change' => 1.20,
                'risk_level' => 'High'
            ],
            [
                'name' => 'Solana',
                'symbol' => 'SOL',
                'type' => 'crypto',
                'current_price' => 150.00,
                'price_change' => -3.40,
                'risk_level' => 'High'
            ],
            [
                'name' => 'Binance Coin',
                'symbol' => 'BNB',
                'type' => 'crypto',
                'current_price' => 580.00,
                'price_change' => 0.80,
                'risk_level' => 'High'
            ],
            // Stocks
            [
                'name' => 'Apple Inc.',
                'symbol' => 'AAPL',
                'type' => 'stock',
                'current_price' => 180.00,
                'price_change' => 0.50,
                'risk_level' => 'Low'
            ],
            [
                'name' => 'Tesla Inc.',
                'symbol' => 'TSLA',
                'type' => 'stock',
                'current_price' => 170.00,
                'price_change' => -2.10,
                'risk_level' => 'High'
            ],
            [
                'name' => 'NVIDIA Corporation',
                'symbol' => 'NVDA',
                'type' => 'stock',
                'current_price' => 900.00,
                'price_change' => 4.30,
                'risk_level' => 'Medium'
            ],
            [
                'name' => 'Amazon.com Inc.',
                'symbol' => 'AMZN',
                'type' => 'stock',
                'current_price' => 180.00,
                'price_change' => 1.15,
                'risk_level' => 'Medium'
            ],
        ];

        foreach ($stocks as $stock) {
            Stock::updateOrCreate(['symbol' => $stock['symbol']], $stock);
        }
    }
}
