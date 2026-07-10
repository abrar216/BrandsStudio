<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

$tables = DB::select('SHOW TABLES');
$dbName = DB::getDatabaseName();
$property = 'Tables_in_' . $dbName;

echo "Database Name: $dbName\n\n";
echo str_pad("Table Name", 40) . " | " . "Row Count\n";
echo str_repeat("-", 55) . "\n";

foreach ($tables as $table) {
    $tableName = $table->$property;
    $count = DB::table($tableName)->count();
    echo str_pad($tableName, 40) . " | " . $count . "\n";
}
