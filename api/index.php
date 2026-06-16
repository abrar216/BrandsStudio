<?php

define('LARAVEL_START', microtime(true));

// Register the Composer autoloader
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__.'/../bootstrap/app.php';

// Resolve and bootstrap the HTTP kernel to fully boot config and providers
$httpKernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$httpKernel->bootstrap();

if (isset($_GET['debug_env'])) {
    header('Content-Type: application/json');
    echo json_encode([
        'DB_CONNECTION' => $_ENV['DB_CONNECTION'] ?? $_SERVER['DB_CONNECTION'] ?? 'not set',
        'POSTGRES_URL' => isset($_ENV['POSTGRES_URL']) || isset($_SERVER['POSTGRES_URL']) ? 'exists' : 'not set',
        'POSTGRES_HOST' => $_ENV['POSTGRES_HOST'] ?? $_SERVER['POSTGRES_HOST'] ?? 'not set',
        'default_connection' => config('database.default'),
        'has_postgres_ext' => extension_loaded('pdo_pgsql') ? 'yes' : 'no',
    ]);
    exit;
}

$dbConnection = config('database.default');
$dbDatabase = config('database.connections.sqlite.database');

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
