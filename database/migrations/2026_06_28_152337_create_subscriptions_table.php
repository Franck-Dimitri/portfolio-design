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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Colonnes pour lier soit à un service, soit à un pack
            $table->foreignId('service_package_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('service_id')->nullable()->constrained()->onDelete('set null');
            
            // Configuration de la commande
            // Pour un service unique, duration_months restera à 1 (ou ignoré)
            $table->integer('duration_months')->default(1); 
            
            // Suivi de l'état
            // pending (en attente de paiement), active (payé/en cours), completed (livré/terminé), expired (pack fini)
            $table->string('status')->default('pending'); 
            
            // Dates de validité (Remplies uniquement si package_id n'est pas null)
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
