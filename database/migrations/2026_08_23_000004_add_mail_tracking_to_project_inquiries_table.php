<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('project_inquiries', function (Blueprint $table) {
            $table->timestamp('customer_confirmation_sent_at')->nullable()->after('meta');
            $table->timestamp('admin_notification_sent_at')->nullable()->after('customer_confirmation_sent_at');
        });
    }

    public function down(): void
    {
        Schema::table('project_inquiries', function (Blueprint $table) {
            $table->dropColumn([
                'customer_confirmation_sent_at',
                'admin_notification_sent_at',
            ]);
        });
    }
};
