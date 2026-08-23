<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('analytics_events', function (Blueprint $table) {
            $table->id();
            $table->string('event_name');
            $table->string('client_id')->nullable()->index();
            $table->string('page_path')->nullable()->index();
            $table->string('page_title')->nullable();
            $table->string('page_type')->nullable()->index();
            $table->timestamp('occurred_at')->index();
            $table->json('payload');
            $table->json('provider_dispatches')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('analytics_events');
    }
};
