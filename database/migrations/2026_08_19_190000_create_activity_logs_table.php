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
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('user_name')->nullable();
            $table->string('user_email')->nullable();
            $table->string('user_role')->nullable();
            $table->string('action'); // ex: 'auth.login', 'order.created', 'deliverable.uploaded'
            $table->string('category')->default('system'); // 'auth', 'order', 'payment', 'client', 'catalog', 'system'
            $table->string('level')->default('info'); // 'info', 'success', 'warning', 'error', 'critical'
            $table->text('description');
            $table->nullableMorphs('subject'); // subject_type, subject_id
            $table->json('properties')->nullable(); // metadata payload or change diff
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
