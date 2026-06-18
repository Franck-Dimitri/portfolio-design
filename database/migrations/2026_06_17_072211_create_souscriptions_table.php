<?php
// ══════════════════════════════════════════════════════════════
// database/migrations/2024_01_01_000002_create_souscriptions_table.php
// ══════════════════════════════════════════════════════════════
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('souscriptions', function (Blueprint $table) {
            $table->id();

            // ── Relations ─────────────────────────────────────
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_package_id')->constrained()->cascadeOnDelete();

            // ── Référence unique ──────────────────────────────
            $table->string('reference')->unique(); // ex: PACK-2024-00042

            // ── Infos client (snapshot au moment de l'achat) ──
            $table->string('client_nom');
            $table->string('client_email');
            $table->string('client_telephone')->nullable();
            $table->string('client_whatsapp')->nullable();
            $table->string('client_entreprise')->nullable();
            $table->text('besoins')->nullable(); // description des besoins

            // ── Tarif snapshot ────────────────────────────────
            $table->unsignedInteger('montant');   // prix payé
            $table->string('devise')->default('FCFA');

            // ── Paiement CinetPay ─────────────────────────────
            $table->string('cinetpay_transaction_id')->nullable()->unique();
            $table->string('cinetpay_payment_token')->nullable();
            $table->enum('statut_paiement', [
                'en_attente',   // créée, pas encore payée
                'initie',       // redirigé vers CinetPay
                'paye',         // confirmé par CinetPay
                'echoue',       // échec
                'rembourse',    // remboursé
            ])->default('en_attente');
            $table->timestamp('paye_le')->nullable();
            $table->json('cinetpay_response')->nullable(); // réponse brute

            // ── Suivi de production ───────────────────────────
            $table->enum('statut_production', [
                'non_demarre',    // paiement OK, pas encore commencé
                'en_cours',       // travail en cours
                'en_revision',    // révision client
                'termine',        // livraison faite
                'archive',
            ])->default('non_demarre');
            $table->text('notes_admin')->nullable();
            $table->timestamp('date_debut_production')->nullable();
            $table->timestamp('date_livraison_estimee')->nullable();
            $table->timestamp('livre_le')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('souscriptions');
    }
};