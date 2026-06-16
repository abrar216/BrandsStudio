<?php

define('LARAVEL_START', microtime(true));

// Register the Composer autoloader
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__.'/../bootstrap/app.php';

$dbConnection = $_ENV['DB_CONNECTION'] ?? $_SERVER['DB_CONNECTION'] ?? 'sqlite';
$dbDatabase = $_ENV['DB_DATABASE'] ?? $_SERVER['DB_DATABASE'] ?? '/tmp/database.sqlite';

if ($dbConnection === 'sqlite') {
    if ($dbDatabase && !file_exists($dbDatabase)) {
        @mkdir(dirname($dbDatabase), 0755, true);
        @touch($dbDatabase);
        try {
            // Resolve console kernel to run migrations and seeders
            $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
            
            // Run migrations
            $kernel->call('migrate', ['--force' => true]);
            
            // Run database seeders
            $kernel->call('db:seed', ['--force' => true]);
            $kernel->call('db:seed', ['--class' => 'AcademySeeder', '--force' => true]);
            $kernel->call('db:seed', ['--class' => 'PlanSeeder', '--force' => true]);
            $kernel->call('db:seed', ['--class' => 'StockSeeder', '--force' => true]);
        } catch (\Exception $e) {
            error_log('Vercel SQLite auto-migrate error: ' . $e->getMessage());
        }
    }
}

// Handle request
$app->handleRequest(Illuminate\Http\Request::capture());
