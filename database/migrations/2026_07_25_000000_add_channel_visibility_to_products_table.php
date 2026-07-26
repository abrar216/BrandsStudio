<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (!Schema::hasColumn('products', 'show_on_web')) {
                $table->boolean('show_on_web')->default(true)->after('status');
            }
            if (!Schema::hasColumn('products', 'show_on_pos')) {
                $table->boolean('show_on_pos')->default(true)->after('show_on_web');
            }
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            if (Schema::hasColumn('products', 'show_on_web')) {
                $table->dropColumn('show_on_web');
            }
            if (Schema::hasColumn('products', 'show_on_pos')) {
                $table->dropColumn('show_on_pos');
            }
        });
    }
};
