<?php
// ══════════════════════════════════════════════════════════════
// database/migrations/2024_01_01_000001_create_service_packages_table.php
// ══════════════════════════════════════════════════════════════
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_packages', function (Blueprint $table) {
            $table->id();

            // ── Infos principales ─────────────────────────────
            $table->string('titre');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('description_courte')->nullable(); // pour les cards

            // ── Tarification ──────────────────────────────────
            $table->unsignedInteger('prix');                 // en FCFA
            $table->unsignedInteger('prix_barre')->nullable(); // ancien prix barré
            $table->string('devise')->default('FCFA');

            // ── Contenu du pack ───────────────────────────────
            $table->unsignedInteger('nombre_design')->nullable(); // null = illimité
            $table->unsignedInteger('delai_livraison')->nullable(); // en jours ouvrés
            $table->unsignedInteger('nombre_revision')->default(2);

            // ── JSON enrichis ─────────────────────────────────
            $table->json('features')->nullable();    // ["5 designs/mois", ...]
            $table->json('livrables')->nullable();   // ["PNG HD", "PDF", ...]
            $table->json('services')->nullable();    // ["logo", "flyer", ...]
            $table->json('non_inclus')->nullable();  // ce qui n'est PAS inclus

            // ── Présentation ──────────────────────────────────
            $table->string('couleur_badge')->default('#f97316'); // couleur accent du pack
            $table->string('icone')->nullable();                 // nom icone lucide
            $table->boolean('is_populaire')->default(false);     // badge "Populaire"
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('ordre')->default(0);        // ordre d'affichage

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_packages');
    }
};