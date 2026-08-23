<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_inquiries', function (Blueprint $table) {
            $table->string('customer_confirmation_tracking_token', 64)->nullable()->unique()->after('meta');
            $table->timestamp('customer_confirmation_opened_at')->nullable()->after('customer_confirmation_sent_at');
            $table->unsignedInteger('customer_confirmation_open_count')->default(0)->after('customer_confirmation_opened_at');
        });
    }

    public function down(): void
    {
        Schema::table('project_inquiries', function (Blueprint $table) {
            $table->dropUnique(['customer_confirmation_tracking_token']);
            $table->dropColumn([
                'customer_confirmation_tracking_token',
                'customer_confirmation_opened_at',
                'customer_confirmation_open_count',
            ]);
        });
    }
};
