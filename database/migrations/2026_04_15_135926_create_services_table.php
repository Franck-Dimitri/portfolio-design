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
        Schema::create('services', function (Blueprint $table) {
            $table->id();

            $table->string('titre');
            $table->string('slug')->unique();
            $table->text('description');

            $table->enum('cathegorie', [
                'logo design',
                'branding',
                'flyer design',
                'poster design',
                'social media design',
                'ui/ux design',
                'illustration',
                'autre'
            ]);

            $table->integer('prix');

            $table->integer('starting_price')->nullable();

            $table->integer('delaie_livraison')->nullable();

            $table->json('outils')->nullable();
            $table->json('livrables')->nullable();

            $table->json('features')->nullable();

            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
