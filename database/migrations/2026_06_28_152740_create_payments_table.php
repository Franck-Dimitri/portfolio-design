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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('subscription_id')->constrained()->onDelete('cascade');
            
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('XAF'); // FCFA
            $table->string('payment_method'); // momo, om, card
            $table->string('transaction_reference')->unique(); // ID de l'opérateur (MTN/Orange)
            $table->string('status')->default('pending'); // pending, success, failed
            
            $table->json('gateway_response')->nullable(); // Stocke le retour complet de l'API
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};