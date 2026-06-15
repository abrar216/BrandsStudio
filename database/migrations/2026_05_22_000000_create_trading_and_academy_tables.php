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
        // Add balance field to users table
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'balance')) {
                $table->decimal('balance', 15, 2)->default(100000.00)->after('role');
            }
        });

        // 1. Stocks Table
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('symbol')->unique();
            $table->string('type'); // stock, crypto, etc.
            $table->decimal('current_price', 15, 2);
            $table->decimal('price_change', 8, 2)->default(0.00);
            $table->string('risk_level')->default('Medium');
            $table->timestamps();
        });

        // 2. Portfolios Table
        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('symbol');
            $table->integer('quantity')->default(0);
            $table->timestamps();

            $table->unique(['user_id', 'symbol']);
        });

        // 3. Transactions Table
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('symbol');
            $table->string('type'); // buy, sell
            $table->string('order_type'); // market, limit
            $table->decimal('limit_price', 15, 2)->nullable();
            $table->integer('quantity');
            $table->decimal('price', 15, 2);
            $table->decimal('total_price', 15, 2);
            $table->string('status')->default('completed'); // completed, pending, failed
            $table->timestamps();
        });

        // 4. Plans Table
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('price', 8, 2);
            $table->json('features')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 5. Subscriptions Table
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('plan_id')->constrained('plans')->onDelete('cascade');
            $table->string('status')->default('active'); // active, expired, cancelled
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });

        // 6. Courses Table
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('level')->default('Beginner');
            $table->string('duration');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 7. Lessons Table
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('content')->nullable();
            $table->string('video_url')->nullable();
            $table->integer('order')->default(1);
            $table->string('duration');
            $table->timestamps();
        });

        // 8. User Progress Table
        Schema::create('user_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade');
            $table->boolean('is_completed')->default(false);
            $table->timestamp('last_watched_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'lesson_id']);
        });

        // 9. API Keys Table
        Schema::create('api_keys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('exchange');
            $table->string('label')->nullable();
            $table->string('api_key');
            $table->string('api_secret');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_keys');
        Schema::dropIfExists('user_progress');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('plans');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('portfolios');
        Schema::dropIfExists('stocks');
        
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'balance')) {
                $table->dropColumn('balance');
            }
        });
    }
};
