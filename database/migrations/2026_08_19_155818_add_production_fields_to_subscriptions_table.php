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
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('reference')->nullable()->unique()->after('id');
            $table->string('statut_production')->default('non_demarre')->after('status'); // non_demarre, en_cours, en_revision, termine, archive
            $table->text('notes_admin')->nullable()->after('statut_production');
            $table->timestamp('date_debut_production')->nullable()->after('notes_admin');
            $table->timestamp('date_livraison_estimee')->nullable()->after('date_debut_production');
            $table->timestamp('livre_le')->nullable()->after('date_livraison_estimee');
            $table->text('besoins')->nullable()->after('livre_le');
            $table->string('client_nom')->nullable()->after('besoins');
            $table->string('client_email')->nullable()->after('client_nom');
            $table->string('client_telephone')->nullable()->after('client_email');
            $table->string('client_whatsapp')->nullable()->after('client_telephone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn([
                'reference',
                'statut_production',
                'notes_admin',
                'date_debut_production',
                'date_livraison_estimee',
                'livre_le',
                'besoins',
                'client_nom',
                'client_email',
                'client_telephone',
                'client_whatsapp',
            ]);
        });
    }
};
