<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Plan;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Plan::create([
            'name' => 'Free Tier',
            'slug' => 'free',
            'price' => 0.00,
            'features' => [
                'Academy Access',
                'Paper Trading',
                'Basic Analytics',
            ],
        ]);

        Plan::create([
            'name' => 'Pro Trader',
            'slug' => 'pro',
            'price' => 29.99,
            'features' => [
                'everything in Free',
                'Live Trading (1 Exchange)',
                'Advanced Charts',
                'Priority Support',
            ],
        ]);

        Plan::create([
            'name' => 'Elite Institutional',
            'slug' => 'elite',
            'price' => 99.99,
            'features' => [
                'everything in Pro',
                'Unlimited Exchanges',
                'Custom Indicators',
                '1-on-1 Mentorship',
            ],
        ]);
    }
}
