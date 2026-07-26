<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Self-heal products table schema for channel visibility
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('products')) {
                if (!\Illuminate\Support\Facades\Schema::hasColumn('products', 'show_on_web')) {
                    \Illuminate\Support\Facades\Schema::table('products', function (\Illuminate\Database\Schema\Blueprint $table) {
                        $table->boolean('show_on_web')->default(true)->nullable();
                    });
                }
                if (!\Illuminate\Support\Facades\Schema::hasColumn('products', 'show_on_pos')) {
                    \Illuminate\Support\Facades\Schema::table('products', function (\Illuminate\Database\Schema\Blueprint $table) {
                        $table->boolean('show_on_pos')->default(true)->nullable();
                    });
                }
            }
        } catch (\Throwable $e) {
            // Ignore DB errors
        }
    }
}
