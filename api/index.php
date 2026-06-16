<?php

define('LARAVEL_START', microtime(true));

// Register the Composer autoloader
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__.'/../bootstrap/app.php';

$dbConnection = $_ENV['DB_CONNECTION'] ?? $_SERVER['DB_CONNECTION'] ?? ($_ENV['POSTGRES_URL'] ?? $_SERVER['POSTGRES_URL'] ?? null ? 'pgsql' : 'sqlite');
$dbDatabase = $_ENV['DB_DATABASE'] ?? $_SERVER['DB_DATABASE'] ?? '/tmp/database.sqlite';

if ($dbConnection === 'sqlite' && $dbDatabase && !file_exists($dbDatabase)) {
    @mkdir(dirname($dbDatabase), 0755, true);
    @touch($dbDatabase);
}

try {
    // Run migrations and seeders automatically if settings table is missing
    if (!Illuminate\Support\Facades\Schema::hasTable('settings')) {
        // Resolve console kernel to run migrations and seeders
        $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
        
        // Run migrations
        $kernel->call('migrate', ['--force' => true]);
        
        // Run database seeders
        $kernel->call('db:seed', ['--force' => true]);
        $kernel->call('db:seed', ['--class' => 'AcademySeeder', '--force' => true]);
        $kernel->call('db:seed', ['--class' => 'PlanSeeder', '--force' => true]);
        $kernel->call('db:seed', ['--class' => 'StockSeeder', '--force' => true]);
    }
} catch (\Exception $e) {
    error_log('Vercel DB auto-migrate error: ' . $e->getMessage());
}

// Handle request
$app->handleRequest(Illuminate\Http\Request::capture());
