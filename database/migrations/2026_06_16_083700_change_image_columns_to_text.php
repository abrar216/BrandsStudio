<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->text('image')->nullable()->change();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->text('image')->nullable()->change();
            $table->text('main_image')->nullable()->change();
        });

        if (Schema::hasTable('product_images')) {
            Schema::table('product_images', function (Blueprint $table) {
                $table->text('image_path')->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->string('image', 255)->nullable()->change();
        });

        Schema::table('products', function (Blueprint $table) {
            $table->string('image', 255)->nullable()->change();
            $table->string('main_image', 255)->nullable()->change();
        });

        if (Schema::hasTable('product_images')) {
            Schema::table('product_images', function (Blueprint $table) {
                $table->string('image_path', 255)->change();
            });
        }
    }
};
