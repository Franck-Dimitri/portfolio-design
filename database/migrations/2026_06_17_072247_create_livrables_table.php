<?php
// ══════════════════════════════════════════════════════════════
// database/migrations/2024_01_01_000003_create_livrables_table.php
// ══════════════════════════════════════════════════════════════
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('livrables', function (Blueprint $table) {
            $table->id();

            $table->foreignId('souscription_id')->constrained()->cascadeOnDelete();

            // ── Fichier ───────────────────────────────────────
            $table->string('nom');                    // nom affiché
            $table->string('fichier_path');           // storage path
            $table->string('fichier_nom_original');   // nom original
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('taille')->nullable(); // en octets
            $table->string('type')->default('livrable');      // livrable | apercu | revision

            // ── Statut ────────────────────────────────────────
            $table->boolean('notifie_whatsapp')->default(false);
            $table->boolean('notifie_email')->default(false);
            $table->timestamp('envoye_le')->nullable();

            // ── Message admin ─────────────────────────────────
            $table->text('message')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('livrables');
    }
};