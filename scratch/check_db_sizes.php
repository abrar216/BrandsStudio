<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    $products = DB::table('products')->select('id', 'name', 'sku', DB::raw('LENGTH(image) as img_len'), DB::raw('LENGTH(main_image) as main_img_len'))->get();
    echo "Products Image Lengths:\n";
    foreach ($products as $p) {
        echo "ID: {$p->id} | Name: {$p->name} | SKU: {$p->sku} | Image: " . round(($p->img_len ?? 0) / 1024, 2) . " KB | Main Image: " . round(($p->main_img_len ?? 0) / 1024, 2) . " KB\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
