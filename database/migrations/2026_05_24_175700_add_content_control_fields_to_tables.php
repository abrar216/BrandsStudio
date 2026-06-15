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
        Schema::table('products', function (Blueprint $table) {
            $table->string('main_image')->nullable()->after('image');
            $table->json('gallery_images')->nullable()->after('main_image');
            $table->boolean('show_in_explore_collections')->default(false)->after('gallery_images');
            $table->boolean('show_in_featured_couture')->default(false)->after('show_in_explore_collections');
            $table->boolean('show_in_new_arrivals')->default(false)->after('show_in_featured_couture');
            $table->boolean('show_in_trending_apparel')->default(false)->after('show_in_new_arrivals');
            $table->boolean('show_in_best_sellers')->default(false)->after('show_in_trending_apparel');
            $table->boolean('show_in_collections')->default(true)->after('show_in_best_sellers');
            $table->integer('display_order')->default(0)->after('show_in_collections');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->integer('display_order')->default(0)->after('image');
            $table->boolean('show_on_homepage')->default(false)->after('display_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'main_image',
                'gallery_images',
                'show_in_explore_collections',
                'show_in_featured_couture',
                'show_in_new_arrivals',
                'show_in_trending_apparel',
                'show_in_best_sellers',
                'show_in_collections',
                'display_order'
            ]);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn([
                'display_order',
                'show_on_homepage'
            ]);
        });
    }
};
