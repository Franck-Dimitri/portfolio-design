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
        Schema::create('service_packages', function (Blueprint $table) {
            $table->id();

            // Infos principales
            $table->string('titre');
            $table->string('slug')->unique();

            $table->text('description')->nullable();

            // 💰 prix mensuel en FCFA
            $table->integer('prix')->nullable();

            // 🎨 nombre de designs inclus
            $table->integer('nombre_design')->nullable();
            // null = illimité (pour pack personnalisé)
            // ⏱ délai de livraison moyen
            $table->integer('delaie_livraison')->nullable();


            // 🧠 features du pack
            $table->json('features')->nullable();
            // ex: ["5 designs/mois", "support 24h", ...]
            $table->json('livrables')->nullable();
            // 🛠 types de design inclus
            $table->json('services')->nullable();
            // ex: ["logo", "flyer", "branding"]

            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_packages');
    }
};
