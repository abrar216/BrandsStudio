<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Database\Seeder;

class AcademySeeder extends Seeder
{
    public function run()
    {
        // Course 1: Beginners Guide to PSX
        $course1 = Course::create([
            'title' => 'Beginners Guide to PSX',
            'slug' => 'beginners-guide-psx',
            'description' => 'Understand the fundamentals of the Pakistan Stock Exchange. Learn about KSE-100 index, sectors, and how the market operates.',
            'level' => 'Beginner',
            'duration' => '4h 30m',
            'is_active' => true,
        ]);

        $course1->lessons()->createMany([
            [
                'title' => 'Introduction to PSX & KSE Indices',
                'slug' => 'intro-psx-indices',
                'content' => 'The Pakistan Stock Exchange (PSX) is the only stock exchange in Pakistan. It was formed in 2016 after the merger of the Karachi, Lahore, and Islamabad stock exchanges. The KSE-100 Index is the benchmark index, representing the largest companies across various sectors. In this lesson, we learn how these indices are calculated and why they matter to every Pakistani investor.',
                'video_url' => 'https://www.youtube.com/embed/SSo_EIwHSd4',
                'order' => 1,
                'duration' => '15m 30s',
            ],
            [
                'title' => 'Top Sectors of the Pakistan Economy',
                'slug' => 'psx-sectors',
                'content' => 'Pakistan\'s market is dominated by several key sectors including Commercial Banks, Fertilizers, Oil & Gas Exploration, and Textiles. Each sector behaves differently during economic cycles. For example, banks often benefit from higher interest rates, while cement companies are sensitive to construction activity. Historically, the fertilizer and banking sectors have been the main drivers of the KSE-100.',
                'video_url' => 'https://www.youtube.com/embed/L7G0OfJUON8',
                'order' => 2,
                'duration' => '22m 15s',
            ],
        ]);

        // Course 2: Mastering the TradeX Platform
        $course2 = Course::create([
            'title' => 'Mastering the TradeX Platform',
            'slug' => 'mastering-tradex',
            'description' => 'A comprehensive guide to all features of TradeX. From placing your first trade to analyzing markets using our AI insights.',
            'level' => 'Beginner',
            'duration' => '3h 15m',
            'is_active' => true,
        ]);

        $course2->lessons()->createMany([
            [
                'title' => 'Terminal Overview & Asset Selection',
                'slug' => 'terminal-overview',
                'content' => 'Welcome to TradeX. Our terminal is built for speed and precision. In this lesson, you will learn about the asset selector, the multi-timeframe chart engine, and how to find top PSX stocks like ENGRO, HUBC, and LUCK. Understanding the interface is the first step to becoming a successful virtual trader.',
                'video_url' => 'https://www.youtube.com/embed/SSo_EIwHSd4',
                'order' => 1,
                'duration' => '12m 45s',
            ],
            [
                'title' => 'Market vs Limit Orders on TradeX',
                'slug' => 'market-limit-orders',
                'content' => 'TradeX supports both Market and Limit orders for PSX stocks. A market order executes immediately at the current best price, while a limit order allows you to set a specific price you are willing to spend. professional traders often prefer limit orders to avoid slippage during volatile sessions in the Karachi market.',
                'video_url' => 'https://www.youtube.com/embed/jIdKIdGf7Y0',
                'order' => 2,
                'duration' => '15m 20s',
            ],
            [
                'title' => 'Using AI Insights for Trading Edge',
                'slug' => 'using-ai-insights',
                'content' => 'One of TradeX\'s unique features is our AI Suggestion engine. It analyzes price momentum, volume, and volatility of PSX stocks to provide "Strong Buy" or "Strong Sell" signals. In this module, we show you how to interpret these signals and combine them with your own technical analysis for a higher win rate in the Pakistan market.',
                'video_url' => 'https://www.youtube.com/embed/L7G0OfJUON8',
                'order' => 3,
                'duration' => '18m 10s',
            ],
        ]);

        // Course 3: Technical Analysis for PSX Stocks
        $course3 = Course::create([
            'title' => 'Technical Analysis for PSX',
            'slug' => 'technical-analysis-psx',
            'description' => 'Master the art of reading charts specifically for the Pakistan Stock Exchange. Learn candlestick patterns and indicators.',
            'level' => 'Intermediate',
            'duration' => '6h 45m',
            'is_active' => true,
        ]);

        $course3->lessons()->createMany([
            [
                'title' => 'Support and Resistance in Volatile Markets',
                'slug' => 'support-resistance-psx',
                'content' => 'Support and resistance are fundamental concepts. In the PSX, round numbers often act as psychological support. We cover how to identify these levels on the TradeX chart engine and how to use them to set your stop-losses effectively.',
                'video_url' => 'https://www.youtube.com/embed/Gk7Mv3_YQ_c',
                'order' => 1,
                'duration' => '25m 00s',
            ],
            [
                'title' => 'Using RSI & MACD with TradeX Charts',
                'slug' => 'indicators-tradex',
                'content' => 'The Relative Strength Index (RSI) and Moving Average Convergence Divergence (MACD) are available on our terminal. In this lesson, we show how to apply these to stocks like Systems Ltd (SYS) and TRG to spot momentum shifts before they happen.',
                'video_url' => 'https://www.youtube.com/embed/H7v-eO62HCI',
                'order' => 2,
                'duration' => '30m 00s',
            ],
        ]);
    }
}
