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
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('cash_received', 10, 2)->default(0.00)->after('cashier_id');
            $table->decimal('change_returned', 10, 2)->default(0.00)->after('cash_received');
            $table->decimal('amount_paid', 10, 2)->default(0.00)->after('change_returned');
            $table->text('payment_details')->nullable()->after('amount_paid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['cash_received', 'change_returned', 'amount_paid', 'payment_details']);
        });
    }
};
