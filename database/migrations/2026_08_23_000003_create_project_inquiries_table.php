<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->index();
            $table->text('description');
            $table->boolean('ai_assist')->default(false);
            $table->boolean('consultation')->default(false);
            $table->boolean('existing_system')->default(false);
            $table->string('existing_system_url')->nullable();
            $table->json('conversation');
            $table->json('summary')->nullable();
            $table->json('meta');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_inquiries');
    }
};
