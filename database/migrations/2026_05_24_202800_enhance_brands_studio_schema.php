<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Enhance products table
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'cost_price')) {
                $table->decimal('cost_price', 10, 2)->nullable()->after('price');
            }
            if (!Schema::hasColumn('products', 'gst_rate')) {
                $table->decimal('gst_rate', 5, 2)->default(0.00)->after('cost_price');
            }
        });

        // 2. Enhance product_variants table
        Schema::table('product_variants', function (Blueprint $table) {
            if (!Schema::hasColumn('product_variants', 'cost_price')) {
                $table->decimal('cost_price', 10, 2)->nullable()->after('price');
            }
        });

        // 3. Create expense_categories table
        if (!Schema::hasTable('expense_categories')) {
            Schema::create('expense_categories', function (Blueprint $table) {
                $table->id();
                $table->string('name')->unique();
                $table->timestamps();
            });

            // Seed default expense categories
            $defaultCategories = [
                'Fabrics & Raw Materials',
                'Salaries & Staff Labor',
                'Shop Rent & Leases',
                'Utilities & Power Bills',
                'Marketing & Ad Spend',
                'Office & Logistics Overhead'
            ];
            foreach ($defaultCategories as $cat) {
                DB::table('expense_categories')->insertOrIgnore([
                    'name' => $cat,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // 4. Create product_images table for multiple product images
        if (!Schema::hasTable('product_images')) {
            Schema::create('product_images', function (Blueprint $table) {
                $table->id();
                $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
                $table->string('image_path');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('expense_categories');

        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropColumn(['cost_price']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['cost_price', 'gst_rate']);
        });
    }
};
